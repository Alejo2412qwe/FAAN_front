import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environment/enviroment';
import { Persona } from '../Models/persona';
import { StorageService } from './storage.service';


@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  constructor(private http: HttpClient, private storageService: StorageService) { }

  public getListaPersonasAtribute(page: number, size: number, sort: string[], nameAtribute: string, valueAtricute: string): Observable<Persona[]> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', sort.join(','))
      .set('columnName', nameAtribute)
      .set('value', valueAtricute);

    return this.http.get<Persona[]>(environment.apiuri + '/persona/pageable/find', { params });
  }


  public getListaPersonas(page: number, size: number, sort: string[]): Observable<Persona[]> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', sort.join(','))
    return this.http.get<Persona[]>(environment.apiuri + '/persona/pageable', { params });
  }

  public getPersonaById(idPersona: number): Observable<Persona> {
    return this.http.get<Persona>(environment.apiuri + '/persona/findOne/' + idPersona);
  }

  public updatePersona(idPersona: number, persona: Persona): Observable<Persona> {
    return this.http.put<Persona>(environment.apiuri + '/persona/update/' + idPersona, persona);
  }

  public savePersona(persona: Persona): Observable<Persona> {
    return this.http.post<Persona>(environment.apiuri + '/persona/save', persona);
  }

  public getAllPersonasPagesOrCedulaOrApellido(filtro: string, page: number, size: number, sort: string[]): Observable<Persona[]> {
    return this.http.get<Persona[]>(environment.apiuri + '/persona/findByCedulaOrNombre/' + filtro + '?' + `&page=${page}&size=${size}&sort=${sort}`);
  }

}
