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
import { DonacionesComponent } from './Components/donaciones/donaciones/donaciones.component';
import { ContactoComponent } from './Components/contacto/contacto/contacto.component';
import { InformationComponent } from './Components/information/information.component';
import { AuthGaurdGuard } from './guard/auth.guard';



const routes: Routes = [

  // PUBLIC---------------------------------------------------------------------------------------------
  { path: 'login', component: LoginComponent },

  { path: 'informacion', component: InformationComponent },

  { path: 'formulario-adopcion', component: ForAdopcionComponent },

  { path: 'donaciones', component: DonacionesComponent },

  { path: 'contacto', component: ContactoComponent },

  { path: 'home', component: HomeComponent },

  { path: 'recover/password/:token', component: RecoverPasswordComponent, data: { titulo: 'Dashboard' } },

  { path: 'person/gestion', component: ControlPersonComponent, canActivate: [AuthGaurdGuard], data: { titulo: 'Control de las Personas/Rescatistas', expectedRoles: ['SUPERADMINISTRADOR', 'ADMINISTRADOR'] } },

  { path: 'registro-mascota', component: RegistroMascotasComponent, canActivate: [AuthGaurdGuard], data: { titulo: 'Registro de Animales', expectedRoles: ['SUPERADMINISTRADOR', 'ADMINISTRADOR'] } },

  { path: 'control-animal', component: ControlAnimalComponent, canActivate: [AuthGaurdGuard], data: { titulo: 'Control de los Animales', expectedRoles: ['SUPERADMINISTRADOR', 'ADMINISTRADOR'] } },

  { path: 'adopcion-animal', component: AdopcionAnimalComponent, canActivate: [AuthGaurdGuard], data: { titulo: 'Adopción de los Animales', expectedRoles: ['SUPERADMINISTRADOR', 'ADMINISTRADOR'] } },

  //REGISTRO DE TIPO Y RAZA DE ANIMAL-----------------------------------------------------
  { path: 'animal-tipo', component: RegisterTipoAnimalComponent, canActivate: [AuthGaurdGuard], data: { titulo: 'Gestión del Tipo de Animal', expectedRoles: ['SUPERADMINISTRADOR', 'ADMINISTRADOR'] } },

  { path: 'animal-raza', component: RegisterRazaAnimalComponent, canActivate: [AuthGaurdGuard], data: { titulo: 'Gestión de las Razas de los Animales', expectedRoles: ['SUPERADMINISTRADOR', 'ADMINISTRADOR'] } },

  // SHARED
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGaurdGuard], data: { titulo: 'Dashboard', expectedRoles: ['SUPERADMINISTRADOR', 'ADMINISTRADOR'] } },

  { path: 'fundacion', component: FundacionComponent, canActivate: [AuthGaurdGuard], data: { titulo: 'Administración de la Fundación', expectedRoles: ['SUPERADMINISTRADOR', 'ADMINISTRADOR'] } },

  { path: 'perfil-usuario', component: PerfilUsuarioComponent, canActivate: [AuthGaurdGuard], data: { titulo: 'Perfil del Usuario', expectedRoles: ['SUPERADMINISTRADOR', 'ADMINISTRADOR'] } },

  // SUPERADMIN
  { path: 'control-usuario', component: ControlUsuariosComponent, canActivate: [AuthGaurdGuard], data: { titulo: 'Control de los Usuarios', expectedRoles: ['SUPERADMINISTRADOR', 'ADMINISTRADOR'] } },

  { path: '**', redirectTo: 'dashboard' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
