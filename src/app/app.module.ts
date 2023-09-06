import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Components/login/login.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { PrimengModule } from './designs/primeng/primeng.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RegistroMascotasComponent } from './Modules/Administrador/registro-mascotas/registro-mascotas.component';
import { FundacionComponent } from './Modules/SuperAdministrador/fundacion/fundacion.component';
import { PerfilUsuarioComponent } from './Modules/SuperAdministrador/perfil-usuario/perfil-usuario.component';
import { ToastrModule } from 'ngx-toastr';
import { RegisterTipoAnimalComponent } from './Modules/Administrador/animal/register-tipo-animal/register-tipo-animal.component';
import { RegisterRazaAnimalComponent } from './Modules/Administrador/animal/register-raza-animal/register-raza-animal.component';
import { ControlAnimalComponent } from './Modules/Administrador/control-animal/control-animal.component';
import { ControlUsuariosComponent } from './Modules/SuperAdministrador/control-usuarios/control-usuarios.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { AdopcionAnimalComponent } from './Modules/Administrador/adopcion-animal/adopcion-animal.component';
import { ControlPersonComponent } from './Modules/Administrador/control-person/control-person.component';
import { HomeComponent } from './Components/home/home.component';
import { RecoverPasswordComponent } from './Components/recover-password/recover-password.component';

import { ForAdopcionComponent } from './Components/formAdopcion/for-adopcion/for-adopcion.component';
import { DonacionesComponent } from './Components/donaciones/donaciones/donaciones.component';
import { ContactoComponent } from './Components/contacto/contacto/contacto.component';
import { LoaderPeticionesInterceptor } from './interceptor/loader-peticiones.interceptor';
import { NgxUiLoaderModule } from 'ngx-ui-loader';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    RegistroMascotasComponent,
    FundacionComponent,
    PerfilUsuarioComponent,
    RegisterTipoAnimalComponent,
    RegisterRazaAnimalComponent,
    ControlAnimalComponent,
    ControlUsuariosComponent,
    AdopcionAnimalComponent,
    ControlPersonComponent,
    HomeComponent,
    RecoverPasswordComponent,

    ForAdopcionComponent,
    DonacionesComponent,
    ContactoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PrimengModule,
    HttpClientModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    BrowserAnimationsModule,
    SlickCarouselModule,
    ToastrModule.forRoot(),
    NgxUiLoaderModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: LoaderPeticionesInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
