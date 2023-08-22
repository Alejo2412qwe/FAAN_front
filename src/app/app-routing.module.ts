import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { AppComponent } from './app.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { RegistroMascotasComponent } from './Modules/Administrador/registro-mascotas/registro-mascotas.component';
import { FundacionComponent } from './Modules/SuperAdministrador/fundacion/fundacion.component';
import { PerfilUsuarioComponent } from './Modules/SuperAdministrador/perfil-usuario/perfil-usuario.component';
import { RegisterTipoAnimalComponent } from './Modules/Administrador/animal/register-tipo-animal/register-tipo-animal.component';
import { ControlAnimalComponent } from './Modules/Administrador/control-animal/control-animal.component';
import { RegisterRazaAnimalComponent } from './Modules/Administrador/animal/register-raza-animal/register-raza-animal.component';
import { ControlUsuariosComponent } from './Modules/SuperAdministrador/control-usuarios/control-usuarios.component';

import { AdopcionAnimalComponent } from './Modules/Administrador/adopcion-animal/adopcion-animal.component';

import { RecoverPasswordComponent } from './Components/recover-password/recover-password.component';
import { ControlPersonComponent } from './Modules/Administrador/control-person/control-person.component';
import { HomeComponent } from './Components/home/home.component';
import { ForAdopcionComponent } from './Components/formAdopcion/for-adopcion/for-adopcion.component';


const routes: Routes = [
  //Public
  { path: 'home', component: HomeComponent },

  //Password recover..
  { path: 'recover/password/:token', component: RecoverPasswordComponent },
  // { path: 'recover-password', component: RecoverPasswordComponent },

  { path: 'person/gestion', component: ControlPersonComponent },

  // MASCOTAS

  { path: 'registro-mascota', component: RegistroMascotasComponent},
  { path: 'control-animal', component: ControlAnimalComponent},
  { path: 'adopcion-animal', component: AdopcionAnimalComponent},


  //REGISTRO DE TIPO DE ANIMAL-----------------------------------------------------
  { path: 'animal-tipo', component: RegisterTipoAnimalComponent },
  { path: 'animal-raza', component: RegisterRazaAnimalComponent },

  // SHARED
  { path: 'dashboard', component: DashboardComponent },
  { path: 'fundacion', component: FundacionComponent },
  { path: 'perfil-usuario', component: PerfilUsuarioComponent },

  // SUPERADMIN
  { path: 'control-usuario', component: ControlUsuariosComponent },

  // PUBLIC
  { path: 'login', component: LoginComponent },
  { path: 'formulario-adopcion', component: ForAdopcionComponent },
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
