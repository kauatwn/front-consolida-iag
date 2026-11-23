import { Routes } from '@angular/router';

export const cycleManagementRoutes: Routes = [
  {
    path: 'ciclo-fechado',
    loadComponent: () =>
      import('./cycle-closed-page/cycle-closed-page').then((m) => m.CycleClosedPage),
  },
];
