import { Injectable, computed, inject } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

export interface NavItem {
  label: string;
  icon: string;
  route: string;
}

type Data = {
  title?: string;
};

const DEFAULT_TITLE = 'HeroApp';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private readonly router = inject(Router);

  readonly navItems: NavItem[] = [
    { label: 'Heroes', icon: 'shield', route: '/heroes' },
    { label: 'Add Hero', icon: 'add_circle', route: '/heroes/new' },
  ];

  private readonly navEnd = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    )
  );

  private lastChild(route: ActivatedRoute): ActivatedRoute {
    return route.firstChild ? this.lastChild(route.firstChild) : route;
  }

  readonly pageTitle = computed(() => {
    this.navEnd();

    const route = this.lastChild(this.router.routerState.root);
    const { title } = route.snapshot.data as Data;

    return title ?? DEFAULT_TITLE;
  });
}
