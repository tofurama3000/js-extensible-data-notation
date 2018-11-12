"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var grammar_1 = require("./grammar");
var interpreter_1 = require("./interpreter");
var stringify_1 = require("./stringify");
var json_interpreter_1 = require("./json_interpreter");
var types = __importStar(require("./types"));
exports.Edn = {
    parse: function (str) { return interpreter_1.processTokens(grammar_1.parse(str)); },
    parseJson: function (str) { return json_interpreter_1.processTokens(grammar_1.parse(str)); },
    stringify: stringify_1.stringify,
    types: types
};
//# sourceMappingURL=index.js.map