import { ConfiguracionPartida } from "./configuracionpartida.model";
import { Jugador } from "./jugador.model";

export class Partida {
    public id: string;
    public jugadores?: Jugador[];
    public configuracion?: ConfiguracionPartida;
    public rondaActual: number;

    constructor(id: string) {
        this.id = id;
        this.rondaActual = 1;
    }
}