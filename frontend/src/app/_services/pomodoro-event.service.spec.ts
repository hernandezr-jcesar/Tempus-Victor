import { TestBed } from '@angular/core/testing';

import { PomodoroEventService } from './pomodoro-event.service';

describe('PomodoroEventService', () => {
  let service: PomodoroEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PomodoroEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
