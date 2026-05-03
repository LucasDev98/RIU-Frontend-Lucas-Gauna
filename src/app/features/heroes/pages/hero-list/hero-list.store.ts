import { computed, inject, Injectable, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { combineLatest, debounceTime, filter, finalize, switchMap } from 'rxjs';
import { Hero, HeroPaginatedResponse } from '../../../../core/models';
import { HeroService, NotificationService } from '../../../../core/services';
import { ConfirmDialogComponent, PageChange } from '../../../../shared/components';

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
  private readonly notification = inject(NotificationService);
  private readonly dialog = inject(MatDialog);

  readonly filterQuery = signal('');
  readonly pageIndex = signal(0);
  readonly pageSize = signal(5);
  private readonly refreshCounter = signal(0);
  private readonly _loading = signal(true);

  readonly isLoading = this._loading.asReadonly();

  private readonly heroPage = toSignal(
    combineLatest({
      filter: toObservable(this.filterQuery).pipe(debounceTime(300)),
      pageIndex: toObservable(this.pageIndex),
      pageSize: toObservable(this.pageSize),
      refresh: toObservable(this.refreshCounter),
    }).pipe(
      switchMap(({ filter, pageIndex, pageSize }) => {
        this._loading.set(true);
        return this.heroService.getAll({
          page: pageIndex + 1,
          perPage: pageSize,
          name: filter || undefined,
        }).pipe(finalize(() => this._loading.set(false)));
      })
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
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Hero',
        message: `Are you sure you want to delete ${hero.name}?`,
        confirmLabel: 'Delete',
      },
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter(confirmed => !!confirmed),
        switchMap(() => this.heroService.remove(hero.id))
      )
      .subscribe({
        next: () => {
          this.notification.success(`${hero.name} deleted successfully.`);
          this.refreshCounter.update(counter => counter + 1);
        },
        error: () => this.notification.error('Failed to delete hero.'),
      });
  }
}
