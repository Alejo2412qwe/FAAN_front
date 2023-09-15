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
        { path: 'registro-mascota', subTitle: 'Registro de Animales' },
        { path: 'control-animal', subTitle: 'Control de los Animales' }
      ]
    },


    {
      title: 'Adopciones',
      idNavigation: "adoption-nav",
      icon: 'bi bi-clipboard2-fill',
      rols: ["SUPERADMINISTRADOR", "ADMINISTRADOR"],
      subMenu: [
        { path: 'adopcion-animal', subTitle: 'Adopción de los Animales' },

      ]
    },

    {
      title: 'Tipo de Animales',
      idNavigation: "tipoAnimal-nav",
      icon: 'bi bi-journal-text',
      rols: ["SUPERADMINISTRADOR", "ADMINISTRADOR"],
      subMenu: [
        { path: 'animal-tipo', subTitle: 'Gestión del Tipo de Animal' },

      ]
    },

    {
      title: 'Razas de los Animales',
      idNavigation: "razaAnimal-nav",
      icon: 'bi bi-layout-text-window-reverse',
      rols: ["SUPERADMINISTRADOR", "ADMINISTRADOR"],
      subMenu: [
        { path: 'animal-raza', subTitle: 'Gestión de las Razas de los Animales' },

      ]
    },

    {
      title: 'Usuarios',
      idNavigation: "controlUser-nav",
      icon: 'bi bi-person-lines-fill',
      rols: ["SUPERADMINISTRADOR", "ADMINISTRADOR"],
      subMenu: [
        { path: 'control-usuario', subTitle: 'Control de los Usuarios' },

      ]
    },

    {
      title: 'Personas',
      idNavigation: "controlPerson-nav",
      icon: 'bi bi-person-square',
      rols: ["SUPERADMINISTRADOR", "ADMINISTRADOR"],
      subMenu: [
        { path: 'person/gestion', subTitle: 'Control de las Personas/Rescatistas' },

      ]
    },

  ];

}
