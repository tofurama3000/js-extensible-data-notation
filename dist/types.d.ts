export declare class EdnKeyword {
    private _keyword;
    constructor(keyword: string);
    keyword: string;
}
export declare class EdnSymbol {
    symbol: string;
    constructor(symbol: string);
}
export declare class EdnTag {
    data: any;
    tag: EdnSymbol;
    constructor(tag: string | EdnSymbol, data: any);
}
export declare class EdnMap {
    private data;
    constructor(data: any[]);
    has: (key: any) => boolean;
    clear: () => void;
    delete: (key: any) => boolean;
    entries: () => IterableIterator<any>;
    get: (key: any) => any;
    keys: () => IterableIterator<any>;
    set: (key: any, value: any) => void;
    values: () => IterableIterator<any>;
    [Symbol.iterator]: () => IterableIterator<any>;
}
export declare class EdnSet {
    private data;
    constructor(data: any[]);
    add: (elem: any) => void;
    clear: () => void;
    has: (elem: any) => boolean;
    delete: (elem: any) => boolean;
    entries: () => IterableIterator<any>;
    values: () => IterableIterator<any>;
    [Symbol.iterator]: () => IterableIterator<any>;
}
export declare function type(input: any): "Number" | "Symbol" | "Keyword" | "Tag" | "Vector" | "String" | "Map" | "Set" | "Nil" | "Other";
export declare const keyword: (str: string) => EdnKeyword;
export declare const symbol: (str: string) => EdnSymbol;
export declare const set: (data: any[]) => EdnSet;
export declare const map: (data: any[]) => EdnMap;
export declare const tag: (tag: any, data: any) => EdnTag;
export declare const stringify: (data: any) => any;
