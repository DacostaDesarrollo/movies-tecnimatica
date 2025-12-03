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
    return !!this.getToken();
  }

  clear(): void {
    this.removeToken();
    this.removeUser();
  }
}
