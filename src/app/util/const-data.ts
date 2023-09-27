import { environment } from "../environment/enviroment";

export const ROLS_SYSTEM = [
    "SUPERADMINISTRADOR",
    "ADMINISTRADOR"
]

export const FOLDER_IMAGES = 'images';
export const FOLDER_DOCUMENTS = 'documents';

export const getFile = (fileName: string, folder: string) => `${environment.apiuri}/uploadUri/${fileName}/${folder}`;

export const getFileDocument = (fileName: string, folder: string) => `${environment.apiuri}/upload/${fileName}/${folder}`;

export const USER_IMAGE_DEFAULT = '4bce1942-ba13-4569-9326-4eb87f663aed_userDefault.png';