import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environment/enviroment';
import { Vacuna } from '../Models/vacuna';
import { StorageService } from './storage.service';
import { VacunasAnimales } from '../Payloads/payloadVacunasAnimal';
import { ControlAnimal } from '../Models/controlAnimal';


@Injectable({
  providedIn: 'root'
})
export class ControlAnimalService {

  constructor(private http: HttpClient, private storageService: StorageService) { }

  public getAllControl(page:number,size:number,sort:string): Observable<ControlAnimal[]> {
    return this.http.get<ControlAnimal[]>(environment.apiuri + '/controlAnimal/pageable?' + `page=${page}&size=${size}&sort=${sort}`);
  }


  public getListaControl():Observable<ControlAnimal[]>{
    return this.http.get<ControlAnimal[]>(environment.apiuri+'/controlAnimal/list');
  }

  public getControlById(idControl: number):Observable<ControlAnimal>{
    return this.http.get<ControlAnimal>(environment.apiuri+'/controlAnimal/findOne/'+idControl);
  }

  public updateControl(idControl:number, control: ControlAnimal):Observable<ControlAnimal>{
    return this.http.put<ControlAnimal>(environment.apiuri+'/controlAnimal/update/'+idControl, control);
  }

  public saveControl(control: ControlAnimal):Observable<ControlAnimal>{
    return this.http.post<ControlAnimal>(environment.apiuri+'/controlAnimal/save', control);
  }

}