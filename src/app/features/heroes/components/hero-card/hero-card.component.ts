import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DEFAULT_HERO_IMAGE, Hero, HeroUniverse } from '../../../../core/models/hero.model';

const UNIVERSE_CLASS_MAP: Record<HeroUniverse, string> = {
  Marvel: 'universe-marvel',
  DC: 'universe-dc',
  Other: 'universe-other',
};

@Component({
  selector: 'app-hero-card',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatChipsModule, MatTooltipModule, NgOptimizedImage],
  templateUrl: './hero-card.component.html',
  styleUrl: './hero-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroCardComponent {
  readonly hero = input.required<Hero>();
  readonly view = output<Hero>();
  readonly edit = output<Hero>();
  readonly delete = output<Hero>();

  readonly universeClass = computed(() => UNIVERSE_CLASS_MAP[this.hero().universe]);

  private readonly imageLoadFailed = signal(false);

  /** Falls back to the local placeholder if the remote URL fails to load. */
  readonly imageSrc = computed(() =>
    this.imageLoadFailed() || !this.hero().imageUrl
      ? DEFAULT_HERO_IMAGE
      : this.hero().imageUrl!
  );

  onImageError(): void {
    this.imageLoadFailed.set(true);
  }
}
