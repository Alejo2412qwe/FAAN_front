import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Fundacion, Persona, Rol, Usuario } from 'src/app/Models/models';
import { FundacionService } from 'src/app/Service/fundacion.service';
import { ImagenService } from 'src/app/Service/imagen.service';
import { PersonaService } from 'src/app/Service/persona.service';
import { UsuarioService } from 'src/app/Service/usuario.service';
import { FOLDER_IMAGES, getFile } from 'src/app/util/const-data';

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
    private personaService: PersonaService,
    private imagenService: ImagenService,
  ) { }

  public idUsuarioLoggin?: any;
  public avatarURL: string = '';
  public avatarURLProfile: string = '';

  //GET PROFILE PHOTO NEW METHOD
  public getUriFile(fileName: string): string {
    return getFile(fileName, FOLDER_IMAGES);
  }

  ngOnInit(): void {
    this.idUsuarioLoggin = localStorage.getItem('id_username');
    this.getDataUser(this.idUsuarioLoggin);
  }

  // GET DATA FOR USER-CONNECT
  usuario = new Usuario();
  persona = new Persona();

  public getDataUser(idUsername: number): void {
    this.usuarioService.getUsuarioById(idUsername).subscribe((data) => {
      this.usuario = data;
      this.persona = this.usuario.persona;
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

  // UPDATE USER
  public async updatePerfilById() {
    if (this.avatarURLProfile?.trim()) {
      try {
        this.usuario.fotoPerfil = await this.uploadImage();
        if(this.usuario.fotoPerfil?.trim()) this.usuarioService.updateUsuario(this.usuario.idUsuario!, this.usuario).subscribe();
      } catch (error) {
        this.toastrService.warning(
          'Problemas al subir la imagen',
          '¡Comuniquese con soporte!'
        );
      }
    }

    // Update person.
    this.personaService.updatePersona(this.persona.idPersona!, this.persona).subscribe(
      (data) => {
        if (data != null) {
          this.toastrService.success(
            'Actualización exitosa de los datos de la persona',
            '¡Bien hecho!'
          );
          // Reload page.
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
    this.avatarURLProfile = imageURL;
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

  // OTHERS
  generos = [
    { value: 'M', label: 'Masculino' },
    { value: 'F', label: 'Femenino' }
  ];
}
