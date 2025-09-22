import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FeaturePostsList } from './domains/feature-posts-list/feature-posts-list';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FeaturePostsList],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('profeo-task-zoneless');
}
