import { stringify } from './stringify';
import { keyword, map, set, symbol, tag } from './types';

describe('stringify', () => {
  it('can stringify numbers', () => {
    expect(stringify(1)).toEqual('1');
    expect(stringify(12.4)).toEqual('12.4');
  });

  it('can stringify strings', () => {
    expect(stringify('')).toEqual('""');
    expect(stringify('hello World')).toEqual('"hello World"');
    expect(stringify('hello "World')).toEqual('"hello \\"World"');
  });

  it('can stringify maps', () => {
    expect(stringify({ hello: 'world' })).toEqual('{"hello" "world"}');
    expect(stringify(map([symbol('hello'), 'world']))).toEqual('{hello "world"}');
  });

  it('can stringify sets', () => {
    expect(stringify(set([symbol('hello'), 'world']))).toEqual('#{hello "world"}');
    expect(stringify(set([3, 3, symbol('hello'), 'world']))).toEqual('#{3 hello "world"}');
  });

  it('can stringify tags', () => {
    expect(stringify(tag('inst', '1985-04-12T23:20:50.52Z'))).toEqual(
      '#inst "1985-04-12T23:20:50.52Z"'
    );
    expect(stringify(tag('my/date', '1995-04-12T23:20:50.52Z'))).toEqual(
      '#my/date "1995-04-12T23:20:50.52Z"'
    );
  });

  it('can stringify symbols', () => {
    expect(stringify(symbol('hello/world'))).toEqual('hello/world');
    expect(stringify(symbol('def'))).toEqual('def');
  });

  it('can stringify keywords', () => {
    expect(stringify(keyword(':def'))).toEqual(':def');
    expect(stringify(keyword('hello/world'))).toEqual(':hello/world');
  });

  it('can stringify vectors', () => {
    expect(stringify([keyword(':def'), 2, 2, 4])).toEqual('[:def 2 2 4]');
  });

  it('can stringify nil', () => {
    expect(stringify(null)).toEqual('nil');
    expect(stringify(undefined)).toEqual('nil');
  });
});
