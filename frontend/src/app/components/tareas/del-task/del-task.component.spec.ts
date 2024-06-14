import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelTaskComponent } from './del-task.component';

describe('DelTaskComponent', () => {
  let component: DelTaskComponent;
  let fixture: ComponentFixture<DelTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DelTaskComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DelTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
