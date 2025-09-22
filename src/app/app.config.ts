import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { API_CONFIG } from './tokens/api.tokens';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(),
    {
      provide: API_CONFIG,
      useValue: {
        baseUrl: 'https://jsonplaceholder.typicode.com',
        posts: 'https://jsonplaceholder.typicode.com/posts',
        users: 'https://jsonplaceholder.typicode.com/users',
      },
    },
  ],
};
