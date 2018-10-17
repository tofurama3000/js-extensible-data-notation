import { Edn } from './interpreter';
import { keyword, symbol, tag } from './types';

describe('Edn.parse', () => {
  it('can parse symbols', () => {
    expect(Edn.parse('hello world')).toEqual([symbol('hello'), symbol('world')]);
  });

  it('can parse keywords', () => {
    expect(Edn.parse(':hello :world')).toEqual([keyword('hello'), keyword('world')]);
  });

  it('can parse numbers', () => {
    expect(Edn.parse('1 2 23.4')).toEqual([1, 2, 23.4]);
  });

  it('can parse strings', () => {
    expect(Edn.parse('"Hello" "World"')).toEqual(['Hello', 'World']);
  });

  it('can parse characters', () => {
    expect(Edn.parse('\\h \\W')).toEqual(['h', 'W']);
  });

  it('can parse discard', () => {
    expect(Edn.parse('#_h #_ W')).toEqual([]);
  });

  it('can parse something complicated', () => {
    expect(
      Edn.parse(`[hello world](12 23.4M 3N 12.3)#_ 4 "Hola" \\c
     ; Comment
     #inst "1985-04-12T23:20:50.52Z" #uuid "f81d4fae-7dec-11d0-a765-00a0c91e6bf6"
`)
    ).toEqual([
      [symbol('hello'), symbol('world')],
      [12, 23.4, 3, 12.3],
      'Hola',
      'c',
      tag('inst', '1985-04-12T23:20:50.52Z'),
      tag('uuid', 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6')
    ]);
  });
});
