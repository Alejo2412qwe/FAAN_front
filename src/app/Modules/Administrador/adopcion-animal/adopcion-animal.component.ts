import { Component, OnInit } from '@angular/core';
import { Animal } from 'src/app/Models/animal';
import { DetalleAdopcion } from 'src/app/Models/detalleEncabezado';
import { EncabezadoAdopcion } from 'src/app/Models/encabezadoAdopcion';
import { Persona } from 'src/app/Models/persona';
import { RazaAnimal } from 'src/app/Models/razaAnimal';
import { AnimalService } from 'src/app/Service/animal.service';
import { DetalleEncabezadoService } from 'src/app/Service/detalleEncabezado.service';
import { EncabezadoAdopcionService } from 'src/app/Service/encabezadoAdopcion.service';
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
	public submitted: boolean = false;
	public mostrar: boolean = false;
	public mostrarbusqueda: string = '';
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
		private screenSizeService: ScreenSizeService,
		private encabezadoAdopcion: EncabezadoAdopcionService,
		private detalleEncabezadoService: DetalleEncabezadoService
	) { }

	ngOnInit() {
		this.cargar();
	}

	public cargar() {
		this.listAnimal = [];
		this.findPageableAnimal(0, 10, ['nombreAnimal', 'asc']);

	}

	public loadAnimalLazy(event: any = null) {
		this.loadingAnimal = true;
		const page = event ? event.first / event.rows : 0;
		const size = event ? event.rows : 4;
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

	openAllDialog(animalse: Animal) {
		if (this.mostrar) {
			this.OpenDialogView(animalse);
		} else {
			this.OpenDialog(animalse);
		}
	}

	closeAllDialog() {
		if (this.mostrar) {
			this.CloseDialogView();
		} else {
			this.CloseDialog();
		}
	}

	OpenDialog(animalse: Animal) {
		this.animalSelect = animalse;
		this.tipoAnimalSelect = animalse.razaAnimal?.tipoAnimal?.nombreTipo || '';
		this.razaAnimalSelect = animalse.razaAnimal?.nombreRaza || '';

		this.fechaAdoption = new Date();
		this.adopcionAnimalDialog = true;
	}

	CloseDialog() {
		this.animalSelect = {} as Animal;
		this.tipoAnimalSelect = '';
		this.razaAnimalSelect = '';

		this.submitted = false;
		this.adopcionAnimalDialog = false;
		this.cargar();
	}

	public onRowSelect(event: any) {
		this.persona = event;
	}

	public loadPersonalLazy(event: any = null) {
		this.loadingPerson = true;
		const page = event ? event.first / event.rows : 0;
		const size = event ? event.rows : 4;
		this.pageablePersona(page, size, ['identificacion', 'asc']);
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

	public getSizeWindowResize() {
		const { width, height } = this.screenSizeService.getCurrentSize();
		this.screenWidth = width;
		this.screenHeight = height;

		this.screenSizeService.onResize.subscribe(({ width, height }) => {
			this.screenWidth = width;
			this.screenHeight = height;
		});
	}

	public isEmpty(obj: any) {
		// return Object.keys(obj).length === 0;
		return obj ? Object.keys(obj).length === 0 : true;
	}

	public avatarURL: string = '';
	public selectedFile!: File;
	public onBasicUpload(event: any) {
		this.selectedFile = event.target.files[0];

		const imageURL = URL.createObjectURL(this.selectedFile);
		this.avatarURL = imageURL;
		// console.log(this.selectedFile.size)
		console.log(imageURL);
		if (this.selectedFile && this.selectedFile.size > 1000000) {
			event.target.value = null;
		} else {
		}
	}

	public emptySelectedPerson() {
		this.persona = {} as Persona;
	}


	saveAdopcion() {
		this.submitted = true;

		if (this.detalleEncabesadoObject.observacion?.trim() && this.encabezadoAdopcionObject.observacion?.trim()
			&& !this.isEmpty(this.animalSelect) && !this.isEmpty(this.persona)) {

			this.encabezadoAdopcionObject.fechaAdopcion = this.fechaAdoption;
			this.encabezadoAdopcionObject.persona = this.persona;
			this.encabezadoAdopcion.saveEncabezadoAdopcion(this.encabezadoAdopcionObject)
				.subscribe((data1) => {
					this.detalleEncabesadoObject.encabezadoAdopcion = data1;
					this.detalleEncabesadoObject.animal = this.animalSelect;
					console.log("sssssssssssssssssssssssssssssssssssss")
					console.log(this.detalleEncabesadoObject)
					console.log("sssssssssssssssssssssssssssssssssssss")
					this.detalleEncabezadoService.saveDetalleAdopcion(this.detalleEncabesadoObject).subscribe((data2) => {
						if (data2 != null) {
							alert('succesfull created..');
							this.CloseDialog();
							// this.listAnimal.push(data);
							// this.closeDialog();
						} else {
							alert('succesfull no created..');
						}
					});
				});
		} else {
			alert('campos vacios..');
		}

	}

	OpenDialogView(animalse: Animal) {
		this.viewAdopcion(Number(animalse.idAnimal));
		this.adopcionAnimalDialog = true;
	}

	CloseDialogView() {
		this.emptySelectedPerson();
		this.detalleEncabesadoObject = {} as DetalleAdopcion;
		this.encabezadoAdopcionObject = {} as EncabezadoAdopcion;
		this.animalSelect = {} as Animal;
		this.tipoAnimalSelect = '';
		this.razaAnimalSelect = '';
		this.adopcionAnimalDialog = false;
	}

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


}
