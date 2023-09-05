import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';
import { Animal } from 'src/app/Models/animal';

import { FichaRegistro } from 'src/app/Models/fichaRegistro';
import { Fundacion } from 'src/app/Models/fundacion';
import { Persona } from 'src/app/Models/persona';
import { RazaAnimal } from 'src/app/Models/razaAnimal';
import { SituacionIngreso } from 'src/app/Models/situacionIngreso';
import { TipoAnimal } from 'src/app/Models/tipoAnimal';
import { AnimalService } from 'src/app/Service/animal.service';
import { FichaRegistroService } from 'src/app/Service/fichaRegistro.service';
import { ImagenService } from 'src/app/Service/imagen.service';
import { PersonaService } from 'src/app/Service/persona.service';
import { RazaAnimalService } from 'src/app/Service/razaAnimal.service';
import { ScreenSizeService } from 'src/app/Service/screen-size-service.service';
import { SituacionIngresoService } from 'src/app/Service/situacionIngreso.service';
import { TipoAnimalService } from 'src/app/Service/tipo-animal.service';

@Component({
	selector: 'app-registro-mascotas',
	templateUrl: './registro-mascotas.component.html',
	styleUrls: ['./registro-mascotas.component.css'],
})
export class RegistroMascotasComponent implements OnInit {
	public animalDialog: boolean = false;

	public animal = new Animal();
	public listAnimal: Animal[] = [];

	public submitted: boolean = false;

	public errorUnique: string = '';

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
	public valueAtributeCI: string = '';

	//INCOME SITUATION-------------------
	public listIncomeSituation: SituacionIngreso[] = [];
	public incomeSituation = new SituacionIngreso();
	public dialogIncomeSituation: boolean = false;
	public submittedIncomeSituation: boolean = false;
	public catchIncomeSituation = new SituacionIngreso();

	//TIPO ANIMAL----------------------------------------
	public tipoAnimal = new TipoAnimal();
	public listTipoAnimal: TipoAnimal[] = [];

	//RAZA ANIMAL--------------------------------------
	public razaAnimal = new RazaAnimal();
	public listRazaAnimal: RazaAnimal[] = [];

	//FICHA REGISTER-----------------------------------
	public fichaRegister = new FichaRegistro();

	//ESTATURA-----------------------------------------
	public listHeightAnimal: string[] | undefined;
	public selectedHeightAnimal: string | undefined;


	constructor(
		private razaAnimalService: RazaAnimalService,
		private tipoAnimalService: TipoAnimalService,
		private animalService: AnimalService,
		private personaService: PersonaService,
		private screenSizeService: ScreenSizeService,
		private incomeSituationService: SituacionIngresoService,
		private imagenService: ImagenService,
		private fichaRegisterService: FichaRegistroService,
		private toastService: ToastrService,
	) { }

