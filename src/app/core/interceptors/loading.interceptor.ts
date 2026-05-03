import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service';

/**
 * Functional HTTP interceptor that maintains a global loading counter.
 * Every outgoing request increments the counter; finalize() ensures it
 * always decrements — even on errors or cancellations.
 */
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loading = inject(LoadingService);

  loading.increment();

  return next(req).pipe(finalize(() => loading.decrement()));
};
