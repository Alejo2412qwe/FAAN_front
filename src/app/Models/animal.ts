import { FichaRegistro } from "./fichaRegistro";
import { Fundacion } from "./fundacion";
import { RazaAnimal } from "./razaAnimal";

export class Animal {
    idAnimal?: number;
    nombreAnimal?: string;
    placaAnimal?: string;
    fotoAnimal?: string;
    edadAnimal?: number;
    estadoAnimal?: string;
    razaAnimal?: RazaAnimal;
    fichaRegistro?: FichaRegistro;
    fundacion?: Fundacion;
}
