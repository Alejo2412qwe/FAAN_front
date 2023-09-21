import jwt_decode from "jwt-decode";
import { TokenData } from "../interface/token-data";

export enum LocalStorageKeys {
    TOKEN = "token",
    ROL = 'rol',
    USER_NAME = 'username'
}

export const getToken = (key: string) => {
    const result = localStorage.getItem(key);
    return !!result && result;
};

export const getTokenjwt = (key: string) => {
    return localStorage.getItem(key);
};

export const getTokenTimeOut = (token: string) => {
    const decodedToken: TokenData = jwt_decode(token);
    const currentTime: number = Math.floor(Date.now() / 1000);

    return decodedToken.exp < currentTime;
};

export const clearLocalStorage = () => {
    localStorage.clear();
    sessionStorage.clear();
};

export const isLoggedInKey = (rol: string) => {
    const user = localStorage.getItem(rol);
    if (user) {
        return true;
    }
    return false;
}

export const getRole = (rol: string) => {
    return localStorage.getItem(rol);
}

export const getUserName = (username: string) => {
    return localStorage.getItem(username);
}

export const EXPORT_DATE_NOW = new Date().toLocaleDateString();

