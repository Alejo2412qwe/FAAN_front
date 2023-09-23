import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'primeng/api';
import { Animal } from 'src/app/Models/animal';
import { DetalleAdopcion } from 'src/app/Models/detalleEncabezado';
import { EncabezadoAdopcion } from 'src/app/Models/encabezadoAdopcion';
import { Persona } from 'src/app/Models/persona';
import { RazaAnimal } from 'src/app/Models/razaAnimal';
import { AdoptedAnimal } from 'src/app/Payloads/adopted-animal';
import { AnimalService } from 'src/app/Service/animal.service';
import { DetalleEncabezadoService } from 'src/app/Service/detalleEncabezado.service';
import { EncabezadoAdopcionService } from 'src/app/Service/encabezadoAdopcion.service';
import { ImagenService } from 'src/app/Service/imagen.service';
import { PersonaService } from 'src/app/Service/persona.service';
import { RazaAnimalService } from 'src/app/Service/razaAnimal.service';
import { ScreenSizeService } from 'src/app/Service/screen-size-service.service';
import { FOLDER_DOCUMENTS, FOLDER_IMAGES, getFile, getFileDocument } from 'src/app/util/const-data';

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

	public keyDocumento: string = "";

	// activar o desactivar dialog
	adopcionAnimalDialog: boolean = false;

	// Datos del select dialog
	public animal = new Animal();
	public animalSelect = new Animal();
	public tipoAnimalSelect = '';
	public razaAnimalSelect = '';
	public fechaAdoption = new Date();

	public encabezadoAdopcionObject = new EncabezadoAdopcion();
	public detalleEncabezadoObject = new DetalleAdopcion();

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


	//llama desde html
	public loadAnimalLazy(event: any = null) {
		this.loadingAnimal = true;
		const page = event ? event.first / event.rows : 0;
		const size = event ? event.rows : 10;
		this.findPageableAnimal(page, size, ['nombreAnimal', 'asc']);
	}


	//metodo de carga animales
	public findPageableAnimal(page: number, size: number, sort: string[]) {
		try {
			this.animalService.findByAdoptadoOrNoAdoptado(page, size, this.mostrar, this.mostrarbusqueda, sort).subscribe(
				(data: any) => {
					if (data != null) {
						this.listAnimal = data.content;
						this.totalAnimal = data.totalElements;
						this.loadingAnimal = false;
					}
				},
				(error) => {
					null;
				}
			);
		} catch (error) {
			throw new Error();
		}
	}

	// DIALOGO ACTIVAR SOLO VER, ADOPTAR UNO O MAS
	openAllDialog(animales: Animal) {
		if (this.mostrar) {
			this.OpenDialogView(animales);
		} else {
			if (this.multipleAnimal) {
				this.OpenDialogList();
			} else {
				this.OpenDialog(animales);
			}
		}
	}

	// DIALOGO ADOPCION MAS DE UNO
	OpenDialogList() {
		this.fechaAdoption = new Date();
		this.adopcionAnimalDialog = true;
	}

	// DIALOGO ADOPCION UNO
	OpenDialog(animales: Animal) {
		if (animales.idAnimal != null) {
			this.animalSelect = animales;
			this.tipoAnimalSelect = animales.razaAnimal?.tipoAnimal?.nombreTipo || '';
			this.razaAnimalSelect = animales.razaAnimal?.nombreRaza || '';
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
		this.detalleEncabezadoObject = {} as DetalleAdopcion;
		this.encabezadoAdopcionObject = {} as EncabezadoAdopcion;
		this.animalSelect = {} as Animal;
		this.tipoAnimalSelect = '';
		this.razaAnimalSelect = '';
		this.adopcionAnimalDialog = false;
		this.multipleAnimal = false;
		this.multipleAnimalUno = false;
		this.listavacia = false;
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
			this.pagablePersona(page, size, ['identificacion', 'asc']);
		} else {
			this.pagablePersonaBusqueda(page, size, ['identificacion', 'asc']);
		}
	}

	public pagablePersona(page: number, size: number, sort: string[]) {
		try {
			this.personaService
				.getListaPersonas(page, size, sort)
				.subscribe((data: any) => {
					this.lisPersona = data.content.filter((i: any) => i.idPersona !== 1);
					this.totalPersons = data.totalElements;
					this.loadingPerson = false;
				});
		} catch (error) {
			throw new Error();
		}
	}

	public pagablePersonaBusqueda(page: number, size: number, sort: string[]) {
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
		return obj ? Object.keys(obj).length === 0 : true;
	}

	// LIMPIAR ADOPTANTE
	public emptySelectedPerson() {
		this.persona = {} as Persona;
	}

	// ALMACENAR ADOPCION UNITARIA
	async saveAdopcion() {
		this.submitted = true;
		if (this.detalleEncabezadoObject.observacion?.trim() && this.encabezadoAdopcionObject.observacion?.trim()
			&& !this.isEmpty(this.animalSelect) && !this.isEmpty(this.persona) && this.avatarURL) {
			let key: string
			try {
				key = await this.uploadImage();
			} catch (error) {
				this.toastr.error('Error, documento .pdf no se guardó intentar nuevamente...');
			}
			this.detalleEncabezadoService.getfindByIdAnimal(Number(this.animalSelect.idAnimal)).subscribe((data) => {
				if (data == null) {
					this.encabezadoAdopcionObject.fechaAdopcion = this.fechaAdoption;
					this.encabezadoAdopcionObject.persona = this.persona;
					this.encabezadoAdopcion.saveEncabezadoAdopcion(this.encabezadoAdopcionObject)
						.subscribe((data1) => {
							if (data1 != null) {
								this.detalleEncabezadoObject.encabezadoAdopcion = data1;
								this.detalleEncabezadoObject.animal = this.animalSelect;
								this.detalleEncabezadoObject.documento = key;
								this.detalleEncabezadoService.saveDetalleAdopcion(this.detalleEncabezadoObject).subscribe((data2) => {
									if (data2 != null) {
										this.animalSelect.estadoAnimal = "A";
										this.animalService.updateAnimal(Number(this.animalSelect.idAnimal), this.animalSelect).subscribe((data3) => {
											if (data2 != null) {
												this.toastr.success(this.animalSelect.nombreAnimal + ' fue adoptado exitosamente...');
												this.CloseDialog();
												this.cargar();
											} else {
												this.toastr.error('Error, ' + this.animalSelect.nombreAnimal + ' no fue adoptado intentar nuevamente...');
											}
										}, (error) => {
											this.toastr.error('Error, ' + this.animalSelect.nombreAnimal + ' no fue adoptado intentar nuevamente...');
										});
									} else {
										this.toastr.error('Error, ' + this.animalSelect.nombreAnimal + ' no fue adoptado intentar nuevamente...');
									}
								}, (error) => {
									this.toastr.error('Error, ' + this.animalSelect.nombreAnimal + ' no fue adoptado intentar nuevamente...');
								});
							} else {
								this.toastr.error('Error, ' + this.animalSelect.nombreAnimal + ' no fue adoptado intentar nuevamente...');
							}
						}, (error) => {
							this.toastr.error('Error, ' + this.animalSelect.nombreAnimal + ' no fue adoptado intentar nuevamente...');
						});
				} else {
					this.toastr.error('Error, ' + this.animalSelect.nombreAnimal + ' ya fue adoptado intentar nuevamente...');
					this.CloseDialog();
					this.cargar();
				}
			}, (error) => {
				this.toastr.error('Error, ' + this.animalSelect.nombreAnimal + ' ya fue adoptado intentar nuevamente...');
				this.CloseDialog();
				this.cargar();
			});
		} else {
			this.toastr.error('Error, campos vacíos intentar nuevamente...')
		}

	}

	// ALMACENAR ADOPCION MORE
	async saveAdopcionList() {
		this.submitted = true;
		let fini = 0;

		if (this.detalleEncabezadoObject.observacion?.trim() && this.encabezadoAdopcionObject.observacion?.trim()
			&& this.listAnimalSelectAdopcion.length > 1 && !this.isEmpty(this.persona) && this.avatarURL) {

			let key: string
			try {
				key = await this.uploadImage();
			} catch (error) {
				this.toastr.error('Error, documento .pdf no se guardó intentar nuevamente...');
			}

			for (let a = 0; a < this.listAnimalSelectAdopcion.length; a++) {
				this.detalleEncabezadoService.getfindByIdAnimal(Number(this.listAnimalSelectAdopcion[a].idAnimal)).subscribe((data) => {
					if (data == null) {
						this.encabezadoAdopcionObject.fechaAdopcion = this.fechaAdoption;
						this.encabezadoAdopcionObject.persona = this.persona;
						this.encabezadoAdopcion.saveEncabezadoAdopcion(this.encabezadoAdopcionObject).subscribe((data1) => {
							this.detalleEncabezadoObject.encabezadoAdopcion = data1;
							this.detalleEncabezadoObject.animal = this.listAnimalSelectAdopcion[a];
							this.detalleEncabezadoObject.documento = key;
							this.detalleEncabezadoService.saveDetalleAdopcion(this.detalleEncabezadoObject).subscribe((data2) => {
								fini++;
								if (data2 != null) {
									this.listAnimalSelectAdopcion[a].estadoAnimal = "A";
									this.animalService.updateAnimal(Number(this.listAnimalSelectAdopcion[a].idAnimal), this.listAnimalSelectAdopcion[a]).subscribe((data3) => {
										if (data2 != null) {
											if (this.listAnimalSelectAdopcion.length == fini) {
												this.toastr.success(this.animalSelect.nombreAnimal + ' fue adoptado exitosamente...');
												this.CloseDialog();
												this.cargar();
											}
										} else {
											this.toastr.error('Error, ' + this.animalSelect.nombreAnimal + ' no fue adoptado intentar nuevamente...');
											this.CloseDialog();
											this.cargar();
										}
									}, (error) => {
										this.toastr.error('Error, ' + this.animalSelect.nombreAnimal + ' no fue adoptado intentar nuevamente...');
										this.CloseDialog();
										this.cargar();
									});
								} else {
									this.toastr.error('Error, ' + this.animalSelect.nombreAnimal + ' no fue adoptado intentar nuevamente...');
									this.CloseDialog();
									this.cargar();
								}
							});
						}, (error) => {
							this.toastr.error('Error, ' + this.animalSelect.nombreAnimal + ' no fue adoptado intentar nuevamente...');
							this.CloseDialog();
							this.cargar();
						});
					} else {
						this.toastr.error('Error, ' + this.animalSelect.nombreAnimal + ' ya fue adoptado intentar nuevamente...');
						this.CloseDialog();
						this.cargar();
					}
				}, (error) => {
					this.toastr.error('Error, ' + this.animalSelect.nombreAnimal + ' ya fue adoptado intentar nuevamente...');
					this.CloseDialog();
					this.cargar();
				});
			}
		} else {
			this.toastr.error('Error, campos vacíos intentar nuevamente...');
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
				this.detalleEncabezadoObject = data;
				if (data != null) {
					if (this.detalleEncabezadoObject.encabezadoAdopcion?.persona != null && this.detalleEncabezadoObject.animal != null
						&& this.detalleEncabezadoObject.animal.razaAnimal?.nombreRaza != null && this.detalleEncabezadoObject.animal.razaAnimal?.tipoAnimal?.nombreTipo != null
						&& this.detalleEncabezadoObject.encabezadoAdopcion != null && this.detalleEncabezadoObject.documento != null) {
						this.keyDocumento = this.detalleEncabezadoObject.documento;
						this.persona = this.detalleEncabezadoObject.encabezadoAdopcion?.persona;
						this.animalSelect = this.detalleEncabezadoObject.animal;
						this.razaAnimalSelect = this.detalleEncabezadoObject.animal.razaAnimal?.nombreRaza;
						this.tipoAnimalSelect = this.detalleEncabezadoObject.animal.razaAnimal?.tipoAnimal?.nombreTipo;
						this.encabezadoAdopcionObject = this.detalleEncabezadoObject.encabezadoAdopcion;
						this.keyDocumento = this.detalleEncabezadoObject.documento;
					}
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

	//OBTENER LA IMAGEN NEW METHOD
	public getUriFile(fileName: string): string {
		return getFile(fileName, FOLDER_DOCUMENTS);
	}

	public avatarURL: string = '';
	public selectedFile!: File;
	public onBasicUpload(event: any) {
		let data = event.target.files[0];

		if (data.size >= 1048576) {
			this.toastService.error('', 'IMAGEN ES MUY GRANDE.', { timeOut: 2000 });
			return;
		}
		this.selectedFile = data
		const imageURL = URL.createObjectURL(this.selectedFile);
		this.avatarURL = imageURL;
	}

	public async uploadImage() {
		try {
			const result = await this.imagenService
				.savePictureInBuket(this.selectedFile, FOLDER_DOCUMENTS)
				.toPromise();
			return result.key;
		} catch (error) {
			throw new Error();
		}
	}

	public modaldetailAdopted: boolean = false;
	public adoptedAnimal = new AdoptedAnimal();
	public modalDetailsAdopted(idAnimal: number) {
		this.encabezadoAdopcion.findAdoptedAnimal(idAnimal).subscribe({
			next: (resp) => {
				this.adoptedAnimal = resp;
				this.modaldetailAdopted = true

			}, error: (err) => {
				this.toastService.error('', 'INCONVENIENTE.', { timeOut: 2000 });
			}
		})
	}

	public getUriResource(fileName: string, key: number): string {
		const folder = key === 1 ? FOLDER_IMAGES : FOLDER_DOCUMENTS;
		return getFile(fileName, folder);
	}

}