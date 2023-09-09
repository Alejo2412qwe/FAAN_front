import { Component, OnInit } from '@angular/core';
import { RazaAnimal } from 'src/app/Models/razaAnimal';
import { TipoAnimal } from 'src/app/Models/tipoAnimal';
import { RazaAnimalService } from 'src/app/Service/razaAnimal.service';
import { ScreenSizeService } from 'src/app/Service/screen-size-service.service';
import { TipoAnimalService } from 'src/app/Service/tipo-animal.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register-raza-animal',
  templateUrl: './register-raza-animal.component.html',
  styleUrls: ['./register-raza-animal.component.css']
})
export class RegisterRazaAnimalComponent implements OnInit {

  public razaAnimalDialog: boolean = false;

  public razaAnimal = new RazaAnimal();

  public submitted: boolean = false;

  public listRazaAnimal: RazaAnimal[] = [];

  public errorUnique: string = '';

  //LIST OF TIPO ANIMALS
  public listTipoAnimals: TipoAnimal[] = [];

  public tipoAnimal = new TipoAnimal();

  //Size of window..
  public screenWidth: number = 0;
  public screenHeight: number = 0;

  public loading: boolean = false;
  public totalRecords!: number;

  //VARIABLE FOR SEARCH BY ATRIBUTE NAME
  public valueAtribute: string = '';
  public submitFindAtribute: boolean = false;

  constructor(private razaAnimalService: RazaAnimalService, private tipoAnimalService: TipoAnimalService, private screenSizeService: ScreenSizeService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.findPagableRazaAnimal(0, 4, ['idRazaAnimal', 'asc']);

    this.findByAllTipoAnimales();

    //Size of the window..
    this.getSizeWindowResize();
    this.loading = true;
  }

  public findByAtributeName() {
    this.loading = true;
    this.submitFindAtribute = true;
    this.razaAnimalService.getAllRazaAnimalAtribute(0, 4, ['idRazaAnimal', 'asc'], 'nombreRaza', this.valueAtribute).subscribe((data: any) => {
      if (data !== null) {
        this.listRazaAnimal = data.content;
        this.loading = false;
      }

    });
  }

  public findPagableRazaAnimal(page: number, size: number, sort: string[]) {
    try {
      this.razaAnimalService.getAllRazaAnimal(page, size, sort).subscribe((data: any) => {

        if (data != null) {
          this.listRazaAnimal = data.content;
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

  // event: LazyLoadEvent
  public loadRazaAnimalLazy(event: any = null) {
    this.loading = true;
    const page = event ? event.first / event.rows : 0;
    const size = event ? event.rows : 4;
    const sortField = event && event.sortField ? event.sortField : ''; // Not stablished field..
    const sortOrder = event && event.sortOrder === 1 ? 'asc' : 'desc';
    this.findPagableRazaAnimal(page, size, [sortField, sortOrder]);

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

  public findByAllTipoAnimales() {
    this.tipoAnimalService.findByAllTipoAnimal(0, 5, []).subscribe((data: any) => {
      if (data != null) {
        this.listTipoAnimals = data.content;

        this.totalRecords = this.listTipoAnimals.length;
      }
    });
  }



  public saveAndUpdateRazaAnimal() {
    this.submitted = true;
    this.razaAnimal.tipoAnimal = this.tipoAnimal;
    console.log(this.isEmpty(this.tipoAnimal))
    if (this.razaAnimal.nombreRaza?.trim() && !this.isEmpty(this.tipoAnimal)) {
      if (this.razaAnimal.idRazaAnimal) {
        this.updateRazaAnimal(this.razaAnimal);
      } else {
        this.saveRazaAnimal(this.razaAnimal);
      }
    }
  }

  public isEmpty(obj: any) {
    // return Object.keys(obj).length === 0;
    return obj ? Object.keys(obj).length === 0 : true;
  }


  public saveRazaAnimal(razaAnimal: RazaAnimal) {
    try {
      this.razaAnimal.estadoRaza = 'A';
      this.razaAnimalService.saveRazaAnimal(razaAnimal).subscribe((data) => {
        if (data != null) {
          this.toastr.success(
            'CREADO CORRECTAMENTE'
          );
          this.listRazaAnimal.push(data);
          this.closeDialog();
        }
      }, (err) => {
        if (err.status === 400) {
          this.errorUnique = 'Nombre existente.';
        }
      })
    } catch (error) {
      throw new Error()
    }
  }

  public updateRazaAnimal(razaAnimal: RazaAnimal) {
    this.razaAnimalService.updateRazaAnimal(razaAnimal.idRazaAnimal!, razaAnimal).subscribe((data) => {
      if (data != null) {
        try {
          const indexfind = this.listRazaAnimal.findIndex((ranimal) => ranimal.idRazaAnimal === data.idRazaAnimal);
          this.listRazaAnimal[indexfind] = data;
        } catch (error) {
          throw new Error()
        }
        this.closeDialog();
        this.toastr.success(
          'ACTUALIZADO CORRECTAMENTE'
        );
      }
    }, (err) => {
      console.log(err)
      if (err.status === 400) {
        this.errorUnique = 'Nombre existente.';
      }
    })
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
            this.toastr.success(
              'ACTUALIZADO'
          );
          }
        }
      });
  }

  public clearInputAndStatus() {
    this.submitFindAtribute = false;
    this.valueAtribute = '';
    this.findPagableRazaAnimal(0, 4, ['idRazaAnimal', 'asc']);
  }

  public closeDialog(): void {
    this.razaAnimalDialog = false;
    this.razaAnimal = {} as RazaAnimal;
    this.tipoAnimal = {} as TipoAnimal;
    this.errorUnique = '';
  }

  public openNewRazaAnimal() {
    this.errorUnique = '';
    this.razaAnimal = {} as RazaAnimal;
    this.tipoAnimal = {} as TipoAnimal;
    this.submitted = false;
    this.razaAnimalDialog = true;
  }

  public editRazaAnimal(razaAnimal: RazaAnimal) {
    this.errorUnique = '';
    this.razaAnimal = { ...razaAnimal };
    this.tipoAnimal = { ...razaAnimal.tipoAnimal }
    this.razaAnimalDialog = true;
  }

  public hideDialog() {
    this.razaAnimal = {} as RazaAnimal;
    this.tipoAnimal = {} as TipoAnimal;
    this.razaAnimalDialog = false;
    this.submitted = false;
  }

}
