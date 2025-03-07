import { Injectable } from '@angular/core';
import { Partida } from '../models/partida.model';
import { v4 as uuidv4 } from 'uuid';
import { TipoJuego } from '../models/enums/TipoJuego.enum';
import { OpcionPuntosPartida } from '../models/enums/OpcionPuntosPartida.enum';
import { OpcionNumeroRondas } from '../models/enums/OpcionNumeroRondas.enum';
import { TipoFinal } from '../models/enums/TipoFinal.enum';
import { Jugador } from '../models/jugador.model';
import { PuntuacionRonda } from '../models/puntuacionronda.model';
import { ConfiguracionPartida } from '../models/configuracionpartida.model';

@Injectable({
  providedIn: 'root'
})
export class PartidaService {
  private partida!: Partida;
  private idJugadorEnCabeza!: string;
  private numeroTiradaJugador!: number;
  private partidaFinalizada: boolean = false;
  private nombreJugadorGanador!: string;

  constructor() { }

  existePartida(): boolean{
    return this.partida != null;
  }

  crearpartida(jugadores:string[], tipoJuegoSeleccionado:TipoJuego, puntoPartidaSeleccionado:OpcionPuntosPartida, rondasSeleccionadas:OpcionNumeroRondas, finalSeleccionad:TipoFinal): void {
    this.partida = new Partida(uuidv4());
    this.partida.jugadores = jugadores.map((nombre, index) => new Jugador(uuidv4(), nombre != '' ? nombre : `Jugador ${index + 1}`));

    var configuracion = new ConfiguracionPartida(uuidv4());
    configuracion.tipoJuego = tipoJuegoSeleccionado;
    configuracion.puntosPartida = puntoPartidaSeleccionado;
    configuracion.numeroRondas = rondasSeleccionadas;
    configuracion.tipoFinal = finalSeleccionad;

    this.partida.configuracion = configuracion;

    this.partida.jugadores.forEach(jugador => {
      jugador.puntuacionRonda?.push(new PuntuacionRonda(1));
      jugador.puntuacionRestante = puntoPartidaSeleccionado.valueOf();
    });
  }

  getJugadores(): string[]{
    return this.partida.jugadores?.map(j => j.nombre) ?? [];
  }

  getPartidaFinalizada(): boolean{
    return this.partidaFinalizada;
  }

  getJugadorGanador(): string{
    return this.nombreJugadorGanador ?? "";
  }

  getPuntuacionPartida(): number{
    return this.partida.configuracion?.puntosPartida?.valueOf() ?? 0;
  }

  empezarPartida(): void
  {
    if (this.partida.jugadores != undefined)
    {
      this.idJugadorEnCabeza = this.partida.jugadores[0].id;
      this.numeroTiradaJugador = 1;
      this.partidaFinalizada = false;
      this.nombreJugadorGanador = "";
    }
  }

  crearRonda(numeroRonda:number): void
  {
    if (this.partida.jugadores != undefined)
    {
      this.partida.jugadores.forEach(jugador => {jugador.puntuacionRonda?.push(new PuntuacionRonda(numeroRonda))});
      this.partida.rondaActual = numeroRonda;
    }
  }

  puntuar(puntuacion: number, doble:boolean, triple:boolean): void 
  {
    // Guardamos la ronda actual para calcular la media de puntuaciones una vez hemos pasado de ronda
    const rondaActual = this.partida.rondaActual;

    var puntuador = doble ? 2 : (triple ? 3 : 1);

    if (this.partida.jugadores != undefined)
    {
      const jugadorEncontrado = this.partida.jugadores.find(jugador => jugador.id == this.idJugadorEnCabeza);
      if (jugadorEncontrado != undefined && jugadorEncontrado.puntuacionRonda != undefined)
      {
        const rondaEncontrada = jugadorEncontrado.puntuacionRonda.find(p => p.numeroRonda == this.partida.rondaActual);
        if (rondaEncontrada != undefined)
        {
          var puntuaje = puntuacion * puntuador;

          this.puntuarEnRonda(rondaEncontrada, puntuaje);

            // Recalculamos puntuación restante y media
            if (jugadorEncontrado.puntuacionRestante != undefined)
              jugadorEncontrado.puntuacionRestante = jugadorEncontrado.puntuacionRestante - puntuaje;

            if (jugadorEncontrado.puntuacionRestante != undefined && this.partida.configuracion != undefined && this.partida.configuracion.puntosPartida != undefined)
              jugadorEncontrado.puntuacionMedia = (this.partida.configuracion.puntosPartida - jugadorEncontrado.puntuacionRestante) / rondaActual;

            if (jugadorEncontrado.puntuacionRestante == 0)
            {
                this.partidaFinalizada = true;
                this.nombreJugadorGanador = jugadorEncontrado.nombre;
            }
            else if (this.partida.configuracion != undefined && this.partida.rondaActual == 1 +this.mapNumeroRondasToInt(this.partida.configuracion?.numeroRondas) && this.numeroTiradaJugador == 1)
            {
              this.partidaFinalizada = true;
              const jugadorConMinimo = this.partida.jugadores.reduce((min, jugador) => {
                if (jugador.puntuacionRestante === undefined) return min; // Ignore undefined values
                if (min.puntuacionRestante === undefined || jugador.puntuacionRestante < min.puntuacionRestante) return jugador;
                return min;
              });
              this.nombreJugadorGanador = jugadorConMinimo.nombre;
            }        
        }
      }
    }
  }

