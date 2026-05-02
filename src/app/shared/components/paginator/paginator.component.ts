import { Component, input, output, viewChild } from '@angular/core';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';

export interface PageChange {
  pageIndex: number;
  pageSize: number;
}

/**
 * Reusable pagination wrapper around MatPaginator.
 * Facade pattern — abstracts Material dependency from feature components.
 */
@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [MatPaginatorModule],
  templateUrl: './paginator.component.html',
})
export class PaginatorComponent {
  readonly totalItems = input.required<number>();
  readonly pageSize = input<number>(5);
  readonly pageSizeOptions = input<number[]>([5, 10, 15, 20]);

  readonly pageChange = output<PageChange>();

  readonly paginator = viewChild.required<MatPaginator>(MatPaginator);

  onPageEvent(event: PageEvent): void {
    this.pageChange.emit({
      pageIndex: event.pageIndex,
      pageSize: event.pageSize,
    });
  }

  reset(): void {
    this.paginator().firstPage();
  }
}
