import { Component, OnInit, ViewChild } from '@angular/core';
import { map } from 'rxjs';
import { Animal } from 'src/app/Models/animal';
import { FichaMedica } from 'src/app/Models/fichaMedica';
import { FichaRegistro } from 'src/app/Models/fichaRegistro';
import { Fundacion } from 'src/app/Models/fundacion';
import { Persona } from 'src/app/Models/persona';
import { RazaAnimal } from 'src/app/Models/razaAnimal';
import { SituacionIngreso } from 'src/app/Models/situacionIngreso';
import { TipoAnimal } from 'src/app/Models/tipoAnimal';
import { AnimalService } from 'src/app/Service/animal.service';
import { FichaMedicaService } from 'src/app/Service/fichaMedica.service';
import { FichaRegistroService } from 'src/app/Service/fichaRegistro.service';
import { ImagenService } from 'src/app/Service/imagen.service';
import { PersonaService } from 'src/app/Service/persona.service';
import { RazaAnimalService } from 'src/app/Service/razaAnimal.service';
import { ScreenSizeService } from 'src/app/Service/screen-size-service.service';
import { SituacionIngresoService } from 'src/app/Service/situacionIngreso.service';
import { TipoAnimalService } from 'src/app/Service/tipo-animal.service';


interface UploadEvent {
	originalEvent: Event;
	files: File[];
}


@Component({
	selector: 'app-registro-mascotas',
	templateUrl: './registro-mascotas.component.html',
	styleUrls: ['./registro-mascotas.component.css'],
})
export class RegistroMascotasComponent implements OnInit {
	public razaAnimalDialog: boolean = false;

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
	public lisPersona: Persona[] = []
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

	//Ficha MEDICA---------------------------------
	public fichaMedica = new FichaMedica();

	constructor(
		private razaAnimalService: RazaAnimalService,
		private tipoAnimalService: TipoAnimalService,
		private animalService: AnimalService,
		private personaService: PersonaService,
		private screenSizeService: ScreenSizeService,
		private incomeSituationService: SituacionIngresoService,
		private imagenService: ImagenService,
		private fichaRegisterService: FichaRegistroService,
		private fichaMedicaService: FichaMedicaService
	) { }

	ngOnInit(): void {
		this.findPageableAnimal(0, 4, ['idAnimal', 'asc']);

		this.pageablePersona(0, 3, ['idPersona', 'asc']);

		//Size of the window..
		this.getSizeWindowResize();
		this.loading = true;

		//IncomeSituation----------

	}

	public findByAtributeName(code: number) {
		if (code === 1) {
			this.loading = true;
			this.submitFindAtribute = true;
			this.razaAnimalService.getAllRazaAnimalAtribute(0, 4, ['idRazaAnimal', 'asc'], 'nombreRaza', this.valueAtribute).subscribe((data: any) => {
				if (data !== null) {
					this.listRazaAnimal = data.content;
					this.loading = false;
				}

			});
		} else {
			this.loadingPerson = true;
			this.submitFindAtribute = true;
			this.personaService.getListaPersonasAtribute(0, 3, ['identificacion', 'asc'], 'identificacion', this.valueAtributeCI).subscribe((data: any) => {
				if (data !== null) {
					this.lisPersona = data.content;
					this.loadingPerson = false;
				}

			});
		}
	}

	public findPageableAnimal(page: number, size: number, sort: string[]) {
		try {
			this.animalService.getAllAnimalesPages(page, size, sort).subscribe((data: any) => {

				if (data != null) {
					this.listAnimal = data.content;
					this.totalRecords = data.totalElements;
					this.loading = false;
				}
			}, (error) => {
				console.error(error);
				this.loading = false;
			});
		} catch (error) {
			throw new Error();
		}
	}

