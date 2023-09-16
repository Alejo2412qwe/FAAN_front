import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { Subject, debounceTime, forkJoin } from 'rxjs';
import { UserDto } from 'src/app/Models/modelDto/user-data';
import { Persona } from 'src/app/Models/persona';
import { Rol } from 'src/app/Models/rol';
import { Usuario } from 'src/app/Models/usuario';
import { PersonFind } from 'src/app/Payloads/person-find';
import { PersonaService } from 'src/app/Service/persona.service';
import { RolService } from 'src/app/Service/rol.service';
import { ScreenSizeService } from 'src/app/Service/screen-size-service.service';
import { UsuarioService } from 'src/app/Service/usuario.service';
import { FOLDER_IMAGES, USER_IMAGE_DEFAULT, getFile } from 'src/app/util/const-data';
import { Response, ValidateEquals } from 'src/app/util/model/response-validate';

@Component({
	selector: 'app-control-usuarios',
	templateUrl: './control-usuarios.component.html',
	styleUrls: ['./control-usuarios.component.css'],
	providers: [ConfirmationService, MessageService]
})

export class ControlUsuariosComponent implements OnInit {

	// ADD NEW USUARIO
	public submitted: boolean = false;

	public userDto = new UserDto();

	public userDialog: boolean = false;

	public editUserDialog: boolean = false;

	public persona = new Persona();
	// GET ALL ROLES
	public listRoles: Rol[] = [];

	public usuario = new Usuario();

	public personFindData = new PersonFind();

	//Form validate. 
	public formUserNew!: FormGroup;
	public formUserEdit!: FormGroup;

	public validateEquals = new ValidateEquals();

	public respose = new Response();

	//VARIABLE FOR SEARCH BY ATRIBUTE NAME
	public valueAtribute: string = '';
	public submitFindAtribute: boolean = false;

	// GET ALL USUARIOS
	public listUsuarios: Usuario[] = [];
	public loading: boolean = false;
	public totalRecords!: number;
	public size: number = 6;

	public screenWidth: number = 0;
	public screenHeight: number = 0;

	constructor(
		private usuarioService: UsuarioService,
		private personaService: PersonaService,
		private rolesService: RolService,
		private screenSizeService: ScreenSizeService,
		private formBuilder: FormBuilder,
		private toastService: ToastrService,
		private confirmationService: ConfirmationService, private messageService: MessageService

	) {
		this.formUserNew = this.formBuilder.group({
			identificacion: ['', [Validators.required, Validators.minLength(10)]],
			correo: [
				'',
				[
					Validators.required,
					Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
				],
			],
			username: ['', [Validators.required, Validators.minLength(4)]],
			password: [
				'',
				[
					Validators.required,
					Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$')
				],
			],
		});

		this.formUserEdit = this.formBuilder.group({
			username: ['', [Validators.required, Validators.minLength(4)]],
			password: [
				'',
				[
					Validators.required,
					Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$')
				],
			],
		});
	}

	ngOnInit(): void {
		this.getAllUsers(0, this.size, ['idUsuario', 'asc']);
		this.getSizeWindowResize();
		this.getAllRolesFull();
		this.loading = true;

		//Tiempo de ejecucución
		this.searchInput$
			.pipe(debounceTime(2000))
			.subscribe((inputValue) => {
				this.searchDataUserPerIdentificacionOrUsername(inputValue);
			});
	}

	public getAllRolesFull() {
		this.rolesService.getAllRolesFull().subscribe({
			next: (resp) => {
				this.listRoles = resp;
			}, error: (err) => {

			}
		});
	}


	public getAllUsers(page: number, size: number, sort: string[]) {
		this.usuarioService.getAllUsuario(page, size, sort).subscribe({
			next: (resp: any) => {
				this.listUsuarios = resp.content;
				this.totalRecords = resp.totalElements;
				this.loading = false;

			}, error: (err) => {
				this.loading = false;

			}
		});
	}

	public validateUserSave() {
		this.submitted = true;
		if (this.formUserNew.invalid) {
			this.submitted = false;
			this.toastService.warning('', 'VERIFIQUE LOS CAMPOS OBLIGATORIOS', { timeOut: 2000 });
			this.formUserNew.markAllAsTouched();
			return;
		}

		if (this.rolsAddUser.length === 0) {
			this.toastService.warning('', 'DEBE SELECCIONAR UN ROL', { timeOut: 2000 });
			return;
		}

		this.userDto = this.formUserNew.value;

		if (!this.isEmpty(this.personFindData)) { //cuando encuentra..

			this.savePersonUserFind();
		} else {
			this.validateEmailAndIdentificacion();
		}

	}

