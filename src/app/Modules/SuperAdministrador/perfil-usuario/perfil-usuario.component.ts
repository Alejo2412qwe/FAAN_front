import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Fundacion, Persona, Rol, Usuario } from 'src/app/Models/models';
import { FundacionService } from 'src/app/Service/fundacion.service';
import { PersonaService } from 'src/app/Service/persona.service';
import { UsuarioService } from 'src/app/Service/usuario.service';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.css']
})
export class PerfilUsuarioComponent implements OnInit {

  constructor(
    private usuarioService: UsuarioService,
    private fundacionService: FundacionService,
    private toastrService: ToastrService,
    private personaService: PersonaService

  ) { }

  public idUsuarioLoggin?: any;

  ngOnInit(): void {
    this.idUsuarioLoggin = localStorage.getItem('id_username');
    this.getDataUser(this.idUsuarioLoggin);
  }

  // GET DATA FOR USER-CONNECT
  usuario?: Usuario;
  roles: string[] = [];
  persona = new Persona();


  public getDataUser(idUsername: number): void {
    this.usuarioService.getUsuarioById(idUsername).subscribe((data) => {
      this.usuario = data;
      this.persona = this.usuario.persona;
      for (let rol of this.usuario.roles) {
        this.roles.push(rol.nombreRol!)
      }
      this.getDataFundation(1);
    })
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

  // UPDATE DATA - USER
  public updatePerfilById() {
    // Verificar si hay campos vacíos en Persona
    if (

      !this.persona.nombre1 ||
      !this.persona.nombre2 ||
      !this.persona.apellido1 ||
      !this.persona.apellido2 ||
      !this.persona.fechaNacimiento ||
      !this.persona.direccion ||
      !this.persona.telefono ||
      !this.persona.celular ||
      !this.persona.correo ||
      !this.persona.genero
    ) {
      this.toastrService.warning(
        'Uno o más campos vacíos',
        'Por favor complete todos los campos'
      );
      return;
    }

    // Verificar si persona está definido
    if (this.persona.idPersona === undefined) {
      this.toastrService.warning(
        'ID de la persona no definido',
        'Error en la actualización'
      );
      return;
    }

    // Realizar actualización de la persona
    this.personaService.updatePersona(this.persona.idPersona, this.persona)
      .subscribe(
        (data) => {
          if (data != null) {
            this.toastrService.success(
              'Actualización exitosa de los datos de la persona',
              '¡Bien hecho!'
            );

            // Implementación de la carga (este código hará una recarga de la página después de 1 segundo)
            setTimeout(() => {
              location.reload();
            }, 1000);
          }
        },
        (error) => {
          console.error(error);
          this.toastrService.error(
            'Error al actualizar los datos de la persona',
            'Por favor intenta más tarde'
          );
        }
      );
  }









  // IMAGEN SELECT
  selectedFile!: File;
  isKeyImage: string = "";
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile.size)
    if (this.selectedFile && this.selectedFile.size > 1000000) {
      this.toastrService.warning(
        'El archivo seleccionado es demasiado grande',
        ' Por favor, seleccione un archivo menor a 1000 KB.',
        {
          timeOut: 1000,
        }
      );
      event.target.value = null;

    } else {
      this.toastrService.success(
        'Foto seleccionada',
        'Correctamente',
        {
          timeOut: 1000,
        }
      )
    }
  }

  // OTHERS
  generos = [
    { value: 'M', label: 'Masculino' },
    { value: 'F', label: 'Femenino' }
  ];
}
