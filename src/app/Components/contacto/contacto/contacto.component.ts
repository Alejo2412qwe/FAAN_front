import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { EnviarGmail } from 'src/app/Models/enviargmail';
import { RecoverPasswordService } from 'src/app/Service/recover-password.service';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent {
  public enviarG = new EnviarGmail();

  constructor(
    private enviarGmail:RecoverPasswordService,
    private toastr: ToastrService
  ) {}

  enviarCorreo() {
    if (
      this.enviarG.nombre &&
      this.enviarG.correo &&
      this.enviarG.asunto &&
      this.enviarG.mensaje
    ) {
      console.log(this.enviarG);
      this.enviarGmail.enviarGmail(this.enviarG).subscribe((data) => {
        console.log(data);
        this.toastr.success("Enviado Correctamente");
        this.enviarG.nombre = "";
        this.enviarG.correo = "";
        this.enviarG.asunto = "";
        this.enviarG.mensaje = "";
      });
    } else {
      this.toastr.error("Por favor, complete todos los campos requeridos");
    }
  }
}

