import { Routes } from '@angular/router';

export const HEROES_ROUTES: Routes = [
  {
    path: '',
    data: { title: 'Heroes' },
    loadComponent: () =>
      import('./pages/hero-list/hero-list.component').then(
        m => m.HeroListComponent
      ),
  },
  {
    path: 'new',
    data: { title: 'Add Hero' },
    loadComponent: () =>
      import('./pages/hero-form/hero-form.component').then(
        m => m.HeroFormComponent
      ),
  },
  {
    path: ':id',
    data: { title: 'Hero Detail' },
    loadComponent: () =>
      import('./pages/hero-detail/hero-detail.component').then(
        m => m.HeroDetailComponent
      ),
  },
  {
    path: ':id/edit',
    data: { title: 'Edit Hero' },
    loadComponent: () =>
      import('./pages/hero-form/hero-form.component').then(
        m => m.HeroFormComponent
      ),
  },
];
