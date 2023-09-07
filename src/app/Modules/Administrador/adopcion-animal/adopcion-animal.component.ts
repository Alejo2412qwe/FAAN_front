import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'primeng/api';
import { Animal } from 'src/app/Models/animal';
import { DetalleAdopcion } from 'src/app/Models/detalleEncabezado';
import { EncabezadoAdopcion } from 'src/app/Models/encabezadoAdopcion';
import { Persona } from 'src/app/Models/persona';
import { RazaAnimal } from 'src/app/Models/razaAnimal';
import { AnimalService } from 'src/app/Service/animal.service';
import { DetalleEncabezadoService } from 'src/app/Service/detalleEncabezado.service';
import { EncabezadoAdopcionService } from 'src/app/Service/encabezadoAdopcion.service';
import { ImagenService } from 'src/app/Service/imagen.service';
import { PersonaService } from 'src/app/Service/persona.service';
import { RazaAnimalService } from 'src/app/Service/razaAnimal.service';
import { ScreenSizeService } from 'src/app/Service/screen-size-service.service';

@Component({
	selector: 'app-adopcion-animal',
	templateUrl: './adopcion-animal.component.html',
	styleUrls: ['./adopcion-animal.component.css'],
})
export class AdopcionAnimalComponent implements OnInit {
	// card view
	public listAnimal: Animal[] = [];
	public listAnimalSelectAdopcion: Animal[] = [];
	public submitted: boolean = false;
	public mostrar: boolean = false;
	public mostrarbusqueda: string = '';
	public mostrarbusquedaPersona: string = '';
	public opcionesMostrar: string[] = ['ADOPTADOS', 'NO ADOPTADOS'];

	// activar o desactivar dialog
	adopcionAnimalDialog: boolean = false;

	// Datos del select dialog
	public animal = new Animal();
	public animalSelect = new Animal();
	public tipoAnimalSelect = '';
	public razaAnimalSelect = '';
	public fechaAdoption = new Date();

	public encabezadoAdopcionObject = new EncabezadoAdopcion();
	public detalleEncabesadoObject = new DetalleAdopcion();

	public multipleAnimalUno: boolean = false;
	public multipleAnimal: boolean = false;
	public listavacia: boolean = false;

	clickedButtons: any[] = [];

	//Size of window..
	public screenWidth: number = 0;
	public screenHeight: number = 0;

	public loading: boolean = false;
	public totalRecords!: number;

	//VARIABLE FOR SEARCH BY ATRIBUTE NAME
	public valueAtribute: string = '';
	public submitFindAtribute: boolean = false;

	//RESCATISTA - PERSON---------
	public persona = new Persona();
	public lisPersona: Persona[] = [];
	public totalPersons!: number;
	public loadingPerson: boolean = false;

	public totalAnimal!: number;
	public loadingAnimal: boolean = false;

	//RAZA ANIMAL--------------------------------------
	public razaAnimal = new RazaAnimal();
	public listRazaAnimal: RazaAnimal[] = [];

	constructor(
		private razaAnimalService: RazaAnimalService,
		private animalService: AnimalService,
		private personaService: PersonaService,
		private imagenService: ImagenService,
		private screenSizeService: ScreenSizeService,
		private toastService: ToastrService,
		private encabezadoAdopcion: EncabezadoAdopcionService,
		private detalleEncabezadoService: DetalleEncabezadoService,
		private toastr: ToastrService
	) { }

	ngOnInit() {
		this.cargar();
	}

	// CARGAR LISTA DE ANIMALES Y PAGINACION
	public cargar() {
		this.listAnimal = [];
		this.findPageableAnimal(0, 10, ['nombreAnimal', 'asc']);
	}

	public loadAnimalLazy(event: any = null) {
		this.loadingAnimal = true;
		const page = event ? event.first / event.rows : 0;
		const size = event ? event.rows : 10;
		this.findPageableAnimal(page, size, ['nombreAnimal', 'asc']);
	}

