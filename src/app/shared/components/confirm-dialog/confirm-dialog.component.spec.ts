import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { vi } from 'vitest';
import { ConfirmDialogComponent, ConfirmDialogData } from './confirm-dialog.component';

const dialogData: ConfirmDialogData = {
  title: 'Delete Hero',
  message: 'Are you sure you want to delete this hero?',
  confirmLabel: 'Delete',
  cancelLabel: 'Cancel',
};

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  const closeFn = vi.fn();

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent],
      providers: [
        provideAnimationsAsync(),
        { provide: MAT_DIALOG_DATA, useValue: dialogData },
        { provide: MatDialogRef, useValue: { close: closeFn } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    // Assert
    expect(component).toBeTruthy();
  });

  it('should close the dialog with true when confirmed', () => {
    // Act
    component.confirm();

    // Assert
    expect(closeFn).toHaveBeenCalledWith(true);
  });

  it('should close the dialog with false when cancelled', () => {
    // Act
    component.cancel();

    // Assert
    expect(closeFn).toHaveBeenCalledWith(false);
  });

  it('should display the title from injected data', () => {
    // Assert
    const title: HTMLElement = fixture.nativeElement.querySelector('h2');
    expect(title.textContent).toContain('Delete Hero');
  });

  it('should display the message from injected data', () => {
    // Assert
    const content: HTMLElement = fixture.nativeElement.querySelector('mat-dialog-content');
    expect(content.textContent).toContain('Are you sure you want to delete this hero?');
  });
});
