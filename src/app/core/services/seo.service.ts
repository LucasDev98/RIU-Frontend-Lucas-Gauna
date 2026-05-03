import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export interface SeoConfig {
  title: string;
  description?: string;
  /** Canonical URL for the page — important for prerendered/SSG routes. */
  canonicalUrl?: string;
}

const APP_NAME = 'HeroApp';

/**
 * Centralises all SEO concerns: <title>, <meta description>, and
 * Open Graph tags so every route contributes correctly to search
 * indexing and social sharing previews.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);

  setPage(config: SeoConfig): void {
    const fullTitle = config.title ? `${config.title} | ${APP_NAME}` : APP_NAME;

    this.titleService.setTitle(fullTitle);

    if (config.description) {
      this.metaService.updateTag({ name: 'description', content: config.description });
      this.metaService.updateTag({ property: 'og:description', content: config.description });
    }

    this.metaService.updateTag({ property: 'og:title', content: fullTitle });

    if (config.canonicalUrl) {
      this.metaService.updateTag({ property: 'og:url', content: config.canonicalUrl });
    }
  }
}
