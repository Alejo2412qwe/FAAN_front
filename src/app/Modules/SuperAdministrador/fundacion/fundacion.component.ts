import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Fundacion } from 'src/app/Models/fundacion';
import { FundacionService } from 'src/app/Service/fundacion.service';
import { ImagenService } from 'src/app/Service/imagen.service';

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
        private toastService: ToastrService
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
            this.toastService.error('', 'IMAGEN MUY GRANDE.', { timeOut: 2000 });
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
                this.toastService.success('', 'DATOS GUARDADOS.', { timeOut: 2000 });
                this.clearData()
            });
    }

    public async uploadImage() {
        try {
            const result = await this.imagenService
                .savePictureInBuket(this.selectedFile)
                .toPromise();
            return result.key;
        } catch (error) {
            console.error('new income');
        }
    }

    public clearData() {
        this.selectedFile = {} as File;
        this.avatarURL = ''
        this.visible = false
    }
}
