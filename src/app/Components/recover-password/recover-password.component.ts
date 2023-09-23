import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RecoverPassword } from 'src/app/Models/recover-password';
import { RecoverPasswordService } from 'src/app/Service/recover-password.service';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.css'],
})
export class RecoverPasswordComponent implements OnInit {

  //Form validate.
  public submitted: boolean = false;
  public equalsPassword: boolean = false;

  public validatePassword = new RecoverPassword();

  constructor(private activatedRoute: ActivatedRoute,
    private toastService: ToastrService,
    private recoverPasswordService: RecoverPasswordService,) {

  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      const token = params['token'];
      this.validatePassword.token = token;
      if (!this.validatePassword.token) {
        location.replace('/login')
      }
    });
  }



  public changePassword() {

    this.submitted = true;
    if (!this.validatePassword.password || !this.validatePassword.passwordr) {
      this.toastService.warning('', 'Verifique los campos.', { timeOut: 1000 });

      return;
    } else {
      if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/.test(this.validatePassword.password!) && this.equalsPassword) {

        // When all the information is correct..
        this.recoverPasswordService.changePasswordFindUser(this.validatePassword).subscribe({
          next: resp => {
            this.toastService.success('', 'CONTRASEÑA CAMBIADA.', { timeOut: 1500 });
            setTimeout(() => {
              location.replace('/login');
            }, 2000);

          }, error: err => {
            this.toastService.error('', 'ERROR INESPERADO.', { timeOut: 1500 });

            setTimeout(() => {
              location.replace('/login');
            }, 2000);

          }
        });

      } else {
        this.toastService.warning('', 'Contraseñas no consistentes.', { timeOut: 1000 });
      }
    }
  }


  validarMismaPassword(evento: any) {
    let passwordValor = this.validatePassword.password;
    let passwordINgreso = evento.target.value;

    if (passwordValor === passwordINgreso) return this.equalsPassword = true;
    return this.equalsPassword = false;
  }



  public validate(password: string): boolean {
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/.test(password)) return true;
    return false;
  }

}
