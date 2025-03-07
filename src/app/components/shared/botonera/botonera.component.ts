import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-botonera',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './botonera.component.html',
  styleUrl: './botonera.component.css'
})
export class BotoneraComponent implements OnInit {
  @Input() cricket!: Boolean;
  @Output() puntuar = new EventEmitter<{ puntuacion: number, doble: boolean, triple: boolean }>();
  @Output() volver = new EventEmitter();
  
  numbers!: Array<number>;
  dobleSeleccionado: boolean = false;
  tripleSeleccionado: boolean = false;

  constructor() {}
  
  ngOnInit(): void 
  {
    if (!this.cricket)
      this.numbers = Array.from({ length: 20 }, (_, i) => i + 1).concat(25); // Array de 1 a 20 y 25
    else
      this.numbers = Array.from({ length: 6 }, (_, i) => i + 15).concat(25); // Array de 15 a 20 y 25
  }
  
  onNumberClick(num: number) {
    // Lógica para manejar el número seleccionado
    this.puntuar.emit({puntuacion: num, doble: this.dobleSeleccionado, triple: this.tripleSeleccionado});
     
    this.dobleSeleccionado = false;
    this.tripleSeleccionado = false;
  }

  onDouble() {
    // Lógica para la función doble
    this.tripleSeleccionado = false;
    this.dobleSeleccionado = true;
  }

  onTriple() {
    // Lógica para la función triple
    this.dobleSeleccionado = false;
    this.tripleSeleccionado = true;
  }

  onBack() {
    // Lógica para la acción de volver
    this.volver.emit();
  }
}
