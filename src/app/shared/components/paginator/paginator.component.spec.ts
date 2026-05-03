import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { PageEvent } from '@angular/material/paginator';
import { vi } from 'vitest';
import { PaginatorComponent, PageChange } from './paginator.component';

describe('PaginatorComponent', () => {
  let component: PaginatorComponent;
  let fixture: ComponentFixture<PaginatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginatorComponent],
      providers: [provideAnimationsAsync()],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginatorComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('totalItems', 50);
    fixture.detectChanges();
  });

  it('should create', () => {
    // Assert
    expect(component).toBeTruthy();
  });

  it('should emit pageChange with correct values on page event', () => {
    // Arrange
    const emitFn = vi.fn();
    component.pageChange.subscribe(emitFn);

    const pageEvent: PageEvent = {
      pageIndex: 2,
      pageSize: 10,
      length: 50,
    };

    // Act
    component.onPageEvent(pageEvent);

    // Assert
    const emitted: PageChange = emitFn.mock.calls[0][0];
    expect(emitted.pageIndex).toBe(2);
    expect(emitted.pageSize).toBe(10);
  });

  it('should use default pageSize of 5', () => {
    // Assert
    expect(component.pageSize()).toBe(5);
  });

  it('should use default pageSizeOptions of [5, 10, 15, 20]', () => {
    // Assert
    expect(component.pageSizeOptions()).toEqual([5, 10, 15, 20]);
  });

  it('should reset to first page when reset is called', () => {
    // Arrange
    const firstPageFn = vi.fn();
    const paginatorSpy = component.paginator();
    paginatorSpy.firstPage = firstPageFn;

    // Act
    component.reset();

    // Assert
    expect(firstPageFn).toHaveBeenCalled();
  });
});
