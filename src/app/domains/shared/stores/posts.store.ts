import { computed, inject, effect } from '@angular/core';
import { signalStore, withState, withMethods, withComputed, patchState, withHooks } from '@ngrx/signals';
import { PostsService } from '../data/posts.service';
import { IPost } from '../models/post.interface';
import { IUser } from '../models/user.interface';
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
  lastFetchTime: number | null;
  lastUserIdFilter: number | null;
}

const POSTS_CACHE_KEY = 'posts_cache';
const FAVORITES_KEY = 'favorite_posts';
const CACHE_EXPIRY = 5 * 60 * 1000;

// SessionStorage for posts cache
const saveToSessionStorage = <T>(key: string, data: T): void => {
  try {
    sessionStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to sessionStorage:', error);
  }
};

const loadFromSessionStorage = <T>(key: string): T | null => {
  try {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Failed to load from sessionStorage:', error);
    return null;
  }
};

// LocalStorage for favorites (persistent)
const saveToLocalStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

const loadFromLocalStorage = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return null;
  }
};

const shouldRefreshCache = (
  lastFetchTime: number | null,
  currentUserFilter: number | null,
  cachedUserFilter: number | null
): boolean => {
  if (!lastFetchTime) return true;
  if (currentUserFilter !== cachedUserFilter) return true;
  if (Date.now() - lastFetchTime > CACHE_EXPIRY) return true;
  return false;
};

// Initial state with sessionStorage data
const getInitialState = (): PostsState => {
  const cachedData = loadFromSessionStorage<{
    posts: IPost[];
    lastFetchTime: number;
    lastUserIdFilter: number | null;
  }>(POSTS_CACHE_KEY);

  const favoritePosts = loadFromLocalStorage<number[]>(FAVORITES_KEY) || [];

  return {
    posts: cachedData?.posts || [],
    loading: false,
    error: null,
    contentFilter: '',
    userIdFilter: cachedData?.lastUserIdFilter || null,
    favoritePosts,
    showOnlyFavorites: false,
    lastFetchTime: cachedData?.lastFetchTime || null,
    lastUserIdFilter: cachedData?.lastUserIdFilter || null,
  };
};

export const PostsStore = signalStore(
  { providedIn: 'root' },
  withState<PostsState>(getInitialState),
  withComputed((store) => ({
    filteredPosts: computed(() => {
      let posts = store.posts();

      // Note: userId filtering is done at API level via getPostsByUser(userId)
      // No need for local filtering by userId here

      // Filter by content if set
      const contentFilter = store.contentFilter().toLowerCase();
      if (contentFilter) {
        posts = posts.filter(
          (post) =>
            post.title.toLowerCase().includes(contentFilter) ||
            post.body.toLowerCase().includes(contentFilter)
        );
      }

      // Filter favorites if enabled
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
              const now = Date.now();
              patchState(store, {
                posts,
                loading: false,
                userIdFilter: userId,
                lastFetchTime: now,
                lastUserIdFilter: userId,
              });

              // Save to sessionStorage
              saveToSessionStorage(POSTS_CACHE_KEY, {
                posts,
                lastFetchTime: now,
                lastUserIdFilter: userId,
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

      // Content filter methods
      setContentFilter: (filter: string) => {
        patchState(store, { contentFilter: filter });
      },

      clearContentFilter: () => {
        patchState(store, { contentFilter: '' });
      },

      // User filter methods
      setUserIdFilter: (userId: number | null) => {
        const shouldRefresh = shouldRefreshCache(
          store.lastFetchTime(),
          userId,
          store.lastUserIdFilter()
        );

        if (shouldRefresh) {
          patchState(store, { userIdFilter: userId });
          loadPosts(userId);
        } else {
          // Just update the filter without API call
          patchState(store, { userIdFilter: userId });
        }
      },
      clearUserIdFilter: () => {
        const shouldRefresh = shouldRefreshCache(
          store.lastFetchTime(),
          null,
          store.lastUserIdFilter()
        );

        if (shouldRefresh) {
          patchState(store, { userIdFilter: null });
          loadPosts(null);
        } else {
          patchState(store, { userIdFilter: null });
        }
      },

      // Favorites methods
      toggleFavorite: (postId: number) => {
        const favorites = store.favoritePosts();
        const isFavorite = favorites.includes(postId);

        const newFavorites = isFavorite
          ? favorites.filter((id) => id !== postId)
          : [...favorites, postId];

        patchState(store, { favoritePosts: newFavorites });
        // Side effect handled by effect() below
      },

      setShowOnlyFavorites: (show: boolean) => {
        patchState(store, { showOnlyFavorites: show });
      },

      // Initialize store
      init: () => {
        const shouldRefresh = shouldRefreshCache(
          store.lastFetchTime(),
          store.userIdFilter(),
          store.lastUserIdFilter()
        );

        if (shouldRefresh) {
          loadPosts(store.userIdFilter());
        }
      },
    };
  }),

  // Hooks for lifecycle and effects
  withHooks({
    onInit(store) {
      // Auto-save favorites to localStorage on every change
      effect(() => {
        const favorites = store.favoritePosts();
        saveToLocalStorage(FAVORITES_KEY, favorites);
      });
    }
  })
);
