// import { CanActivateFn } from '@angular/router';

// export const authGuard: CanActivateFn = (route, state) => {
//   return true;
// };
// src/app/core/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);

  // ✅ إذا كان المستخدم مسجل دخول، اسمح بالمرور
  if (authService.isAuthenticated()) {
    return true;
  }

  // ✅ وإلا، وجهه إلى صفحة تسجيل الدخول
  // مع حفظ الـ URL الحالي في queryParams للعودة إليه لاحقًا
  return router.createUrlTree(['/auth/login'], {
    queryParams: { returnUrl: state.url },
  });
};
