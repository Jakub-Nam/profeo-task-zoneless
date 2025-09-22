import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { POSTS_API_URL } from '../../tokens/api.tokens';
import { IPost } from './models/post.interface';
import { IUser } from './models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private readonly http = inject(HttpClient);
  private readonly postsApiUrl = inject(POSTS_API_URL);

  public getPosts(): Observable<IPost[]> {
    return this.http.get<IPost[]>(this.postsApiUrl);
  }

  public getPostsByUser(userId: number): Observable<IPost[]> {
    return this.http.get<IPost[]>(`${this.postsApiUrl}?userId=${userId}`);
  }

  public getUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>('https://jsonplaceholder.typicode.com/users');
  }
}
