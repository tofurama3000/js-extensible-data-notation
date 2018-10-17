import { preprocess } from './preprocessor';

describe('preprocessor', () => {
  it('trims a string', () => {
    const str = '    a   ';
    expect(preprocess(str)).toBe('a');
  });

  it('removes comments', () => {
    const str = '; hello\nworld';
    expect(preprocess(str)).toEqual('world');
  });

  it('leaves strings alone', () => {
    const str = '"Hello ; World"';
    expect(preprocess(str)).toEqual(str);
  });

  it('can handle complex strings', () => {
    const str = '"Hello ; World" how ; ar you\n to; day"\n; my\npre"cious;;;;"';
    expect(preprocess(str)).toEqual('"Hello ; World" how \n to\n\npre"cious;;;;"');
  });
});
