"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("./types");
var arrays_1 = require("tofu-js/dist/arrays");
var is_1 = require("tofu-js/dist/is");
var strings_1 = require("./strings");
function processTokens(tokens) {
    if (!is_1.isArray(tokens)) {
        throw 'Invalid EDN string';
    }
    return tokens.filter(function (t) { return t && t.type !== 'discard'; }).map(processToken);
}
exports.processTokens = processTokens;
function processToken(token) {
    var data = token.data, type = token.type, tag = token.tag;
    switch (type) {
        case 'double':
            return parseFloat(data);
        case 'int':
            return parseInt(data);
        case 'string':
            return strings_1.unescapeStr(data);
        case 'char':
            return data;
        case 'keyword':
            return types_1.keyword(data);
        case 'symbol':
            return types_1.symbol(data);
        case 'boolean':
            return data === 'true';
        case 'tag':
            return processTag(tag, data);
        case 'list':
        case 'vector':
            return processTokens(data);
        case 'set':
            return types_1.set(processTokens(data));
        case 'map':
            return types_1.map(arrays_1.flatMap(processTokens, data));
    }
    return null;
}
function processTag(tagName, data) {
    return types_1.tag(tagName, processToken(data));
}
//# sourceMappingURL=interpreter.js.map