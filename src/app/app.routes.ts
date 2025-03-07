import { Routes } from '@angular/router';
import { PartidaComponent } from './components/partida/partida.component';
import { OpcionesPartidaComponent } from './components/opciones-partida/opciones-partida.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { PartidaGuard } from './core/guards/partida.guard';

export const routes: Routes = [
    { path: '', component: InicioComponent },
    { path: 'configurar-partida', component: OpcionesPartidaComponent},
    { path: 'partida', component: PartidaComponent, canActivate: [PartidaGuard]},
];