import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private isLogginPresent: boolean = false;

  getIsLogginPresent(): boolean {
    return this.isLogginPresent;
  }

  setIsLogginPresent(value: boolean): void {
    this.isLogginPresent = value;
  }
}
