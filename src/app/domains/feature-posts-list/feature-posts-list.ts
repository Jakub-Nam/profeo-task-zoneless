import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { PostsService, Post } from '../shared/posts.service';

@Component({
  selector: 'app-feature-posts-list',
  imports: [],
  templateUrl: './feature-posts-list.html',
  styleUrl: './feature-posts-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeaturePostsList implements OnInit {
  private readonly postsService = inject(PostsService);
  protected readonly posts = signal<Post[]>([]);

  public ngOnInit(): void {
    this.postsService.getPosts().subscribe({
      next: (posts) => {
        console.log('Pobrane posty:', posts);
        this.posts.set(posts);
      },
      error: (error) => {
        console.error('Błąd podczas pobierania postów:', error);
      },
    });
  }
}
