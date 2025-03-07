import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-navbar-partida',
  standalone: true,
  imports: [],
  templateUrl: './navbar-partida.component.html',
  styleUrl: './navbar-partida.component.css'
})
export class NavbarPartidaComponent {
  @Input() titulo!: string;
  @Input() descripcion!: string;
}
