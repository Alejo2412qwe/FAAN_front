import { Injectable } from '@angular/core';
import { ROLS_SYSTEM } from '../const-data';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  constructor() { }

  dataMenu: any[] = [

    {
      title: 'Animales',
      idNavigation: "aminals-nav",
      icon: 'bi bi-clipboard-plus-fill',
      rols: ["SUPERADMINISTRADOR", "ADMINISTRADOR"],
      subMenu: [
        { path: 'registro-mascota', subTitle: 'Registro Animal' },
        { path: 'control-animal', subTitle: 'Control Animal' }
      ]
    },


    {
      title: 'Adopciones',
      idNavigation: "adoption-nav",
      icon: 'bi bi-clipboard2-fill',
      rols: ["SUPERADMINISTRADOR", "ADMINISTRADOR"],
      subMenu: [
        { path: 'adopcion-animal', subTitle: 'Adopciones Animales' },

      ]
    },

    {
      title: 'Animal Tipos',
      idNavigation: "tipoAnimal-nav",
      icon: 'bi bi-journal-text',
      rols: ["SUPERADMINISTRADOR", "ADMINISTRADOR"],
      subMenu: [
        { path: 'animal-tipo', subTitle: 'Gestión Tipo Animal' },

      ]
    },

    {
      title: 'Animal Razas',
      idNavigation: "razaAnimal-nav",
      icon: 'bi bi-layout-text-window-reverse',
      rols: ["SUPERADMINISTRADOR", "ADMINISTRADOR"],
      subMenu: [
        { path: 'animal-raza', subTitle: 'Gestión Raza Animal' },

      ]
    },

    {
      title: 'Usuarios',
      idNavigation: "controlUser-nav",
      icon: 'bi bi-person-lines-fill',
      rols: ["SUPERADMINISTRADOR", "ADMINISTRADOR"],
      subMenu: [
        { path: 'control-usuario', subTitle: 'Control Usuario' },

      ]
    },

    {
      title: 'Persona',
      idNavigation: "controlPerson-nav",
      icon: 'bi bi-person-square',
      rols: ["SUPERADMINISTRADOR", "ADMINISTRADOR"],
      subMenu: [
        { path: 'person/gestion', subTitle: 'Control Persona' },

      ]
    },

  ];

}
