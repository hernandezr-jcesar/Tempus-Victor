import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EisenhowerTasksComponent } from './eisenhower-tasks.component';

describe('EisenhowerTasksComponent', () => {
  let component: EisenhowerTasksComponent;
  let fixture: ComponentFixture<EisenhowerTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EisenhowerTasksComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EisenhowerTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
