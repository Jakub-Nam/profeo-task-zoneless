import { computed, inject } from '@angular/core';
import { signalStore, withState, withMethods, withComputed, patchState } from '@ngrx/signals';
import { PostsService } from '../data/posts.service';
import { IPost } from '../models/post.interface';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, catchError, EMPTY } from 'rxjs';

export interface PostsState {
  posts: IPost[];
  loading: boolean;
  error: string | null;
  contentFilter: string;
  userIdFilter: number | null;
  favoritePosts: number[];
  showOnlyFavorites: boolean;
}

const getInitialState = (): PostsState => {
  return {
    posts: [],
    loading: false,
    error: null,
    contentFilter: '',
    userIdFilter: null,
    favoritePosts: [],
    showOnlyFavorites: false,
  };
};

export const PostsStore = signalStore(
  { providedIn: 'root' },
  withState<PostsState>(getInitialState),
  withComputed((store) => ({
    filteredPosts: computed(() => {
      let posts = store.posts();

      const contentFilter = store.contentFilter().toLowerCase();
      if (contentFilter) {
        posts = posts.filter(
          (post) =>
            post.title.toLowerCase().includes(contentFilter) ||
            post.body.toLowerCase().includes(contentFilter)
        );
      }

      if (store.showOnlyFavorites()) {
        const favorites = store.favoritePosts();
        posts = posts.filter((post) => favorites.includes(post.id));
      }

      return posts;
    }),

    isPostFavorite: computed(() => {
      const favorites = store.favoritePosts();
      return (postId: number) => favorites.includes(postId);
    }),
  })),
  withMethods((store, postsService = inject(PostsService)) => {
    const loadPosts = rxMethod<number | null>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((userId) => {
          const apiCall = userId ? postsService.getPostsByUser(userId) : postsService.getPosts();

          return apiCall.pipe(
            tap((posts) => {
              patchState(store, {
                posts,
                loading: false,
                userIdFilter: userId,
              });
            }),
            catchError((error) => {
              patchState(store, {
                loading: false,
                error: 'Failed to load posts',
              });
              console.error('Error loading posts:', error);
              return EMPTY;
            })
          );
        })
      )
    );

    return {
      loadPosts,

      setContentFilter: (filter: string) => {
        patchState(store, { contentFilter: filter });
      },

      clearContentFilter: () => {
        patchState(store, { contentFilter: '' });
      },

      setUserIdFilter: (userId: number | null) => {
        patchState(store, { userIdFilter: userId });
        loadPosts(userId);
      },
      clearUserIdFilter: () => {
        patchState(store, { userIdFilter: null });
        loadPosts(null);
      },

      toggleFavorite: (postId: number) => {
        const favorites = store.favoritePosts();
        const isFavorite = favorites.includes(postId);

        const newFavorites = isFavorite
          ? favorites.filter((id) => id !== postId)
          : [...favorites, postId];

        patchState(store, { favoritePosts: newFavorites });
      },

      setShowOnlyFavorites: (show: boolean) => {
        patchState(store, { showOnlyFavorites: show });
      },

      // Initialize store
      init: () => {
        loadPosts(store.userIdFilter());
      },
    };
  })
);
