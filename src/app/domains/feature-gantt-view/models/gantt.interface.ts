import { IPost } from '../../shared/models';

export interface IGanttPost extends IPost {
  startDate: Date;
  endDate: Date;
  progress: number;
  category: 'planning' | 'development' | 'review' | 'completed';
}

export interface IGanttData {
  posts: IGanttPost[];
  timeline: {
    start: Date;
    end: Date;
    totalDays: number;
  };
}
