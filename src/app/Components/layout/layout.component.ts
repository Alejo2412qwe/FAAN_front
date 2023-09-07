import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CargarScrpitsService } from 'src/app/Service/cargar-scrpits.service';
import { NotifacionesService } from 'src/app/Service/notifaciones.service';
import { StorageService } from 'src/app/Service/storage.service';
import { WebSocketService } from 'src/app/Service/web-socket.service';
import { clearLocalStorage } from 'src/app/util/local-storage-manager';
import { SharedService } from 'src/app/util/shared.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  constructor(
    private _CargarScript: CargarScrpitsService,
    private router: Router,
    private storageService: StorageService,
    private notificacionService: NotifacionesService,
    private webSocketService: WebSocketService,
    private sharedService: SharedService, // Inject the SharedService

  ) {
    _CargarScript.Cargar(["main"]);
  }

  // NOTIFICACIONES
  listNotificaciones: any[] = []; // Aquí almacenarás las notificaciones recibidas
  countNotificaciones: number = 0;
  viewNotificacionesPanle: boolean = false;

  // LOGOUT
  public logOut() {

    this.router.navigate(['/home']).then(() => {
      this.sharedService.setIsLogginPresent(false); // Set the value here
      clearLocalStorage()
      this.desconectarWebSocket();
      window.location.reload();
    });
  }

  // Método para desconectar el WebSocket
  public desconectarWebSocket(): void {
    this.webSocketService.disconnect();
    this.listNotificaciones = []; // Limpias las notificaciones cuando te desconectas
  }
}
