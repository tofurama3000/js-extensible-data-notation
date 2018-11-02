"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.preprocess = function (str) { return removeComments(str).trim(); };
function removeComments(str) {
    var newStr = '';
    var inQuotes = false;
    var inComment = false;
    var skip = false;
    for (var _i = 0, str_1 = str; _i < str_1.length; _i++) {
        var c = str_1[_i];
        if (skip) {
            newStr += c;
            skip = false;
        }
        else if (c === ';' && !inQuotes) {
            inComment = true;
        }
        else if (c === '\n') {
            newStr += '\n';
            inComment = false;
        }
        else if (!inComment) {
            newStr += c;
            if (c === '\\')
                skip = true;
            else if (c === '"')
                inQuotes = !inQuotes;
        }
    }
    return newStr;
}
//# sourceMappingURL=preprocessor.js.map