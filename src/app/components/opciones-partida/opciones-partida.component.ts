import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TipoJuego } from '../../core/models/enums/TipoJuego.enum';
import { OpcionPuntosPartida } from '../../core/models/enums/OpcionPuntosPartida.enum';
import { OpcionNumeroRondas } from '../../core/models/enums/OpcionNumeroRondas.enum';
import { TipoFinal } from '../../core/models/enums/TipoFinal.enum';
import { PartidaService } from '../../core/services/partida.service';
import { PopUpComponent } from '../shared/pop-up/pop-up.component';

@Component({
  selector: 'app-opciones-partida',
  standalone: true,
  imports: [CommonModule, FormsModule, PopUpComponent],
  templateUrl: './opciones-partida.component.html',
  styleUrl: './opciones-partida.component.css'
})
export class OpcionesPartidaComponent {

  popupFuncionalidadPruebasVisible: boolean = false;
  popUpTexto: string = "Esta funcionalidad no está disponible en este momento";

  constructor(private router: Router, private partidaService: PartidaService) {}

  jugadores: { nombre: string, placeholder: string }[] = [{ nombre: '', placeholder: 'Introduce nombre para jugador 1' }];

  tiposJuego = [TipoJuego.X01, TipoJuego.CRICKET, TipoJuego.CLOCK];
  puntosPartida = [OpcionPuntosPartida.P101, OpcionPuntosPartida.P301, OpcionPuntosPartida.P501, OpcionPuntosPartida.P701];
  rondas = [OpcionNumeroRondas.R10, OpcionNumeroRondas.R20, OpcionNumeroRondas.R30, OpcionNumeroRondas.R40, OpcionNumeroRondas.ILIMITADO];
  tiposFinal = [TipoFinal.SIMPLE, TipoFinal.DOBLE, TipoFinal.TRIPLE];

  // Valores seleccionados
  juegoSeleccionado = this.tiposJuego[0];
  puntoPartidaSeleccionado = this.puntosPartida[1];
  rondasSeleccionadas = this.rondas[1];
  finalSeleccionado = this.tiposFinal[1];

  agregarJugador() {
    this.jugadores.push({ nombre: ``, placeholder: `Introduce nombre para jugador ${this.jugadores.length + 1}`});
  }

  eliminarJugador(index: number) {
    this.jugadores.splice(index, 1);
  }

  empezarPartida(): void {
    if (this.juegoSeleccionado == TipoJuego.X01)
      {
      var nombresJugadores = this.jugadores.map(j => j.nombre);

      this.partidaService.crearpartida(nombresJugadores, this.juegoSeleccionado, this.puntoPartidaSeleccionado, this.rondasSeleccionadas, this.finalSeleccionado);
      this.router.navigate(['/partida']);
    }
    else
    {
      this.popupFuncionalidadPruebasVisible = true;
    }

  }

  closePopUp(event: { }){
    this.popupFuncionalidadPruebasVisible = false;
  }
}
