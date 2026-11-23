import { Routes } from '@angular/router';
import { homeRedirectGuard } from '../core/auth/auth-redirect';
import { activeCycleGuard } from '../cycle-management/active-cycle-guard';
import { serviceAccessGuard } from './service-access-guard';

export const weeklyRequestRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    canActivate: [homeRedirectGuard],
    children: [],
  },
  {
    path: ':serviceCode',
    loadComponent: () => import('./totem-page/totem-page').then((m) => m.TotemPage),
    canActivate: [serviceAccessGuard, activeCycleGuard],
  },
];
