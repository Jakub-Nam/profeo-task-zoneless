import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { combineLatest, EMPTY, pipe, switchMap, tap, catchError, of, map } from 'rxjs';
import { PostsService } from '../data/posts.service';
import { UsersStore } from './users.store';
import type { IPost, IUser, IComment } from '../models';

interface PostDetailsState {
  post: IPost | null;
  comments: IComment[];
  loading: boolean;
  error: string | null;
}

const initialState: PostDetailsState = {
  post: null,
  comments: [],
  loading: false,
  error: null,
};

export const PostDetailsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, postsService = inject(PostsService)) => ({
    loadPostDetails: rxMethod<number>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((postId) =>
          combineLatest([
            postsService.getPostById(postId),
            postsService.getPostComments(postId),
          ]).pipe(
            tap(([post, comments]) =>
              patchState(store, {
                post,
                comments,
                loading: false,
              })
            ),
            catchError((error) => {
              patchState(store, {
                error: 'Failed to load post details',
                loading: false,
              });
              return EMPTY;
            })
          )
        )
      )
    ),

    reset: () => patchState(store, initialState),
  })),
  withComputed((state, usersStore = inject(UsersStore)) => ({
    author: computed(() => {
      const post = state.post();
      const users = usersStore.users();
      return post ? users.find((user: IUser) => user.id === post.userId) || null : null;
    }),
    hasData: computed(() => state.post() !== null),
  }))
);