  private puntuarEnRonda(rondaEncontrada: PuntuacionRonda, puntuaje:number)
  {
    if (this.numeroTiradaJugador == 1)
    {
      rondaEncontrada.tirada1 = puntuaje;
    }
    else if (this.numeroTiradaJugador == 2)
      {
      rondaEncontrada.tirada2 = puntuaje;
    }
    else
    {
      rondaEncontrada.tirada3 = puntuaje;

      // Cuando es la 3 cogemos el indice del siguiente jugador en la lista
      var indexSiguienteJugador = 0;
      this.partida.jugadores?.forEach((jugador, index) => {
        if (jugador.id == this.idJugadorEnCabeza){
          indexSiguienteJugador = index + 1;
        }
      });
      
      if (this.partida.jugadores != undefined)
      {
        // Seteamos variable al siguiente jugador
        var jugadorSiguiente = this.partida.jugadores[indexSiguienteJugador % this.partida.jugadores.length];
        this.idJugadorEnCabeza = jugadorSiguiente.id;

        // Si ya no hay mas jugadores, pasamos al primero
        if (indexSiguienteJugador % this.partida.jugadores.length == 0)
        {
          this.partida.rondaActual = this.partida.rondaActual + 1;
          this.crearRonda(this.partida.rondaActual);
        }
      }
    }

    // Añadimos un número de tirada y si es el último lo ponemos a 1
    this.numeroTiradaJugador = (this.numeroTiradaJugador % 3) + 1;
  }

  public checkPuntosNoSobrepasan(puntuacion: number, doble:boolean, triple:boolean): boolean
  {
    var puntuador = doble ? 2 : (triple ? 3 : 1);
    var puntuaje = puntuacion * puntuador;

    if (this.partida.jugadores != undefined)
    {
      const jugadorEncontrado = this.partida.jugadores.find(jugador => jugador.id == this.idJugadorEnCabeza);
      if (jugadorEncontrado != undefined && jugadorEncontrado.puntuacionRonda != undefined)
      {
        const rondaEncontrada = jugadorEncontrado.puntuacionRonda.find(p => p.numeroRonda == this.partida.rondaActual);
        if (rondaEncontrada != undefined)
        {
          if (jugadorEncontrado.puntuacionRestante != undefined)
            {
              if (jugadorEncontrado.puntuacionRestante - puntuaje == 0)
              {
                switch (this.partida.configuracion?.tipoFinal) {
                  case TipoFinal.SIMPLE:
                    return true;
                  case TipoFinal.DOBLE:
                    return doble;
                  case TipoFinal.TRIPLE:
                    return triple;
                  default:
                    return true;
                }
              }
              else
              {
                return jugadorEncontrado.puntuacionRestante - puntuaje >= this.mapTipoFinalToInt(this.partida.configuracion?.tipoFinal);
              }
            }
        }
      }
    }

    return false;
  }

  public volver(): void
  {
    //Primera tirada primera ronda
    if (this.partida.jugadores == undefined || (this.partida.rondaActual == 1 && this.numeroTiradaJugador == 1 && this.idJugadorEnCabeza == this.partida.jugadores[0].id))
      return;
    
    // Volvemos al número de tirada anterior
    this.numeroTiradaJugador = (this.numeroTiradaJugador - 1) % 3;
    if (this.numeroTiradaJugador == 0)
      this.numeroTiradaJugador = 3;

    this.partidaFinalizada = false;
    this.nombreJugadorGanador = "";

    var jugadorEncontrado = undefined;

    if (this.partida.jugadores != undefined)
    {
      if (this.numeroTiradaJugador == 3)
      {
        
        var indexJugadorAnterior = 0;
        this.partida.jugadores?.forEach((jugador, index) => {
          if (jugador.id == this.idJugadorEnCabeza){
            indexJugadorAnterior = index - 1;
          }
        });

        if (indexJugadorAnterior < 0)
          indexJugadorAnterior = this.partida.jugadores.length - 1;

        var jugadorSiguiente = this.partida.jugadores[indexJugadorAnterior];
        this.idJugadorEnCabeza = jugadorSiguiente.id;
        this.partida.rondaActual -= 1;
      }

      jugadorEncontrado = this.partida.jugadores.find(jugador => jugador.id == this.idJugadorEnCabeza);
    }

    if (jugadorEncontrado != undefined && jugadorEncontrado.puntuacionRonda != undefined)
    {
      const rondaEncontrada = jugadorEncontrado.puntuacionRonda.find(p => p.numeroRonda == this.partida.rondaActual);
      if (rondaEncontrada != undefined)
      {
        var tiradaVuelta;
        if (this.numeroTiradaJugador == 1)
        {
          tiradaVuelta = rondaEncontrada.tirada1;
          rondaEncontrada.tirada1 = 0;
        }
        else if (this.numeroTiradaJugador == 2)
        {
          tiradaVuelta = rondaEncontrada.tirada2;
          rondaEncontrada.tirada2 = 0;
        }
        else
        {
          tiradaVuelta = rondaEncontrada.tirada3;
          rondaEncontrada.tirada3 = 0;
        }
      }

      if (jugadorEncontrado.puntuacionRestante != undefined){
        jugadorEncontrado.puntuacionRestante += tiradaVuelta ?? 0;
        if (this.partida.configuracion != undefined && this.partida.configuracion.puntosPartida != undefined)
          jugadorEncontrado.puntuacionMedia = (this.partida.configuracion.puntosPartida - jugadorEncontrado.puntuacionRestante) / (this.partida.rondaActual);
      }
    }
  }

