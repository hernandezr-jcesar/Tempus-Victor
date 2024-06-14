import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelNotesComponent } from './del-notes.component';

describe('DelNotesComponent', () => {
  let component: DelNotesComponent;
  let fixture: ComponentFixture<DelNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DelNotesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DelNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
