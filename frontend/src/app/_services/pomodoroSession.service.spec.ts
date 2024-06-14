import { TestBed } from '@angular/core/testing';

import { PomodoroSessionService } from './pomodoroSession.service';

describe('PomodoroSessionService', () => {
  let service: PomodoroSessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PomodoroSessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
