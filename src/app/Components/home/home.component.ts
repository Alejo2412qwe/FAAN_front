import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Animal } from 'src/app/Models/animal';
import { RazaAnimal } from 'src/app/Models/razaAnimal';
import { TipoAnimal } from 'src/app/Models/tipoAnimal';
import { AnimalService } from 'src/app/Service/animal.service';
import { CargarScrpitsService } from 'src/app/Service/cargar-scrpits.service';
import { RazaAnimalService } from 'src/app/Service/razaAnimal.service';
import { TipoAnimalService } from 'src/app/Service/tipo-animal.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  public animal = new Animal();
  public listAnimal: Animal[] = [];

  public tipoAnimal = new TipoAnimal();
	public listTipoAnimal: TipoAnimal[] = [];


  public listRazaAnimal: RazaAnimal[] = [];
  public razaAnimal = new RazaAnimal();

  razaAnimal2: SelectItem[] = [];

    constructor(
    private _CargarScript: CargarScrpitsService,
    private animalesService: AnimalService,
    private razaAnimalService: RazaAnimalService,
    private tipoAnimalService: TipoAnimalService
    
    
  ) {
    _CargarScript.Cargar(["home"]);
  }

  ngOnInit(): void {

    
	}

  // GET ANIMALES FOR PARAMETERS
  public ListAnimales!: Animal[];

  // PAGES
  isPage: number = 0;
  isSize: number = 8
  isSosrt: string[] = ['nombreAnimal', 'asc']

  pageTotal: number = 0;
  isFirst: boolean = false;
  isLast: boolean = false;
  public isTextDigit: string = ""

  public getAllMascotas(): void {
    try {
      this.animalesService.getAllAnimalesPagesOrPlacaOrName(this.isTextDigit!, this.isPage, this.isSize, this.isSosrt).subscribe((data: any) => {
        if (data !== null) {
          this.ListAnimales = data.content;
          console.log(data.content)
          this.pageTotal = data.totalPages
        }
      });
    } catch (error) {
      console.log('Exeption')
    }
  }

  public findByAllRazaAnimales() {
		let dataLocal = localStorage.getItem('listRazas');
		if (dataLocal) {
			this.listRazaAnimal = (JSON.parse(dataLocal));

			this.loadingEventFilterRaza();
		} else {
			this.razaAnimalService.getAllRazaAnimal(0, 5, []).subscribe((data: any) => {
				if (data != null) {
					this.listRazaAnimal = data.content;
					localStorage.setItem('listRazas', JSON.stringify(data.content));

					this.loadingEventFilterRaza();
				}
			});
		}
	}

  public findByAllTipoAnimales() {
		let dataLocal = localStorage.getItem('listTipos');
		if (dataLocal) {
			this.listTipoAnimal = (JSON.parse(dataLocal));
		} else {
			this.tipoAnimalService.findByAllTipoAnimal(0, 5, []).subscribe((data: any) => {
				if (data != null) {
					this.listTipoAnimal = data.content;
					localStorage.setItem('listTipos', JSON.stringify(data.content));
				}
			});
		}

	}

  public loadingEventFilterRaza() {
		if (this.animal.idAnimal) {
			this.eventCatchTipoFilter(this.animal.razaAnimal?.tipoAnimal!);
			this.razaAnimal = this.animal.razaAnimal!;
		}
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


  public getAllAnimalPerTipo(idTipoAnimal: number) {
    this.tipoAnimalService
      .findTipoAnimalById(idTipoAnimal)
      .subscribe((data) => {
        // this.listAnimals = data
        this.ListAnimales
      });
  }

  listRazas: RazaAnimal [] = [];
  public getRazaAnimalById(idTipoAnimal: number) {
    this.razaAnimalService.findTipoAnimalById(idTipoAnimal).subscribe(
      (data) => {
        //this.listRazas = data;
        this.razaAnimal2 = this.listRazas.map((raza) => {
          return { label: raza.nombreRaza, value: raza.idRazaAnimal };
        });

      },
      (err) => {
        console.log(err);
      }
    );
  }

  
  //Control view setvisible in the case view tipos..
  enableViewAllAnimals: boolean = true;


  //Control view setvisible in the case view tipos..
  enableViewAllTipos: boolean = false;

  public setEnable(): void {
    this.enableViewAllAnimals = false;
    this.enableViewAllTipos = true;
  }

  public valuedataGender: boolean = false;
  public setDisabledGender() {
    this.valuedataGender = false;
  }

  public setEnableAll(): void {
    this.enableViewAllAnimals = true;
    this.enableViewAllTipos = false;
  }
}



