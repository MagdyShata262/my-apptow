// src/app/core/interceptors/auth.interceptor.ts

import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';

import { inject } from '@angular/core';

import { catchError, from, switchMap, throwError } from 'rxjs';

import { Auth } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(Auth);

  const token = authService.accessToken();

  // ============================================
  // 1. Login & Refresh
  // ============================================

  // لا نرسل Access Token إلى login أو refresh
  // حتى لا ندخل في Infinite Loop.
  if (req.url.includes('/auth/login') || req.url.includes('/auth/refresh')) {
    return next(req);
  }

  // ============================================
  // 2. Attach Access Token
  // ============================================

  let authReq = req;

  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // ============================================
  // 3. Send Request
  // ============================================

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // ========================================
      // 4. Access Token Expired
      // ========================================

      if (error.status !== 401) {
        return throwError(() => error);
      }

      // ========================================
      // 5. Renew Token
      // ========================================

      return from(authService.renewToken()).pipe(
        switchMap((newAccessToken) => {
          // Refresh failed
          if (!newAccessToken) {
            authService.logout();

            return throwError(() => error);
          }

          // ====================================
          // 6. Retry Original Request
          // ====================================

          const newReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${newAccessToken}`,
            },
          });

          return next(newReq);
        }),

        // ======================================
        // 7. Refresh Request Failed
        // ======================================

        catchError((refreshError) => {
          authService.logout();

          return throwError(() => refreshError);
        }),
      );
    }),
  );
};
