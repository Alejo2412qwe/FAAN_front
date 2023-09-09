import { Component, OnInit } from '@angular/core';

import { StorageService } from './Service/storage.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public isLogginPresent: boolean = false;

  constructor(private storageService: StorageService,) { }

  ngOnInit(): void {
    this.isLogginPresent = this.storageService.isLoggedIn();
  }

}

