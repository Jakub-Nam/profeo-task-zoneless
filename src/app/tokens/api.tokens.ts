import { InjectionToken } from '@angular/core';

export interface ApiConfig {
  baseUrl: string;
  posts: string;
  users: string;
}

export const API_CONFIG = new InjectionToken<ApiConfig>('API_CONFIG');
