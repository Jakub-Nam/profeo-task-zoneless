import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private readonly FAVORITES_KEY = 'favorite_posts';
  private readonly _favoritePostIds = signal<number[]>(this.loadFromStorage());
  public readonly favoritePostIds = this._favoritePostIds.asReadonly();

  public constructor() {
    this.favoritePostIds().forEach(() => {
      this.saveToStorage();
    });
  }

  public isPostFavorite(postId: number): boolean {
    return this._favoritePostIds().includes(postId);
  }

  public toggleFavorite(postId: number): void {
    const currentFavorites = this._favoritePostIds();
    const isFavorite = currentFavorites.includes(postId);

    if (isFavorite) {
      this._favoritePostIds.set(currentFavorites.filter((id) => id !== postId));
    } else {
      this._favoritePostIds.set([...currentFavorites, postId]);
    }

    this.saveToStorage();
  }

  public getFavoriteIds(): number[] {
    return this._favoritePostIds();
  }

  private loadFromStorage(): number[] {
    try {
      const stored = localStorage.getItem(this.FAVORITES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading favorites from storage:', error);
      return [];
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(this._favoritePostIds()));
    } catch (error) {
      console.error('Error saving favorites to storage:', error);
    }
  }
}