	public findPageableAnimal(page: number, size: number, sort: string[]) {
		try {
			this.animalService.findByAdoptadoOrNoAdoptado(page, size, this.mostrar, this.mostrarbusqueda, sort).subscribe(
				(data: any) => {
					if (data != null) {
						console.log(data);
						this.listAnimal = data.content;
						this.totalAnimal = data.totalElements;
						this.loadingAnimal = false;
					}
				},
				(error) => {
					console.error(error);
					// this.loading = false;
				}
			);
		} catch (error) {
			throw new Error();
		}
	}


	// DIALOGO ACTIVAR SOLO VER, ADOPTAR UNO O MAS
	openAllDialog(animalse: Animal) {
		if (this.mostrar) {
			this.OpenDialogView(animalse);
		} else {
			if (this.multipleAnimal) {
				this.OpenDialogList();
			} else {
				this.OpenDialog(animalse);
			}
		}
	}


	// AL PRECIONAR X DIALOGO
	closeAllDialog() {
		if (!this.mostrar) {
			this.submitted = false;
		}
		this.CloseDialog();
	}

	// LIMPIA AL CERRAR EL DIALOGO
	CloseDialog() {
		this.emptySelectedPerson();
		this.clickedButtons = [];
		this.listAnimalSelectAdopcion = [];
		this.detalleEncabesadoObject = {} as DetalleAdopcion;
		this.encabezadoAdopcionObject = {} as EncabezadoAdopcion;
		this.animalSelect = {} as Animal;
		this.tipoAnimalSelect = '';
		this.razaAnimalSelect = '';
		this.adopcionAnimalDialog = false;

		this.multipleAnimal = false;
		this.multipleAnimalUno = false;
		this.listavacia = false;
	}

	// DIALOGO ADOPCION MAS DE UNO
	OpenDialogList() {
		this.fechaAdoption = new Date();
		this.adopcionAnimalDialog = true;
	}

	// DIALOGO ADOPCION UNO
	OpenDialog(animalse: Animal) {
		if (animalse.idAnimal != null) {
			this.animalSelect = animalse;
			this.tipoAnimalSelect = animalse.razaAnimal?.tipoAnimal?.nombreTipo || '';
			this.razaAnimalSelect = animalse.razaAnimal?.nombreRaza || '';
		} else {
			this.animalSelect = this.listAnimalSelectAdopcion[0];
			if (this.listAnimalSelectAdopcion[0].razaAnimal?.tipoAnimal?.nombreTipo && this.listAnimalSelectAdopcion[0].razaAnimal?.nombreRaza) {
				this.tipoAnimalSelect = this.listAnimalSelectAdopcion[0].razaAnimal?.tipoAnimal?.nombreTipo;
				this.razaAnimalSelect = this.listAnimalSelectAdopcion[0].razaAnimal?.nombreRaza;
			}
		}

		this.fechaAdoption = new Date();
		this.adopcionAnimalDialog = true;
	}

	// LISTA DE ADOPCION MULTIPLE
	selectAdopcion(anim: Animal) {
		let existe = false;
		for (let a = 0; a < this.listAnimalSelectAdopcion.length; a++) {
			if (this.listAnimalSelectAdopcion[a].placaAnimal === anim.placaAnimal) {
				this.listAnimalSelectAdopcion.splice(a, 1);
				existe = true;
				break;
			}
		}

		if (!existe) {
			this.listAnimalSelectAdopcion.push(anim);
		}

		if (this.listAnimalSelectAdopcion.length != 0) {
			this.listavacia = true;
		} else {
			this.listavacia = false;
		}

		if (this.listAnimalSelectAdopcion.length == 1) {
			this.multipleAnimalUno = true;
		} else {
			this.multipleAnimalUno = false;
		}

		if (this.listAnimalSelectAdopcion.length > 1) {
			this.multipleAnimal = true;
		} else {
			this.multipleAnimal = false;
		}
		console.log(this.listAnimalSelectAdopcion.length + "   " + anim.nombreAnimal)
	}

