import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../../tokens/api.tokens';
import { IPost, IUser, IComment } from '../models';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private readonly http = inject(HttpClient);
  private readonly apiConfig = inject(API_CONFIG);

  public getPosts(): Observable<IPost[]> {
    return this.http.get<IPost[]>(this.apiConfig.posts);
  }

  public getPostsByUser(userId: number): Observable<IPost[]> {
    return this.http.get<IPost[]>(`${this.apiConfig.posts}?userId=${userId}`);
  }

  public getUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(this.apiConfig.users);
  }

  public getPostById(id: number): Observable<IPost> {
    return this.http.get<IPost>(`${this.apiConfig.posts}/${id}`);
  }

  public getUserById(id: number): Observable<IUser> {
    return this.http.get<IUser>(`${this.apiConfig.users}/${id}`);
  }

  public getPostComments(postId: number): Observable<IComment[]> {
    return this.http.get<IComment[]>(`${this.apiConfig.posts}/${postId}/comments`);
  }
}
