import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeeTaskComponent } from './see-task.component';

describe('SeeTaskComponent', () => {
  let component: SeeTaskComponent;
  let fixture: ComponentFixture<SeeTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SeeTaskComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SeeTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
