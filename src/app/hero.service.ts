import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/observable';
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { MessagesService } from './messages.service';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';

@Injectable()
export class HeroService {

	private heroesUrl = 'api/heroes';

  constructor( private http: HttpClient, private messagesService: MessagesService ) { }

  private log( message: string ): void {
  	this.messagesService.add('HeroService: '+ message);
  }

  /**
	 * Handle Http operation that failed.
	 * Let the app continue.
	 * @param operation - name of the operation that failed
	 * @param result - optional value to return as the observable result
	 */
	private handleError<T> (operation = 'operation', result?: T) {
	  return (error: any): Observable<T> => {

	    // TODO: send the error to remote logging infrastructure
	    console.error(error); // log to console instead

	    // TODO: better job of transforming error for user consumption
	    this.log(`${operation} failed: ${error.message}`);

	    // Let the app keep running by returning an empty result.
	    return of(result as T);
	  };
	}

  getHeroes(): Observable<Hero[]> {

  	return this.http.get<Hero[]>(this.heroesUrl)
  		.pipe(
  			tap(heroes => this.log('fetched heroes')),
  			catchError( this.handleError('getHeroes', []))
  		);

  }

  getHero( id: number ): Observable<Hero> {
  	
  	const url = `${this.heroesUrl}/${id}`;

  	return this.http.get<Hero>(url)
  		.pipe(
  			tap( _ => this.log(`fetched hero id=${id}`)),
  			catchError(this.handleError<Hero>(`getHero Id=${id}`))
  		);

  }

  updateHero( hero: Hero ): Observable<any> {

  	const httpOptions = {
  		headers: new HttpHeaders({'content-type': 'application/json'})
  	};

  	return this.http.put(this.heroesUrl, hero, httpOptions).pipe(
  		tap( _ => this.log(`updated hero id=${hero.id}`)),
  		catchError(this.handleError<any>('updateHero'))
  	);

  }

  addHero( hero: Hero ): Observable<Hero> {

  	const httpOptions = {
  		headers: new HttpHeaders({'content-type': 'application/json'})
  	};

  	return this.http.post(this.heroesUrl, hero, httpOptions)
  		.pipe(
  			tap( (hero: Hero) => this.log(`added hero w/ id=${hero.id}`)),
  			catchError(this.handleError<Hero>('addHero'))
  		);

  }

  deleteHero( hero: Hero | number ): Observable<any> {

  	const id = typeof hero === 'number'  ? hero : hero.id;
  	const url = `${this.heroesUrl}/${id}`;

  	return this.http.delete(url,hero)
  		.pipe(
  			tap( _ => this.log(`deleted hero id=${id}`) ),
  			catchError(this.handleError<any>('deleteHero'))
  		);

  }

  searchHeroes( term: string ): Observable<Hero[]> {

  	if(!term.trim()) {
  		return of([]);
  	}

  	return this.http.get(`${this.heroesUrl}/?name=${term}`).pipe(
  			tap( _ => this.log(`found heroes matching "${term}"`)),
  			catchError(this.handleError<Hero[]>('searchHero'))
  		);

  }
}
