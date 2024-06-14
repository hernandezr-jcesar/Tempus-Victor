import { TestBed } from '@angular/core/testing';

import { AudioOnceService } from './audio-once.service';

describe('AudioOnceService', () => {
  let service: AudioOnceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AudioOnceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