  public pasarRonda(): void
  {
    if (this.partida.jugadores != undefined)
    {
      const jugadorEncontrado = this.partida.jugadores.find(jugador => jugador.id == this.idJugadorEnCabeza);
      if (jugadorEncontrado != undefined && jugadorEncontrado.puntuacionRonda != undefined)
      {
        const rondaEncontrada = jugadorEncontrado.puntuacionRonda.find(p => p.numeroRonda == this.partida.rondaActual);
        if (rondaEncontrada != undefined)
        {
          this.numeroTiradaJugador = 1;
          var sumaTiradasEnEstaRonda = (rondaEncontrada.tirada1 ?? 0) + (rondaEncontrada.tirada2 ?? 0) + (rondaEncontrada.tirada3 ?? 0);

          for (let i = 0; i < 3; i++) 
          {
            this.puntuarEnRonda(rondaEncontrada, 0);
          }

          if (jugadorEncontrado.puntuacionRestante != undefined){
            jugadorEncontrado.puntuacionRestante += sumaTiradasEnEstaRonda;
            if (this.partida.configuracion != undefined && this.partida.configuracion.puntosPartida != undefined)
              jugadorEncontrado.puntuacionMedia = (this.partida.configuracion.puntosPartida - jugadorEncontrado.puntuacionRestante) / (this.partida.rondaActual - 1);
          }
        }
      }
    }
  }

  private mapTipoFinalToInt(tipoFinal?: TipoFinal): number{
    switch (tipoFinal) {
      case TipoFinal.SIMPLE:
        return 1;
      case TipoFinal.DOBLE:
        return 2;
      case TipoFinal.TRIPLE:
        return 3;
      default:
        return 0;
    }
  }

  private mapNumeroRondasToInt(numeroRondas?: OpcionNumeroRondas): number{
    switch (numeroRondas) {
      case OpcionNumeroRondas.R10:
        return 10;
      case OpcionNumeroRondas.R20:
        return 20;
      case OpcionNumeroRondas.R30:
        return 30;
      case OpcionNumeroRondas.R40:
        return 40;
      case OpcionNumeroRondas.ILIMITADO:
        return 99999;
      default:
        return 0;
    }
  }

  getRondaActual(): number{
    return this.partida.rondaActual;
  }

  getNombreJugadorTirando(): string | undefined{
    var jugadorTirando = this.partida.jugadores?.find(j => j.id == this.idJugadorEnCabeza);
    return jugadorTirando?.nombre;
  }

  getPuntuacionJugador(numeroRonda: number, nombreJugador: string): PuntuacionRonda | undefined{
    var jugadores = this.partida.jugadores;
    var jugadorTirando = jugadores?.find(j => j.nombre == nombreJugador);
    return jugadorTirando?.puntuacionRonda?.find(p => p.numeroRonda == numeroRonda);
  }

  getPuntuacionRestanteJugador(nombreJugador: string): number | undefined{
    var jugadores = this.partida.jugadores;
    var jugadorTirando = jugadores?.find(j => j.nombre == nombreJugador);
    return jugadorTirando?.puntuacionRestante;
  }

  getPuntuacionMediaJugador(nombreJugador: string): number | undefined{
    var jugadores = this.partida.jugadores;
    var jugadorTirando = jugadores?.find(j => j.nombre == nombreJugador);
    return jugadorTirando?.puntuacionMedia;
  }

  getTItuloPartida(): string{
    return `${this.partida.configuracion?.tipoJuego} (${this.partida.configuracion?.puntosPartida}P, ${this.partida.configuracion?.numeroRondas} rondas, Final ${this.partida.configuracion?.tipoFinal})`;
  }
}