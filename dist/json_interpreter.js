"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
            return data;
        case 'symbol':
            return data;
        case 'boolean':
            return data === 'true';
        case 'tag':
            return { tag: tag, value: processToken(data) };
        case 'list':
        case 'vector':
            return processTokens(data);
        case 'set':
            return arrays_1.fromPairs(arrays_1.map(function (t) { return [t, t]; }, processTokens(data)));
        case 'map':
            return arrays_1.fromPairs(arrays_1.chunk(2, arrays_1.flatMap(processTokens, data)));
    }
    return null;
}
//# sourceMappingURL=json_interpreter.js.map