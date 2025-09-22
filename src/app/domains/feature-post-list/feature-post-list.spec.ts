import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturePostList } from './feature-post-list';

describe('FeaturePostList', () => {
  let component: FeaturePostList;
  let fixture: ComponentFixture<FeaturePostList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturePostList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeaturePostList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
