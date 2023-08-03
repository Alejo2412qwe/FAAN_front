import { Component, OnInit } from '@angular/core';
import { Animal } from 'src/app/Models/animal';
import { TipoAnimal } from 'src/app/Models/tipoAnimal';
import { AnimalService } from 'src/app/Service/animal.service';
import { CargarScrpitsService } from 'src/app/Service/cargar-scrpits.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  public animal = new Animal();
  public listAnimal: Animal[] = [];


  public tipoAnimal = new TipoAnimal();
	public listTipoAnimal: TipoAnimal[] = [];

    constructor(
    private _CargarScript: CargarScrpitsService,
    private animalService: AnimalService
    
    
  ) {
    _CargarScript.Cargar(["home"]);
  }

  ngOnInit(): void {

    
	}


}


