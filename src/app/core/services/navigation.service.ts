import { Injectable, computed, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';

export interface NavItem {
  label: string;
  icon: string;
  route: string;
}

const ROUTE_TITLES: Record<string, string> = {
  '/heroes': 'Heroes',
  '/heroes/new': 'Add Hero',
};

/** Singleton service that owns navigation items and resolves the active page title. */
@Injectable({ providedIn: 'root' })
export class NavigationService {
  private readonly router = inject(Router);

  readonly navItems: NavItem[] = [
    { label: 'Heroes', icon: 'shield', route: '/heroes' },
    { label: 'Add Hero', icon: 'add_circle', route: '/heroes/new' },
  ];

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(event => (event as NavigationEnd).urlAfterRedirects)
    ),
    { initialValue: this.router.url }
  );

  readonly pageTitle = computed(() => {
    const url = this.currentUrl();
    if (url.includes('/edit')) return 'Edit Hero';
    return ROUTE_TITLES[url] ?? 'Heroes';
  });
}
