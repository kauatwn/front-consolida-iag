import { Routes } from '@angular/router';

export const consolidationRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./consolidation-page/consolidation-page').then((m) => m.ConsolidationPage),
  },
];
