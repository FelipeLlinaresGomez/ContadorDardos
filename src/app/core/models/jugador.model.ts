import { PuntuacionRonda } from "./puntuacionronda.model";

export class Jugador {
    public id: string;
    public nombre: string;
    public puntuacionRonda?: PuntuacionRonda[];
    public puntuacionRestante?: number;
    public puntuacionMedia?: number;

    constructor(id: string, nombre: string) {
        this.id = id;
        this.nombre = nombre;
        this.puntuacionRonda = [];
        this.puntuacionMedia = 0;
    }
}