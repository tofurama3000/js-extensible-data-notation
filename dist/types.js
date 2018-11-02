"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var is_1 = require("tofu-js/dist/is");
var arrays_1 = require("tofu-js/dist/arrays");
var iterators_1 = require("tofu-js/dist/iterators");
var fp_1 = require("tofu-js/dist/fp");
var EdnKeyword = /** @class */ (function () {
    function EdnKeyword(keyword) {
        this._keyword = '';
        this.keyword = keyword;
    }
    Object.defineProperty(EdnKeyword.prototype, "keyword", {
        get: function () {
            return this._keyword;
        },
        set: function (keyword) {
            if (keyword[0] === ':') {
                keyword = keyword.substr(1);
            }
            this._keyword = keyword;
        },
        enumerable: true,
        configurable: true
    });
    return EdnKeyword;
}());
exports.EdnKeyword = EdnKeyword;
var EdnSymbol = /** @class */ (function () {
    function EdnSymbol(symbol) {
        this.symbol = symbol;
    }
    return EdnSymbol;
}());
exports.EdnSymbol = EdnSymbol;
var EdnTag = /** @class */ (function () {
    function EdnTag(tag, data) {
        this.data = data;
        if (is_1.isString(tag))
            this.tag = new EdnSymbol(tag);
        else
            this.tag = tag;
    }
    return EdnTag;
}());
exports.EdnTag = EdnTag;
var AnyKeyMap = /** @class */ (function () {
    function AnyKeyMap(data) {
        this.data = new Map();
        this.data = new Map(fp_1.pipe(data, arrays_1.chunk(2), arrays_1.map(function (_a) {
            var key = _a[0], value = _a[1];
            return [toKey(key), { key: key, value: value }];
        })));
    }
    AnyKeyMap.prototype.get = function (key) {
        var k = toKey(key);
        if (this.data.has(k)) {
            return this.data.get(k).value;
        }
        else {
            return null;
        }
    };
    AnyKeyMap.prototype.has = function (key) {
        return this.data.has(toKey(key));
    };
    AnyKeyMap.prototype.set = function (key, value) {
        this.data.set(toKey(key), { key: key, value: value });
    };
    AnyKeyMap.prototype.keys = function () {
        return iterators_1.map(function (_a) {
            var key = _a.key;
            return key;
        }, this.data.values());
    };
    AnyKeyMap.prototype.values = function () {
        return iterators_1.map(function (_a) {
            var value = _a.value;
            return value;
        }, this.data.values());
    };
    AnyKeyMap.prototype.delete = function (key) {
        return this.data.delete(toKey(key));
    };
    AnyKeyMap.prototype.clear = function () {
        this.data.clear();
    };
    AnyKeyMap.prototype[Symbol.iterator] = function () {
        return this.entries();
    };
    AnyKeyMap.prototype.entries = function () {
        return iterators_1.map(function (_a) {
            var key = _a.key, value = _a.value;
            return [key, value];
        }, this.data.values());
    };
    return AnyKeyMap;
}());
var EdnMap = /** @class */ (function () {
    function EdnMap(data) {
        var _this = this;
        this.has = function (key) { return _this.data.has(key); };
        this.clear = function () { return _this.data.clear(); };
        this.delete = function (key) { return _this.data.delete(key); };
        this.entries = function () { return _this.data.entries(); };
        this.get = function (key) { return _this.data.get(key); };
        this.keys = function () { return _this.data.keys(); };
        this.set = function (key, value) { return _this.data.set(key, value); };
        this.values = function () { return _this.data.values(); };
        this[Symbol.iterator] = function () { return _this.data[Symbol.iterator](); };
        this.data = new AnyKeyMap(data);
    }
    return EdnMap;
}());
exports.EdnMap = EdnMap;
var EdnSet = /** @class */ (function () {
    function EdnSet(data) {
        var _this = this;
        this.add = function (elem) { return _this.data.set(elem, elem); };
        this.clear = function () { return _this.data.clear(); };
        this.has = function (elem) { return _this.data.has(elem); };
        this.delete = function (elem) { return _this.data.delete(elem); };
        this.entries = function () { return _this.data.entries(); };
        this.values = function () { return _this.data.values(); };
        this[Symbol.iterator] = function () { return _this.data[Symbol.iterator](); };
        this.data = new AnyKeyMap(fp_1.pipe(data, arrays_1.map(function (d) { return [d, d]; }), arrays_1.flatten));
    }
    return EdnSet;
}());
exports.EdnSet = EdnSet;
function toKey(input) {
    return type(input) + '#' + toString(input);
}
function toString(input) {
    if (is_1.isNil(input)) {
        return 'null';
    }
    return JSON.stringify(input);
}
function type(input) {
    if (is_1.isNil(input)) {
        return 'Nil';
    }
    else if (is_1.isNumber(input)) {
        return 'Number';
    }
    else if (is_1.isString(input)) {
        return 'String';
    }
    else if (input instanceof EdnTag) {
        return 'Tag';
    }
    else if (input instanceof EdnSymbol) {
        return 'Symbol';
    }
    else if (input instanceof EdnKeyword) {
        return 'Keyword';
    }
    else if (input instanceof EdnSet) {
        return 'Set';
    }
    else if (is_1.isArray(input)) {
        return 'Vector';
    }
    else if (is_1.isObject(input) || input instanceof EdnMap) {
        return 'Map';
    }
    else {
        return 'Other';
    }
}
exports.type = type;
exports.keyword = function (str) { return new EdnKeyword(str); };
exports.symbol = function (str) { return new EdnSymbol(str); };
exports.set = function (data) { return new EdnSet(data); };
exports.map = function (data) { return new EdnMap(data); };
exports.tag = function (tag, data) { return new EdnTag(tag, data); };
exports.stringify = function (data) {
    var typeOf = type(data);
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
function stringifyMap(data) {
    return ('{' +
        fp_1.pipe(data.entries(), iterators_1.flatten, iterators_1.map(exports.stringify), iterators_1.collectToArray, arrays_1.join(' ')) +
        '}');
}
function stringifySet(data) {
    return ('#{' +
        fp_1.pipe(data.values(), iterators_1.map(exports.stringify), iterators_1.collectToArray, arrays_1.join(' ')) +
        '}');
}
function stringifyTag(data) {
    return '#' + data.tag.symbol + ' ' + exports.stringify(data.data);
}
function stringifySymbol(data) {
    return data.symbol;
}
function stringifyKeyword(data) {
    return ':' + data.keyword;
}
function stringifyVector(data) {
    return '[' + arrays_1.map(exports.stringify, data).join(' ') + ']';
}
//# sourceMappingURL=types.js.map