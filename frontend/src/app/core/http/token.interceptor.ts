import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  // (opcional pero recomendado) NO agregar bearer a /auth/login
  if (req.url.includes('/auth/login')) return next(req);

  const auth = inject(AuthService);
  const token = auth.token;

  if (!token) return next(req);

  return next(
    req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    })
  );
};
