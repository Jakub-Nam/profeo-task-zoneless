import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { PostsStore } from '../shared/stores/posts.store';
import { UsersStore } from '../shared/stores/users.store';
import { Filters } from './internal/filters/filters';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-feature-posts-list',
  imports: [Filters, RouterLink],
  templateUrl: './feature-posts-list.html',
  styleUrl: './feature-posts-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeaturePostsList implements OnInit {
  private readonly postsStore = inject(PostsStore);
  private readonly usersStore = inject(UsersStore);
  private readonly router = inject(Router);

  public ngOnInit(): void {
    this.postsStore.init(); // Store will now load both users and posts
  }

  // Delegate to store methods
  protected onContentFilterChange(filter: string): void {
    this.postsStore.setContentFilter(filter);
  }

  protected onUserIdFilterChange(userId: number | null): void {
    this.postsStore.setUserIdFilter(userId);
  }

  protected onShowOnlyFavoritesChange(showOnlyFavorites: boolean): void {
    this.postsStore.setShowOnlyFavorites(showOnlyFavorites);
  }

  protected onToggleFavorite(postId: number): void {
    this.postsStore.toggleFavorite(postId);
  }

  protected isPostFavorite(postId: number): boolean {
    return this.postsStore.isPostFavorite()(postId);
  }

  protected onPostClick(postId: number): void {
    this.router.navigate(['/posts', postId]);
  }

  // Expose store signals to template
  protected get posts() {
    return this.postsStore.filteredPosts;
  }
  protected get loading() {
    return this.postsStore.loading;
  }
  protected get error() {
    return this.postsStore.error;
  }
  protected get users() {
    return this.usersStore.users;
  }

  // Expose filter values from store
  protected get contentFilter() {
    return this.postsStore.contentFilter;
  }
  protected get userIdFilter() {
    return this.postsStore.userIdFilter;
  }
  protected get showOnlyFavorites() {
    return this.postsStore.showOnlyFavorites;
  }
}
