import { Routes } from '@angular/router';
import { activeCycleGuard } from '../cycle-management/active-cycle-guard';
import { serviceAccessGuard } from './service-access-guard';

export const weeklyRequestRoutes: Routes = [
  {
    path: ':serviceCode',
    loadComponent: () => import('./totem-page/totem-page').then((m) => m.TotemPage),
    canActivate: [serviceAccessGuard, activeCycleGuard],
  },
];
