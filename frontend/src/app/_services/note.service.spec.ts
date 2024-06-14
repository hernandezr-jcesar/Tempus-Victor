import { TestBed } from '@angular/core/testing';

import { NoteService } from './note.service';

describe('NotsService', () => {
  let service: NoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NoteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
