import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { TipoAnimal } from '../Models/tipoAnimal';
import { environment } from '../../environment/enviroment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoAnimalService {

  constructor(private http: HttpClient, private storageService: StorageService) { }

  public findByAllTipoAnimalPageable(page: number, size: number, sort: string[]): Observable<TipoAnimal[]> {
    return this.http.get<TipoAnimal[]>(environment.apiuri + '/tipoanimal/pageable?' + `page=${page}&size=${size}&sort=${sort}`);
  }

  public findByAllTipoAnimal(): Observable<TipoAnimal[]> {
    return this.http.get<TipoAnimal[]>(environment.apiuri + '/tipoanimal/list');
  }

  public findByAllTipoAnimalStatus(): Observable<TipoAnimal[]> {
    return this.http.get<TipoAnimal[]>(environment.apiuri + '/tipoanimal/status');
  }

  public saveTipoAnimal(tipoAnimal: TipoAnimal): Observable<TipoAnimal> {
    return this.http.post<TipoAnimal>(environment.apiuri + '/tipoanimal/save', tipoAnimal);
  }

  public findTipoAnimalById(idTipoAnimal: number): Observable<TipoAnimal> {
    return this.http.get<TipoAnimal>(environment.apiuri + '/tipoanimal/findOne/' + idTipoAnimal);
  }

  public updateTipoAnimal(idTipoAnimal: number, tipoanimal: TipoAnimal): Observable<TipoAnimal> {
    return this.http.put<TipoAnimal>(environment.apiuri + '/tipoanimal/update/' + idTipoAnimal, tipoanimal);
  }
}
