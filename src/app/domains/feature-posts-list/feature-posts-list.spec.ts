import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturePostsList } from './feature-posts-list';

describe('FeaturePostsList', () => {
  let component: FeaturePostsList;
  let fixture: ComponentFixture<FeaturePostsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturePostsList],
    }).compileComponents();

    fixture = TestBed.createComponent(FeaturePostsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
