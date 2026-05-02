import { Component, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Hero } from '../../../../core/models/hero.model';
import { HERO_MOCKS } from '../../mocks/hero.mock';
import { HeroCardComponent } from '../../components/hero-card/hero-card.component';
import { PaginatorComponent, PageChange } from '../../../../shared/components/paginator/paginator.component';

@Component({
  selector: 'app-hero-list',
  standalone: true,
  imports: [HeroCardComponent, PaginatorComponent],
  templateUrl: './hero-list.component.html',
  styleUrl: './hero-list.component.scss',
})
export class HeroListComponent {
  private readonly router = inject(Router);

  private readonly allHeroes = signal<Hero[]>(HERO_MOCKS);

  readonly pageIndex = signal(0);
  readonly pageSize = signal(5);

  readonly totalItems = computed(() => this.allHeroes().length);

  readonly pagedHeroes = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.allHeroes().slice(start, start + this.pageSize());
  });

  onPageChange(event: PageChange): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  onView(hero: Hero): void {
    this.router.navigate(['/heroes', hero.id]);
  }

  onEdit(hero: Hero): void {
    this.router.navigate(['/heroes', hero.id, 'edit']);
  }

  onDelete(hero: Hero): void {
    this.allHeroes.update(list => list.filter(current => current.id !== hero.id));
  }
}