	// SELECCION DE ADOPTANTE
	public onRowSelect(event: any) {
		this.persona = event;
	}

	public loadPersonalLazy(event: any = null) {
		this.loadingPerson = true;
		const page = event ? event.first / event.rows : 0;
		const size = event ? event.rows : 10;

		if (this.mostrarbusquedaPersona == '') {
			this.pageablePersona(page, size, ['identificacion', 'asc']);
		} else {
			this.pageablePersonaBusqueda(page, size, ['identificacion', 'asc']);
		}
	}

	public pageablePersona(page: number, size: number, sort: string[]) {
		try {
			this.personaService
				.getListaPersonas(page, size, sort)
				.subscribe((data: any) => {
					this.lisPersona = data.content;
					this.totalPersons = data.totalElements;
					this.loadingPerson = false;
				});
		} catch (error) {
			throw new Error();
		}
	}

	public pageablePersonaBusqueda(page: number, size: number, sort: string[]) {
		try {
			this.personaService
				.getAllPersonasPagesOrCedulaOrApellido(this.mostrarbusquedaPersona, page, size, sort)
				.subscribe((data: any) => {
					this.lisPersona = data.content;
					this.totalPersons = data.totalElements;
					this.loadingPerson = false;
				});
		} catch (error) {
			throw new Error();
		}
	}


	// RESPONSIVE
	public getSizeWindowResize() {
		const { width, height } = this.screenSizeService.getCurrentSize();
		this.screenWidth = width;
		this.screenHeight = height;

		this.screenSizeService.onResize.subscribe(({ width, height }) => {
			this.screenWidth = width;
			this.screenHeight = height;
		});
	}

	// VERIFICAR SI ESTA VACIO
	public isEmpty(obj: any) {
		// return Object.keys(obj).length === 0;
		return obj ? Object.keys(obj).length === 0 : true;
	}

	// ALMACENAR ARCHIVO
	public avatarURL: string = '';
	public selectedFile!: File;
	public onBasicUpload(event: any) {
		let data = event.target.files[0];

		if (data.size >= 1048576) {
			this.toastService.error('', 'IMAGEN MUY GRANDE.', { timeOut: 2000 });
			return;
		}

		this.selectedFile = data
		const imageURL = URL.createObjectURL(this.selectedFile);
		this.avatarURL = imageURL;
	}

	public async uploadImage() {
		try {
			const result = await this.imagenService
				.savePictureInBuket(this.selectedFile)
				.toPromise();
			return result.key;
		} catch (error) {
			throw new Error();
		}
	}

	// LIMPIAR ADOPTANTE
	public emptySelectedPerson() {
		this.persona = {} as Persona;
	}

	// ALMACENAR ADOPCION UNITARIA
	async saveAdopcion() {
		this.submitted = true;
		const key = await this.uploadImage();

		if (this.detalleEncabesadoObject.observacion?.trim() && this.encabezadoAdopcionObject.observacion?.trim()
			&& !this.isEmpty(this.animalSelect) && !this.isEmpty(this.persona)) {

			this.encabezadoAdopcionObject.fechaAdopcion = this.fechaAdoption;
			this.encabezadoAdopcionObject.persona = this.persona;
			this.encabezadoAdopcion.saveEncabezadoAdopcion(this.encabezadoAdopcionObject)
				.subscribe((data1) => {
					this.detalleEncabesadoObject.encabezadoAdopcion = data1;
					this.detalleEncabesadoObject.animal = this.animalSelect;
					this.detalleEncabesadoObject.documento = key;
					this.detalleEncabezadoService.saveDetalleAdopcion(this.detalleEncabesadoObject).subscribe((data2) => {
						if (data2 != null) {
							this.toastr.success(this.animalSelect.nombreAnimal + ' fue adoptado');
							this.CloseDialog();
							this.cargar();
						} else {
							this.toastr.error('Error ' + this.animalSelect.nombreAnimal + 'no fue adoptado');
						}
					});
				});
		} else {
			alert('campos vacios..');
		}

	}

