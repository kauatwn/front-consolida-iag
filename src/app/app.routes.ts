import { Routes } from '@angular/router';
// import { activeCycleGuard } from './core/guards/active-cycle.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'pedido/cei',
  },
  {
    path: 'pedido/:serviceCode',
    loadComponent: () => import('./weekly-request/totem-page/totem-page').then((m) => m.TotemPage),
    // canActivate: [activeCycleGuard],
  },
  {
    path: 'totem',
    loadComponent: () => import('./weekly-request/totem-page/totem-page').then((m) => m.TotemPage),
    // canActivate: [activeCycleGuard],
  },
  {
    path: 'ciclo-fechado',
    loadComponent: () =>
      import('./cycle-management/cycle-closed-page/cycle-closed-page').then(
        (m) => m.CycleClosedPage,
      ),
  },
  {
    path: '**',
    redirectTo: 'pedido/cei',
  },
];
