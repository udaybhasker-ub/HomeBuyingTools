import { NegativePolarityPipe } from './negative-polarity.pipe';

describe('NegativePolarityPipe', () => {
  it('create an instance', () => {
    const pipe = new NegativePolarityPipe();
    expect(pipe).toBeTruthy();
  });
});
