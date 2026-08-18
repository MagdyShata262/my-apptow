import { bootstrapApplication } from '@angular/platform-browser';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

const browserConfig = {
  providers: [...appConfig.providers, provideClientHydration(withEventReplay())],
};

bootstrapApplication(App, browserConfig).catch((err) => console.error(err));
