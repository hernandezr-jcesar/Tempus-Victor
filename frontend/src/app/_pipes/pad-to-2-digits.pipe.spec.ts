import { PadTo2DigitsPipe } from './pad-to-2-digits.pipe';

describe('PadTo2DigitsPipe', () => {
  it('create an instance', () => {
    const pipe = new PadTo2DigitsPipe();
    expect(pipe).toBeTruthy();
  });
});
