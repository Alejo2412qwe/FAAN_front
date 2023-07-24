import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { environment } from 'src/environment/enviroment';
import { Observable, tap } from 'rxjs';
import { Notificacion } from '../Models/notificacion';

@Injectable({
  providedIn: 'root'
})
export class NotifacionesService {

  constructor(private http: HttpClient, private storageService: StorageService) { }

  public saveNotificacion(notifiacion: Notificaciones): Observable<Notificaciones> {
    return this.http.post<Notificaciones>(environment.apiuri + '/notificaciones/save', notifiacion);
  }


  // public getNotificacion(): Observable<Notificacion[]> {
  //   return this.http.get<Notificacion[]>(environment.apiuri + '/notificaciones');
  // }
  public getNotificacion(): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(environment.apiuri + '/notificaciones').pipe(
      tap((notificaciones: Notificacion[]) => {
        console.log('Notificaciones obtenidas:', notificaciones);
      })
    );
  }

}
