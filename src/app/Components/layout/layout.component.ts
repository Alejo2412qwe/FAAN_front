import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CargarScrpitsService } from 'src/app/Service/cargar-scrpits.service';

import { SidebarService } from 'src/app/util/service/sidebar.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  public listSidebar: any[] = [];
  constructor(
    private sidebarService: SidebarService
  ) { }

  ngOnInit() {
    this.listSidebar = this.sidebarService.dataMenu;
  }
}
