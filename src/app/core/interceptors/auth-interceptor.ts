// src/app/core/interceptors/auth.interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { Auth } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(Auth); // ✅ تعديل التسمية لـ AuthService
  const token = authService.accessToken();

  // 1. استثناء مسارات عدم إرسال التوكن (Login & Refresh) لمنع الحلقات اللانهائية (Infinite Loops)
  if (req.url.includes('/auth/login') || req.url.includes('/auth/refresh')) {
    return next(req);
  }

  // 2. إرفاق הـ Access Token في الترويسة (Header) إذا كان متوفراً
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // 3. تمرير الطلب ومعالجة الخطأ 401 للتوكن المنتهي تلقائياً
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/auth/refresh')) {
        // محاولة تجديد التوكن
        return authService.renewToken().pipe(
          switchMap((tokens) => {
            // إعادة إرسال الطلب الأصل بعد تحديث الـ Header بالتوكن الجديد
            const newReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${tokens.accessToken}`,
              },
            });
            return next(newReq);
          }),
          catchError((refreshErr) => {
            // إذا فشلت محاولة التجديد أيضاً، يتم تسجيل الخروج
            authService.logout();
            return throwError(() => refreshErr);
          }),
        );
      }

      return throwError(() => error);
    }),
  );
};
