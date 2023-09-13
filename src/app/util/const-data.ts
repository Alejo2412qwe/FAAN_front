export const ROLS_SYSTEM = [
    "SUPERADMINISTRADOR",
    "ADMINISTRADOR"
]

export const FOLDER_IMAGES = 'images';
export const FOLDER_DOCUMENTS = 'documents';

export const getFile = (fileName: string, folder: string) => `http://localhost:8080/api/uploadUri/${fileName}/${folder}`;