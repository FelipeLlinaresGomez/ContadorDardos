import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartidaComponent } from './partida.component';

describe('PartidaComponent', () => {
  let component: PartidaComponent;
  let fixture: ComponentFixture<PartidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartidaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
