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
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  ngOnInit(): void { }
}
