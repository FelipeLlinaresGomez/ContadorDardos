import { OpcionNumeroRondas } from "./enums/OpcionNumeroRondas.enum";
import { OpcionPuntosPartida } from "./enums/OpcionPuntosPartida.enum";
import { TipoFinal } from "./enums/TipoFinal.enum";
import { TipoJuego } from "./enums/TipoJuego.enum";


export class ConfiguracionPartida {
    public id: string;
    public tipoJuego?: TipoJuego;
    public puntosPartida?: OpcionPuntosPartida;
    public numeroRondas?: OpcionNumeroRondas;
    public tipoFinal?: TipoFinal;

    constructor(id: string) {
        this.id = id;
    }
}