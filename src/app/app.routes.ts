import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth-guard';
import { buyerGuard } from './core/auth/buyer-guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: 'login',
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
