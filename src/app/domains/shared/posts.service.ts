import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../tokens/api.tokens';
import { IPost } from './models/post.interface';
import { IUser } from './models/user.interface';

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
}
