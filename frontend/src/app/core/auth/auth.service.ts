import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG } from '../config/api.config';
import { AuthStorage } from './auth.storage';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = API_CONFIG.baseUrl;

  constructor(private http: HttpClient) {}

  login(dto: { email: string; password: string }) {
    return this.http
      .post<{ token: string; roles?: string[] }>(`${this.base}/auth/login`, {
        correo: dto.email,
        password: dto.password,
      })
      .pipe(
        tap((res) => {
          AuthStorage.setToken(res.token); // ✅ aquí estaba el error típico
        })
      );
  }

  logout() {
    AuthStorage.clear();
  }

  get token(): string {
    return AuthStorage.getToken() ?? '';
  }

  get isLoggedIn(): boolean {
    return !!AuthStorage.getToken();
  }

  me() {
    return this.http.get(`${this.base}/users/me`);
  }
}
