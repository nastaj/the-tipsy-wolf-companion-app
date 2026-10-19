import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login.page').then((m) => m.LoginPage),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./features/shell/shell.page').then((m) => m.ShellPage),
    children: [
      {
        path: 'keepers',
        loadComponent: () => import('./features/keepers/keepers.page').then((m) => m.KeepersPage),
      },
      {
        path: 'market',
        loadComponent: () => import('./features/market/market.page').then((m) => m.MarketPage),
      },
      {
        path: 'reviews',
        loadComponent: () => import('./features/reviews/reviews.page').then((m) => m.ReviewsPage),
      },
      { path: '', redirectTo: 'keepers', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '' },
];
