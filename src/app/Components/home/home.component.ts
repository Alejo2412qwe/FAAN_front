import { Component } from '@angular/core';
import { CargarScrpitsService } from 'src/app/Service/cargar-scrpits.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

    constructor(
    private _CargarScript: CargarScrpitsService
    
  ) {
    _CargarScript.Cargar(["home"]);
  }
}


