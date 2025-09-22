import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { POSTS_API_URL } from '../../tokens/api.tokens';

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private readonly http = inject(HttpClient);
  private readonly postsApiUrl = inject(POSTS_API_URL);

  public getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.postsApiUrl);
  }
}
