import { TestBed } from '@angular/core/testing';
import { of, Subject, throwError } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { vi } from 'vitest';
import { HeroListStore } from './hero-list.store';
import { HeroService, NotificationService } from '../../../../core/services';
import { Hero } from '../../../../core/models';

const mockHero: Hero = {
  id: '1',
  name: 'SPIDERMAN',
  alias: 'Peter Parker',
  power: 'Wall-crawling',
  universe: 'Marvel',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

describe('HeroListStore', () => {
  let store: HeroListStore;

  const getAllFn = vi.fn(() =>
    of({ data: [mockHero], items: 1, pages: 1 })
  );
  const removeFn = vi.fn();
  const successFn = vi.fn();
  const errorFn = vi.fn();
  const openFn = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [
        HeroListStore,
        { provide: HeroService, useValue: { getAll: getAllFn, remove: removeFn } },
        { provide: NotificationService, useValue: { success: successFn, error: errorFn } },
        { provide: MatDialog, useValue: { open: openFn } },
      ],
    });

    store = TestBed.inject(HeroListStore);
    vi.advanceTimersByTime(300);
  });

  afterEach(() => vi.useRealTimers());

  // -------------------------
  // INITIAL STATE
  // -------------------------
  it('should initialize with default state', () => {
    expect(store.filterQuery()).toBe('');
    expect(store.pageIndex()).toBe(0);
    expect(store.pageSize()).toBe(5);
  });

  // -------------------------
  // REACTIVE FLOW
  // -------------------------
  it('should fetch heroes on init', () => {
    expect(getAllFn).toHaveBeenCalled();
    expect(store.heroes()).toEqual([mockHero]);
    expect(store.totalItems()).toBe(1);
  });

  it('should refetch when filter changes (debounced)', () => {
    // Arrange — reset call count after the initial fetch
    getAllFn.mockClear();

    // Act
    store.setFilter('spider');

    // Assert — debounce should hold the request
    expect(getAllFn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);

    // Assert — request fires after debounce with correct filter
    expect(getAllFn).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'spider' })
    );
  });

  it('should refetch when page changes', () => {
    store.setPage({ pageIndex: 2, pageSize: 10 });

    expect(getAllFn).toHaveBeenCalled();
  });

  // -------------------------
  // FILTER & PAGINATION
  // -------------------------
  describe('setFilter', () => {
    it('should update query and reset page', () => {
      store.setPage({ pageIndex: 3, pageSize: 5 });

      store.setFilter('man');

      expect(store.filterQuery()).toBe('man');
      expect(store.pageIndex()).toBe(0);
    });
  });

  describe('setPage', () => {
    it('should update pageIndex and pageSize', () => {
      store.setPage({ pageIndex: 2, pageSize: 10 });

      expect(store.pageIndex()).toBe(2);
      expect(store.pageSize()).toBe(10);
    });
  });

  // -------------------------
  // DELETE FLOW
  // -------------------------
  describe('remove', () => {
    it('should open confirmation dialog', () => {
      const afterClosed$ = new Subject<boolean>();
      const dialogRefMock = {
        afterClosed: () => afterClosed$,
      } as Partial<MatDialogRef<unknown>>;

      openFn.mockReturnValue(dialogRefMock);

      store.remove(mockHero);

      expect(openFn).toHaveBeenCalled();
    });

    it('should call service and show success when confirmed', () => {
      const afterClosed$ = new Subject<boolean>();
      const dialogRefMock = {
        afterClosed: () => afterClosed$,
      } as Partial<MatDialogRef<unknown>>;

      openFn.mockReturnValue(dialogRefMock);
      removeFn.mockReturnValue(of(undefined));

      store.remove(mockHero);
      afterClosed$.next(true);
      afterClosed$.complete();

      expect(removeFn).toHaveBeenCalledWith('1');
      expect(successFn).toHaveBeenCalled();
    });

    it('should not call service when cancelled', () => {
      const afterClosed$ = new Subject<boolean>();
      const dialogRefMock = {
        afterClosed: () => afterClosed$,
      } as Partial<MatDialogRef<unknown>>;

      openFn.mockReturnValue(dialogRefMock);

      store.remove(mockHero);
      afterClosed$.next(false);
      afterClosed$.complete();

      expect(removeFn).not.toHaveBeenCalled();
    });

    it('should show error when delete fails', () => {
      const afterClosed$ = new Subject<boolean>();
      const dialogRefMock = {
        afterClosed: () => afterClosed$,
      } as Partial<MatDialogRef<unknown>>;

      openFn.mockReturnValue(dialogRefMock);
      removeFn.mockReturnValue(throwError(() => new Error('fail')));

      store.remove(mockHero);
      afterClosed$.next(true);
      afterClosed$.complete();

      expect(errorFn).toHaveBeenCalled();
    });
  });
});
