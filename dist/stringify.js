"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fp_1 = require("tofu-js/dist/fp");
var iterators_1 = require("tofu-js/dist/iterators");
var arrays_1 = require("tofu-js/dist/arrays");
var types_1 = require("./types");
var objects_1 = require("tofu-js/dist/objects");
exports.stringify = function (data) {
    var typeOf = types_1.type(data);
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
        fp_1.pipe(objects_1.entries(data), iterators_1.flatten, iterators_1.map(exports.stringify), iterators_1.collectToArray, arrays_1.join(' ')) +
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
//# sourceMappingURL=stringify.js.map