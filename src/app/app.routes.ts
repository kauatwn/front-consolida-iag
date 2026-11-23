import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth-guard';
import { buyerGuard } from './core/auth/buyer-guard';
import { rootRedirectGuard } from './core/auth/root-redirect-guard';
import { unauthGuard } from './core/auth/unauth-guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    canActivate: [rootRedirectGuard],
    children: [],
  },
  {
    path: 'login',
    canActivate: [unauthGuard],
    loadComponent: () => import('./core/auth/login-page/login-page').then((m) => m.LoginPage),
  },
  {
    path: 'consolidacao',
    canActivate: [authGuard, buyerGuard],
    loadChildren: () =>
      import('./consolidation/consolidation-routes').then((m) => m.consolidationRoutes),
  },
  {
    path: 'pedido',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./weekly-request/weekly-request-routes').then((m) => m.weeklyRequestRoutes),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./cycle-management/cycle-management-routes').then((m) => m.cycleManagementRoutes),
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
