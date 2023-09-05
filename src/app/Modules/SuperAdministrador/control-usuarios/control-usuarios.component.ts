import { Component, OnInit } from '@angular/core';
import { Persona } from 'src/app/Models/persona';
import { Rol } from 'src/app/Models/rol';
import { Usuario } from 'src/app/Models/usuario';
import { ImagenService } from 'src/app/Service/imagen.service';
import { PersonaService } from 'src/app/Service/persona.service';
import { RolService } from 'src/app/Service/rol.service';
import { ScreenSizeService } from 'src/app/Service/screen-size-service.service';
import { UsuarioService } from 'src/app/Service/usuario.service';

@Component({
  selector: 'app-control-usuarios',
  templateUrl: './control-usuarios.component.html',
  styleUrls: ['./control-usuarios.component.css']
})




export class ControlUsuariosComponent implements OnInit {

  constructor(
    private usuarioService: UsuarioService,
    private personaService: PersonaService,
    private rolesService: RolService,
    private screenSizeService: ScreenSizeService,
    private imagenService: ImagenService

  ) { }

  ngOnInit(): void {
    this.getAllUsuario(0, this.size, ['idUsuario', 'asc']);
    this.getSizeWindowResize();
    this.loading = true;
  }

  //VARIABLE FOR SEARCH BY ATRIBUTE NAME
  public valueAtribute: string = '';
  public submitFindAtribute: boolean = false;

  // GET ALL USUARIOS
  public listUsuarios: Usuario[] = [];
  public loading: boolean = false;
  public totalRecords!: number;
  public size: number = 3;

  public getAllUsuario(page: number, size: number, sort: string[]) {
    this.usuarioService.getAllUsuario(page, size, sort).subscribe((data: any) => {
      this.listUsuarios = data.content;
      this.totalRecords = data.totalElements;
      this.loading = false;
    }, (error) => {
      this.loading = false;
    });
  }

  public async uploadImage() {
    try {
      const result = await this.imagenService.savePictureInBuket(this.selectedFile).toPromise();
      return result.key;
    } catch (error) {
      throw new Error()
    }
  }



  // ADD UPDATE
  public editUsuario(usuario: Usuario) {
    this.usuario = { ...usuario };
    this.persona = this.usuario.persona;
    this.userDialog = true;
  }

  //CHANGE STATE
  public inhaUser(usuario: Usuario){
    this.usuario = {...usuario};
    this.persona = this.usuario.persona;
    this.desactivarUser = true;
  }

  // GET ALL ROLES
  public listRoles: Rol[] = [];

  public getAllRolesFull() {
    this.rolesService.getAllRolesFull().subscribe((data) => {
      this.listRoles = data;
    }, (error) => {
      console.log(error)
    });
  }


  //ASIGNAR ROLES A USUARIO
  public selectedRoles: Rol[] = [];

  // ADD NEW USUARIO
  public submitted: boolean = false;
  fullname: string = "";
  persona = new Persona();
  usuario = new Usuario();

  public async saveNewUsuario() {
    const key = await this.uploadImage();
    this.personaService.savePersona(this.persona).subscribe((data) => {
      this.persona = data
      console.log(this.persona)
      this.usuario.idUsuario = 0;
      this.usuario.persona = this.persona;
      this.usuario.roles = this.selectedRoles;
      this.usuario.estadoUsuario = true;
      this.usuario.fotoPerfil = key;
      this.usuarioService.saveUsuario(this.usuario).subscribe((data) => {
        this.usuario = data;
        alert('SUCESSFULL')
      }, (error) => {
        console.log('2', error)
      })
    }, (error) => {
      console.log('1', error)
    });
  }


  // UPDATE USUARIO
  public updateUsuario() {
    this.usuario.roles = this.selectedRoles
    this.usuarioService.saveUsuario(this.usuario).subscribe((data) => {
      if(data!=null){
        this.usuario = {...this.usuario}

        this.personaService.updatePersona(this.persona.idPersona!, this.persona)
        .subscribe((data1)=> {
          if(data1!=null){
            alert('datos actualizados')
          }
        })
      }
    }, (error) => {
      console.log('2', error)
    })
  }


  // UNIDO

  public saveAndUpdateUsuario() {
    this.submitted = true;
    if (this.usuario.idUsuario) {
      this.updateUsuario();
    } else {
      this.saveNewUsuario();
    }

  }

  // MODAL
  userDialog = false;
  desactivarUser = false;

  public openNewUsuario() {
    this.getAllRolesFull();
    this.persona = {} as Persona;
    this.usuario = {} as Usuario;
    this.userDialog = true;
    this.fullname = '';
  }

  // TABLE
  public screenWidth: number = 0;
  public screenHeight: number = 0;

  public getSizeWindowResize() {
    const { width, height } = this.screenSizeService.getCurrentSize();
    this.screenWidth = width;
    this.screenHeight = height;
    this.screenSizeService.onResize.subscribe(({ width, height }) => {
      this.screenWidth = width;
      this.screenHeight = height;
    });
  }

  // EVETNS
  public loadUsuarioLazy(event: any = null) {
    this.loading = true;
    const page = event ? event.first / event.rows : 0;
    this.size = event ? event.rows : 2;
    const sortField = event && event.sortField ? event.sortField : '';
    const sortOrder = event && event.sortOrder === 1 ? 'asc' : 'desc';
    this.getAllUsuario(page, this.size, [sortField, sortOrder]);
  }

  public clearInputAndStatus() {
    this.submitFindAtribute = false;
    this.valueAtribute = '';
    this.getAllUsuario(0, 1, ['idUsuario', 'asc']);
  }

  // PREVIUALIZACION IMAGEN
  public avatarURL: string = '';
  public selectedFile!: File;
  public onBasicUpload(event: any) {
    this.selectedFile = event.target.files[0];
    const imageURL = URL.createObjectURL(this.selectedFile);
    this.avatarURL = imageURL;
    if (this.selectedFile && this.selectedFile.size > 1000000) {
      event.target.value = null;
    } else {

    }
  }


  public hideDialog() {
    this.desactivarUser = false;
    this.userDialog = false;
    this.submitted = false;
    this.persona = {} as Persona;
    this.usuario = {} as Usuario;
    this.userDialog = false;
    this.fullname = '';
  }

  getSeverity(status: boolean) {
    switch (status) {
      case true:
        return 'success';
      case false:
        return 'warning';
      default:
        return 'danger';
    }
  }
}
