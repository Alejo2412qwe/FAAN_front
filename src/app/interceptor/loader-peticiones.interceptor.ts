import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { Observable, finalize, throwError } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { LocalStorageKeys, clearLocalStorage, getToken, getTokenTimeOut } from '../util/local-storage-manager';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Injectable()
export class LoaderPeticionesInterceptor implements HttpInterceptor {

    constructor(private _ngxUiLoaderService: NgxUiLoaderService, private toastrService: ToastrService, private router: Router) { }

    private _activeRequest = 0;

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        console.log('**INGRESANDO AL INTERCEPTOR**');
        if (this._activeRequest === 0) {
            this._ngxUiLoaderService.start();
        }
        this._activeRequest++; //1

        const token = getToken(LocalStorageKeys.TOKEN);

        if (token) {
            if (getTokenTimeOut(token)) {
                return this.handleTokenTimeout();
            }

            request = request.clone({
                setHeaders: { Authorization: `Bearer ${token}` }
            });
        }

        return next.handle(request).pipe(finalize(() => this._stopLoader()));
    }

    private _stopLoader() {
        this._activeRequest--;
        if (this._activeRequest === 0) {
            this._ngxUiLoaderService.stop();
        }
    }

    private handleTokenTimeout(): Observable<HttpEvent<unknown>> {
        this.openMessage();

        setTimeout(() => {
            clearLocalStorage();
            this.router.navigate(['/login']).then(() => { window.location.reload(); });
        }, 3000);
        return throwError('Token timeout');
    }

    private openMessage() {
        this.toastrService.error('', 'SU SESION HA CADUCADO, INGRESE NUEVAMENTE', {
            timeOut: 3000,
        });
    }
}
