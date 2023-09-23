import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/enviroment';
import { Usuario, usuarioLoginDTO } from '../Models/usuario';
import { JwtResponse } from '../Models/modelDto/jwt-response';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor(private http: HttpClient) { }

  public login(usuario: usuarioLoginDTO): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(environment.apiuriPublic + '/auth/signIn', usuario);
  }

  // JwtResponse

}


