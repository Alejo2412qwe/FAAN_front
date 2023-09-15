import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environment/enviroment';
import { RazaAnimal } from '../Models/razaAnimal';
import { StorageService } from './storage.service';
import { TipoAnimal } from '../Models/tipoAnimal';


@Injectable({
  providedIn: 'root'
})
export class RazaAnimalService {

  constructor(private http: HttpClient, private storageService: StorageService) { }


  public getAllRazaAnimal(page: number, size: number, sort: string[]): Observable<RazaAnimal[]> {
    return this.http.get<RazaAnimal[]>(environment.apiuri + '/razaAnimal/pageable?' + `page=${page}&size=${size}&sort=${sort}`);
  }

  public findTipoAnimalById(idTipoAnimal: number): Observable<TipoAnimal> {
    return this.http.get<TipoAnimal>(environment.apiuri + '/tipoanimal/findOne/' + idTipoAnimal);
  }

  public getAllRazaAnimalAtribute(page: number, size: number, sort: string[], nameAtribute: string, valueAtricute: string): Observable<RazaAnimal[]> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', sort.join(','))
      .set('columnName', nameAtribute)
      .set('value', valueAtricute);

    return this.http.get<RazaAnimal[]>(environment.apiuri + '/razaAnimal/pageable/find', { params });
  }

  public findByAllRazaAnimalStatus(): Observable<RazaAnimal[]> {
    return this.http.get<RazaAnimal[]>(environment.apiuri + '/razaAnimal/status');
  }

  public getAllRazaA(): Observable<RazaAnimal[]> {
    return this.http.get<RazaAnimal[]>(environment.apiuri + '/razaAnimal/list');
  }

  public getRazaAnimalById(idRazaAnimal: number): Observable<RazaAnimal> {
    return this.http.get<RazaAnimal>(environment.apiuri + '/razaAnimal/findOne/' + idRazaAnimal);
  }

  public updateRazaAnimal(idRazaAnimal: number, razaAnimal: RazaAnimal): Observable<RazaAnimal> {
    return this.http.put<RazaAnimal>(environment.apiuri + '/razaAnimal/update/' + idRazaAnimal, razaAnimal);
  }

  public saveRazaAnimal(razaAnimal: RazaAnimal): Observable<RazaAnimal> {
    return this.http.post<RazaAnimal>(environment.apiuri + '/razaAnimal/save', razaAnimal);
  }

}