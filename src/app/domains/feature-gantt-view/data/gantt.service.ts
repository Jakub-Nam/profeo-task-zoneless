import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { PostsService } from '../../shared/data/posts.service';
import { IGanttPost, IGanttData } from '../models/gantt.interface';
import { IPost } from '../../shared/models';

@Injectable({
  providedIn: 'root',
})
export class GanttService {
  private readonly postsService = inject(PostsService);

  public getGanttData(): Observable<IGanttData> {
    return this.postsService.getPosts().pipe(map((posts) => this.transformToGanttData(posts)));
  }

  private transformToGanttData(posts: IPost[]): IGanttData {
    const ganttPosts = posts.map((post, index) => this.createGanttPost(post, index));

    const dates = ganttPosts.map((p) => [p.startDate, p.endDate]).flat();
    const minDate = new Date(Math.min(...dates.map((d) => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())));

    const totalDays = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));

    return {
      posts: ganttPosts,
      timeline: {
        start: minDate,
        end: maxDate,
        totalDays,
      },
    };
  }

  private createGanttPost(post: IPost, index: number): IGanttPost {
    const baseDate = new Date('2025-01-01');
    const startOffset = (post.id * 3 + index) % 90;
    const duration = 7 + (post.id % 14);

    const startDate = new Date(baseDate);
    startDate.setDate(baseDate.getDate() + startOffset);

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + duration);

    const progress = Math.min(100, (post.id * 7) % 101);
    const categories: IGanttPost['category'][] = ['planning', 'development', 'review', 'completed'];
    const category = categories[post.id % categories.length];

    return {
      ...post,
      startDate,
      endDate,
      progress,
      category,
    };
  }
}
