import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';

import { MATERIAL_IMPORTS } from './shared/material.imports';
import { SidenavComponent } from './shared/components/sidenav/sidenav.component';
import { LoadingService, NavigationService, SeoService } from './core/services';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ...MATERIAL_IMPORTS, SidenavComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly navService = inject(NavigationService);
  protected readonly loadingService = inject(LoadingService);

  private readonly router = inject(Router);
  private readonly seoService = inject(SeoService);
  private readonly breakpointObserver = inject(BreakpointObserver);

  readonly sidenavOpen = signal(true);

  readonly isHandset = toSignal(
    this.breakpointObserver.observe(Breakpoints.Handset).pipe(map(r => r.matches)),
    { initialValue: false }
  );

  constructor() {
    // Automatically sync <title> and meta tags with the active route on every navigation.
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(() => {
        let route = this.router.routerState.root;
        while (route.firstChild) route = route.firstChild;
        return route.snapshot.data?.['title'] as string | undefined;
      }),
      filter(Boolean),
      takeUntilDestroyed()
    ).subscribe(title => this.seoService.setPage({ title }));
  }

  toggleSidenav(): void {
    this.sidenavOpen.update(open => !open);
  }

  closeSidenavOnMobile(): void {
    if (this.isHandset()) this.sidenavOpen.set(false);
  }
}
