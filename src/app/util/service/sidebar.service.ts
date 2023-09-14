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
      rols: ROLS_SYSTEM,
      subMenu: [
        { path: 'registro-mascota', subTitle: 'Registro de los Animales' },
        { path: 'control-animal', subTitle: 'Control de los Animales' }
      ]
    },


    {
      title: 'Adopciones',
      idNavigation: "adoption-nav",
      icon: 'bi bi-clipboard2-fill',
      rols: ROLS_SYSTEM,
      subMenu: [
        { path: 'adopcion-animal', subTitle: 'Adopción de los Animales' },

      ]
    },

    {
      title: 'Clasificación de Animales',
      idNavigation: "tipoAnimal-nav",
      icon: 'bi bi-journal-text',
      rols: ROLS_SYSTEM,
      subMenu: [
        { path: 'animal-tipo', subTitle: 'Gestión del Tipo de Animal' },

      ]
    },

    {
      title: 'Razas de los Animales',
      idNavigation: "razaAnimal-nav",
      icon: 'bi bi-layout-text-window-reverse',
      rols: ROLS_SYSTEM,
      subMenu: [
        { path: 'animal-raza', subTitle: 'Gestión de la Raza del Animal' },

      ]
    },

    {
      title: 'Usuarios',
      idNavigation: "controlUser-nav",
      icon: 'bi bi-person-lines-fill',
      rols: ROLS_SYSTEM,
      subMenu: [
        { path: 'control-usuario', subTitle: 'Control de los Usuarios' },

      ]
    },

    {
      title: 'Personas',
      idNavigation: "controlPerson-nav",
      icon: 'bi bi-person-square',
      rols: ROLS_SYSTEM,
      subMenu: [
        { path: 'person/gestion', subTitle: 'Control de las Personas/Rescatistas' },

      ]
    },

  ];

}
