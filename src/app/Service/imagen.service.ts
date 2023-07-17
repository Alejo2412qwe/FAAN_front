import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment/enviroment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImagenService {

  constructor(private http: HttpClient, private storageService: StorageService) { }

  public savePictureInBuket(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(environment.apiuri + '/assets/uploads', formData);
  }
}
