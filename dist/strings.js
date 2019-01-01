"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function unescapeChar(str) {
    if (!str.length) {
        return '\\';
    }
    var char = str[0];
    var rest = str.substr(1);
    switch (char.toLowerCase()) {
        case 'n':
            return "\n" + rest;
        case 'r':
            return "\r" + rest;
        case 't':
            return "\t" + rest;
        case '\\':
            return "\\" + rest;
        case "'":
            return "'" + rest;
        case '"':
            return "\"" + rest;
        case 'b':
            return "\b" + rest;
        case 'f':
            return "\f" + rest;
        /// TODO: Unescape unicode characters
        default:
            return str;
    }
}
exports.unescapeChar = unescapeChar;
function unescapeStr(str) {
    var parts = str.split('\\');
    return parts.map(function (p, i) { return (i ? unescapeChar(p) : p); }).join('');
}
exports.unescapeStr = unescapeStr;
//# sourceMappingURL=strings.js.map