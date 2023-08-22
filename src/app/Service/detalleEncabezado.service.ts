import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environment/enviroment';
import { DetalleAdopcion } from '../Models/detalleEncabezado';

import { StorageService } from './storage.service';


@Injectable({
  providedIn: 'root'
})
export class DetalleEncabezadoService {

  constructor(private http: HttpClient, private storageService: StorageService) { }

  public getAllDetalleAdopcion(page:number,size:number,sort:string): Observable<DetalleAdopcion[]> {
    return this.http.get<DetalleAdopcion[]>(environment.apiuri + '/detalleadopcion/pageable?' + `page=${page}&size=${size}&sort=${sort}`);
  }

  public getListaDetalleAdopcion():Observable<DetalleAdopcion []>{
    return this.http.get<DetalleAdopcion []>(environment.apiuri+'/detalleadopcion/list');
  }

  public getDetalleAdopcionById(idAdopcion: number):Observable<DetalleAdopcion >{
    return this.http.get<DetalleAdopcion >(environment.apiuri+'/detalleadopcion/findOne/'+idAdopcion);
  }

  public updateDetalleAdopcion (idAdopcion:number, DetalleAdopcion : DetalleAdopcion ):Observable<DetalleAdopcion >{
    return this.http.put<DetalleAdopcion >(environment.apiuri+'/detalleadopcion/update/'+idAdopcion, DetalleAdopcion );
  }

  public saveDetalleAdopcion (detalleAdopcion : DetalleAdopcion ):Observable<DetalleAdopcion >{
    return this.http.post<DetalleAdopcion >(environment.apiuriPublic+'/api/detalleadopcion/save', detalleAdopcion);
  }


  public getfindByIdAnimal(idAnimal: number):Observable<DetalleAdopcion >{
    return this.http.get<DetalleAdopcion>(environment.apiuri+'/detalleadopcion/findByIdAnimal/' + idAnimal);
  }

  public getExistIdAnimal(idAnimal: number):Observable<Boolean >{
    return this.http.get<Boolean>(environment.apiuri+'/detalleadopcion/existIdAnimal/' + idAnimal);
  }

}