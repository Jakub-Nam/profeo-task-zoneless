import { computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { combineLatest, EMPTY, pipe, switchMap, tap, catchError, of } from 'rxjs';
import { PostsService } from '../data/posts.service';
import type { IPost, IUser, IComment } from '../models';

interface PostDetailsState {
  post: IPost | null;
  author: IUser | null;
  comments: IComment[];
  loading: boolean;
  error: string | null;
}

const initialState: PostDetailsState = {
  post: null,
  author: null,
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
            switchMap(([post, comments]) =>
              postsService.getUserById(post.userId).pipe(
                tap((author) => 
                  patchState(store, { 
                    post, 
                    author, 
                    comments, 
                    loading: false 
                  })
                ),
                catchError((error) => {
                  patchState(store, { 
                    error: 'Failed to load post details', 
                    loading: false 
                  });
                  return EMPTY;
                })
              )
            )
          )
        )
      )
    ),

    reset: () => patchState(store, initialState),
  })),
  withComputed((state) => ({
    hasData: computed(() => 
      state.post() !== null && 
      state.author() !== null
    ),
  }))
);
