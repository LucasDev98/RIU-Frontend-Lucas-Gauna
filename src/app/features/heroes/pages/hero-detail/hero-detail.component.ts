import { Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { MATERIAL_IMPORTS } from '../../../../shared/material.imports';
import { HeroService } from '../../../../core/services/hero.service';
import { DEFAULT_HERO_IMAGE, HeroUniverse } from '../../../../core/models/hero.model';

const UNIVERSE_CLASS_MAP: Record<HeroUniverse, string> = {
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
})
export class HeroDetailComponent {
  readonly defaultImage = DEFAULT_HERO_IMAGE;
  private readonly router = inject(Router);
  private readonly heroService = inject(HeroService);

  readonly id = input.required<string>();

  readonly hero = toSignal(
    toObservable(this.id).pipe(
      switchMap(id => this.heroService.getById(id))
    )
  );

  readonly universeClass = computed(() => {
    const universe = this.hero()?.universe;
    return universe ? UNIVERSE_CLASS_MAP[universe] : '';
  });

  goBack(): void {
    this.router.navigate(['/heroes']);
  }

  goToEdit(): void {
    this.router.navigate(['/heroes', this.id(), 'edit']);
  }
}
