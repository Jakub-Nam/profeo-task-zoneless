import { Routes } from '@angular/router';
import { FeaturePostsList } from './domains/feature-posts-list/feature-posts-list';

export const routes: Routes = [
  {
    path: '',
    component: FeaturePostsList,
  },
  {
    path: 'posts/:id',
    loadComponent: () =>
      import('./domains/feature-post-details/feature-post-details').then(
        (m) => m.FeaturePostDetails
      ),
  },
];