	public savePersonUserFind() {
		this.persona.idPersona = this.personFindData.idPersona;

		this.usuario.idUsuario = 0;
		this.usuario.persona = this.persona;
		this.usuario.roles = this.rolsAddUser;
		this.usuario.username = this.userDto.username!;
		this.usuario.password = this.userDto.password!;
		this.usuario.fotoPerfil = USER_IMAGE_DEFAULT
		this.usuario.estadoUsuario = true;

		this.usuarioService.saveUsuario(this.usuario).subscribe({
			next: (resp) => {
				this.toastService.success('', 'USUARIO CREADO', { timeOut: 2000 });
				this.listUsuarios.push(resp);
				this.userDialog = false;
			},
			error: (err) => {
				this.toastService.error('', 'INCONVENIENTE AL CREAR USUARIO', { timeOut: 2000 });
			}
		})
	}

	public validateEmailAndIdentificacion() {

		const existIdentificacion = this.personaService.existByIdentificacion(this.userDto.identificacion!, false);
		const existEmail = this.personaService.existsByEmail(this.userDto.correo!, false);
		const existUsername = this.usuarioService.existByUsername(this.userDto.username!);

		forkJoin([existIdentificacion, existEmail, existUsername]).subscribe(
			([cedulaRepetidaResp, emailRepetidoResp, userNameRespetidoResp]) => {
				this.respose.ci = cedulaRepetidaResp ? 'Identificación existente' : ''
				this.respose.emailValidate = emailRepetidoResp ? 'Direccón de correo existente' : '';
				this.respose.username = userNameRespetidoResp ? 'Nombre de usuario existente' : '';

				if (!cedulaRepetidaResp && !emailRepetidoResp) {
					this.savePersonUserNotFound();
				}
			}
		);
	}

	public savePersonUserNotFound() {
		this.persona.identificacion = this.userDto.identificacion;
		this.persona.correo = this.userDto.correo;

		this.usuarioService.existByUsername(this.userDto.username!).subscribe(data => {
			this.respose.username = data ? 'Nombre de usuario existente' : ''

			if (!data) {
				this.personaService.savePersona(this.persona).subscribe({
					next: (resp) => {

						this.usuario.idUsuario = 0;
						this.usuario.persona = resp;
						this.usuario.roles = this.rolsAddUser;
						this.usuario.username = this.userDto.username!;
						this.usuario.password = this.userDto.password!;
						this.usuario.fotoPerfil = USER_IMAGE_DEFAULT
						this.usuario.estadoUsuario = true;
						this.usuarioService.saveUsuario(this.usuario).subscribe({
							next: (resp) => {
								this.toastService.success('', 'USUARIO CREADO', { timeOut: 2000 });
								this.listUsuarios.push(resp);
								this.userDialog = false;
							},
							error: (err) => {
								this.toastService.error('', 'INCONVENIENTE AL CREAR USUARIO', { timeOut: 2000 });
							}
						})

					}, error: (err) => {
						this.toastService.error('', 'INCONVENIENTE AL CREAR USUARIO', { timeOut: 2000 });
					}
				})
			}
		})

	}

	public isEmpty(personFind: PersonFind) {
		return personFind ? Object.keys(personFind).length === 0 : true;
	}

	public findPersonByIdentificacion(event: any) {
		let identificacion = event;
		console.log(identificacion);

		if (identificacion.length === 10) {
			this.personaService.findPersonByIdentificacion(identificacion).subscribe({
				next: (resp) => {
					this.toastService.success('', 'PERSONA ENCONTRADA', { timeOut: 2000 });
					this.personFindData = resp;
					this.formUserNew.patchValue(resp);
				},
				error: (err) => {
					this.toastService.error('', 'PERSONA NO ENCONTRADA', { timeOut: 2000 });
					this.formUserNew.patchValue({});
				}
			})
		}
	}

	public openNewUser() {
		this.generalDataReset();
		this.userDialog = true;
	}

	// ADD UPDATE
	public editUsuario(usuario: Usuario) {
		this.usuario = { ...usuario };
		this.persona = this.usuario.persona;
		this.formUserEdit.patchValue(this.usuario);
		this.rolsAddUser = [...this.usuario.roles!];
		this.editUserDialog = true;
	}

	public validateUpdateDataUser() {
		if (this.formUserEdit.invalid) {
			this.toastService.warning('', 'VERIFIQUE LOS CAMPOS OBLIGATORIOS', { timeOut: 2000 });
			this.formUserEdit.markAllAsTouched();
			return;
		}

		if (this.rolsAddUser.length === 0) {
			this.toastService.warning('', 'DEBE SELECCIONAR UN ROL', { timeOut: 2000 });
			return;
		}

		this.userDto = this.formUserEdit.value;

		this.updateUser();
	}

