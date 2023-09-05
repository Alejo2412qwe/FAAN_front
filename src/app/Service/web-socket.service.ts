import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private socket: WebSocket | undefined;
  private messageSubject: Subject<string> = new Subject<string>();
  private connected: boolean = false;

  constructor() {}

  public connect(): void {
    if (this.connected) {
      return; // Ya está conectado, no hagas nada
    }

    this.socket = new WebSocket('ws://localhost:8080/my-websocket-endpoint');

    this.socket.onopen = () => {
      console.log('Conexión WebSocket establecida');
      this.connected = true;
    };

    this.socket.onmessage = (event) => {
      console.log('Mensaje recibido desde el servidor:', event.data);
      this.handleMessage(event);
    };

    this.socket.onclose = () => {
      console.log('Conexión WebSocket cerrada');
      this.connected = false;
    };

    this.socket.onerror = (error) => {
      console.error('Error en la conexión WebSocket:', error);
    };
  }

  public disconnect(): void {
    if (!this.connected) {
      return; // Ya está desconectado, no hagas nada
    }
    this.socket!.close();
    this.connected = false;
  }

  public getMessageObservable(): Observable<string> {
    return this.messageSubject.asObservable();
  }

  private handleMessage(event: MessageEvent): void {
    const message = event.data;
    this.messageSubject.next(message);
  }
}
