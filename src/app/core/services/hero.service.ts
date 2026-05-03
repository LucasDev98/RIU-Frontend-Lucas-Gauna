import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CreateHeroDto,
  Hero,
  HeroPageParams,
  HeroPaginatedResponse,
  UpdateHeroDto,
} from '../models/hero.model';

@Injectable({ providedIn: 'root' })
export class HeroService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/heroes';

  getAll(params: HeroPageParams): Observable<HeroPaginatedResponse> {
    let httpParams = new HttpParams()
      .set('_page', params.page)
      .set('_per_page', params.perPage);

    if (params.name) {
      httpParams = httpParams.set('name_like', params.name);
    }

    return this.http.get<HeroPaginatedResponse>(this.baseUrl, { params: httpParams });
  }

  getById(id: string): Observable<Hero> {
    return this.http.get<Hero>(`${this.baseUrl}/${id}`);
  }

  create(dto: CreateHeroDto): Observable<Hero> {
    return this.http.post<Hero>(this.baseUrl, dto);
  }

  update(id: string, dto: UpdateHeroDto): Observable<Hero> {
    return this.http.patch<Hero>(`${this.baseUrl}/${id}`, dto);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
