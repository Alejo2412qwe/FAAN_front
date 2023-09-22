import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { Animal } from 'src/app/Models/animal';
import { EnviarGmail } from 'src/app/Models/enviargmail';
import { Fundacion } from 'src/app/Models/fundacion';
import { RazaAnimal } from 'src/app/Models/razaAnimal';
import { TipoAnimal } from 'src/app/Models/tipoAnimal';
import { AnimalService } from 'src/app/Service/animal.service';
import { CargarScrpitsService } from 'src/app/Service/cargar-scrpits.service';
import { FundacionService } from 'src/app/Service/fundacion.service';
import { ImagenService } from 'src/app/Service/imagen.service';
import { FOLDER_IMAGES, getFile } from 'src/app/util/const-data';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public animal = new Animal();
  public listAnimal: Animal[] = [];
  public listRazaAnimal: RazaAnimal[] = [];

  constructor(
    private _CargarScript: CargarScrpitsService,
    private animalesService: AnimalService,
    private router: Router,
    private fundacionService: FundacionService,
    private imagenService: ImagenService,

  ) {
    _CargarScript.Cargar(["home"]);
  }

  responsiveOptions: any[] | undefined;

  ngOnInit(): void {

    this.getDataFundation(1);

    // RESPONSIVE
    this.responsiveOptions = [
      {
        breakpoint: '1199px',
        numVisible: 1,
        numScroll: 1
      },
      {
        breakpoint: '991px',
        numVisible: 2,
        numScroll: 1
      },
      {
        breakpoint: '767px',
        numVisible: 1,
        numScroll: 1
      }
    ];
    this.getAllMascotas()

  }
  // MODEL
  public fundacion = new Fundacion();

  public getDataFundation(idFundacion: number) {
    this.fundacionService.getFundacionById(idFundacion).subscribe({
      next: (resp) => {
        this.fundacion = resp;
      }, error: (err) => {
        null;
      }
    });
  }

  // GET ANIMALES FOR PARAMETERS
  public ListAnimales!: Animal[];

  // PAGES
  isPage: number = 0;
  isSize: number = 3;
  isSosrt: string[] = ['nombreAnimal', 'asc']

  pageTotal: number = 0;
  isFirst: boolean = false;
  isLast: boolean = false;
  public isTextDigit: string = ""

  // Get photo
  public getUriFile(fileName: string): string {
    return getFile(fileName, FOLDER_IMAGES);
  }

  public getAllMascotas(): void {
    try {
      this.animalesService.getAll(this.isPage, this.isSize, this.isSosrt).subscribe((data: any) => {
        if (data !== null) {
          this.ListAnimales = data.content;
          this.pageTotal = data.totalPages
        }
      });
    } catch (error) {
      null;
    }
  }

  anterior(): void {
    if (!this.isFirst) {
      this.isPage--;
      this.getAllMascotas();
    }
  }

  siguiente(): void {
    if (!this.isLast) {
      this.isPage++;
      this.getAllMascotas();
    }
  }

  // NEW
  goLogin() {
    this.router.navigate(['/login']).then(() => {
      localStorage.clear();
    });
  }

  goFormulario() {
    this.router.navigate(['/formulario-adopcion']).then(() => {
      localStorage.clear();
    });
  }


  public showModalWhatsapp: boolean = false;
  public showModalMessage() {
    this.showModalWhatsapp = true;
  }

  public redirectMessage() {
    const numberPhone = "https://api.whatsapp.com/send?phone=593998681859&text=Hola%20Fundaci%C3%B3n%20FAAN%20quiero%20mas%20informaci%C3%B3n";
    window.open(numberPhone, "_blank");
    this.showModalWhatsapp = false;
  }

}
