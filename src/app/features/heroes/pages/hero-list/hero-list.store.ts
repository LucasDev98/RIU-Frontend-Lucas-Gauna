import { computed, inject, Injectable, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, debounceTime, switchMap } from 'rxjs';
import { Hero, HeroPaginatedResponse } from '../../../../core/models/hero.model';
import { HeroService } from '../../../../core/services/hero.service';
import { PageChange } from '../../../../shared/components/paginator/paginator.component';

const EMPTY_PAGE: Readonly<HeroPaginatedResponse> = {
  data: [],
  items: 0,
  pages: 0,
};

/**
 * Manages state and data fetching for the hero list.
 */
@Injectable()
export class HeroListStore {
  private readonly heroService = inject(HeroService);

  readonly filterQuery = signal('');
  readonly pageIndex = signal(0);
  readonly pageSize = signal(5);
  private readonly refreshCounter = signal(0);

  private readonly heroPage = toSignal(
    combineLatest({
      filter: toObservable(this.filterQuery).pipe(debounceTime(300)),
      pageIndex: toObservable(this.pageIndex),
      pageSize: toObservable(this.pageSize),
      refresh: toObservable(this.refreshCounter),
    }).pipe(
      switchMap(({ filter, pageIndex, pageSize }) =>
        this.heroService.getAll({
          page: pageIndex + 1,
          perPage: pageSize,
          name: filter || undefined,
        })
      )
    ),
    { initialValue: EMPTY_PAGE }
  );

  readonly heroes = computed(() => this.heroPage().data);
  readonly totalItems = computed(() => this.heroPage().items);

  setFilter(query: string): void {
    this.filterQuery.set(query);
    this.pageIndex.set(0);
  }

  setPage(event: PageChange): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  remove(hero: Hero): void {
    this.heroService.remove(hero.id).subscribe({
      next: () => this.refreshCounter.update(counter => counter + 1),
      error: () => console.error('Failed to delete hero'),
    });
  }
}
