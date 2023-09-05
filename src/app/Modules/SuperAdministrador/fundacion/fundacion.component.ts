import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UploadEvent } from 'primeng/fileupload';
import { Fundacion } from 'src/app/Models/fundacion';
import { FundacionService } from 'src/app/Service/fundacion.service';
import { ImagenService } from 'src/app/Service/imagen.service';

@Component({
  selector: 'app-fundacion',
  templateUrl: './fundacion.component.html',
  styleUrls: ['./fundacion.component.css']
})
export class FundacionComponent implements OnInit {

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
    this.fundacionService.getFundacionById(idFundacion).subscribe((data) => {
      this.fundacion = data;
    })
  }

  // MODAL
  visible: boolean = false;

  showDialog() {
    this.visible = true;
  }

  selectedFile!: File;
  isKeyImage: string = "";
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile.size)
    if (this.selectedFile && this.selectedFile.size > 1000000) {
      this.toastService.warning(
        'El archivo seleccionado es demasiado grande',
        ' Por favor, seleccione un archivo menor a 1000 KB.',
        {
          timeOut: 1000,
        }
      );
      event.target.value = null;

    } else {
      this.toastService.success(
        'Foto seleccionada',
        'Correctamente',
        {
          timeOut: 1000,
        }
      )
    }
  }

  // UPDATE DATA FUNDATION
  public updateFundacionById(): void {
    if (this.selectedFile!) {
      this.imagenService.savePictureInBuket(this.selectedFile).subscribe((data) => {
        console.log(data);
        this.isKeyImage = data.key;
        this.fundacion.logoFundacion = this.isKeyImage;
        console.log(this.isKeyImage);
        console.log(this.fundacion.logoFundacion + 'dsad');
        this.fundacionService.updateFundacionById(this.fundacion.idFudacion!, this.fundacion).subscribe((data) => {
          this.fundacion = data;
          alert('update')
        })
      })
    } else {
      this.fundacionService.updateFundacionById(this.fundacion.idFudacion!, this.fundacion).subscribe((data) => {
        this.fundacion = data;
        alert('update')
      })
    }
  }

}
