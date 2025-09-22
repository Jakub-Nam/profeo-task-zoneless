import { ChangeDetectionStrategy, Component, output, input } from '@angular/core';
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
  public readonly users = input<IUser[]>([]);

  // Input values from store
  public readonly contentFilter = input<string>('');
  public readonly userIdValue = input<number | null>(null);
  public readonly showFavoritesValue = input<boolean>(false);

  public readonly filterChange = output<string>();
  public readonly userIdFilterChange = output<number | null>();
  public readonly showOnlyFavoritesChange = output<boolean>();

  protected onFilterChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    this.filterChange.emit(value);
  }

  protected onUserIdFilterChange(value: string | number): void {
    const userId = typeof value === 'string' ? (value ? parseInt(value, 10) : null) : value;
    this.userIdFilterChange.emit(userId);
  }

  protected clearFilter(): void {
    this.filterChange.emit('');
  }

  protected clearUserFilter(): void {
    this.userIdFilterChange.emit(null);
  }

  protected onShowOnlyFavoritesChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.checked;
    this.showOnlyFavoritesChange.emit(value);
  }
}