	public updateUser() {
		this.usuario.password = this.userDto.password!;
		this.usuario.roles = this.rolsAddUser;
		this.usuarioService.updateUsuario(this.usuario.idUsuario!, this.usuario).subscribe({
			next: (resp) => {
				this.toastService.success('', 'USUARIO ACTUALIZADO', { timeOut: 2000 });
				const index = this.listUsuarios.findIndex(i => i.idUsuario === resp.idUsuario);
				this.listUsuarios[index] = resp;
				this.editUserDialog = false;
			}, error: (err) => {
				this.toastService.error('', 'INCONVENIENTE AL ACTUALIZAR', { timeOut: 2000 });
			}
		});
	}

	public hideDialogNewUser() {
		this.generalDataReset();
		this.userDialog = false;
		this.editUserDialog = false;
	}

	public generalDataReset() {
		this.formUserNew.reset();
		this.submitted = false;
		this.userDto = {} as UserDto;
		this.personFindData = {} as PersonFind;
		this.persona = {} as Persona;
		this.usuario = {} as Usuario;
		this.respose = {} as Response;
	}

	public getSizeWindowResize() {
		const { width, height } = this.screenSizeService.getCurrentSize();
		this.screenWidth = width;
		this.screenHeight = height;
		this.screenSizeService.onResize.subscribe(({ width, height }) => {
			this.screenWidth = width;
			this.screenHeight = height;
		});
	}

	// EVETNS
	public loadUsuarioLazy(event: any = null) {
		this.loading = true;
		const page = event ? event.first / event.rows : 0;
		this.size = event ? event.rows : 2;
		const sortField = event && event.sortField ? event.sortField : '';
		const sortOrder = event && event.sortOrder === 1 ? 'asc' : 'desc';
		this.getAllUsers(page, this.size, [sortField, sortOrder]);
	}

	//ADD NEW METHODS -- ROLS ADD--------------------------------------
	public rolsAddUser: Rol[] = [];
	public addRolsUser(rol: Rol) {

		const index = this.rolsAddUser.findIndex(
			(item) => item.idRol === rol.idRol
		);

		if (index !== -1) {
			this.rolsAddUser.splice(index, 1);
		} else {
			this.rolsAddUser.push(rol);
		}

	}

	public isRoleAssigned(role: Rol): boolean {

		return this.rolsAddUser.some(
			(assignedRole) => assignedRole.idRol === role.idRol
		);
	}


	public messageConfirmation(user: Usuario) {
		this.usuario = { ...user }
		this.usuario.estadoUsuario = !this.usuario.estadoUsuario;
		this.confirmationService.confirm({
			message: `Esta seguro en ${this.usuario.estadoUsuario ? 'activar' : 'desactivar'} a ${this.usuario.username}?'`,
			header: 'Mensaje de confirmación',
			icon: 'pi pi-exclamation-triangle',
			acceptLabel: 'Aceptar',
			rejectLabel: 'Cancelar',
			accept: () => {
				this.usuarioService.updateUsuario(this.usuario.idUsuario!, this.usuario).subscribe({
					next: (resp) => {
						this.toastService.success('', 'ESTADO ACTUALIZADO', { timeOut: 2000 });
						const index = this.listUsuarios.findIndex(i => i.idUsuario === resp.idUsuario);
						this.listUsuarios[index] = resp

					}, error: (err) => {
						this.toastService.error('', 'INCONVENIENTE AL ACTUALIZAR ESTADO', { timeOut: 2000 });
					}
				});

			},
			reject: (type: any) => {
				switch (type) {
					case ConfirmEventType.REJECT:
						this.toastService.info('', 'CANCELADO', { timeOut: 2000 });

						break;
					case ConfirmEventType.CANCEL:
						this.toastService.info('', 'CANCELADO', { timeOut: 2000 });
						break;
				}
			},
		});
	}

	public searchInput$ = new Subject<string>();
	public searchDataUserPerIdentificacionOrUsername(key: string) {
		this.listUsuarios
		if (!key) {
			this.getAllUsers(0, this.size, ['idUsuario', 'asc']);
			return;
		}

		this.loading = true;
		this.usuarioService.findByIdentificacionOrUsername(key).subscribe({
			next: (resp: any) => {
				this.listUsuarios = resp.content;
				this.totalRecords = resp.totalElements;
				this.loading = false;
			}, error: (err) => {
				this.loading = false;
			}
		});
	}


	//OBTENER LA IMAGEN NEW MOTHOD------------------------------
	public getUriFile(fileName: string): string {
		return getFile(fileName ? fileName : USER_IMAGE_DEFAULT, FOLDER_IMAGES);
	}
}