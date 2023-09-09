import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/Models/models';
import { AuthService } from 'src/app/Service/auth.service';
import { RecoverPasswordService } from 'src/app/Service/recover-password.service';
import { ScreenSizeService } from 'src/app/Service/screen-size-service.service';
import { SharedService } from 'src/app/util/service/shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  //Form validate.
  public formulario!: FormGroup;

  //responde server
  public responseServer = {} as any;

  //Window size..
  public screenWidth: number = 0;
  public screenHeight: number = 0;

  constructor(
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private screenSizeService: ScreenSizeService,
    private sendEmailRecoverService: RecoverPasswordService,
    private sharedService: SharedService, // Inject the SharedService
  ) {
    this.formulario = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]]
    });

  }

  ngOnInit(): void {
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

  public infoUsuario!: Usuario;


  public usuarioLoginDTO = {
    username: '',
    password: ''
  };


  // METHOD AUTHENTICATION USER
  public singIn(): void {
    if (!this.usuarioLoginDTO.password || !this.usuarioLoginDTO.password) {
      alert('EMPYTY FIELDS')
    } else {
      this.authService.login(this.usuarioLoginDTO).subscribe(data => {
        if (!data) {
          console.log('CREDENCIALES INCORRECTAS');
          localStorage.removeItem('id_username');
          localStorage.removeItem('id_persona');
          localStorage.removeItem('foto');
          localStorage.removeItem('rol');
          localStorage.removeItem('username');
          localStorage.removeItem('token');
        } else {
          this.infoUsuario = data;
          console.log(data)
          if (this.infoUsuario.roles.length! > 1) {
            this.modalView();
          } else {
            this.sharedService.setIsLogginPresent(true);

            alert('BIENVENIDO')
            // STORE IN STORAGE
            // localStorage.setItem('token', String(this.infoUsuario.token));
            localStorage.setItem('id_username', String(this.infoUsuario.idUsuario));
            localStorage.setItem('id_persona', String(this.infoUsuario.persona.idPersona));
            localStorage.setItem('foto', String(this.infoUsuario.fotoPerfil));
            localStorage.setItem('username', String(this.infoUsuario.username));

            for (let rol of this.infoUsuario.roles!) {
              localStorage.setItem('rol', String(rol.nombreRol));
            }
            setTimeout(() => {
              this.router.navigate(['/dashboard']).then(() => {
                this.sharedService.setIsLogginPresent(true); // Set 
                window.location.reload();
              });

            }, 1500);
          }
        }
      },
        (err) => {
          console.log('Error -> ' + err)
        })
    }
  }

  // VIEW TWO - MORE ROLES
  public visiblePeriodoMensual: boolean = false;

  public modalView() {
    this.visiblePeriodoMensual = true;
  }

  //IMPLEMENT RECOVER PASSWORD----------------------------------------------------------------
  public dialogRecoverPassword: boolean = false;
  public submitted: boolean = false;

  public openDialogRecoverPassword() {
    this.closeDialog();
    this.dialogRecoverPassword = true;
  }

  public hideDialog() {
    this.closeDialog();
    this.dialogRecoverPassword = false;
  }

  public closeDialog() {
    this.responseServer = {} as any;
    this.formulario.reset();
    this.submitted = false;
  }

  public isEmpty(obj: any) {
    return obj ? Object.keys(obj).length === 0 : true;
  }

  public sendRecoverPassword() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    this.submitted = true;

    console.log(this.formulario.value);
    this.sendEmailRecoverService.sendEmailRecoverPassword(this.formulario.value.email).subscribe(
      {
        next: resp => {
          this.responseServer = { status: 200, message: resp }
          this.submitted = false;
          this.formulario.reset();

          setTimeout(() => {
            this.hideDialog();
          }, 2500);

        },
        error: err => {
          this.responseServer = { status: err.status, message: err.error }
          this.submitted = false;
        }
      });

  }
}
