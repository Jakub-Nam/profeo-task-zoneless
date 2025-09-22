import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  computed,
} from '@angular/core';
import { PostsService } from '../shared/data/posts.service';
import { IPost } from '../shared/models/post.interface';
import { IUser } from '../shared/models/user.interface';
import { Filters } from './internal/filters/filters';
import { FavoritesService } from '../shared/data/favorites.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-feature-posts-list',
  imports: [Filters],
  templateUrl: './feature-posts-list.html',
  styleUrl: './feature-posts-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeaturePostsList implements OnInit {
  private readonly postsService = inject(PostsService);
  private readonly favoritesService = inject(FavoritesService);
  private readonly router = inject(Router);

  protected readonly posts = signal<IPost[]>([]);
  protected readonly users = signal<IUser[]>([]);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly contentFilter = signal('');
  protected readonly userIdFilter = signal<number | null>(null);
  protected readonly showOnlyFavorites = signal(false);

  // Computed filtered posts
  protected readonly filteredPosts = computed(() => {
    let posts = this.posts();
    const filter = this.contentFilter().toLowerCase();

    // Filter by content if set
    if (filter) {
      posts = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(filter) || post.body.toLowerCase().includes(filter)
      );
    }

    // Filter by favorites if enabled
    if (this.showOnlyFavorites()) {
      const favoriteIds = this.favoritesService.getFavoriteIds();
      posts = posts.filter((post) => favoriteIds.includes(post.id));
    }

    return posts;
  });

  public ngOnInit(): void {
    this.loadUsers();
    this.loadPosts();
  }

  private loadUsers(): void {
    this.postsService.getUsers().subscribe({
      next: (users) => {
        this.users.set(users);
      },
      error: (error) => {
        console.error('Error loading users:', error);
      },
    });
  }

  private loadPosts(): void {
    this.loading.set(true);
    this.error.set(null);

    const userId = this.userIdFilter();
    const apiCall = userId
      ? this.postsService.getPostsByUser(userId)
      : this.postsService.getPosts();

    apiCall.subscribe({
      next: (posts) => {
        this.posts.set(posts);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading posts:', error);
        this.error.set('Failed to load posts');
        this.loading.set(false);
      },
    });
  }

  protected onContentFilterChange(filter: string): void {
    this.contentFilter.set(filter);
  }

  protected onUserIdFilterChange(userId: number | null): void {
    this.userIdFilter.set(userId);
    // Reload posts with new user filter
    this.loadPosts();
  }

  protected onShowOnlyFavoritesChange(showOnlyFavorites: boolean): void {
    this.showOnlyFavorites.set(showOnlyFavorites);
  }

  protected onToggleFavorite(postId: number): void {
    this.favoritesService.toggleFavorite(postId);
  }

  protected isPostFavorite(postId: number): boolean {
    return this.favoritesService.isPostFavorite(postId);
  }

  protected onPostClick(postId: number): void {
    this.router.navigate(['/post', postId]);
  }
}
