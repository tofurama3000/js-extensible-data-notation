import { parse } from './grammar';
import { processTokens } from './interpreter';
import { stringify } from './stringify';

export const Edn = {
  parse: (str: string) => processTokens(parse(str)),
  stringify
};
