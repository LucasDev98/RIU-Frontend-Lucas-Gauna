import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

import { MATERIAL_IMPORTS } from './shared/material.imports';
import { SidenavComponent } from './shared/components/sidenav/sidenav.component';
import { NavigationService } from './core/services/navigation.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ...MATERIAL_IMPORTS, SidenavComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly navService = inject(NavigationService);
  private readonly breakpointObserver = inject(BreakpointObserver);

  readonly sidenavOpen = signal(true);

  readonly isHandset = toSignal(
    this.breakpointObserver
      .observe(Breakpoints.Handset)
      .pipe(map(r => r.matches)),
    { initialValue: false }
  );

  toggleSidenav(): void {
    this.sidenavOpen.update(open => !open);
  }

  closeSidenavOnMobile(): void {
    if (this.isHandset()) this.sidenavOpen.set(false);
  }
}
