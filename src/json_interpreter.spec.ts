import '@babel/polyfill';
import { Edn } from './index';

describe('Edn.parseJson', () => {
  it('can parse symbols', () => {
    expect(Edn.parseJson('hello world')).toEqual(['hello', 'world']);
  });

  it('can parse keywords', () => {
    expect(Edn.parseJson(':hello :world')).toEqual([':hello', ':world']);
  });

  it('can parse numbers', () => {
    expect(Edn.parseJson('1 2 23.4')).toEqual([1, 2, 23.4]);
  });

  it('can parse strings', () => {
    expect(Edn.parseJson('"Hello" "World"')).toEqual(['Hello', 'World']);
  });

  it('can parse characters', () => {
    expect(Edn.parseJson('\\h \\W')).toEqual(['h', 'W']);
  });

  it('can parse discard', () => {
    expect(Edn.parseJson('#_h #_ W')).toEqual([]);
  });

  it('can parse maps', () => {
    const parsed = Edn.parseJson('{4 5, :hello [9 10] harry potter}')[0];
    expect(parsed).toEqual({ 4: 5, ':hello': [9, 10], harry: 'potter' });
  });

  it('can parse sets', () => {
    const parsed = Edn.parseJson('#{4 5, peter pan}')[0];
    expect(parsed).toEqual({ 4: 4, 5: 5, peter: 'peter', pan: 'pan' });
  });

  it('can parse tags', () => {
    const parsed = Edn.parseJson('#inst "1985-04-12T23:20:50.52Z"')[0];
    expect(parsed).toEqual({ tag: 'inst', value: '1985-04-12T23:20:50.52Z' });
  });

  it('can parse something complicated', () => {
    expect(
      Edn.parseJson(`[hello world](12 23.4M 3N 12.3)#_ 4 "Hola" \\c
     ; Comment
     #inst "1985-04-12T23:20:50.52Z" #uuid "f81d4fae-7dec-11d0-a765-00a0c91e6bf6"
`)
    ).toEqual([
      ['hello', 'world'],
      [12, 23.4, 3, 12.3],
      'Hola',
      'c',
      { tag: 'inst', value: '1985-04-12T23:20:50.52Z' },
      { tag: 'uuid', value: 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6' }
    ]);
  });
});
