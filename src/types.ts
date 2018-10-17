export class EdnKeyword {
  constructor(private keyword: string) {
    if (this.keyword[0] === ':') {
      this.keyword = this.keyword.substr(1);
    }
  }
}

export const keyword = (str: string) => new EdnKeyword(str);

export class EdnSymbol {
  constructor(private symbol: string) {}
}

export class EdnTag {
  constructor(private tag: string, private data: any) {}
}

export const symbol = (str: string) => new EdnSymbol(str);

export const set = (_data: any) => new Set([]);
export const map = (_data: any) => new Map([]);
export const tag = (tag, data) => new EdnTag(tag, data);
