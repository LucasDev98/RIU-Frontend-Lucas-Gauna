import { TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { SeoService } from './seo.service';

describe('SeoService', () => {
  let service: SeoService;
  let titleService: Title;
  let metaService: Meta;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SeoService, Title, Meta],
    });

    service = TestBed.inject(SeoService);
    titleService = TestBed.inject(Title);
    metaService = TestBed.inject(Meta);

    // Meta tags persist in JSDOM across tests — clean up to keep each test isolated.
    metaService.removeTag('name="description"');
    metaService.removeTag('property="og:description"');
    metaService.removeTag('property="og:url"');
    metaService.removeTag('property="og:title"');
  });

  it('should be created', () => {
    // Assert
    expect(service).toBeTruthy();
  });

  it('should set the page title with the app name suffix', () => {
    // Act
    service.setPage({ title: 'Heroes' });

    // Assert
    expect(titleService.getTitle()).toBe('Heroes | HeroApp');
  });

  it('should set og:title meta tag', () => {
    // Act
    service.setPage({ title: 'Spider-Man' });

    // Assert
    const ogTitle = metaService.getTag('property="og:title"');
    expect(ogTitle?.content).toBe('Spider-Man | HeroApp');
  });

  it('should set description and og:description when provided', () => {
    // Arrange
    const description = 'Friendly neighborhood hero with spider powers';

    // Act
    service.setPage({ title: 'Spider-Man', description });

    // Assert
    expect(metaService.getTag('name="description"')?.content).toBe(description);
    expect(metaService.getTag('property="og:description"')?.content).toBe(description);
  });

  it('should not set description tags when description is omitted', () => {
    // Act
    service.setPage({ title: 'Heroes' });

    // Assert
    expect(metaService.getTag('name="description"')).toBeNull();
  });

  it('should set og:url when canonicalUrl is provided', () => {
    // Arrange
    const canonicalUrl = 'https://heroapp.com/heroes';

    // Act
    service.setPage({ title: 'Heroes', canonicalUrl });

    // Assert
    expect(metaService.getTag('property="og:url"')?.content).toBe(canonicalUrl);
  });
});
