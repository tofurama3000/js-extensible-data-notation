"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var grammar_1 = require("./grammar");
var interpreter_1 = require("./interpreter");
var stringify_1 = require("./stringify");
exports.Edn = {
    parse: function (str) { return interpreter_1.processTokens(grammar_1.parse(str)); },
    stringify: stringify_1.stringify
};
//# sourceMappingURL=index.js.map