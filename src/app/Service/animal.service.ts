import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environment/enviroment';
import { Animal } from '../Models/animal';
import { StorageService } from './storage.service';


@Injectable({
  providedIn: 'root'
})
export class AnimalService {

  constructor(private http: HttpClient, private storageService: StorageService) { }

  public findByAdoptadoOrNoAdoptado(page: number, size: number, adoptado: Boolean, NombreOrPlaca: string, sort: string[]): Observable<Animal[]> {
    return this.http.get<Animal[]>(environment.apiuri + '/animal/findByAdoptadoOrNoAdoptado/' + adoptado + '?' + `busqueda=${NombreOrPlaca}&page=${page}&size=${size}&sort=${sort}`);
  }

  public getAllAnimalesPages(page: number, size: number, sort: string[]): Observable<Animal[]> {
    return this.http.get<Animal[]>(environment.apiuri + '/animal/pageable?' + `page=${page}&size=${size}&sort=${sort}`);
  }

  public getAllAnimalesPagesOrPlacaOrName(filtro: string, page: number, size: number, sort: string[]): Observable<Animal[]> {
    return this.http.get<Animal[]>(environment.apiuri + '/animal/findBynameAnimalOrPlacaAnimal/' + filtro + '?' + `&page=${page}&size=${size}&sort=${sort}`);
  }

  public getListaAnimal(): Observable<Animal[]> {
    return this.http.get<Animal[]>(environment.apiuri + '/animal/list');
  }

  public getAnimalById(idAnimal: number): Observable<Animal> {
    return this.http.get<Animal>(environment.apiuri + '/animal/findOne/' + idAnimal);
  }

  public updateAnimal(idAnimal: number, Animal: Animal): Observable<Animal> {
    return this.http.put<Animal>(environment.apiuri + '/animal/update/' + idAnimal, Animal);
  }

  public saveAnimal(animal: Animal): Observable<Animal> {
    return this.http.post<Animal>(environment.apiuri + '/animal/save', animal);
  }

  //FIND EXIST PLACA
  public findPlacaAnimal(placa: string): Observable<Boolean> {
    return this.http.get<Boolean>(environment.apiuri + '/animal/exitPlaca/' + placa);

  }

}