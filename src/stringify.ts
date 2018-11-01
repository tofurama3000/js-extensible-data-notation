import { pipe } from 'tofu-js/dist/fp';
import { collectToArray, flatten as iflatten, map as imap } from 'tofu-js/dist/iterators';
import { join, map as amap } from 'tofu-js/dist/arrays';
import { EdnKeyword, EdnMap, EdnSet, EdnSymbol, EdnTag, type } from './types';
import { entries } from 'tofu-js/dist/objects';

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

function stringifyMap(data: EdnMap | object) {
  return (
    '{' +
    pipe(
      entries(data),
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
