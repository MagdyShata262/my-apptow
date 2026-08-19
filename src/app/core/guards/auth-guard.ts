// src/app/core/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);

  // ✅ التحقق من حالة التسجيل
  if (authService.isAuthenticated()) {
    return true;
  }

  // ✅ إعادة التوجيه لصفحة تسجيل الدخول مع حفظ مسار العودة
  return router.createUrlTree(['/auth/login'], {
    queryParams: { returnUrl: state.url },
  });
};
