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

  // ✅ حماية إضافية: القراءة المباشرة من Storage إذا كان التطبيق في مرحلة الـ Initial Load
  if (typeof localStorage !== 'undefined') {
    const savedSession = localStorage.getItem('auth_session');
    if (savedSession) {
      return true; // تسمح بالمرور وستتولى دالة loadFromStorage تحديث الـ Signals
    }
  }

  // ✅ إعادة التوجيه لصفحة تسجيل الدخول مع حفظ مسار العودة
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url },
  });
};
