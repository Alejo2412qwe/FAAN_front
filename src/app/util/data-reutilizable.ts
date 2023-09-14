import { EXPORT_DATE_NOW, LocalStorageKeys, getUserName } from "./local-storage-manager";

export function generateCustomContent(imageDataUrl: string, nameReport: string) {
    return [
        {
            absolutePosition: { x: 540, y: 10 },
            image: imageDataUrl,
            width: 70,
            height: 40,
            alignment: 'center',
        },
        {
            text: 'FUNDACÍON FAMILIA AMOR  ANIMAL',
            style: 'header',
            alignment: 'center',
            margin: [0, 10],
        },
        {
            text: `Fecha de Exportación: ${EXPORT_DATE_NOW}`,
            style: 'subheader',
            alignment: 'left',
            margin: [0, 3],
        },
        {
            text: `Exportado por: ${getUserName(LocalStorageKeys.USER_NAME)}`,
            style: 'subheader',
            alignment: 'left',
            margin: [0, 3],
        },
        {
            text: nameReport,
            style: 'header',
            alignment: 'center',
            margin: [0, 10],
        },
    ];
}
