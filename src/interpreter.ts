import { parse } from './grammar';
import { EdnTag, keyword, map, set, symbol, tag } from './types';

export const Edn = {
  parse: (str: string) => processTokens(parse(str))
};

console.log(
  JSON.stringify(
    Edn.parse(`[hello world](12 23.4M 3N {1 3,
     1 2 3 4} 12.3)#{3 4 3}#_ 4 "Hola" \\c
     ; Comment
     #inst "1985-04-12T23:20:50.52Z" #uuid "f81d4fae-7dec-11d0-a765-00a0c91e6bf6"
`)
  )
);

function processTokens(tokens: any[]) {
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
      return set(data);
    case 'map':
      return map(data);
  }
  return null;
}

function processTag(tagName: string, data: any) {
  return tag(tagName, processToken(data));
}
