import { Component, input, output, computed } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../../shared/material.imports';
import { Hero, HeroUniverse } from '../../../../core/models/hero.model';

const UNIVERSE_CLASS_MAP: Record<HeroUniverse, string> = {
  Marvel: 'universe-marvel',
  DC: 'universe-dc',
  Other: 'universe-other',
};

@Component({
  selector: 'app-hero-card',
  standalone: true,
  imports: [...MATERIAL_IMPORTS],
  templateUrl: './hero-card.component.html',
  styleUrl: './hero-card.component.scss',
})
export class HeroCardComponent {
  readonly hero = input.required<Hero>();
  readonly view = output<Hero>();
  readonly edit = output<Hero>();
  readonly delete = output<Hero>();

  readonly universeClass = computed(() => UNIVERSE_CLASS_MAP[this.hero().universe]);
}
