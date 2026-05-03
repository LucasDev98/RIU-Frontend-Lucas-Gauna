import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { vi } from 'vitest';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;
  const openFn = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        { provide: MatSnackBar, useValue: { open: openFn } },
      ],
    });

    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    // Assert
    expect(service).toBeTruthy();
  });

  it('should open a snackbar with success styles and 3s duration', () => {
    // Act
    service.success('Hero saved successfully');

    // Assert
    expect(openFn).toHaveBeenCalledWith(
      'Hero saved successfully',
      'Close',
      expect.objectContaining({
        duration: 3000,
        panelClass: ['snack-success'],
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
      })
    );
  });

  it('should open a snackbar with error styles and 4s duration', () => {
    // Act
    service.error('Something went wrong');

    // Assert
    expect(openFn).toHaveBeenCalledWith(
      'Something went wrong',
      'Close',
      expect.objectContaining({
        duration: 4000,
        panelClass: ['snack-error'],
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
      })
    );
  });
});
