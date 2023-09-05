import { Animal } from "./animal";
import { EstadoAnimal } from "./estadoAnimal";
export class ControlAnimal {
    idControlAnimal?: number;
    fechaControlAnimal?: Date;
    observaciones?: string;
    estadoControl?: boolean;
    nombreVeterinario?: string;
    pesoActual?: number;
    animal?: Animal;
    estadoAnimal?: EstadoAnimal;
}