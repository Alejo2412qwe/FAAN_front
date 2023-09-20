import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Fundacion } from 'src/app/Models/fundacion';
import { FundacionService } from 'src/app/Service/fundacion.service';
import { ImagenService } from 'src/app/Service/imagen.service';
import { FOLDER_IMAGES, getFile } from 'src/app/util/const-data';

@Component({
    selector: 'app-fundacion',
    templateUrl: './fundacion.component.html',
    styleUrls: ['./fundacion.component.css'],
})
export class FundacionComponent implements OnInit {

    public visible: boolean = false;

    constructor(
        private fundacionService: FundacionService,
        private imagenService: ImagenService,
        private toastrService: ToastrService,
    ) { }

    ngOnInit(): void {
        this.getDataFundation(1);
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

    public showDialog() {
        this.visible = true;
        //this.clearData();
    }

    selectedFile!: File;
    public onFileSelected(event: any) {
        let data = event.target.files[0];

        if (data.size >= 1048576) {
            this.toastrService.warning(
                'El archivo seleccionado es demasiado grande',
                ' Por favor, seleccione un archivo menor a 1000 KB.',
                {
                    timeOut: 1000,
                }
            );
            event.target.value = null;
            return;
        }

        this.selectedFile = data;
        const imageURL = URL.createObjectURL(this.selectedFile);
        this.avatarURL = imageURL;
    }

    // UPDATE DATA FUNDATION
    public avatarURL: string = '';
    public async updateFundacionById() {
        if (this.avatarURL?.trim()) {
            try {
                this.fundacion.logoFundacion = await this.uploadImage();
            } catch (error) {
                console.error('A problme upload.');
            }
        }

        this.fundacionService
            .updateFundacionById(this.fundacion.idFudacion!, this.fundacion)
            .subscribe((data) => {
                this.fundacion = data;
                this.toastrService.success('', 'DATOS GUARDADOS.', { timeOut: 2000 });
                this.clearData()
            });
    }

    public async uploadImage() {
        try {
            const result = await this.imagenService
                .savePictureInBuket(this.selectedFile, FOLDER_IMAGES)
                .toPromise();
            return result.key;
        } catch (error) {
            throw new Error();
        }
    }

    public clearData() {
        this.selectedFile = {} as File;
        this.avatarURL = ''
        this.visible = false
    }

    //OBTENER LA IMAGEN NEW MOTHOD------------------------------
    public getUriFile(fileName: string): string {
        return getFile(fileName, FOLDER_IMAGES);
    }
}
