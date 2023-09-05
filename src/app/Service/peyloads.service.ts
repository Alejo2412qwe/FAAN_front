import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Fundacion } from '../Models/fundacion';
import { Observable } from 'rxjs';
import { environment } from '../../environment/enviroment';
import { PeyloadNumeroAdopcionRaza } from '../Payloads/peyloadNumeroAdopcionRaza';
import { PeyloadNumeroAdopcionFecha } from '../Payloads/peyloadNumeroAdopcionFecha';
import { VacunasAnimales } from '../Payloads/payloadVacunasAnimal';
import { NumeroAnimalTipo } from '../Payloads/PayloadNumeroAnimalTipo';
import { ControlAnimal } from '../Models/controlAnimal';
import { PayloadControlAnimal } from '../Payloads/payloadControlPorAnimal';


@Injectable({
  providedIn: 'root'
})
export class PayloadService {

  constructor(private http: HttpClient, private storageService: StorageService) { }
 // PAYLOADAS

  public getAllPeyloadNumeroAdopcionRaza(): Observable<PeyloadNumeroAdopcionRaza[]>{
    return this.http.get<PeyloadNumeroAdopcionRaza[]>(environment.apiuri + `/animal/lista/PeyloadNumeroAdopcionRaza`);
  }

  public getAllPeyloadNumeroAdopcionFecha(): Observable<PeyloadNumeroAdopcionFecha[]>{
    return this.http.get<PeyloadNumeroAdopcionFecha[]>(environment.apiuri + `/animal/lista/PeyloadNumeroAdopcionFecha`);
  }

  public getAllPeyloadNumeroAnimalTipo(): Observable<NumeroAnimalTipo[]>{
    return this.http.get<NumeroAnimalTipo[]>(environment.apiuri + `/tipoanimal/numeroAnimalesTipo`);
  }

  public getPeyloadControlAnimal(idControlAnimal: number):Observable<PayloadControlAnimal[]>{
    console.log("entrooooooooo:"+ idControlAnimal);
    console.log("entrooooooooo:"+ environment.apiuri+'/controlAnimal/peyload/controlanimal/'+idControlAnimal);
    return this.http.get<PayloadControlAnimal[]>(environment.apiuri+'/controlAnimal/peyload/'+idControlAnimal);
  }

  public getPeyloadVacunasAnimalById(idControlAnimal: number):Observable<VacunasAnimales[]>{
    return this.http.get<VacunasAnimales[]>(environment.apiuri+'/vacuna/fichamedicaVacuna/'+idControlAnimal);
  } 

}