import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
    title: 'Home',
  },
  {
    path: 'about',
    loadComponent: () => import('./features/about/about').then((m) => m.About),
    title: 'About',
  },

  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES), // ✅ مسار تسجيل الدخول
  },
  // {
  //   path: 'features',
  //   canActivate: [authGuard], // ✅ حماية الصفحات الحساسة
  //   loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  // },
  {
    path: '**',
    redirectTo: '',
  },
];
