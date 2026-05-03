import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Hero, HeroPaginatedResponse } from '../models';
import { HeroService } from '.';

const mockHero: Hero = {
  id: '1',
  name: 'SPIDERMAN',
  alias: 'Peter Parker',
  power: 'Wall-crawling, spider-sense',
  universe: 'Marvel',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

describe('HeroService', () => {
  let service: HeroService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(HeroService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  describe('getAll', () => {
    it('should send _page and _limit as query params', () => {
      // Act
      service.getAll({ page: 1, perPage: 5 }).subscribe();

      // Assert
      const req = httpMock.expectOne(r => r.url === '/api/heroes');
      expect(req.request.params.get('_page')).toBe('1');
      expect(req.request.params.get('_limit')).toBe('5');
      req.flush([mockHero], { headers: { 'X-Total-Count': '1' } });
    });

    it('should include name_like param when name is provided', () => {
      // Act
      service.getAll({ page: 1, perPage: 5, name: 'man' }).subscribe();

      // Assert
      const req = httpMock.expectOne(r => r.url === '/api/heroes');
      expect(req.request.params.get('name_like')).toBe('man');
      req.flush([], { headers: { 'X-Total-Count': '0' } });
    });

    it('should map X-Total-Count header to items field', () => {
      // Arrange
      let result: HeroPaginatedResponse | undefined;

      // Act
      service.getAll({ page: 1, perPage: 5 }).subscribe(r => (result = r));
      httpMock
        .expectOne(r => r.url === '/api/heroes')
        .flush([mockHero, mockHero], { headers: { 'X-Total-Count': '20' } });

      // Assert
      expect(result?.items).toBe(20);
      expect(result?.data.length).toBe(2);
    });

    it('should default items to 0 when X-Total-Count header is missing', () => {
      // Arrange
      let result: HeroPaginatedResponse | undefined;

      // Act
      service.getAll({ page: 1, perPage: 5 }).subscribe(r => (result = r));
      httpMock.expectOne(r => r.url === '/api/heroes').flush([]);

      // Assert
      expect(result?.items).toBe(0);
    });
  });

  describe('getById', () => {
    it('should GET the hero with the given id', () => {
      // Arrange
      let result: Hero | undefined;

      // Act
      service.getById('1').subscribe(r => (result = r));
      httpMock.expectOne('/api/heroes/1').flush(mockHero);

      // Assert
      expect(result?.name).toBe('SPIDERMAN');
    });
  });

  describe('create', () => {
    it('should POST with the hero data', () => {
      // Arrange
      const dto = { name: 'HULK', alias: 'Bruce Banner', power: 'Strength', universe: 'Marvel' as const };

      // Act
      service.create(dto).subscribe();
      const req = httpMock.expectOne('/api/heroes');

      // Assert
      expect(req.request.method).toBe('POST');
      expect(req.request.body.name).toBe('HULK');
      req.flush({ ...dto, id: '21', createdAt: '', updatedAt: '' });
    });
  });

  describe('update', () => {
    it('should PATCH only the changed fields', () => {
      // Arrange
      const changes = { name: 'SPIDERMAN 2099' };

      // Act
      service.update('1', changes).subscribe();
      const req = httpMock.expectOne('/api/heroes/1');

      // Assert
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body.name).toBe('SPIDERMAN 2099');
      req.flush({ ...mockHero, ...changes });
    });
  });

  describe('remove', () => {
    it('should DELETE the hero with the given id', () => {
      // Act
      service.remove('1').subscribe();
      const req = httpMock.expectOne('/api/heroes/1');

      // Assert
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });
});
