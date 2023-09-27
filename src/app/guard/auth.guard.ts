import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot,
    UrlTree,
} from '@angular/router';

import { LocalStorageKeys, getRole, getToken, isLoggedInKey } from '../util/local-storage-manager';
@Injectable({
    providedIn: 'root'
})
export class AuthGaurdGuard implements CanActivate {
    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const token = getToken(LocalStorageKeys.TOKEN);
        const isLoggedIn = isLoggedInKey(LocalStorageKeys.ROL);
        const expectedRoles = route.data['expectedRoles'];
        const role = getRole(LocalStorageKeys.ROL);

        if (isLoggedIn && expectedRoles.includes(role)) {

            return true;
        }

        if (isLoggedIn) {
            this.router.navigate(['/dashboard']);
            return true;
        }

        this.router.navigate(['/login']);
        return false;
    }

}
