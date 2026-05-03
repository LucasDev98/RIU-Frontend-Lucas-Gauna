import { TestBed } from '@angular/core/testing';
import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    // Assert
    expect(service).toBeTruthy();
  });

  it('should start with isLoading as false', () => {
    // Assert
    expect(service.isLoading()).toBe(false);
  });

  it('should set isLoading to true after increment', () => {
    // Act
    service.increment();

    // Assert
    expect(service.isLoading()).toBe(true);
  });

  it('should set isLoading back to false after increment and decrement', () => {
    // Arrange
    service.increment();

    // Act
    service.decrement();

    // Assert
    expect(service.isLoading()).toBe(false);
  });

  it('should stay true while multiple concurrent requests are in flight', () => {
    // Arrange
    service.increment();
    service.increment();

    // Act
    service.decrement();

    // Assert — one request still pending
    expect(service.isLoading()).toBe(true);

    // Act
    service.decrement();

    // Assert — all resolved
    expect(service.isLoading()).toBe(false);
  });

  it('should not go below zero on extra decrements', () => {
    // Act — decrement without a prior increment
    service.decrement();

    // Assert — stays false, no negative counter
    expect(service.isLoading()).toBe(false);
  });
});
