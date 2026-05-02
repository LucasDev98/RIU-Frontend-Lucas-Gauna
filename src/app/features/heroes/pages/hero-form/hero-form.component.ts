import { Component, computed, effect, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MATERIAL_IMPORTS } from '../../../../shared/material.imports';
import { UppercaseInputDirective } from '../../../../shared/directives/uppercase-input.directive';
import { HERO_MOCKS } from '../../mocks/hero.mock';
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
  imports: [...MATERIAL_IMPORTS, ReactiveFormsModule, UppercaseInputDirective],
  templateUrl: './hero-form.component.html',
  styleUrl: './hero-form.component.scss',
})
export class HeroFormComponent {
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

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

      const hero = HERO_MOCKS.find(hero => hero.id === id);
      if (!hero) return;

      this.form.patchValue({
        name: hero.name,
        alias: hero.alias,
        power: hero.power,
        universe: hero.universe,
        imageUrl: hero.imageUrl ?? '',
      });
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.router.navigate(['/heroes']);
  }

  goBack(): void {
    this.router.navigate(['/heroes']);
  }

  hasError(field: keyof HeroFormGroup, error: string): boolean {
    const control = this.form.get(field);
    return !!control?.hasError(error) && !!control.touched;
  }
}
