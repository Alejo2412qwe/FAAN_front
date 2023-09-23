import { Component, OnInit } from '@angular/core';
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	Validators,
} from '@angular/forms';
import { forkJoin } from 'rxjs';
import { Persona } from 'src/app/Models/persona';
import { PersonaService } from 'src/app/Service/persona.service';
import { ScreenSizeService } from 'src/app/Service/screen-size-service.service';
import { Response, ValidateEquals } from 'src/app/util/model/response-validate';
import { ToastrService } from 'ngx-toastr';


@Component({
	selector: 'app-control-person',
	templateUrl: './control-person.component.html',
	styleUrls: ['./control-person.component.css'],
})
export class ControlPersonComponent implements OnInit {
	public personDialog: boolean = false;

	public respose = new Response();

	public person = new Persona();

	public submitted: boolean = false;

	public listPerson: Persona[] = [];

	public validateEquals = new ValidateEquals();
	//Size of window..
	public screenWidth: number = 0;
	public screenHeight: number = 0;

	public loading: boolean = false;
	public totalRecords!: number;

	//VARIABLE FOR SEARCH BY ATRIBUTE NAME
	public valueAtribute: string = '';
	public submitFindAtribute: boolean = false;

	//Form validate.
	public formPerson!: FormGroup;

	constructor(
		private personService: PersonaService,
		private screenSizeService: ScreenSizeService,
		private formBuilder: FormBuilder,
		private toastr: ToastrService
	) {
		this.formPerson = this.formBuilder.group({
			idPersona: ['', []],
			identificacion: ['', [Validators.required, Validators.minLength(10)]],
			nombre1: ['', [Validators.required]],
			nombre2: ['', []],
			apellido1: ['', [Validators.required]],
			apellido2: ['', []],
			direccion: ['', []],
			correo: [
				'',
				[
					Validators.required,
					Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
				],
			],
			telefono: ['', [this.customTelefonoValidator]],
			fechaNacimiento: ['', [this.customFechaNacimientoValidator]],
			// fechaNacimiento: ['', [this.customFechaNacimientoValidator]],
			// celular: ['', [Validators.nullValidator]],
			genero: ['', [Validators.required]],
		});
	}

	ngOnInit(): void {
		this.findPagablePerson(0, 4, ['idPersona', 'asc']);
		//Size of the window..
		this.getSizeWindowResize();
		this.loading = true;
	}

	//Validate telephone number..
	public customTelefonoValidator(control: AbstractControl) {
		const telefono = control.value;
		if (!telefono) {
			return null;
		}

		if (telefono.length < 8) {
			return {
				telefonoInvalido: true,
				mensaje: 'Teléfono invalido.',
			};
		}
		return null;
	}

	//Validate person 18 years old.
	public customFechaNacimientoValidator(control: AbstractControl) {
		const fechaNacimiento = control.value as Date;

		if (!fechaNacimiento || isNaN(fechaNacimiento.getTime())) {
			return null;
		}

		return new Date().getFullYear() - fechaNacimiento.getFullYear() < 18
			? {
				fechaNacimientoInvalida: true,
				mensaje: 'Debe ser mayor de edad.',
			}
			: null;
	}

	public findByAtributeName() {
		this.loading = true;
		this.submitFindAtribute = true;
		this.personService
			.getListaPersonasAtribute(
				0,
				4,
				['idPersona', 'asc'],
				'identificacion',
				this.valueAtribute
			)
			.subscribe((data: any) => {
				if (data !== null) {
					this.listPerson = data.content;
					this.loading = false;
				}
			});
	}

	public findPagablePerson(page: number, size: number, sort: string[]) {

		this.personService.findByAllPerson(page, size, sort).subscribe(
			{
				next: (resp: any) => {
					this.listPerson = resp.content;
					this.totalRecords = resp.totalElements;
					this.loading = false;
				}, error: (err) => {
					this.loading = false;
				}
			}
		);

	}

	// event: LazyLoadEvent
	public loadPersonLazy(event: any = null) {
		this.loading = true;
		const page = event ? event.first / event.rows : 0;
		const size = event ? event.rows : 4;
		const sortField = event && event.sortField ? event.sortField : ''; // Not stablished field..
		const sortOrder = event && event.sortOrder === 1 ? 'asc' : 'desc';
		this.findPagablePerson(page, size, [sortField, sortOrder]);
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

	public validateSaveAndUpdatePerson() {
		if (this.formPerson.invalid) {
			this.formPerson.markAllAsTouched();
			return;
		}

		this.submitted = true;
		this.person = this.formPerson.value;

		this.validateEmailAndCi(this.person.identificacion!, this.person.correo!);
	}

	public validateEmailAndCi(identificacion: string, email: string) {

		const identificacionEqualsValidate = this.validateEquals.identificacion === this.person.identificacion;
		const emailEqualsValidate = this.validateEquals.emailValidate === this.person.correo;

		const existIdentificacion = this.personService.existByIdentificacion(identificacion, identificacionEqualsValidate);
		const existEmail = this.personService.existsByEmail(email, emailEqualsValidate);

		forkJoin([existIdentificacion, existEmail]).subscribe(
			([cedulaRepetidaResp, emailRepetidoResp]) => {

				this.respose.ci = cedulaRepetidaResp ? 'Identificación existente' : ''
				this.respose.emailValidate = emailRepetidoResp ? 'Direccón de correo existente' : '';

				if (!cedulaRepetidaResp && !emailRepetidoResp) {
					if (this.person.idPersona) {
						this.updatePerson();
					} else {
						this.savePerson();
					}
				} else {
					this.toastr.warning('Revise los campos', 'Precaución');
				}
			}
		);
	}

	public isEmpty(obj: any) {
		return obj ? Object.keys(obj).length === 0 : true;
	}

	public savePerson() {
		this.personService.savePersona(this.person).subscribe({
			next: (resp) => {
				this.toastr.success('Creado Correctamente', 'Éxito');
				this.listPerson.push(resp);
				this.totalRecords += this.totalRecords;
				this.closeDialog();
			},
			error: (err) => {
				alert('err');
			},
		});
	}

	public updatePerson() {
		this.personService
			.updatePersona(this.person.idPersona!, this.person)
			.subscribe({
				next: (resp) => {
					alert('succesfull updated..');
					this.toastr.success('Actualizado Correctamente', 'Éxito');
					const indexfind = this.listPerson.findIndex(
						(person) => person.idPersona === resp.idPersona
					);
					this.listPerson[indexfind] = resp;
					this.closeDialog();
				},
				error: (err) => {
					this.toastr.error('Problemas al actualizar', 'Error');
				},
			});
	}

	public clearInputAndStatus() {
		this.submitFindAtribute = false;
		this.valueAtribute = '';
		this.findPagablePerson(0, 4, ['idPersona', 'asc']);
	}

	public closeDialog(): void {
		this.personDialog = false;
		this.person = {} as Persona;
	}

	public openNewPerson() {
		this.respose = {} as Response;
		this.validateEquals = {} as ValidateEquals;
		this.formPerson.reset();
		this.person = {} as Persona;
		this.submitted = false;
		this.personDialog = true;
	}


	public editPerson(person: Persona) {
		this.formPerson.reset();
		this.person = { ...person };
		this.validateEquals = { identificacion: this.person.identificacion, emailValidate: this.person.correo }
		this.person.fechaNacimiento = new Date(this.person.fechaNacimiento!);
		this.formPerson.patchValue(this.person);
		this.personDialog = true;
	}

	public hideDialog() {
		this.formPerson.reset();
		this.person = {} as Persona;
		this.personDialog = false;
		this.submitted = false;
	}
}