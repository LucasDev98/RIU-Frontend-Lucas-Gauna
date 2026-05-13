import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap, catchError, of } from 'rxjs';
import { MATERIAL_IMPORTS } from '../../../../shared/material.imports';
import { HeroService, SeoService } from '../../../../core/services';
import { DEFAULT_HERO_IMAGE, HeroUniverse } from '../../../../core/models/hero.model';

const UNIVERSE_CLASS_MAP: Readonly<Record<HeroUniverse, string>> = {
  Marvel: 'universe-marvel',
  DC: 'universe-dc',
  Other: 'universe-other',
};

@Component({
  selector: 'app-hero-detail',
  standalone: true,
  imports: [...MATERIAL_IMPORTS, DatePipe],
  templateUrl: './hero-detail.component.html',
  styleUrl: './hero-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroDetailComponent {
  readonly defaultImage = DEFAULT_HERO_IMAGE;

  private readonly router = inject(Router);
  private readonly heroService = inject(HeroService);
  private readonly seoService = inject(SeoService);

  readonly id = input.required<string>();

  readonly hero = toSignal(
    toObservable(this.id).pipe(
      switchMap(id => this.heroService.getById(id)),
      catchError(error => {
        console.error('Error loading hero', error);
        return of(null);
      })
    ),
    { initialValue: null }
  );

  readonly universeClass = computed(() => {
    const hero = this.hero();
    return hero ? UNIVERSE_CLASS_MAP[hero.universe] : '';
  });

  readonly isNotFound = computed(() => this.hero() === null);

  constructor() {
    effect(() => {
      const currentHero = this.hero();
      if (!currentHero) return;

      this.seoService.setPage({
        title: currentHero.name,
        description: `${currentHero.alias} — ${currentHero.power} (${currentHero.universe})`,
      });
    });
  }

  goBack(): void {
    this.router.navigate(['/heroes']);
  }

  goToEdit(): void {
    this.router.navigate(['/heroes', this.id(), 'edit']);
  }
}
