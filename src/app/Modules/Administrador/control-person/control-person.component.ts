import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Persona } from 'src/app/Models/persona';
import { PersonaService } from 'src/app/Service/persona.service';
import { ScreenSizeService } from 'src/app/Service/screen-size-service.service';

@Component({
  selector: 'app-control-person',
  templateUrl: './control-person.component.html',
  styleUrls: ['./control-person.component.css'],
})
export class ControlPersonComponent implements OnInit {
  public personDialog: boolean = false;

  public person = new Persona();

  public submitted: boolean = false;

  public listPerson: Persona[] = [];

  public errorUnique: string = '';

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
    private formBuilder: FormBuilder
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
      fechaNacimiento: ['', []],
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
    try {
      this.personService.getListaPersonas(page, size, sort).subscribe(
        (data: any) => {
          if (data != null) {
            this.listPerson = data.content;
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
      console.log(this.formPerson);
      this.formPerson.markAllAsTouched();
      return;
    }
    this.submitted = true;
    this.person = this.formPerson.value;

    if (this.person.idPersona) {
      this.updatePerson();
    } else {
      this.savePerson();
    }
  }

  public isEmpty(obj: any) {
    return obj ? Object.keys(obj).length === 0 : true;
  }

  public savePerson() {
    this.personService.savePersona(this.person).subscribe({
      next: (resp) => {
        alert('succesfull created..');
        this.listPerson.push(resp);
        this.closeDialog();
      },
      error: (err) => {
        if (err.status === 400) {
          this.errorUnique = 'Nombre existente.';
        }
      },
    });
  }

  public updatePerson() {
    this.personService
      .updatePersona(this.person.idPersona!, this.person)
      .subscribe({
        next: (resp) => {
          if (resp != null) {
            try {
              const indexfind = this.listPerson.findIndex(
                (person) => person.idPersona === resp.idPersona
              );
              this.listPerson[indexfind] = resp;
            } catch (error) {
              throw new Error();
            }
            this.closeDialog();
            alert('succesfull updated..');
          }
        },
        error: (err) => {
          console.log(err);
          if (err.status === 400) {
            this.errorUnique = 'Nombre existente.';
          }
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
    this.errorUnique = '';
  }

  public openNewPerson() {
    this.errorUnique = '';
    this.formPerson.reset();
    this.person = {} as Persona;
    this.submitted = false;
    this.personDialog = true;
  }

  public editPerson(person: Persona) {
    this.errorUnique = '';
    this.formPerson.reset();
    this.person = { ...person };
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
