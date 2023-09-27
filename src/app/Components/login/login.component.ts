import { Component, OnInit } from '@angular/core';
import {
	FormBuilder,
	FormControl,
	FormGroup,
	Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Rol, Usuario } from 'src/app/Models/models';
import { AuthService } from 'src/app/Service/auth.service';
import { RecoverPasswordService } from 'src/app/Service/recover-password.service';
import { ScreenSizeService } from 'src/app/Service/screen-size-service.service';
import { SharedService } from 'src/app/util/service/shared.service';
import { ToastrService } from 'ngx-toastr';
import { clearLocalStorage } from 'src/app/util/local-storage-manager';
import { UserResponse } from 'src/app/Models/modelDto/user-response';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
	//Form validate.
	public formulario!: FormGroup;

	//responde server
	public responseServer = {} as any;

	//Window size..
	public screenWidth: number = 0;
	public screenHeight: number = 0;

	constructor(
		private router: Router,
		private authService: AuthService,
		private formBuilder: FormBuilder,
		private screenSizeService: ScreenSizeService,
		private sendEmailRecoverService: RecoverPasswordService,
		private sharedService: SharedService, // Inject the SharedService
		private toastrService: ToastrService
	) {
		this.formulario = this.formBuilder.group({
			email: [
				'',
				[
					Validators.required,
					Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
				],
			],
		});
	}

	ngOnInit(): void {
		this.getSizeWindowResize();
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

	public initAuthSpinner: boolean = false;

	public useResponse = new UserResponse();
	public roles: Rol[] = [];

	public usuarioLoginDTO = {
		username: '',
		password: '',
	};

	public info?: any;
	// METHOD AUTHENTICATION USER
	public singIn(): void {
		if (!this.usuarioLoginDTO.password || !this.usuarioLoginDTO.password) {
			this.toastrService.error('Campos Vacíos', 'ERROR');
		} else {
			this.initAuthSpinner = true;

			this.authService.login(this.usuarioLoginDTO).subscribe({
				next: (resp) => {
					clearLocalStorage();

					this.initAuthSpinner = false;

					this.useResponse = resp.userResponse!;
					this.roles = this.useResponse.roles!;
					localStorage.setItem('token', String(resp.token));
					localStorage.setItem(
						'id_username',
						String(this.useResponse.idUsuario)
					);

					localStorage.setItem('foto', String(this.useResponse.urlPhoto));
					localStorage.setItem('username', String(this.useResponse.username));
					if (this.useResponse.roles!.length > 1) {
						this.modalView();
					} else if (this.useResponse.roles!.length != 0) {
						this.sharedService.setIsLogginPresent(true);

						for (let rol of this.useResponse.roles!) {
							localStorage.setItem('rol', String(rol.nombreRol));
						}
						setTimeout(() => {
							this.router.navigate(['/dashboard']).then(() => {
								this.sharedService.setIsLogginPresent(true);
								window.location.reload();
							});
						}, 1500);
					} else {
						this.modalViewRolNoasigando();
						clearLocalStorage();
					}

				}, error: (err) => {
					this.initAuthSpinner = false;
					this.toastrService.error('REVISE SUS CREDENCIALES', 'ERROR');
				}
			})
		}
	}

	//ROL NO ASIGNADO
	public visibleRolnoAsignado: boolean = false;
	public modalViewRolNoasigando() {
		this.visibleRolnoAsignado = true;
	}

	public visibleListRoles: boolean = false;
	public modalView() {
		this.visibleListRoles = true;
	}

	//IMPLEMENT RECOVER PASSWORD
	public dialogRecoverPassword: boolean = false;
	public submitted: boolean = false;

	public openDialogRecoverPassword() {
		this.closeDialog();
		this.dialogRecoverPassword = true;
	}

	public hideDialog() {
		this.closeDialog();
		this.dialogRecoverPassword = false;
	}

	public closeDialog() {
		this.responseServer = {} as any;
		this.formulario.reset();
		this.submitted = false;
	}

	public isEmpty(obj: any) {
		return obj ? Object.keys(obj).length === 0 : true;
	}

	public sendRecoverPassword() {
		if (this.formulario.invalid) {
			this.formulario.markAllAsTouched();
			return;
		}
		this.submitted = true;

		console.log(this.formulario.value);
		this.sendEmailRecoverService
			.sendEmailRecoverPassword(this.formulario.value.email)
			.subscribe({
				next: (resp) => {
					this.responseServer = { status: 200, message: resp };
					this.submitted = false;
					this.formulario.reset();

					setTimeout(() => {
						this.hideDialog();
					}, 2500);
				},
				error: (err) => {
					this.responseServer = { status: err.status, message: err.error };
					this.submitted = false;
				},
			});
	}

	showSpinner: any;

	public guardarRolStorage(nombre: string) {
		this.showSpinner = true;

		localStorage.setItem('rol', String(nombre));
		setTimeout(() => {
			this.showSpinner = false;
			window.location.reload();
			location.replace('/dashboard');
		}, 200);
	}
}
