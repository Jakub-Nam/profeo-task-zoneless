import { DestroyRef, inject, Injectable, InjectionToken, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, shareReplay, takeUntil } from 'rxjs';
import { API_CONFIG } from '../../../tokens/api.tokens';
import { IUser } from '../models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly http = inject(HttpClient);
  private readonly apiConfig = inject(API_CONFIG);
  private readonly destroyRef = inject(DestroyRef);

  public getUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(this.apiConfig.users).pipe(takeUntilDestroyed(this.destroyRef));
  }

  public getUserById(id: number): Observable<IUser | undefined> {
    return new Observable((observer) => {
      this.getUsers()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
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
