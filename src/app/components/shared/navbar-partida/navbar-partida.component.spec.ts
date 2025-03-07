import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarPartidaComponent } from './navbar-partida.component';

describe('NavbarPartidaComponent', () => {
  let component: NavbarPartidaComponent;
  let fixture: ComponentFixture<NavbarPartidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarPartidaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarPartidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
