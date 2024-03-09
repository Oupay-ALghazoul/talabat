import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsiteInfoComponent } from './profile-edit.component';

describe('ProfileEditComponent', () => {
  let component: WebsiteInfoComponent;
  let fixture: ComponentFixture<WebsiteInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebsiteInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebsiteInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
