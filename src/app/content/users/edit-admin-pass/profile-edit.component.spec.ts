import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAdminPassComponent } from './profile-edit.component';

describe('ProfileEditComponent', () => {
  let component: EditAdminPassComponent;
  let fixture: ComponentFixture<EditAdminPassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAdminPassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAdminPassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
