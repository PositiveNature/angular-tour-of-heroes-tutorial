import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Hero } from './hero';
import { MessageService } from './message.service';
import { HEROES } from './mock-heroes';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  constructor(
    private http: HttpClient,
    private messageService: MessageService,
  ) { }

  getHeroes(): Observable<Hero[]> {
    // const heroes = of(HEROES);
    // this.messagesService.add('HeroService: Fetched heroes')
    this.log('Fetched heroes')
    return this.http.get<Hero[]>(this.heroesUrl)
    .pipe(
        tap(_ => this.log('fetched heroes')),
        catchError(this.handleError<Hero[]>('getHeroes', []))
      );
    // return heroes;
  }

  getHero(id: number): Observable<Hero> {
    const hero = HEROES.find(h => h.id === id)!;
    // this.messagesService.add(`HeroService: fetched hero id=${id}`);
    this.log(`fetched hero id=${id}`);
    return of(hero);
  }

  private handleError<T>(operation = 'operation', result?: T)
  {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    }
  }

  private heroesUrl = 'api/heroes'
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
}
