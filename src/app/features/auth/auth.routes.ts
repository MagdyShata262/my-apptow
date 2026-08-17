// └── auth.routes.ts             ✅ جديد (يدوي)

import { Routes } from '@angular/router';
import { Login } from './login/login';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    component: Login,
    title: 'تسجيل الدخول',
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