	ngOnInit(): void {
		//CLEAR LOCALSTORAGE LIST, RAZA, TIPO, SITUATION..
		this.localStorageRemoveItems();

		this.findPageableAnimal(0, 4, ['idAnimal', 'asc']);

		this.pageablePersona(0, 3, ['idPersona', 'asc']);

		this.getSizeWindowResize();

		this.loading = true;
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

	public findByAtributeName(code: number) {
		if (code === 1) {
			this.loading = true;
			this.submitFindAtribute = true;
			this.razaAnimalService
				.getAllRazaAnimalAtribute(
					0,
					4,
					['idRazaAnimal', 'asc'],
					'nombreRaza',
					this.valueAtribute
				)
				.subscribe((data: any) => {
					if (data !== null) {
						this.listRazaAnimal = data.content;
						this.loading = false;
					}
				});
		} else {
			this.loadingPerson = true;
			this.submitFindAtribute = true;
			this.personaService
				.getListaPersonasAtribute(
					0,
					3,
					['identificacion', 'asc'],
					'identificacion',
					this.valueAtributeCI
				)
				.subscribe((data: any) => {
					if (data !== null) {
						this.lisPersona = data.content;
						this.loadingPerson = false;
					}
				});
		}
	}

	public findPageableAnimal(page: number, size: number, sort: string[]) {
		try {
			this.animalService.getAllAnimalesPages(page, size, sort).subscribe(
				(data: any) => {
					if (data != null) {
						this.listAnimal = data.content;
						this.totalRecords = data.totalElements;
						this.loading = false;
					}
				},
				(error) => {
					console.error(error);
					this.loading = false;
				}
			);
		} catch (error) {
			throw new Error();
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

	// event: LazyLoadEvent 
	public loadRazaAnimalLazy(event: any = null) {
		this.loading = true;
		const page = event ? event.first / event.rows : 0;
		const size = event ? event.rows : 4;
		const sortField = event && event.sortField ? event.sortField : ''; // Not stablished field..
		const sortOrder = event && event.sortOrder === 1 ? 'asc' : 'desc';
		this.findPageableAnimal(page, size, [sortField, sortOrder]);
	}

	public loadPersonalLazy(event: any = null) {
		this.loadingPerson = true;
		const page = event ? event.first / event.rows : 0;
		const size = event ? event.rows : 4;
		this.pageablePersona(page, size, ['identificacion', 'asc']);
	}

	public saveAndUpdateAnimal() {
		this.submitted = true;
		this.animal.estatura = this.selectedHeightAnimal;
		// Validate fields
		if (
			this.animal.nombreAnimal?.trim() &&
			this.animal.placaAnimal?.trim() &&
			this.animal.estatura?.trim() &&
			this.animal.edadAnimal &&
			this.fichaRegister.descripcionFichaRegistro?.trim() &&
			!this.isEmpty(this.tipoAnimal) &&
			!this.isEmpty(this.razaAnimal) &&
			!this.isEmpty(this.persona) &&
			!this.isEmpty(this.catchIncomeSituation)
		) {
			if (this.animal.idAnimal) {
				this.updateAnimal();
			} else {
				if (this.avatarURL?.trim()) {
					this.saveAnimal();
				} else {
					this.toastService.error('', 'CAMPOS INCOMPLETOS.', { timeOut: 2000 });
					// alert('campos incompletos2');
				}
			}
		} else {
			this.toastService.error('', 'CAMPOS INCOMPLETOS.', { timeOut: 2000 });
			// alert('campos incompletos1');
		}
	}

	public isEmpty(obj: any) {
		// return Object.keys(obj).length === 0;
		return obj ? Object.keys(obj).length === 0 : true;
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

	public fundacion = { idFudacion: 1 } as Fundacion; //Objeto de la fundacion..
	public async saveAnimal() {
		const isPlacaAnimalTaken = await this.animalService
			.findPlacaAnimal(this.animal.placaAnimal!)
			.toPromise();

		if (isPlacaAnimalTaken) {
			this.animal.placaAnimal = this.generatePlacaAnimal(8);
		}

		const key = await this.uploadImage();

		this.fichaRegister.situacionIngreso = this.catchIncomeSituation;
		this.fichaRegister.persona = this.persona;

		this.fichaRegisterService
			.saveFichaRegistro(this.fichaRegister)
			.subscribe((data) => {
				this.animal.fichaRegistro = data;

				this.animal.fotoAnimal = key;
				this.animal.estadoAnimal = 'A';
				this.animal.razaAnimal = this.razaAnimal;
				this.animal.fundacion = this.fundacion;

				this.animalService.saveAnimal(this.animal).subscribe((data) => {
					if (data != null) {
						this.toastService.success(
							'CREADO CORRECTAMENTE'
						);
						this.listAnimal.push(data);
						this.closeDialog();
					}
				});
			});
	}

	public async updateAnimal() {
		if (this.avatarURL?.trim()) {
			this.animal.fotoAnimal = await this.uploadImage();
		}

		this.fichaRegister.situacionIngreso = this.catchIncomeSituation;

		this.fichaRegisterService
			.updateFichaRegistro(
				this.fichaRegister.idFichaRegistro!,
				this.fichaRegister
			)
			.subscribe(() => {
				this.animal.razaAnimal = this.razaAnimal;
				this.animalService
					.updateAnimal(this.animal.idAnimal!, this.animal)
					.subscribe((data) => {
						if (data != null) {
							this.toastService.success(
								'ACTUALIZADO CORRECTAMENTE'
							);
							const indexfind = this.listAnimal.findIndex(
								(animal) => animal.idAnimal === data.idAnimal
							);
							this.listAnimal[indexfind] = data;
							this.closeDialog();
						}
					});
			});
	}

	public generatePlacaAnimal(length: number): string {
		const charset =
			'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		const charsetLength = charset.length;
		let placa = '';

		const randomValues = new Uint8Array(length);

		crypto.getRandomValues(randomValues);

		for (let i = 0; i < length; i++) {
			const randomIndex = randomValues[i] % charsetLength;
			placa += charset.charAt(randomIndex);
		}

		this.animal.placaAnimal = placa;
		return placa;
	}

	public eliminadoLogicoDeLosTiposAnimales(razaAnimal: RazaAnimal) {
		razaAnimal.estadoRaza = razaAnimal.estadoRaza === 'A' ? 'I' : 'A';
		this.razaAnimalService
			.updateRazaAnimal(razaAnimal.idRazaAnimal!, razaAnimal)
			.subscribe((data) => {
				if (data != null) {
					if (razaAnimal.estadoRaza) {
						this.toastService.success(
							'ACTUALIZADO'
						);
					}
				}
			});
	}

	//ALL RESCATISTA ----------------------------------------------------------------
	public onRowSelect(event: any) {
		this.persona = event;
	}

	public emptySelectedPerson() {
		this.persona = {} as Persona;
	}

	//INCOME SITUATION----------------------------------------

	public findAllIncomeSituation() {
		let dataIncomeSituation = localStorage.getItem('listIncomeSituarion');
		if (dataIncomeSituation) {
			this.listIncomeSituation = JSON.parse(dataIncomeSituation);
		} else {
			try {
				this.incomeSituationService
					.getAllIncomeSituation()
					.subscribe((data) => {
						this.listIncomeSituation = data;
						localStorage.setItem('listIncomeSituarion', JSON.stringify(data));
					});
			} catch (error) {
				throw new Error();
			}
		}
	}

	// RAZA AND TIPO ANIMAL--------------------------
	public findByAllTipoAnimales() {
		let dataLocal = localStorage.getItem('listTipos');
		if (dataLocal) {
			this.listTipoAnimal = JSON.parse(dataLocal);
		} else {
			this.tipoAnimalService
				.findByAllTipoAnimal(0, 5, [])
				.subscribe((data: any) => {
					if (data != null) {
						this.listTipoAnimal = data.content;
						localStorage.setItem('listTipos', JSON.stringify(data.content));
					}
				});
		}
	}

	public findByAllRazaAnimales() {
		let dataLocal = localStorage.getItem('listRazas');
		if (dataLocal) {
			this.listRazaAnimal = JSON.parse(dataLocal);

			this.loadingEventFilterRaza();
		} else {
			this.razaAnimalService
				.getAllRazaAnimal(0, 5, [])
				.subscribe((data: any) => {
					if (data != null) {
						this.listRazaAnimal = data.content;
						localStorage.setItem('listRazas', JSON.stringify(data.content));

						this.loadingEventFilterRaza();
					}
				});
		}
	}

	//EVENT FILTER RAZA OF TIPO
	public loadingEventFilterRaza() {
		if (this.animal.idAnimal) {
			this.eventCatchTipoFilter(this.animal.razaAnimal?.tipoAnimal!);
			this.razaAnimal = this.animal.razaAnimal!;
		}
	}

	public listRazaFiltered: RazaAnimal[] = [];
	public eventCatchTipoFilter(e: any) {
		console.log({ tipo: e });
		console.log(...this.listRazaAnimal);
		const datacopy = [...this.listRazaAnimal];
		this.listRazaFiltered = datacopy.filter((raza: any) => {
			return raza.tipoAnimal.idTipoAnimal === e.idTipoAnimal;
		});
		console.log(datacopy);
	}

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

	public openDialogIconmeSituation() {
		// this.errorUnique = '';
		this.submittedIncomeSituation = false;
		this.incomeSituation = {} as SituacionIngreso;
		this.dialogIncomeSituation = true;
	}

	public saveIncomeSituation() {
		this.submittedIncomeSituation = true;
		if (this.incomeSituation.nombreSituacionIngreso?.trim()) {
			this.incomeSituationService
				.saveSituacionIngreso(this.incomeSituation)
				.subscribe((data) => {
					if (data != null) {
						this.listIncomeSituation.push(data);
						localStorage.setItem(
							'listIncomeSituarion',
							JSON.stringify(this.listIncomeSituation)
						);

						setTimeout(() => {
							this.closeDialogIconmeSituation();
						}, 500);
					}
				});
		} else {
			this.toastService.error('', 'CAMPO INCOMPLETO.', { timeOut: 2000 });

		}

	}

	public closeDialogIconmeSituation() {
		this.incomeSituation = {} as SituacionIngreso;
		this.dialogIncomeSituation = 
		false;


	}
	//
	public clearInputAndStatus() {
		this.submitFindAtribute = false;
		this.valueAtribute = '';
		this.findPageableAnimal(0, 4, ['idRazaAnimal', 'asc']);
	}

	public closeDialog(): void {
		this.animalDialog = false;
		this.animal = {} as Animal;
		this.errorUnique = '';
	}

	public openNewAnimal() {
		//get list income situation..
		this.newMethodGeneral();

		this.cleanAllMethods();
		this.catchIncomeSituation = {} as SituacionIngreso;
		this.animalDialog = true;
	}

	public editAnimal(animal: Animal) {
		this.newMethodGeneral();
		this.errorUnique = '';
		this.animal = { ...animal };
		this.fichaRegister = this.animal.fichaRegistro!;
		this.catchIncomeSituation = this.fichaRegister.situacionIngreso!;
		this.persona = this.fichaRegister.persona!;
		this.tipoAnimal = this.animal.razaAnimal?.tipoAnimal!;
		this.razaAnimal = this.animal.razaAnimal!;
		this.selectedHeightAnimal = animal.estatura;
		this.animalDialog = true;
	}

	public newMethodGeneral() {
		this.findAllIncomeSituation();
		this.findByAllTipoAnimales();
		this.findByAllRazaAnimales();

		this.loadingHeightAnimal();
	}

	public loadingHeightAnimal() {
		this.listHeightAnimal = ["Grande", "Mediano", "Pequeño"];
	}

	public hideDialog() {
		this.cleanAllMethods();

		this.animalDialog = false;
	}

	public cleanAllMethods() {
		this.errorUnique = '';
		this.selectedHeightAnimal = '';
		this.animal = {} as Animal;
		this.persona = {} as Persona;
		this.tipoAnimal = {} as TipoAnimal;
		this.razaAnimal = {} as RazaAnimal;
		this.fichaRegister = {} as FichaRegistro;
		this.submitted = false;

	}

	public localStorageRemoveItems() {
		localStorage.removeItem('listTipos');
		localStorage.removeItem('listRazas');
		localStorage.removeItem('listIncomeSituarion');
	}
}
