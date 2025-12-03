import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const PAGES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages.component').then(m => m.PagesComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'search',
        loadComponent: () => import('./search/search.component').then(m => m.SearchComponent)
      },
      {
        path: 'favorites',
        loadComponent: () => import('./favorites/favorites.component').then(m => m.FavoritesComponent)
      },
      {
        path: '',
        redirectTo: 'search',
        pathMatch: 'full'
      }
    ]
  }
];
