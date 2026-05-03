import { computed, Injectable, signal } from '@angular/core';

/**
 * Tracks in-flight HTTP requests to derive a global loading state.
 * Consumed by the loading interceptor and any component that needs
 * to reflect overall network activity (e.g., a top progress bar).
 */
@Injectable({ providedIn: 'root' })
export class LoadingService {
  private readonly _activeRequests = signal(0);

  /** True while at least one HTTP request is pending. */
  readonly isLoading = computed(() => this._activeRequests() > 0);

  increment(): void {
    this._activeRequests.update(n => n + 1);
  }

  decrement(): void {
    this._activeRequests.update(n => Math.max(0, n - 1));
  }
}
