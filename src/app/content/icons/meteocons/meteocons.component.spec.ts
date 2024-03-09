import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeteoconsComponent } from './meteocons.component';

describe('MeteoconsComponent', () => {
  let component: MeteoconsComponent;
  let fixture: ComponentFixture<MeteoconsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeteoconsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeteoconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
