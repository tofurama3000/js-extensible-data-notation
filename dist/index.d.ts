import * as types from './types';
export declare const Edn: {
    parse: (str: string) => any[];
    parseJson: (str: string) => any[];
    stringify: (data: any) => any;
    types: typeof types;
};
