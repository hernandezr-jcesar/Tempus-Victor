import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeeNotesComponent } from './see-notes.component';

describe('SeeNotesComponent', () => {
  let component: SeeNotesComponent;
  let fixture: ComponentFixture<SeeNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SeeNotesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SeeNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
