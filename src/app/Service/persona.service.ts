import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { environment } from '../../environment/enviroment';
import { Persona } from '../Models/persona';
import { StorageService } from './storage.service';
import { PersonFind } from '../Payloads/person-find';


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

  public findByAllPerson(page: number, size: number, sort: string[]): Observable<Persona[]> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', sort.join(','))
    return this.http.get<Persona[]>(environment.apiuri + '/persona/pageable/dadmin', { params });
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


  public existByIdentificacion(cedula: string, equalsCedula: boolean): Observable<boolean> {
    if (equalsCedula) return of(false);
    return this.http.get<boolean>(environment.apiuri + `/persona/cedulaRegistra/${cedula}`);
  }

  public existsByEmail(email: string, equalsEmail: boolean): Observable<boolean> {
    if (equalsEmail) return of(false);
    return this.http.get<boolean>(environment.apiuri + `/persona/correoRegistrado/${email}`);
  }

  //Other endpoints filter-----------------------------------
  public findPersonByIdentificacion(identificacion: string): Observable<PersonFind> {
    return this.http.get<PersonFind>(environment.apiuri + '/persona/findByIdentificacion/' + identificacion);
  }

}
