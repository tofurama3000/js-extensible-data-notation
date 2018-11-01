import { isNil, isObject, isNumber, isString, isArray } from 'tofu-js/dist/is';
import { chunk, flatten, map as amap, join } from 'tofu-js/dist/arrays';
import { collectToArray, map as imap, flatten as iflatten } from 'tofu-js/dist/iterators';
import { pipe } from 'tofu-js/dist/fp';

export class EdnKeyword {
  private _keyword: string = '';
  constructor(keyword: string) {
    this.keyword = keyword;
  }

  public get keyword() {
    return this._keyword;
  }

  public set keyword(keyword: string) {
    if (keyword[0] === ':') {
      keyword = keyword.substr(1);
    }
    this._keyword = keyword;
  }
}

export class EdnSymbol {
  constructor(public symbol: string) {}
}

export class EdnTag {
  public tag: EdnSymbol;
  constructor(tag: string | EdnSymbol, public data: any) {
    if (isString(tag)) this.tag = new EdnSymbol(tag);
    else this.tag = tag;
  }
}

class AnyKeyMap {
  private data = new Map();

  constructor(data: any[]) {
    this.data = new Map(
      pipe(
        data,
        chunk(2),
        amap(([key, value]: any[]) => [toKey(key), { key, value }])
      )
    );
  }

  get(key: any) {
    const k = toKey(key);
    if (this.data.has(k)) {
      return this.data.get(k).value;
    } else {
      return null;
    }
  }

  has(key: any) {
    return this.data.has(toKey(key));
  }

  set(key: any, value: any) {
    this.data.set(toKey(key), { key, value });
  }

  keys() {
    return imap(({ key }) => key, this.data.values());
  }

  values() {
    return imap(({ value }) => value, this.data.values());
  }

  delete(key: any) {
    return this.data.delete(toKey(key));
  }

  clear() {
    this.data.clear();
  }

  [Symbol.iterator]() {
    return this.entries();
  }

  entries() {
    return imap(({ key, value }) => [key, value], this.data.values());
  }
}

export class EdnMap {
  private data: AnyKeyMap;
  constructor(data: any[]) {
    this.data = new AnyKeyMap(data);
  }

  has = (key: any) => this.data.has(key);
  clear = () => this.data.clear();
  delete = (key: any) => this.data.delete(key);
  entries = () => this.data.entries();
  get = (key: any) => this.data.get(key);
  keys = () => this.data.keys();
  set = (key: any, value: any) => this.data.set(key, value);
  values = () => this.data.values();
  [Symbol.iterator] = () => this.data[Symbol.iterator]();
}

export class EdnSet {
  private data: AnyKeyMap;
  constructor(data: any[]) {
    this.data = new AnyKeyMap(
      pipe(
        data,
        amap(d => [d, d]),
        flatten
      )
    );
  }

  add = (elem: any) => this.data.set(elem, elem);
  clear = () => this.data.clear();
  has = (elem: any) => this.data.has(elem);
  delete = (elem: any) => this.data.delete(elem);
  entries = () => this.data.entries();
  values = () => this.data.values();
  [Symbol.iterator] = () => this.data[Symbol.iterator]();
}

function toKey(input: any) {
  return type(input) + '#' + toString(input);
}

function toString(input: any) {
  if (isNil(input)) {
    return 'null';
  }
  return JSON.stringify(input);
}

export function type(input: any) {
  if (isNil(input)) {
    return 'Nil';
  } else if (isNumber(input)) {
    return 'Number';
  } else if (isString(input)) {
    return 'String';
  } else if (input instanceof EdnTag) {
    return 'Tag';
  } else if (input instanceof EdnSymbol) {
    return 'Symbol';
  } else if (input instanceof EdnKeyword) {
    return 'Keyword';
  } else if (input instanceof EdnSet) {
    return 'Set';
  } else if (isArray(input)) {
    return 'Vector';
  } else if (isObject(input) || input instanceof EdnMap) {
    return 'Map';
  } else {
    return 'Other';
  }
}

export const keyword = (str: string) => new EdnKeyword(str);
export const symbol = (str: string) => new EdnSymbol(str);
export const set = (data: any[]) => new EdnSet(data);
export const map = (data: any[]) => new EdnMap(data);
export const tag = (tag, data) => new EdnTag(tag, data);
export const stringify = (data: any) => {
  const typeOf = type(data);
  switch (typeOf) {
    case 'Nil':
      return 'nil';
    case 'Number':
      return '' + data;
    case 'String':
      return JSON.stringify(data);
    case 'Map':
      return stringifyMap(data);
    case 'Set':
      return stringifySet(data);
    case 'Tag':
      return stringifyTag(data);
    case 'Symbol':
      return stringifySymbol(data);
    case 'Keyword':
      return stringifyKeyword(data);
    case 'Vector':
      return stringifyVector(data);
    default:
      return '' + data;
  }
};

function stringifyMap(data: EdnMap) {
  return (
    '{' +
    pipe(
      data.entries(),
      iflatten,
      imap(stringify),
      collectToArray,
      join(' ')
    ) +
    '}'
  );
}

function stringifySet(data: EdnSet) {
  return (
    '#{' +
    pipe(
      data.values(),
      imap(stringify),
      collectToArray,
      join(' ')
    ) +
    '}'
  );
}

function stringifyTag(data: EdnTag) {
  return '#' + data.tag.symbol + ' ' + stringify(data.data);
}

function stringifySymbol(data: EdnSymbol) {
  return data.symbol;
}

function stringifyKeyword(data: EdnKeyword) {
  return ':' + data.keyword;
}

function stringifyVector(data: any[]) {
  return '[' + amap(stringify, data).join(' ') + ']';
}
