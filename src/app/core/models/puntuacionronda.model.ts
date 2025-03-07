export class PuntuacionRonda {
    public numeroRonda: number;
    public tirada1?: number;
    public tirada2?: number;
    public tirada3?: number;

    constructor(numeroRonda: number, tirada1:number = 0, tirada2:number = 0, tirada3: number = 0) {
        this.numeroRonda = numeroRonda;
        this.tirada1 = tirada1;
        this.tirada2 = tirada2;
        this.tirada3 = tirada3;
    }
}