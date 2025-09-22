import { ChangeDetectionStrategy, Component, output, signal, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IUser } from '../../../shared/models/user.interface';

@Component({
  selector: 'app-filters',
  imports: [FormsModule],
  templateUrl: './filters.html',
  styleUrl: './filters.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Filters {
  // Input for users list
  public readonly users = input<IUser[]>([]);

  // Filters for content search and user selection
  protected readonly filterText = signal('');
  protected readonly userIdFilter = signal<number | null>(null);
  protected readonly showOnlyFavorites = signal(false);

  // Outputs for filter changes
  public readonly filterChange = output<string>();
  public readonly userIdFilterChange = output<number | null>();
  public readonly showOnlyFavoritesChange = output<boolean>();

  protected onFilterChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    this.filterText.set(value);
    this.filterChange.emit(value);
  }

  protected onUserIdFilterChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const value = target.value ? parseInt(target.value, 10) : null;
    this.userIdFilter.set(value);
    this.userIdFilterChange.emit(value);
  }

  protected clearFilter(): void {
    this.filterText.set('');
    this.filterChange.emit('');
  }

  protected clearUserFilter(): void {
    this.userIdFilter.set(null);
    this.userIdFilterChange.emit(null);
  }

  protected onShowOnlyFavoritesChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.checked;
    this.showOnlyFavorites.set(value);
    this.showOnlyFavoritesChange.emit(value);
  }
}
