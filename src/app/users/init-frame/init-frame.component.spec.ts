import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InitFrameComponent } from './init-frame.component';

describe('InitFrameComponent', () => {
  let component: InitFrameComponent;
  let fixture: ComponentFixture<InitFrameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitFrameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
