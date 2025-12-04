import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { TokenService } from '../services/token.service';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);
  const token = tokenService.getToken();

  // Verificar si el token existe y no ha expirado
  if (token && tokenService.isAuthenticated()) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next(clonedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        // Si recibimos 401, el token expiró o es inválido
        if (error.status === 401) {
          tokenService.clear();
          router.navigate(['/auth/login']);
        }
        return throwError(() => error);
      })
    );
  }

  // Si no hay token válido, limpiar y continuar
  if (token && !tokenService.isAuthenticated()) {
    tokenService.clear();
  }

  return next(req);
};
