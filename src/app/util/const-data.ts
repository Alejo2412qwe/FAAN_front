export const ROLS_SYSTEM = [
    "SUPERADMINISTRADOR",
    "ADMINISTRADOR"
]

export const FOLDER_IMAGES = 'images';
export const FOLDER_DOCUMENTS = 'documents';

export const getFile = (fileName: string, folder: string) => `http://localhost:8080/api/uploadUri/${fileName}/${folder}`;

export const USER_IMAGE_DEFAULT = '4bce1942-ba13-4569-9326-4eb87f663aed_userDefault.png';