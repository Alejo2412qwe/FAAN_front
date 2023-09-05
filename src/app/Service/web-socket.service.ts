import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private socket: WebSocket;
  private messageSubject: Subject<string> = new Subject<string>();

  constructor() {

    this.socket = new WebSocket('ws://localhost:8080/my-websocket-endpoint');


    this.socket.onopen = () => {
      console.log('Conexión WebSocket establecida');
    };

    this.socket.onmessage = (event) => {
      console.log('Mensaje recibido desde el servidor:', event.data);
    };

    this.socket.onclose = () => {
      console.log('Conexión WebSocket cerrada');
    };

    this.socket.onerror = (error) => {
      console.error('Error en la conexión WebSocket:', error);
    };


  }

  public getMessageObservable(): Observable<string> {
    return this.messageSubject.asObservable();
  }

  private handleMessage(event: MessageEvent): void {
    const message = event.data;
    this.messageSubject.next(message);
  }


}
