import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  input,
  effect,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PostDetailsStore } from '../shared/stores/post-details.store';

@Component({
  selector: 'app-feature-post-details',
  imports: [CommonModule, RouterLink],
  templateUrl: './feature-post-details.html',
  styleUrl: './feature-post-details.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeaturePostDetails implements OnDestroy {
  private readonly router = inject(Router);
  private readonly postDetailsStore = inject(PostDetailsStore);

  readonly id = input<string>();

  constructor() {
    effect(() => {
      const postId = Number(this.id());
      if (postId && !isNaN(postId)) {
        this.postDetailsStore.loadPostDetails(postId);
      } else if (this.id() !== undefined) {
        this.router.navigate(['/']);
      }
    });
  }

  ngOnDestroy(): void {
    this.postDetailsStore.reset();
  }

  protected getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  protected get post() {
    return this.postDetailsStore.post;
  }
  protected get author() {
    return this.postDetailsStore.author;
  }
  protected get comments() {
    return this.postDetailsStore.comments;
  }
  protected get loading() {
    return this.postDetailsStore.loading;
  }
  protected get error() {
    return this.postDetailsStore.error;
  }
  protected get hasData() {
    return this.postDetailsStore.hasData;
  }
}
