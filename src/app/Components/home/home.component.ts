import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SelectItem } from 'primeng/api';
import { Animal } from 'src/app/Models/animal';
import { EnviarGmail } from 'src/app/Models/enviargmail';
import { Fundacion } from 'src/app/Models/fundacion';
import { RazaAnimal } from 'src/app/Models/razaAnimal';
import { TipoAnimal } from 'src/app/Models/tipoAnimal';
import { AnimalService } from 'src/app/Service/animal.service';
import { CargarScrpitsService } from 'src/app/Service/cargar-scrpits.service';
import { FundacionService } from 'src/app/Service/fundacion.service';
import { RazaAnimalService } from 'src/app/Service/razaAnimal.service';
import { RecoverPasswordService } from 'src/app/Service/recover-password.service';
import { TipoAnimalService } from 'src/app/Service/tipo-animal.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public animal = new Animal();
  public listAnimal: Animal[] = [];

  public tipoAnimal = new TipoAnimal();
  public listTipoAnimal: TipoAnimal[] = [];


  public listRazaAnimal: RazaAnimal[] = [];
  public razaAnimal = new RazaAnimal();
  public enviarG = new EnviarGmail();

  razaAnimal2: SelectItem[] = [];

  constructor(
    private _CargarScript: CargarScrpitsService,
    private animalesService: AnimalService,
    private razaAnimalService: RazaAnimalService,
    private tipoAnimalService: TipoAnimalService,
    private router: Router,
    private fundacionService: FundacionService,
    private enviarGmail:RecoverPasswordService,
    private toastr: ToastrService

  ) {
    _CargarScript.Cargar(["home"]);
  }

  // MODEL
  public fundacion = new Fundacion();

  public getDataFundation(idFundacion: number) {
    this.fundacionService.getFundacionById(idFundacion).subscribe({
      next: (resp) => {
        this.fundacion = resp;
      }, error: (err) => {
        console.error('err');
      }
    });
  }


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
          console.log("----")
          console.log(data.content)
          this.pageTotal = data.totalPages
        }
      });
    } catch (error) {
      console.log('Exeption')
    }
  }

  responsiveOptions: any[] | undefined;






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

  enviarCorreo(){
    console.log(this.enviarG)
    this.enviarGmail.enviarGmail(this.enviarG).subscribe(data=>{
      console.log(data);
      this.toastr.success("Enviado Correctamente")
    });
  }
}
