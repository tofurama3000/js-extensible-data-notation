import { parse } from './grammar';
import { processTokens as correctProcess } from './interpreter';
import { stringify } from './stringify';
import { processTokens as jsonProcess } from './json_interpreter';
import * as types from './types';

export default {
  parse: (str: string) => correctProcess(parse(str)),
  parseJson: (str: string) => jsonProcess(parse(str)),
  stringify,
  types
};
