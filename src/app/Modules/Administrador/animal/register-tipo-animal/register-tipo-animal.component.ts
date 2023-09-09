import { Component, OnInit } from '@angular/core';
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

    constructor(private tipoAnimalService: TipoAnimalService, private screenSizeService: ScreenSizeService) { }

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
        try {
            this.tipoAnimalService.findByAllTipoAnimal(0, 3, []).subscribe((data: any) => {
                if (data !== null) {
                    console.log(data)
                    this.ListTipoAnimal = data.content;
                }
            });
        } catch (error) {
            throw new Error()
        }

    }

    public saveAndUpdateTipoAnimal() {
        this.submitted = true;
        if (this.tipoAnimal.nombreTipo?.trim() && this.tipoAnimal.descripcionAnimal?.trim()) {
            if (this.tipoAnimal.idTipoAnimal) {
                this.updateTipoAnimal(this.tipoAnimal);
            } else {
                this.createTipoAnimal(this.tipoAnimal);
            }
        }
    }

    public createTipoAnimal(tipoAnimal: TipoAnimal): void {
        try {
            this.tipoAnimal.estadoTipo = 'A';
            this.tipoAnimalService.saveTipoAnimal(tipoAnimal).subscribe((data) => {
                if (data != null) {
                    alert('succesfull created..')
                    this.ListTipoAnimal.push(data);
                    this.closeDialog();
                }
            }, (err) => {
                if (err.error) {
                    this.errorUnique = 'Nombre existente.';
                }
            })
        } catch (error) {
            throw new Error()
        }
    }

    public updateTipoAnimal(tipoAnimal: TipoAnimal): void {
        this.tipoAnimalService.updateTipoAnimal(tipoAnimal.idTipoAnimal!, tipoAnimal).subscribe((data) => {
            if (data != null) {
                try {
                    const indexfind = this.ListTipoAnimal.findIndex((tanimal) => tanimal.idTipoAnimal === data.idTipoAnimal);
                    this.ListTipoAnimal[indexfind] = data;
                } catch (error) {
                    throw new Error()
                }
                this.closeDialog();
                alert('succesfull updated..')
            }
        }, (err) => {
            console.log(err)
            if (err.status === 400) {
                this.errorUnique = 'Nombre existente.';
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
            .subscribe((data) => {
                if (data != null) {
                    if (tipoAnimal.estadoTipo) {
                        alert('Update')
                    }
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