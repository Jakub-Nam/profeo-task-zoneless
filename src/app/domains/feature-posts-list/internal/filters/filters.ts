import { ChangeDetectionStrategy, Component, output, input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { IUser } from '../../../shared/models/user.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface IFiltersForm {
  contentFilter: FormControl<string>;
  userIdFilter: FormControl<number | null>;
  showOnlyFavorites: FormControl<boolean>;
}

@Component({
  selector: 'app-filters',
  imports: [ReactiveFormsModule],
  templateUrl: './filters.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Filters implements OnInit {
  private readonly fb = inject(FormBuilder);

  public readonly users = input<IUser[]>([]);
  public readonly contentFilter = input<string>('');
  public readonly userIdValue = input<number | null>(null);
  public readonly showFavoritesValue = input<boolean>(false);

  public readonly filterChange = output<string>();
  public readonly userIdFilterChange = output<number | null>();
  public readonly showOnlyFavoritesChange = output<boolean>();

  public filtersForm: FormGroup<IFiltersForm>;

  constructor() {
    this.filtersForm = this.fb.group<IFiltersForm>({
      contentFilter: this.fb.control('', { nonNullable: true }),
      userIdFilter: this.fb.control<number | null>(null),
      showOnlyFavorites: this.fb.control(false, { nonNullable: true }),
    });
  }

  ngOnInit(): void {
    this.filtersForm.patchValue({
      contentFilter: this.contentFilter(),
      userIdFilter: this.userIdValue(),
      showOnlyFavorites: this.showFavoritesValue(),
    });

    this.filtersForm
      .get('contentFilter')
      ?.valueChanges.pipe(takeUntilDestroyed())
      .subscribe((value: string) => this.filterChange.emit(value));

    this.filtersForm
      .get('userIdFilter')
      ?.valueChanges.pipe(takeUntilDestroyed())
      .subscribe((value: number | null) => this.userIdFilterChange.emit(value));

    this.filtersForm
      .get('showOnlyFavorites')
      ?.valueChanges.pipe(takeUntilDestroyed())
      .subscribe((value: boolean) => this.showOnlyFavoritesChange.emit(value));
  }

  protected clearFilter(): void {
    this.filtersForm.patchValue({ contentFilter: '' });
  }

  protected clearUserFilter(): void {
    this.filtersForm.patchValue({ userIdFilter: null });
  }
}
