import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CargarScrpitsService } from 'src/app/Service/cargar-scrpits.service';
import { NotifacionesService } from 'src/app/Service/notifaciones.service';
import { StorageService } from 'src/app/Service/storage.service';
import { WebSocketService } from 'src/app/Service/web-socket.service';
import { clearLocalStorage } from 'src/app/util/local-storage-manager';
import { SharedService } from 'src/app/util/service/shared.service';
import { SidebarService } from 'src/app/util/service/sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  // IMG PROFILE
  imagenUrl: string | null = 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8cGVvcGxlfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60';

  public isLogginPresent: boolean = false;

  //ImplementSocket
  public receivedMessage!: string;
  title = 'WebSocketClient';
  stock: any = {};

  //User
  public userLoggin: string = '';
  //Rol
  public rolLoggin: string = '';

  public listSidebar: any[] = [];


  constructor(
    private _CargarScript: CargarScrpitsService,
    private router: Router,
    private storageService: StorageService,
    private notificacionService: NotifacionesService,
    private webSocketService: WebSocketService,
    private sharedService: SharedService,
    private sidebarService: SidebarService
  ) {
    _CargarScript.Cargar(["main"]);
  }

  ngOnInit() {
    this.listSidebar = this.sidebarService.dataMenu;
    console.log(this.listSidebar);

    this.isLogginPresent = this.storageService.isLoggedIn();
    console.log(this.isLogginPresent)
    if (this.isLogginPresent === true) {
      this.conectarWebSocket();
    }

    this.userLoggin = localStorage.getItem("username")!;
    this.rolLoggin = localStorage.getItem("rol")!;
  }


  isCurrentRoute(route: string): boolean {
    return this.router.isActive(route, true);
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

  // Formatear imagen
  formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  }

  removerNotificacion(data: any) {
    this.notificacionService.updateNotificacionEstado(data._id).subscribe(data => {
      console.log("VISTO");
    })
  }

  public dayExact(day: string): string {
    const DIAS_EXACT: Record<string, string> = { '1': 'warning', '2': 'success' }
    return DIAS_EXACT[day] || 'primary';
  }
}
