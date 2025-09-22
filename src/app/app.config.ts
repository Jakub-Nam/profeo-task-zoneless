import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { API_BASE_URL, POSTS_API_URL } from './tokens/api.tokens';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: API_BASE_URL,
      useValue: 'https://jsonplaceholder.typicode.com',
    },
    {
      provide: POSTS_API_URL,
      useValue: 'https://jsonplaceholder.typicode.com/posts',
    },
  ],
};
