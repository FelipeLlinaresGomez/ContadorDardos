import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pop-up',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pop-up.component.html',
  styleUrl: './pop-up.component.css'
})
export class PopUpComponent {
    @Input() titulo!: string;
    @Input() visible!: boolean;
    @Input() crossVisible!: boolean;

    @Output() closePopUp = new EventEmitter();

    closeOverlay() {
      this.closePopUp.emit();
    }
}