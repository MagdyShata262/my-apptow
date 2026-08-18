import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { withInterceptors, provideHttpClient, withFetch } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withFetch(), // ✅ إصلاح التحذير - استخدام fetch APIs
      withInterceptors([authInterceptor]),
    ),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()), // ✅ هذا السطر مهم جدًا
  ],
};
