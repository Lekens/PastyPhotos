import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRoutesComponent } from './admin-routes.component';

describe('AdminRoutesComponent', () => {
  let component: AdminRoutesComponent;
  let fixture: ComponentFixture<AdminRoutesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminRoutesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminRoutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
