import { MonthToWordsPipe } from './month-to-words.pipe';

describe('MonthToWordsPipe', () => {
  it('create an instance', () => {
    const pipe = new MonthToWordsPipe();
    expect(pipe).toBeTruthy();
  });
});
