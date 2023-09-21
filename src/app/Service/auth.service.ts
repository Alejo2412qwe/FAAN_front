import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/enviroment';
import { Usuario, usuarioLoginDTO } from '../Models/usuario';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor(private http: HttpClient) { }

  public login(usuario: usuarioLoginDTO): Observable<Usuario> {
    return this.http.post<Usuario>(environment.apiuriPublic + '/auth/signIn', usuario);
  }

  // JwtResponse

}


