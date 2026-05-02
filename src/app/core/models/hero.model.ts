export type HeroUniverse = 'Marvel' | 'DC' | 'Other';

export interface Hero {
  readonly id: string;
  name: string;
  alias: string;
  power: string;
  universe: HeroUniverse;
  imageUrl: string;
  readonly createdAt: string;
  updatedAt: string;
}

export type CreateHeroDto = Omit<Hero, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateHeroDto = Partial<CreateHeroDto>;

export const HERO_UNIVERSES: HeroUniverse[] = ['Marvel', 'DC', 'Other'];
