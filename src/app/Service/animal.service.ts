import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environment/enviroment';
import { Animal } from '../Models/animal';
import { StorageService } from './storage.service';
import { AnimalFilter } from '../Payloads/animal-filter';


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

  public getAll(page: number, size: number, sort: string[]): Observable<Animal[]> {
    return this.http.get<Animal[]>(environment.apiuri + '/animal/all/pageable?' + `page=${page}&size=${size}&sort=${sort}`);
  }

  // ---------------------------------------------------
  public findByMultipleAtributesFilter(key: any, status: any): Observable<AnimalFilter[]> {
    let params = new HttpParams();

    if (key || key === false) params = params.set('key', key);

    if (status) params = params.set('status', status);

    return this.http.get<AnimalFilter[]>(environment.apiuri + '/animal/findByMultipleAtributesFilter', { params });
  }
  // ---------------------------------------------------

  public getAllAnimalesPagesOrPlacaOrName(filtro: string, page: number, size: number, sort: string[]): Observable<Animal[]> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', sort.join(','))
      .set('filter', filtro)
    console.log(params);
    return this.http.get<Animal[]>(environment.apiuri + '/animal/findBynameOrplaca', { params });
  }

  public getAllAnimalAtribute(page: number, size: number, sort: string[], nameAtribute: string, valueAtricute: string): Observable<Animal[]> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', sort.join(','))
      .set('columnName', nameAtribute)
      .set('value', valueAtricute);

    return this.http.get<Animal[]>(environment.apiuri + '/animal/pageable/find', { params });
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