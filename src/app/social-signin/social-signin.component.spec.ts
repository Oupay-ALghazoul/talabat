import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialSigninComponent } from './social-signin.component';

describe('SocialSigninComponent', () => {
  let component: SocialSigninComponent;
  let fixture: ComponentFixture<SocialSigninComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SocialSigninComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialSigninComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
