import { Persona } from "./persona";
import { SituacionIngreso } from "./situacionIngreso";

export class FichaRegistro {
    idFichaRegistro?: number;
    descripcionFichaRegistro?: string;
    origen?: string; //another atributte.
    situacionIngreso?: SituacionIngreso;
    persona?: Persona
}
