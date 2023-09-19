import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { StorageService } from './storage.service';
import { Usuario } from '../Models/usuario';
import { environment } from '../../environment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient, private storageService: StorageService) { }

  public saveUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(environment.apiuri + '/usuario/save', usuario);
  }

  public getAllUsuario(page: number, size: number, sort: string[]): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(environment.apiuri + '/usuario/pageable?' + `page=${page}&size=${size}&sort=${sort}`);
  }

  public getUsuarioById(idUsuario: number): Observable<Usuario> {
    return this.http.get<Usuario>(environment.apiuri + '/usuario/findOne/' + idUsuario);
  }

  public updateUsuario(idUsusario: number, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(environment.apiuri + '/usuario/update/' + idUsusario, usuario);
  }

  // other changes
  public existByUsername(username: string): Observable<boolean> {
    return this.http.get<boolean>(environment.apiuri + `/usuario/existByUsername/${username}`);
  }


  public findByIdentificacionOrUsername(key: string): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(environment.apiuri + '/usuario/findByIdentificacionOrUsername/filter/' + key);
  }
}
