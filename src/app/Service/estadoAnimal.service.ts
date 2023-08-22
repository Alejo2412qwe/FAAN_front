import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environment/enviroment';
import { Vacuna } from '../Models/vacuna';
import { StorageService } from './storage.service';
import { VacunasAnimales } from '../Payloads/payloadVacunasAnimal';
import { ControlAnimal } from '../Models/controlAnimal';
import { EstadoAnimal } from '../Models/estadoAnimal';


@Injectable({
  providedIn: 'root'
})
export class EsatadoAnimalService {

  constructor(private http: HttpClient, private storageService: StorageService) { }

  public getAllEstadoAnimal(page:number,size:number,sort:string): Observable<EstadoAnimal[]> {
    return this.http.get<EstadoAnimal[]>(environment.apiuri + '/estadoAnimal/pageable?' + `page=${page}&size=${size}&sort=${sort}`);
  }


  public getListaEstadoAnimal():Observable<EstadoAnimal[]>{
    return this.http.get<EstadoAnimal[]>(environment.apiuri+'/estadoAnimal/list');
  }

  public getEstadoAnimalById(idEstadoAnimal: number):Observable<EstadoAnimal>{
    return this.http.get<EstadoAnimal>(environment.apiuri+'/estadoAnimal/findOne/'+idEstadoAnimal);
  }

  public updateEstadoAnimal(idEstadoAnimal:number, estado: EstadoAnimal):Observable<EstadoAnimal>{
    return this.http.put<EstadoAnimal>(environment.apiuri+'/estadoAnimal/update/'+idEstadoAnimal, estado);
  }

  public saveEstadoAnimal(estado: EstadoAnimal):Observable<EstadoAnimal>{
    return this.http.post<EstadoAnimal>(environment.apiuri+'/estadoAnimal/save', estado);
  }

}