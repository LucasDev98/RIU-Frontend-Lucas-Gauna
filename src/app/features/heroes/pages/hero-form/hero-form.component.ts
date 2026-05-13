import { Component, computed, effect, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { UppercaseInputDirective } from '../../../../shared/directives/uppercase-input.directive';
import { HeroService } from '../../../../core/services/hero.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { HERO_UNIVERSES, HeroUniverse } from '../../../../core/models/hero.model';

interface HeroFormGroup {
  name: FormControl<string>;
  alias: FormControl<string>;
  power: FormControl<string>;
  universe: FormControl<HeroUniverse>;
  imageUrl: FormControl<string>;
}

@Component({
  selector: 'app-hero-form',
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatSelectModule, ReactiveFormsModule, UppercaseInputDirective],
  templateUrl: './hero-form.component.html',
  styleUrl: './hero-form.component.scss',
})
export class HeroFormComponent {
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly heroService = inject(HeroService);
  private readonly notification = inject(NotificationService);

  readonly id = input<string>();
  readonly universes = HERO_UNIVERSES;

  readonly isEditMode = computed(() => !!this.id());
  readonly pageLabel = computed(() =>
    this.isEditMode() ? 'Edit Hero' : 'Add Hero'
  );

  readonly form: FormGroup<HeroFormGroup> = this.fb.nonNullable.group({
    name:     ['', [Validators.required, Validators.minLength(2)]],
    alias:    ['', Validators.required],
    power:    ['', Validators.required],
    universe: ['Marvel' as HeroUniverse, Validators.required],
    imageUrl: ['', Validators.pattern(/^https?:\/\/.+/)],
  });

  constructor() {
    effect(() => {
      const id = this.id();
      if (!id) return;

      this.heroService.getById(id).subscribe(hero => {
        this.form.patchValue({
          name: hero.name,
          alias: hero.alias,
          power: hero.power,
          universe: hero.universe,
          imageUrl: hero.imageUrl ?? '',
        });
      });
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const id = this.id();

    const action$ = id
      ? this.heroService.update(id, value)
      : this.heroService.create(value);

    action$.subscribe({
      next: hero => {
        const msg = id ? `${hero.name} updated successfully.` : `${hero.name} created successfully.`;
        this.notification.success(msg);
        this.router.navigate(['/heroes']);
      },
      error: () => this.notification.error('Operation failed. Please try again.'),
    });
  }

  goBack(): void {
    this.router.navigate(['/heroes']);
  }

  hasError(field: keyof HeroFormGroup, error: string): boolean {
    const control = this.form.get(field);
    return !!control?.hasError(error) && !!control.touched;
  }
}
