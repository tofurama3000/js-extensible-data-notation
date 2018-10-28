import '@babel/polyfill';
import { Edn } from './interpreter';
import { EdnMap, EdnSet, keyword, map, set, symbol, tag } from './types';

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

  it('can parse maps', () => {
    const parsed = Edn.parse('{4 5, [6 7] [9 10]}')[0] as EdnMap;
    expect(parsed).toEqual(map([4, 5, [6, 7], [9, 10]]));
    expect(parsed.get(4)).toBe(5);
    expect(parsed.get([6, 7])).toEqual([9, 10]);
    expect(parsed.get('bob')).toBeNull();
  });

  it('can parse complicated maps', () => {
    const parsed = Edn.parse('{4 5, [6 7] [9 10] "harry" {:surname "Potter"}}')[0] as EdnMap;
    expect(parsed).toEqual(
      map([4, 5, [6, 7], [9, 10], 'harry', map([keyword('surname'), 'Potter'])])
    );
    expect(parsed.get(4)).toBe(5);
    expect(parsed.get([6, 7])).toEqual([9, 10]);
    expect(parsed.get('bob')).toBeNull();
  });

  it('can parse sets', () => {
    const parsed = Edn.parse('#{4 5,bob [6 7] [9 10] #{1 2}}')[0] as EdnSet;
    expect(parsed).toEqual(set([4, 5, symbol('bob'), [6, 7], [9, 10], set([1, 2])]));
    expect(parsed.has(4)).toBe(true);
    expect(parsed.has([6, 7])).toBe(true);
    expect(parsed.has('bob')).toBe(false);
    expect(parsed.has(symbol('bob'))).toBe(true);
  });

  it('can parse tags', () => {
    const parsed = Edn.parse('#inst "1985-04-12T23:20:50.52Z"')[0] as EdnSet;
    expect(parsed).toEqual(tag('inst', '1985-04-12T23:20:50.52Z'));
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
