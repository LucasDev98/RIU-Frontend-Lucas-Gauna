import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Hero } from '../../../../core/models/hero.model';
import { HeroListStore } from './hero-list.store';
import { HeroCardComponent } from '../../components/hero-card/hero-card.component';
import { PaginatorComponent, PageChange } from '../../../../shared/components/paginator/paginator.component';
import { MATERIAL_IMPORTS } from '../../../../shared/material.imports';

@Component({
  selector: 'app-hero-list',
  standalone: true,
  imports: [HeroCardComponent, PaginatorComponent, ...MATERIAL_IMPORTS],
  templateUrl: './hero-list.component.html',
  styleUrl: './hero-list.component.scss',
  providers: [HeroListStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroListComponent {
  private readonly router = inject(Router);
  protected readonly store = inject(HeroListStore);
  readonly skeletons = Array(this.store.pageSize());

  onFilterChange(query: string): void {
    this.store.setFilter(query);
  }

  onPageChange(event: PageChange): void {
    this.store.setPage(event);
  }

  onAddHero(): void {
    this.router.navigate(['/heroes/new']);
  }

  onView(hero: Hero): void {
    this.router.navigate(['/heroes', hero.id]);
  }

  onEdit(hero: Hero): void {
    this.router.navigate(['/heroes', hero.id, 'edit']);
  }

  onDelete(hero: Hero): void {
    this.store.remove(hero);
  }
}
