import { chunk, flatMap, fromPairs, map } from 'tofu-js/dist/arrays';
import { isArray } from 'tofu-js/dist/is';

export function processTokens(tokens: any[] | boolean) {
  if (!isArray(tokens)) {
    throw 'Invalid EDN string';
  }
  return tokens.filter(t => t && t.type !== 'discard').map(processToken);
}

function unescapeChar(str: string): string {
  if (!str.length) {
    return '\\';
  }
  const char = str[0];
  const rest = str.substr(1);
  switch (char.toLowerCase()) {
    case 'n':
      return `\n${rest}`;
    case 'r':
      return `\r${rest}`;
    case 't':
      return `\t${rest}`;
    case '\\':
      return `\\${rest}`;
    case "'":
      return `\'${rest}`;
    case '"':
      return `"${rest}`;
    case 'b':
      return `\b${rest}`;
    case 'f':
      return `\f${rest}`;
    default:
      return str;
  }
}

function unescapeStr(str: string): string {
  const parts = str.split('\\');
  return parts.map((p, i) => (i ? unescapeChar(p) : p)).join('');
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
      return data === 'true';
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
