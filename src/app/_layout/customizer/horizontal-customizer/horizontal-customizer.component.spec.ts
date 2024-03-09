import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HorizontalCustomizerComponent } from './horizontal-customizer.component';

describe('HorizontalCustomizerComponent', () => {
  let component: HorizontalCustomizerComponent;
  let fixture: ComponentFixture<HorizontalCustomizerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HorizontalCustomizerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HorizontalCustomizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
