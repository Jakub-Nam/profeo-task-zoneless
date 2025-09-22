import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-feature-posts-list',
  imports: [],
  templateUrl: './feature-posts-list.html',
  styleUrl: './feature-posts-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeaturePostsList {}
