import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpcionesPartidaComponent } from './opciones-partida.component';

describe('OpcionesPartidaComponent', () => {
  let component: OpcionesPartidaComponent;
  let fixture: ComponentFixture<OpcionesPartidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpcionesPartidaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpcionesPartidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