	// ALMACENAR ADOPCION UNITARIA
	saveAdopcionList() {
		this.submitted = true;
		let fini = 0;

		if (this.detalleEncabesadoObject.observacion?.trim() && this.encabezadoAdopcionObject.observacion?.trim()
			&& this.listAnimalSelectAdopcion.length > 1 && !this.isEmpty(this.persona)) {

			for (let a = 0; a < this.listAnimalSelectAdopcion.length; a++) {
				this.detalleEncabezadoService.getfindByIdAnimal(Number(this.listAnimalSelectAdopcion[a].idAnimal)).subscribe(
					(data) => {
						if (data == null) {
							this.encabezadoAdopcionObject.fechaAdopcion = this.fechaAdoption;
							this.encabezadoAdopcionObject.persona = this.persona;
							this.encabezadoAdopcion.saveEncabezadoAdopcion(this.encabezadoAdopcionObject)
								.subscribe((data1) => {
									this.detalleEncabesadoObject.encabezadoAdopcion = data1;
									this.detalleEncabesadoObject.animal = this.listAnimalSelectAdopcion[a];
									this.detalleEncabezadoService.saveDetalleAdopcion(this.detalleEncabesadoObject).subscribe((data2) => {
										fini++;
										if (data2 != null) {
											if (this.listAnimalSelectAdopcion.length == fini) {
												this.toastr.success(this.animalSelect.nombreAnimal + ' fue adoptado');
												this.CloseDialog();
												this.cargar();
											}
										} else {
											this.toastr.error('Error ' + this.animalSelect.nombreAnimal + 'no fue adoptado');
										}
									});
								});
						} else {
							fini++;
							this.toastr.error('Error al almacenar un animal ya registrado..');
						}
					}
				)
			}
		} else {
			this.toastr.warning('campos vacios..');
		}

	}

	// DIALOGO ADOPCION VIEW A UNO
	OpenDialogView(animalse: Animal) {
		this.viewAdopcion(Number(animalse.idAnimal));
		this.adopcionAnimalDialog = true;
	}

	// CARGAR DATOS DE ADPTADOS
	viewAdopcion(idAnimal: number) {
		this.detalleEncabezadoService.getfindByIdAnimal(idAnimal).subscribe(
			(data) => {
				this.detalleEncabesadoObject = data;
				if (this.detalleEncabesadoObject.encabezadoAdopcion?.persona != null && this.detalleEncabesadoObject.animal != null
					&& this.detalleEncabesadoObject.animal.razaAnimal?.nombreRaza != null && this.detalleEncabesadoObject.animal.razaAnimal?.tipoAnimal?.nombreTipo != null
					&& this.detalleEncabesadoObject.encabezadoAdopcion != null) {
					this.persona = this.detalleEncabesadoObject.encabezadoAdopcion?.persona;
					this.animalSelect = this.detalleEncabesadoObject.animal;
					this.razaAnimalSelect = this.detalleEncabesadoObject.animal.razaAnimal?.nombreRaza;
					this.tipoAnimalSelect = this.detalleEncabesadoObject.animal.razaAnimal?.tipoAnimal?.nombreTipo;
					this.encabezadoAdopcionObject = this.detalleEncabesadoObject.encabezadoAdopcion;
				}
			}
		)
	}


	selectAdopcionclicked(animal: Animal) {
		const index = this.clickedButtons.indexOf(animal);
		if (index === -1) {
			this.clickedButtons.push(animal);
		} else {
			this.clickedButtons.splice(index, 1);
		}
	}

	isButtonClicked(animal: Animal): boolean {
		for (let a = 0; a < this.clickedButtons.length; a++) {
		  if (this.clickedButtons[a].idAnimal == animal.idAnimal) {
			return true;
		  }
		}
		return false;
	  }

}
