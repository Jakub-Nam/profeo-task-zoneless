import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturePostDetails } from './feature-post-details';

describe('FeaturePostDetails', () => {
  let component: FeaturePostDetails;
  let fixture: ComponentFixture<FeaturePostDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturePostDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeaturePostDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
