import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../Models/usuario';
import { RecoverPassword } from '../Models/recover-password';
import { environment } from 'src/environment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class RecoverPasswordService {

  constructor(private http: HttpClient) { }

  public sendEmailRecoverPassword(email: string): Observable<String> {
    return this.http.get<String>(environment.apiuriPublic + '/auth/email/sendRecuperacionPassword/' + email);
  }

  public changePasswordFindUser(recoverPassword: RecoverPassword): Observable<String> {
    return this.http.post<String>(environment.apiuriPublic + '/auth/cambiarContraseniaUsuario', recoverPassword);
  }
}
