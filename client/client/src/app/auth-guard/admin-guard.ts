// admin-guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.isAuthenticated().pipe(
      tap((isAuthenticated) => {
        console.log('isAuthenticated:', isAuthenticated);
        if (!isAuthenticated) {
          this.router.navigate(['/']); // Redirige si el usuario no está autenticado
        }
      }),
      map(() => {
        // Ahora, verifica si el usuario es administrador
        const isAdmin = this.authService.isAdmin();
        console.log('isAdmin:', isAdmin);
  
        if (!isAdmin) {
          this.router.navigate(['/']); // Redirige si el usuario no es administrador
        }
  
        return isAdmin;
      })
    );
  }
}
