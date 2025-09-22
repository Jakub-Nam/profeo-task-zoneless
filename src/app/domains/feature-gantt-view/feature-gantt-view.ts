import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { GanttService } from './services/gantt.service';
import { IGanttData, IGanttPost } from './models/gantt.interface';

@Component({
  selector: 'app-feature-gantt-view',
  imports: [CommonModule, RouterLink],
  templateUrl: './feature-gantt-view.html',
  styleUrl: './feature-gantt-view.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureGanttView {
  private readonly ganttService = inject(GanttService);

  protected ganttData = toSignal(this.ganttService.getGanttData());

  protected getCategoryColor(category: IGanttPost['category']): string {
    const colors = {
      planning: '#fbbf24', // yellow-400
      development: '#3b82f6', // blue-500
      review: '#f59e0b', // amber-500
      completed: '#10b981', // emerald-500
    };
    return colors[category];
  }

  protected getProgressColor(progress: number): string {
    if (progress >= 80) return '#10b981'; // green
    if (progress >= 50) return '#f59e0b'; // amber
    if (progress >= 20) return '#3b82f6'; // blue
    return '#ef4444'; // red
  }

  protected getDayPosition(date: Date, timeline: IGanttData['timeline']): number {
    const daysDiff = Math.floor(
      (date.getTime() - timeline.start.getTime()) / (1000 * 60 * 60 * 24)
    );
    return (daysDiff / timeline.totalDays) * 100;
  }

  protected getDuration(post: IGanttPost, timeline: IGanttData['timeline']): number {
    const duration = Math.floor(
      (post.endDate.getTime() - post.startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return (duration / timeline.totalDays) * 100;
  }

  protected formatDate(date: Date): string {
    return date.toLocaleDateString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  protected formatDateShort(date: Date): string {
    return date.toLocaleDateString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
    });
  }

  protected shouldShowSeparateDates(post: IGanttPost, timeline: IGanttData['timeline']): boolean {
    return this.getDuration(post, timeline) > 12; // Show separate dates if duration > 12% of timeline
  }
}
