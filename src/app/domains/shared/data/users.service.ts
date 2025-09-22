import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, shareReplay } from 'rxjs';
import { API_CONFIG } from '../../../tokens/api.tokens';
import { IUser } from '../models';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly http = inject(HttpClient);
  private readonly apiConfig = inject(API_CONFIG);
  private users$: Observable<IUser[]> | null = null;

  public getUsers(): Observable<IUser[]> {
    if (!this.users$) {
      this.users$ = this.http.get<IUser[]>(this.apiConfig.users).pipe(shareReplay(1));
    }
    return this.users$;
  }

  public getUserById(id: number): Observable<IUser | undefined> {
    return new Observable((observer) => {
      this.getUsers().subscribe({
        next: (users) => {
          const user = users.find((u) => u.id === id);
          observer.next(user);
          observer.complete();
        },
        error: (error) => observer.error(error),
      });
    });
  }
}
