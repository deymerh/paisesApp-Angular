import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, map, tap } from 'rxjs';
import { Country } from '../interfaces/country.interface';
import { CacheStore } from '../interfaces/cache-store.interface';
import { Region } from '../interfaces/region.type';

const BASE_URL = 'https://restcountries.com/v3.1'

@Injectable()
export class CountriesService {

  public cacheStore: CacheStore = {
    byCapital: { term: '', countries: [] },
    byCountries: { term: '', countries: [] },
    byRegion: { region: '', countries: [] },
  }

  constructor(private readonly http: HttpClient) {
    this.loadFromLocalStorage();
  }

  private saveToLocalStorage() {
    window.localStorage.setItem('cacheStore', JSON.stringify(this.cacheStore));
  }

  private loadFromLocalStorage() {
    if (!window.localStorage.getItem('cacheStore')) return;
    this.cacheStore = JSON.parse(window.localStorage.getItem('cacheStore')!);
  }

  private getCountryRequest(api: string, term: string): Observable<Country[]> {
    return this.http.get<Country[]>(`${BASE_URL}/${api}/${term}`)
      .pipe(
        catchError(() => of([])),
      );
  }

  searchCountryByAlphaCode(code: string): Observable<Country | null> {
    return this.http.get<Country[]>(`${BASE_URL}/alpha/${code}`)
      .pipe(
        map(countries => countries.length > 0 ? countries[0] : null),
        catchError(() => of(null))
      );
  }

  searchCapital(term: string): Observable<Country[]> {
    return this.getCountryRequest('capital', term)
      .pipe(
        tap((countries) => this.cacheStore.byCapital = { term, countries }),
        tap(() => this.saveToLocalStorage())
      );
  }

  searchCountry(term: string): Observable<Country[]> {
    return this.getCountryRequest('name', term)
      .pipe(
        tap((countries) => this.cacheStore.byCountries = { term, countries }),
        tap(() => this.saveToLocalStorage())
      )
  }

  searchRegion(region: Region): Observable<Country[]> {
    return this.getCountryRequest('region', region)
      .pipe(
        tap((countries) => this.cacheStore.byRegion = { region, countries }),
        tap(() => this.saveToLocalStorage())
      )
  }
}
