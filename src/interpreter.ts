import { parse } from './grammar';
import { keyword, map, set, symbol, tag } from './types';
import { flatMap } from 'tofu-js/dist/arrays';
import { isArray } from 'tofu-js/dist/is';

export const Edn = {
  parse: (str: string) => processTokens(parse(str))
};

function processTokens(tokens: any[] | boolean) {
  if (!isArray(tokens)) {
    throw 'Invalid EDN string';
  }
  return tokens.filter(t => t && t.type !== 'discard').map(processToken);
}

function processToken(token: any): any {
  const { data, type, tag } = token;
  switch (type) {
    case 'double':
      return parseFloat(data);
    case 'int':
      return parseInt(data);
    case 'string':
    case 'char':
      return data;
    case 'keyword':
      return keyword(data);
    case 'symbol':
      return symbol(data);
    case 'boolean':
      return data === 'true';
    case 'tag':
      return processTag(tag, data);
    case 'list':
    case 'vector':
      return processTokens(data);
    case 'set':
      return set(processTokens(data));
    case 'map':
      return map(flatMap(processTokens, data));
  }
  return null;
}

function processTag(tagName: string, data: any) {
  return tag(tagName, processToken(data));
}