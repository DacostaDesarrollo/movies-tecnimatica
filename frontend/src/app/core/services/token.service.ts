import {Injectable} from '@angular/core';
import { StorageService } from '../../shared/services/storage.service';


@Injectable({
  providedIn :'root'
})
export class TokenService{
  private readonly TOKEN_KEY:string = 'auth_token';
  private readonly USER_KEY:string = 'current_user';

  constructor(private storageService: StorageService){}

  saveToken(token:string):void {
    this.storageService.setItem(this.TOKEN_KEY,token);
  }

  getToken(): string | null{
    return this.storageService.getItem<string>(this.TOKEN_KEY);
  }
  removeToken(): void {
    this.storageService.removeItem(this.TOKEN_KEY);
  }

  saveUser(email: string): void {
    this.storageService.setItem(this.USER_KEY, { email });
  }

  getUser(): { email: string } | null {
    return this.storageService.getItem<{ email: string }>(this.USER_KEY);
  }

  removeUser(): void {
    this.storageService.removeItem(this.USER_KEY);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    // Verificar si el token ha expirado
    return !this.isTokenExpired(token);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = this.decodeToken(token);
      if (!payload || !payload.exp) {
        return true;
      }

      // exp viene en segundos, Date.now() en milisegundos
      const expirationDate = payload.exp * 1000;
      const now = Date.now();

      return now >= expirationDate;
    } catch (error) {
      // Si hay error al decodificar, consideramos el token inválido
      return true;
    }
  }

  private decodeToken(token: string): any {
    try {
      // JWT tiene 3 partes separadas por puntos: header.payload.signature
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }

      // Decodificar el payload (segunda parte)
      const payload = parts[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded);
    } catch (error) {
      return null;
    }
  }

  getTokenExpiration(): Date | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    try {
      const payload = this.decodeToken(token);
      if (!payload || !payload.exp) {
        return null;
      }

      return new Date(payload.exp * 1000);
    } catch (error) {
      return null;
    }
  }

  clear(): void {
    this.removeToken();
    this.removeUser();
  }
}
