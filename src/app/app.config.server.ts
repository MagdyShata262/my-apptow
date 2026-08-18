import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

const serverConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withEventReplay()),
    provideServerRendering(withRoutes(serverRoutes)),
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
