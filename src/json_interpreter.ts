import { chunk, flatMap, fromPairs, map } from 'tofu-js/dist/arrays';
import { isArray } from 'tofu-js/dist/is';
import { unescapeStr } from './strings';

export function processTokens(tokens: any[] | boolean) {
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
      return unescapeStr(data);
    case 'char':
      return data;
    case 'keyword':
      return data;
    case 'symbol':
      return data;
    case 'boolean':
    case 'bool':
      return data === 'true' || data === true;
    case 'tag':
      return { tag, value: processToken(data) };
    case 'list':
    case 'vector':
      return processTokens(data);
    case 'set':
      return fromPairs(map(t => [t, t], processTokens(data)));
    case 'map':
      return fromPairs(chunk(2, flatMap(processTokens, data)) as any);
  }
  return null;
}
