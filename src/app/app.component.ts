import { Component, OnInit } from '@angular/core';
import { CargarScrpitsService } from './Service/cargar-scrpits.service';
import { Router } from '@angular/router';
import { StorageService } from './Service/storage.service';
import { NotifacionesService } from './Service/notifaciones.service';
import { Notificaciones } from './Models/notificacion';
import { Message } from 'primeng/api';
import { WebSocketService } from './Service/web-socket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  // IMG PROFILE
  imagenUrl: string | null = 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8cGVvcGxlfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60';

  public isLogginPresent: boolean = false;

  //ImplementSocket
  private messageSubscription!: Subscription;
  public receivedMessage!: string;
  title = 'WebSocketClient';
  stock: any = {};
  private webSocket!: WebSocket;


  constructor(
    private _CargarScript: CargarScrpitsService,
    private router: Router,
    private storageService: StorageService,
    private notificacionService: NotifacionesService,
    private webSocketService: WebSocketService
  ) {
    _CargarScript.Cargar(["dashboard"]);
  }

  ngOnInit(): void {
    this.isLogginPresent = this.storageService.isLoggedIn();
    if (this.isLogginPresent === true) {
      this.conectarWebSocket();
    }
  }


  // LOGOUT
  public logOut() {
    this.router.navigate(['/login']).then(() => {
      this.isLogginPresent = false;
      localStorage.clear();
      this.desconectarWebSocket();
    });
  }

  // CHECK ROL
  isSuperAdministrador: boolean = false;
  isAdministrador: boolean = false;

  public checkRolesUserLogin(nombreRol: string): void {
    switch (nombreRol) {
      case 'SUPERADMINISTRADOR':
        this.isSuperAdministrador = true;
        this.isAdministrador = false;
        break;
      case 'ADMINISTRADOR':
        this.isSuperAdministrador = false;
        this.isAdministrador = true;
        break;
      default:
        this.isLogginPresent = false;
        break;
    };
  }

  // NOTIFICACIONES
  listNotificaciones: any[] = []; // Aquí almacenarás las notificaciones recibidas
  countNotificaciones: number = 0;
  viewNotificacionesPanle: boolean = false;

  // Método para conectar y recibir notificaciones
  public conectarWebSocket(): void {
    this.webSocketService.connect();
    this.webSocketService.getMessageObservable().subscribe((message: string) => {
      // Aquí procesas las notificaciones recibidas
      const notificaciones = JSON.parse(message);
      this.listNotificaciones = notificaciones;
      this.countNotificaciones = this.listNotificaciones.length;
    });
  }

  // Método para desconectar el WebSocket
  public desconectarWebSocket(): void {
    this.webSocketService.disconnect();
    this.listNotificaciones = []; // Limpias las notificaciones cuando te desconectas
  }

  // Formatear imagen
  formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  }

  removerNotificacion(data:any){
    this.notificacionService.updateNotificacionEstado(data._id).subscribe(data=>{
      console.log("VISTO");
    })
  }
}

