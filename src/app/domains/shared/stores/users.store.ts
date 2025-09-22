import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState, withHooks } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, catchError, EMPTY } from 'rxjs';
import { UsersService } from '../data/users.service';
import type { IUser } from '../models';

interface UsersState {
  users: IUser[];
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
};

export const UsersStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, usersService = inject(UsersService)) => ({
    loadUsers: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(() =>
          usersService.getUsers().pipe(
            tap((users) => patchState(store, { users, loading: false })),
            catchError((error) => {
              patchState(store, { error: 'Failed to load users', loading: false });
              return EMPTY;
            })
          )
        )
      )
    ),
  })),
  withHooks({
    onInit({ loadUsers }) {
      loadUsers();
    },
  })
);