	public pageablePersona(page: number, size: number, sort: string[]) {
		try {
			this.personaService.getListaPersonas(page, size, sort).subscribe((data: any) => {
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

	public getSizeWindowResize() {
		const { width, height } = this.screenSizeService.getCurrentSize();
		this.screenWidth = width;
		this.screenHeight = height;

		this.screenSizeService.onResize.subscribe(({ width, height }) => {
			this.screenWidth = width;
			this.screenHeight = height;
		});
	}

	public saveAndUpdateAnimal() {
		this.submitted = true;

		if (this.animal.idAnimal) {
			this.updateAnimal();
		} else {
			this.saveAnimal();
		}

	}


	public isEmpty(obj: any) {
		// return Object.keys(obj).length === 0;
		return obj ? Object.keys(obj).length === 0 : true;
	}

	public async uploadImage() {
		try {
			const result = await this.imagenService.savePictureInBuket(this.selectedFile).toPromise();

			return result.key;

		} catch (error) {
			throw new Error()
		}

	}

	public fundacion = { idFudacion: 1 } as Fundacion; //Objeto de la fundacion..
	public async saveAnimal() {

		const key = await this.uploadImage();

		this.fichaRegister.situacionIngreso = this.catchIncomeSituation;
		this.fichaRegister.persona = this.persona

		this.fichaRegisterService.saveFichaRegistro(this.fichaRegister).subscribe((data) => {
			this.animal.fichaRegistro = data;

			this.fichaMedicaService.saveidFichaMedica(this.fichaMedica).subscribe((data) => {
				this.animal.fichaMedica = data

				this.animal.fotoAnimal = key;
				this.animal.estadoAnimal = 'A';
				this.animal.razaAnimal = this.razaAnimal;
				this.animal.fundacion = this.fundacion;

				this.animalService.saveAnimal(this.animal).subscribe((data) => {
					if (data != null) {
						alert('succesfull created..')
						this.listAnimal.push(data);
						this.closeDialog();
					}
				})
			})
		});



	}

	public updateAnimal() {
		// this.razaAnimalService.updateRazaAnimal(razaAnimal.idRazaAnimal!, razaAnimal).subscribe((data) => {
		// 	if (data != null) {
		// 		try {
		// 			const indexfind = this.listRazaAnimal.findIndex((ranimal) => ranimal.idRazaAnimal === data.idRazaAnimal);
		// 			this.listRazaAnimal[indexfind] = data;
		// 		} catch (error) {
		// 			throw new Error()
		// 		}
		// 		this.closeDialog();
		// 		alert('succesfull updated..')
		// 	}
		// }, (err) => {
		// 	console.log(err)
		// 	if (err.status === 400) {
		// 		this.errorUnique = 'Nombre existente.';
		// 	}
		// })
	}

	public eliminadoLogicoDeLosTiposAnimales(
		razaAnimal: RazaAnimal
	) {

		razaAnimal.estadoRaza = razaAnimal.estadoRaza === 'A' ? 'I' : 'A';
		this.razaAnimalService
			.updateRazaAnimal(
				razaAnimal.idRazaAnimal!, razaAnimal
			)
			.subscribe((data) => {
				if (data != null) {
					if (razaAnimal.estadoRaza) {
						alert('Update')
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
		try {
			this.incomeSituationService.getAllIncomeSituation().subscribe((data) => {
				this.listIncomeSituation = data;
			});

		} catch (error) {
			throw new Error();
		}

	}

	// RAZA AND TIPO ANIMAL--------------------------
	public findByAllTipoAnimales() {
		this.tipoAnimalService.findByAllTipoAnimal(0, 5, []).subscribe((data: any) => {
			if (data != null) {
				this.listTipoAnimal = data.content;
			}
		});
	}

	public findByAllRazaAnimales() {
		this.razaAnimalService.getAllRazaAnimal(0, 5, []).subscribe((data: any) => {
			if (data != null) {
				this.listRazaAnimal = data.content;

				if (this.animal.idAnimal) {
					this.eventCatchTipoFilter(this.animal.razaAnimal?.tipoAnimal!);
					this.razaAnimal = this.animal.razaAnimal!;
				}

			}
		});
	}

	public listRazaFiltered: RazaAnimal[] = [];
	public eventCatchTipoFilter(e: any) {
		console.log({ tipo: e })
		console.log(...this.listRazaAnimal)
		const datacopy = [...this.listRazaAnimal];
		this.listRazaFiltered = datacopy.filter((raza: any) => {
			return raza.tipoAnimal.idTipoAnimal === e.idTipoAnimal
		});
		console.log(datacopy)

	}


	public avatarURL: string = '';
	public selectedFile!: File;
	public onBasicUpload(event: any) {
		this.selectedFile = event.target.files[0];

		const imageURL = URL.createObjectURL(this.selectedFile);
		this.avatarURL = imageURL;
		// console.log(this.selectedFile.size)
		console.log(imageURL)
		if (this.selectedFile && this.selectedFile.size > 1000000) {

			event.target.value = null;

		} else {

		}
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
			this.incomeSituationService.saveSituacionIngreso(this.incomeSituation).subscribe((data) => {
				if (data != null) {
					this.listIncomeSituation.push(data);

					setTimeout(() => {
						this.closeDialogIconmeSituation();
					}, 500);
				}
			});
		}


	}

	public closeDialogIconmeSituation() {
		this.incomeSituation = {} as SituacionIngreso;
		this.dialogIncomeSituation = false;
	}
	// 
	public clearInputAndStatus() {
		this.submitFindAtribute = false;
		this.valueAtribute = '';
		this.findPageableAnimal(0, 4, ['idRazaAnimal', 'asc']);
	}

	public closeDialog(): void {
		this.razaAnimalDialog = false;
		this.animal = {} as Animal;
		this.errorUnique = '';

	}

	public openNewAnimal() {
		//get list income situation..
		this.newMethodGeneral();

		this.errorUnique = '';
		this.animal = {} as Animal;
		this.persona = {} as Persona;
		this.tipoAnimal = {} as TipoAnimal;
		this.razaAnimal = {} as RazaAnimal;

		this.submitted = false;
		this.razaAnimalDialog = true;
	}

	public editAnimal(animal: Animal) {
		this.newMethodGeneral();
		this.errorUnique = '';
		this.animal = { ...animal };
		this.fichaRegister = this.animal.fichaRegistro!;
		this.catchIncomeSituation = this.fichaRegister.situacionIngreso!;
		this.persona = this.fichaRegister.persona!;
		this.tipoAnimal = this.animal.razaAnimal?.tipoAnimal!;
		this.razaAnimalDialog = true;
	}


	public newMethodGeneral() {
		this.findAllIncomeSituation();
		this.findByAllTipoAnimales();
		this.findByAllRazaAnimales();
	}



	public hideDialog() {
		this.animal = {} as Animal;
		this.razaAnimalDialog = false;
		this.submitted = false;
	}



}
