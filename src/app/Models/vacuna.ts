import { TipoVacuna } from "./tipoVacuna";

export class Vacuna {
    idVacuna!: number;
    fechaVacuna!: Date;
    fechaProximaVacuna!: Date;
    observaciones?: string;
    estadoVacuna?: string;
    tipoVacuna?: TipoVacuna;
}