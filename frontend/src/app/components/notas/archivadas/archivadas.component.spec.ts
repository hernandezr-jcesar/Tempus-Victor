import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivadasComponent } from './archivadas.component';

describe('ArchivadasComponent', () => {
  let component: ArchivadasComponent;
  let fixture: ComponentFixture<ArchivadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArchivadasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArchivadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
