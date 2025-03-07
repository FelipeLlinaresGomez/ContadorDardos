import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { PartidaService } from '../services/partida.service';

@Injectable({
  providedIn: 'root',
})
export class PartidaGuard implements CanActivate {
  constructor(private partidaService: PartidaService, private router: Router) {}

  async canActivate(): Promise<boolean> {

    if (!this.partidaService.existePartida()) {
      this.router.navigate(['/', "configurar-partida"]);
      return false;
    }
    
    return true;
  }
}
