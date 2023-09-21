import { Rol } from "../rol";

export class UserResponse {
    idUsuario?: number;
    username?: string;
    urlPhoto?: string;
    roles?: Rol[];
}