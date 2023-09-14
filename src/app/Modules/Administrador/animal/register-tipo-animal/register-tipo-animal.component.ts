import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';
import { TipoAnimal } from 'src/app/Models/tipoAnimal';
import { ScreenSizeService } from 'src/app/Service/screen-size-service.service';
import { TipoAnimalService } from 'src/app/Service/tipo-animal.service';

@Component({
    selector: 'app-register-tipo-animal',
    templateUrl: './register-tipo-animal.component.html',
    styleUrls: ['./register-tipo-animal.component.css']
})
export class RegisterTipoAnimalComponent implements OnInit {

    public tipoAnimalDialog: boolean = false;

    public tipoAnimal = new TipoAnimal();

    public submitted: boolean = false;

    public ListTipoAnimal: TipoAnimal[] = [];

    public errorUnique: string = '';

    //Size of window..
    public screenWidth: number = 0;
    public screenHeight: number = 0;

    constructor(private tipoAnimalService: TipoAnimalService, private screenSizeService: ScreenSizeService, private toastr: ToastrService) { }

    ngOnInit(): void {
        this.findPageableTipoAnimal();
        this.getSizeWindowResize();
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

    public findPageableTipoAnimal() {
        this.tipoAnimalService.findByAllTipoAnimal().subscribe((data) => {
            this.ListTipoAnimal = data;
        });
    }

    public saveAndUpdateTipoAnimal() {
        this.submitted = true;
        if (this.tipoAnimal.nombreTipo?.trim() && this.tipoAnimal.descripcionAnimal?.trim()) {
            if (this.tipoAnimal.idTipoAnimal) {
                this.updateTipoAnimal(this.tipoAnimal);
            } else {
                this.createTipoAnimal(this.tipoAnimal);
            }
        } else {
            this.toastr.info(
                '',
                'LLENE LOS CAMPOS'
            );
        }
    }

    public createTipoAnimal(tipoAnimal: TipoAnimal) {
        this.tipoAnimal.estadoTipo = 'A';
        this.tipoAnimalService.saveTipoAnimal(tipoAnimal).subscribe({
            next: (resp) => {
                this.toastr.success(
                    '',
                    'CORRECTO AL CREAR'
                );
                this.ListTipoAnimal.push(resp);
                this.closeDialog();
            },
            error: (err) => {
                if (err.error) {
                    this.errorUnique = 'Nombre existente.';
                    this.toastr.error(
                        '',
                        'Nombre existente.'
                    );
                }
            }
        })
    }

    public updateTipoAnimal(tipoAnimal: TipoAnimal) {
        this.tipoAnimalService.updateTipoAnimal(tipoAnimal.idTipoAnimal!, tipoAnimal).subscribe({
            next: (resp) => {
                const indexfind = this.ListTipoAnimal.findIndex((tanimal) => tanimal.idTipoAnimal === resp.idTipoAnimal);
                this.ListTipoAnimal[indexfind] = resp;
                this.toastr.success(
                    '',
                    'CORRECTO AL ACTUALIZAR'
                );
                this.closeDialog();
            },
            error: (err) => {
                this.toastr.error(
                    '',
                    'Inconveniente al actualizar.'
                );
            }
        })
    }

    public eliminadoLogicoDeLosTiposAnimales(
        tipoAnimal: TipoAnimal
    ) {

        tipoAnimal.estadoTipo = tipoAnimal.estadoTipo === 'A' ? 'I' : 'A';
        this.tipoAnimalService
            .updateTipoAnimal(
                tipoAnimal.idTipoAnimal!, tipoAnimal
            )
            .subscribe({
                next: (resp) => {
                    this.toastr.success(
                        '',
                        'CORRECTO AL' + (tipoAnimal.estadoTipo === 'A' ? ' HABILITAR' : ' INHABILITAR')
                    );
                },
                error: (err) => {
                    this.toastr.error(
                        '',
                        'Inconveniente al actualizar.'
                    );
                }
            });
    }

    public closeDialog(): void {
        this.tipoAnimalDialog = false;
        this.tipoAnimal = {} as TipoAnimal;
        this.errorUnique = '';
    }

    public openNewTipoAnimal() {
        this.errorUnique = '';
        this.tipoAnimal = {} as TipoAnimal;
        this.submitted = false;
        this.tipoAnimalDialog = true;
    }

    public editTipoAnimal(tipoAnimal: TipoAnimal) {
        this.errorUnique = '';
        this.tipoAnimal = { ...tipoAnimal };
        this.tipoAnimalDialog = true;
    }

    public hideDialog() {
        this.tipoAnimal = {} as TipoAnimal;
        this.tipoAnimalDialog = false;
        this.submitted = false;
    }

}

// para vaciar una interface
//    this.tipoAnimal = {} as TipoAnimal;