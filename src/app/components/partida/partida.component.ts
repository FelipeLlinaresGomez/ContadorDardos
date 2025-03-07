import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarPartidaComponent } from '../shared/navbar-partida/navbar-partida.component';
import { BotoneraComponent } from '../shared/botonera/botonera.component';
import { PartidaService } from '../../core/services/partida.service';
import { PopUpComponent } from "../shared/pop-up/pop-up.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-partida',
  standalone: true,
  imports: [CommonModule, FormsModule, BotoneraComponent, NavbarPartidaComponent, PopUpComponent],
  templateUrl: './partida.component.html',
  styleUrl: './partida.component.css'
})

export class PartidaComponent implements OnInit {
  titulo: string = "En el juego";
  descripcion: string = "X01 (301P, FirstTo 1L, Str-Out)";
  TituloJugadorArriba!: string;
  jugadorArriba: string = 'Jugador 1';
  ronda: number = 1;
  cricket: boolean = false;

  popupVisible: boolean = false;
  popUpTexto!: string;

  teHasPasdoVisible: boolean = false;
  popUpTeHasPasadoTexto: string = "Te has pasado!!! :(";
    
  jugadores: { 
    nombre: string, 
    puntuaciones: number[],
    puntuacionRestante: number,
    puntuacionRondaActual: number,
    puntuacionMedia: number,
    seleccionado: Boolean
  }[] = [];

  constructor(private partidaService: PartidaService, private router: Router) { }

    ngOnInit(): void {
      this.descripcion = this.partidaService.getTItuloPartida();

      this.partidaService.empezarPartida();

      var jugadoresTemp = this.partidaService.getJugadores();
      var puntuacionPartida = this.partidaService.getPuntuacionPartida();
      jugadoresTemp.forEach((j, index) => {
        var jugador = { nombre: j, puntuaciones: [0, 0, 0], puntuacionRondaActual: 0, puntuacionMedia: 0, puntuacionRestante: puntuacionPartida, seleccionado: index == 0 }
        this.jugadores.push(jugador);
      });

      this.jugadorArriba = this.jugadores[0].nombre;
    }

    calcularPuntuacionMedia(jugador: any): number {
      const total = jugador.puntuaciones.reduce((acc: number, score: number) => acc + score, 0);
      return total / jugador.puntuaciones.length;
    }
  
    puntuar(event: { puntuacion: number, doble:boolean, triple:boolean }){
      var ronda = this.partidaService.getRondaActual();
      var jugadorTirando = this.partidaService.getNombreJugadorTirando() ?? "";

      if (this.partidaService.checkPuntosNoSobrepasan(event.puntuacion, event.doble, event.triple))
      {
        this.partidaService.puntuar(event.puntuacion, event.doble, event.triple);

        this.updateJugador(ronda, jugadorTirando);
  
        if (this.partidaService.getPartidaFinalizada())
        {
          var ganador = this.partidaService.getJugadorGanador();
          this.popupVisible = true;
          this.popUpTexto = `El ganador es ${ganador} !!!`;
        }
        else
        {
          // Actualizamos jugador tirando y ronda
          this.ronda = this.partidaService.getRondaActual();
          this.jugadorArriba = this.partidaService.getNombreJugadorTirando() ?? "";
          this.jugadores.forEach(j => { j.seleccionado = j.nombre == this.jugadorArriba});
        }
      }
      else
      {
        this.partidaService.pasarRonda();
        this.teHasPasdoVisible = true;
        
        setTimeout(() => {
          this.teHasPasdoVisible = false; // Set the value to false after 1 second (1000 milliseconds)
        }, 1000);

        this.updateJugador(ronda, jugadorTirando);

        // Actualizamos jugador tirando y ronda
        this.ronda = this.partidaService.getRondaActual();
        this.jugadorArriba = this.partidaService.getNombreJugadorTirando() ?? "";
        this.jugadores.forEach(j => j.seleccionado = j.nombre == this.jugadorArriba);
      } 
    }

    volver(event:{}){
      this.partidaService.volver();

      var ronda = this.partidaService.getRondaActual();
      var jugadorTirando = this.partidaService.getNombreJugadorTirando() ?? "";
      this.updateJugador(ronda, jugadorTirando);

      // Actualizamos jugador tirando y ronda
      this.ronda = this.partidaService.getRondaActual();
      this.jugadorArriba = this.partidaService.getNombreJugadorTirando() ?? "";
      this.jugadores.forEach(j => { j.seleccionado = j.nombre == this.jugadorArriba});
    }

    private limit2Decimals(num: number): number {
      const factor = Math.pow(10, 2);
      return Math.floor(num * factor) / factor; // Trunca sin redondear
    }

    closePopUp(event: { }){
      this.popupVisible = false;
      this.router.navigate(['/', "configurar-partida"]);
    }

    closePopUpTeHasPasado(event: { }){
      this.teHasPasdoVisible = false;
    }

    private updateJugador(ronda: number, jugadorTirando: string): void
    {
      var puntuacionesUltimaRonda = this.partidaService.getPuntuacionJugador(ronda, jugadorTirando);
      var puntuacionMedia = this.partidaService.getPuntuacionMediaJugador(jugadorTirando);
      var puntuacionRestante = this.partidaService.getPuntuacionRestanteJugador(jugadorTirando);

      var jugador = this.jugadores.find(j => j.nombre == jugadorTirando);
      if (jugador != undefined)
      {
        if (puntuacionesUltimaRonda != undefined)
        {
          jugador.puntuaciones = [puntuacionesUltimaRonda.tirada1 ?? 0, puntuacionesUltimaRonda.tirada2 ?? 0, puntuacionesUltimaRonda.tirada3 ?? 0];
          jugador.puntuacionRondaActual = jugador.puntuaciones.reduce((acc, curr) => acc + curr, 0);
        }

        if (puntuacionMedia != undefined)
          jugador.puntuacionMedia = this.limit2Decimals(puntuacionMedia);

        if (puntuacionRestante != undefined)
          jugador.puntuacionRestante = puntuacionRestante;
      }
    }
}