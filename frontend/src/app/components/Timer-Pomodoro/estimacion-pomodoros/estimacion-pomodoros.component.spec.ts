import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstimacionPomodorosComponent } from './estimacion-pomodoros.component';

describe('EstimacionPomodorosComponent', () => {
  let component: EstimacionPomodorosComponent;
  let fixture: ComponentFixture<EstimacionPomodorosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EstimacionPomodorosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EstimacionPomodorosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
