import { Component, OnInit } from '@angular/core';
import { ScreenSizeService } from 'src/app/Service/screen-size-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public screenWidth: number = 0;
  public screenHeight: number = 0;

  constructor(private screenSizeService: ScreenSizeService) { }

  ngOnInit(): void {
    this.getSizeWindowResize();

  }

  public getSizeWindowResize() {
    const { width, height } = this.screenSizeService.getCurrentSize();
    this.screenWidth = width;
    this.screenHeight = height;
    this.screenSizeService.onResize.subscribe(({ width, height }) => {
      this.screenWidth = width;
      this.screenHeight = height;
    });
  }
}
