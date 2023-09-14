import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TipoAnimal } from 'src/app/Models/tipoAnimal';
import { ScreenSizeService } from 'src/app/Service/screen-size-service.service';
import { TipoAnimalService } from 'src/app/Service/tipo-animal.service';
import { ImageService } from 'src/app/Service/image.service';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TIPO_ANIMAL } from 'src/app/util/const-validate';
import { EXPORT_DATE_NOW, LocalStorageKeys, getUserName } from 'src/app/util/local-storage-manager';
import { generateCustomContent } from 'src/app/util/data-reutilizable';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;


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

    constructor(private tipoAnimalService: TipoAnimalService, private screenSizeService: ScreenSizeService, private toastr: ToastrService, private imageService: ImageService) { }

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

    public async generatePdfAllTips() {
        if (this.ListTipoAnimal.length === 0) {
            this.toastr.info(
                '',
                'NO HAY INFORMACIÓN',
                { timeOut: 1500 }
            );
            return;
        }

        const tableData = this.ListTipoAnimal.map(item => [
            { text: item.idTipoAnimal },
            { text: item.nombreTipo, },
            { text: item.descripcionAnimal, },
            { text: item.estadoTipo === 'A' ? 'Activo' : 'Inactivo', }
        ]);

        const imageDataUrl = await this.imageService.getImageDataUrl('assets/img/faan.jpg');

        const docDefinition = {

            content:
                [
                    generateCustomContent(imageDataUrl, 'Informe tipo de animales'),
                    {
                        table: {
                            headerRows: 1,
                            widths: ['auto', 'auto', '*', 'auto'],
                            body: [['ID', 'NOMBRE', 'DESCRIPCIÓN', 'ESTADO'], ...tableData],
                        },
                        style: 'table',

                        layout: {
                            fillColor: (rowI: number, node: any, columI: number) => {
                                return rowI === 0 ? '#65b2cc' : rowI % 2 === 0 ? '#CCCCCC' : ''
                            },
                            hLineWidth: () => 0.2,
                            vLineWidth: () => 0.2,
                        }

                    },
                ]
            ,
            footer: function (currentPage: number, pageCount: number) {
                return {
                    text: `Pagina ${currentPage.toString()} de ${pageCount}`,
                    style: 'footer',
                    alignment: 'center',
                    margin: [0, 10],
                    fontSize: 14,
                    color: '#3498db',
                };
            },
            styles: TIPO_ANIMAL,
            defaultStyle: {
                border: '1px solid black'
            }
        };


        pdfMake.createPdf(docDefinition as any).open();
        // pdfMake.createPdf(docDefinition as any)download('tipo_animal.pdf');
    }

}