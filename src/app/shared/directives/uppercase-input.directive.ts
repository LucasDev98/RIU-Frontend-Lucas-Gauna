import { Directive, HostListener, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: 'input[appUppercaseInput]',
  standalone: true,
})
export class UppercaseInputDirective {
  private readonly control = inject(NgControl, { optional: true });

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const start = input.selectionStart ?? 0;
    const end = input.selectionEnd ?? 0;

    const upper = input.value.toUpperCase();

    if (input.value === upper) return;

    input.value = upper;
    input.setSelectionRange(start, end);

    this.control?.control?.setValue(upper, { emitEvent: false });
  }
}
