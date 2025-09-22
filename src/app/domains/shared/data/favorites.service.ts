import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private readonly _favoritePostIds = signal<number[]>([]);
  public readonly favoritePostIds = this._favoritePostIds.asReadonly();

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
  }

  public getFavoriteIds(): number[] {
    return this._favoritePostIds();
  }
}
