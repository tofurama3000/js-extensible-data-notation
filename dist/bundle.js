/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/nearley/lib/nearley.js":
/*!*********************************************!*\
  !*** ./node_modules/nearley/lib/nearley.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function(root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.nearley = factory();
    }
}(this, function() {

    function Rule(name, symbols, postprocess) {
        this.id = ++Rule.highestId;
        this.name = name;
        this.symbols = symbols;        // a list of literal | regex class | nonterminal
        this.postprocess = postprocess;
        return this;
    }
    Rule.highestId = 0;

    Rule.prototype.toString = function(withCursorAt) {
        function stringifySymbolSequence (e) {
            return e.literal ? JSON.stringify(e.literal) :
                   e.type ? '%' + e.type : e.toString();
        }
        var symbolSequence = (typeof withCursorAt === "undefined")
                             ? this.symbols.map(stringifySymbolSequence).join(' ')
                             : (   this.symbols.slice(0, withCursorAt).map(stringifySymbolSequence).join(' ')
                                 + " ● "
                                 + this.symbols.slice(withCursorAt).map(stringifySymbolSequence).join(' ')     );
        return this.name + " → " + symbolSequence;
    }


    // a State is a rule at a position from a given starting point in the input stream (reference)
    function State(rule, dot, reference, wantedBy) {
        this.rule = rule;
        this.dot = dot;
        this.reference = reference;
        this.data = [];
        this.wantedBy = wantedBy;
        this.isComplete = this.dot === rule.symbols.length;
    }

    State.prototype.toString = function() {
        return "{" + this.rule.toString(this.dot) + "}, from: " + (this.reference || 0);
    };

    State.prototype.nextState = function(child) {
        var state = new State(this.rule, this.dot + 1, this.reference, this.wantedBy);
        state.left = this;
        state.right = child;
        if (state.isComplete) {
            state.data = state.build();
        }
        return state;
    };

    State.prototype.build = function() {
        var children = [];
        var node = this;
        do {
            children.push(node.right.data);
            node = node.left;
        } while (node.left);
        children.reverse();
        return children;
    };

    State.prototype.finish = function() {
        if (this.rule.postprocess) {
            this.data = this.rule.postprocess(this.data, this.reference, Parser.fail);
        }
    };


    function Column(grammar, index) {
        this.grammar = grammar;
        this.index = index;
        this.states = [];
        this.wants = {}; // states indexed by the non-terminal they expect
        this.scannable = []; // list of states that expect a token
        this.completed = {}; // states that are nullable
    }


    Column.prototype.process = function(nextColumn) {
        var states = this.states;
        var wants = this.wants;
        var completed = this.completed;

        for (var w = 0; w < states.length; w++) { // nb. we push() during iteration
            var state = states[w];

            if (state.isComplete) {
                state.finish();
                if (state.data !== Parser.fail) {
                    // complete
                    var wantedBy = state.wantedBy;
                    for (var i = wantedBy.length; i--; ) { // this line is hot
                        var left = wantedBy[i];
                        this.complete(left, state);
                    }

                    // special-case nullables
                    if (state.reference === this.index) {
                        // make sure future predictors of this rule get completed.
                        var exp = state.rule.name;
                        (this.completed[exp] = this.completed[exp] || []).push(state);
                    }
                }

            } else {
                // queue scannable states
                var exp = state.rule.symbols[state.dot];
                if (typeof exp !== 'string') {
                    this.scannable.push(state);
                    continue;
                }

                // predict
                if (wants[exp]) {
                    wants[exp].push(state);

                    if (completed.hasOwnProperty(exp)) {
                        var nulls = completed[exp];
                        for (var i = 0; i < nulls.length; i++) {
                            var right = nulls[i];
                            this.complete(state, right);
                        }
                    }
                } else {
                    wants[exp] = [state];
                    this.predict(exp);
                }
            }
        }
    }

    Column.prototype.predict = function(exp) {
        var rules = this.grammar.byName[exp] || [];

        for (var i = 0; i < rules.length; i++) {
            var r = rules[i];
            var wantedBy = this.wants[exp];
            var s = new State(r, 0, this.index, wantedBy);
            this.states.push(s);
        }
    }

    Column.prototype.complete = function(left, right) {
        var copy = left.nextState(right);
        this.states.push(copy);
    }


    function Grammar(rules, start) {
        this.rules = rules;
        this.start = start || this.rules[0].name;
        var byName = this.byName = {};
        this.rules.forEach(function(rule) {
            if (!byName.hasOwnProperty(rule.name)) {
                byName[rule.name] = [];
            }
            byName[rule.name].push(rule);
        });
    }

    // So we can allow passing (rules, start) directly to Parser for backwards compatibility
    Grammar.fromCompiled = function(rules, start) {
        var lexer = rules.Lexer;
        if (rules.ParserStart) {
          start = rules.ParserStart;
          rules = rules.ParserRules;
        }
        var rules = rules.map(function (r) { return (new Rule(r.name, r.symbols, r.postprocess)); });
        var g = new Grammar(rules, start);
        g.lexer = lexer; // nb. storing lexer on Grammar is iffy, but unavoidable
        return g;
    }


    function StreamLexer() {
      this.reset("");
    }

    StreamLexer.prototype.reset = function(data, state) {
        this.buffer = data;
        this.index = 0;
        this.line = state ? state.line : 1;
        this.lastLineBreak = state ? -state.col : 0;
    }

    StreamLexer.prototype.next = function() {
        if (this.index < this.buffer.length) {
            var ch = this.buffer[this.index++];
            if (ch === '\n') {
              this.line += 1;
              this.lastLineBreak = this.index;
            }
            return {value: ch};
        }
    }

    StreamLexer.prototype.save = function() {
      return {
        line: this.line,
        col: this.index - this.lastLineBreak,
      }
    }

    StreamLexer.prototype.formatError = function(token, message) {
        // nb. this gets called after consuming the offending token,
        // so the culprit is index-1
        var buffer = this.buffer;
        if (typeof buffer === 'string') {
            var nextLineBreak = buffer.indexOf('\n', this.index);
            if (nextLineBreak === -1) nextLineBreak = buffer.length;
            var line = buffer.substring(this.lastLineBreak, nextLineBreak)
            var col = this.index - this.lastLineBreak;
            message += " at line " + this.line + " col " + col + ":\n\n";
            message += "  " + line + "\n"
            message += "  " + Array(col).join(" ") + "^"
            return message;
        } else {
            return message + " at index " + (this.index - 1);
        }
    }


    function Parser(rules, start, options) {
        if (rules instanceof Grammar) {
            var grammar = rules;
            var options = start;
        } else {
            var grammar = Grammar.fromCompiled(rules, start);
        }
        this.grammar = grammar;

        // Read options
        this.options = {
            keepHistory: false,
            lexer: grammar.lexer || new StreamLexer,
        };
        for (var key in (options || {})) {
            this.options[key] = options[key];
        }

        // Setup lexer
        this.lexer = this.options.lexer;
        this.lexerState = undefined;

        // Setup a table
        var column = new Column(grammar, 0);
        var table = this.table = [column];

        // I could be expecting anything.
        column.wants[grammar.start] = [];
        column.predict(grammar.start);
        // TODO what if start rule is nullable?
        column.process();
        this.current = 0; // token index
    }

    // create a reserved token for indicating a parse fail
    Parser.fail = {};

    Parser.prototype.feed = function(chunk) {
        var lexer = this.lexer;
        lexer.reset(chunk, this.lexerState);

        var token;
        while (token = lexer.next()) {
            // We add new states to table[current+1]
            var column = this.table[this.current];

            // GC unused states
            if (!this.options.keepHistory) {
                delete this.table[this.current - 1];
            }

            var n = this.current + 1;
            var nextColumn = new Column(this.grammar, n);
            this.table.push(nextColumn);

            // Advance all tokens that expect the symbol
            var literal = token.text !== undefined ? token.text : token.value;
            var value = lexer.constructor === StreamLexer ? token.value : token;
            var scannable = column.scannable;
            for (var w = scannable.length; w--; ) {
                var state = scannable[w];
                var expect = state.rule.symbols[state.dot];
                // Try to consume the token
                // either regex or literal
                if (expect.test ? expect.test(value) :
                    expect.type ? expect.type === token.type
                                : expect.literal === literal) {
                    // Add it
                    var next = state.nextState({data: value, token: token, isToken: true, reference: n - 1});
                    nextColumn.states.push(next);
                }
            }

            // Next, for each of the rules, we either
            // (a) complete it, and try to see if the reference row expected that
            //     rule
            // (b) predict the next nonterminal it expects by adding that
            //     nonterminal's start state
            // To prevent duplication, we also keep track of rules we have already
            // added

            nextColumn.process();

            // If needed, throw an error:
            if (nextColumn.states.length === 0) {
                // No states at all! This is not good.
                var message = this.lexer.formatError(token, "invalid syntax") + "\n";
                message += "Unexpected " + (token.type ? token.type + " token: " : "");
                message += JSON.stringify(token.value !== undefined ? token.value : token) + "\n";
                var err = new Error(message);
                err.offset = this.current;
                err.token = token;
                throw err;
            }

            // maybe save lexer state
            if (this.options.keepHistory) {
              column.lexerState = lexer.save()
            }

            this.current++;
        }
        if (column) {
          this.lexerState = lexer.save()
        }

        // Incrementally keep track of results
        this.results = this.finish();

        // Allow chaining, for whatever it's worth
        return this;
    };

    Parser.prototype.save = function() {
        var column = this.table[this.current];
        column.lexerState = this.lexerState;
        return column;
    };

    Parser.prototype.restore = function(column) {
        var index = column.index;
        this.current = index;
        this.table[index] = column;
        this.table.splice(index + 1);
        this.lexerState = column.lexerState;

        // Incrementally keep track of results
        this.results = this.finish();
    };

    // nb. deprecated: use save/restore instead!
    Parser.prototype.rewind = function(index) {
        if (!this.options.keepHistory) {
            throw new Error('set option `keepHistory` to enable rewinding')
        }
        // nb. recall column (table) indicies fall between token indicies.
        //        col 0   --   token 0   --   col 1
        this.restore(this.table[index]);
    };

    Parser.prototype.finish = function() {
        // Return the possible parsings
        var considerations = [];
        var start = this.grammar.start;
        var column = this.table[this.table.length - 1]
        column.states.forEach(function (t) {
            if (t.rule.name === start
                    && t.dot === t.rule.symbols.length
                    && t.reference === 0
                    && t.data !== Parser.fail) {
                considerations.push(t);
            }
        });
        return considerations.map(function(c) {return c.data; });
    };

    return {
        Parser: Parser,
        Grammar: Grammar,
        Rule: Rule,
    };

}));


/***/ }),

/***/ "./node_modules/tofu-js/dist/arrays/chunk.js":
/*!***************************************************!*\
  !*** ./node_modules/tofu-js/dist/arrays/chunk.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = __webpack_require__(/*! ../fp */ "./node_modules/tofu-js/dist/fp/index.js");
const toArrayOrEmpty_1 = __webpack_require__(/*! ./toArrayOrEmpty */ "./node_modules/tofu-js/dist/arrays/toArrayOrEmpty.js");
exports.chunk = fp_1.curry((size, array) => {
    const arr = toArrayOrEmpty_1.toArrayOrEmpty(array);
    const output = [];
    let chunk = [];
    for (let elem of arr) {
        if (chunk.length >= size) {
            output.push(chunk);
            chunk = [];
        }
        chunk.push(elem);
    }
    if (chunk.length) {
        output.push(chunk);
    }
    return output;
});
//# sourceMappingURL=chunk.js.map

/***/ }),

/***/ "./node_modules/tofu-js/dist/arrays/filter.js":
/*!****************************************************!*\
  !*** ./node_modules/tofu-js/dist/arrays/filter.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = __webpack_require__(/*! ../fp */ "./node_modules/tofu-js/dist/fp/index.js");
const toArrayOrEmpty_1 = __webpack_require__(/*! ./toArrayOrEmpty */ "./node_modules/tofu-js/dist/arrays/toArrayOrEmpty.js");
exports.filter = fp_1.curry((func, array) => toArrayOrEmpty_1.toArrayOrEmpty(array).filter(func));
//# sourceMappingURL=filter.js.map

/***/ }),

/***/ "./node_modules/tofu-js/dist/arrays/first.js":
/*!***************************************************!*\
  !*** ./node_modules/tofu-js/dist/arrays/first.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const firstOrNull_1 = __webpack_require__(/*! ./firstOrNull */ "./node_modules/tofu-js/dist/arrays/firstOrNull.js");
exports.first = firstOrNull_1.firstOrNull;
//# sourceMappingURL=first.js.map

/***/ }),

/***/ "./node_modules/tofu-js/dist/arrays/firstOr.js":
/*!*****************************************************!*\
  !*** ./node_modules/tofu-js/dist/arrays/firstOr.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const toArrayOrEmpty_1 = __webpack_require__(/*! ./toArrayOrEmpty */ "./node_modules/tofu-js/dist/arrays/toArrayOrEmpty.js");
const fp_1 = __webpack_require__(/*! ../fp */ "./node_modules/tofu-js/dist/fp/index.js");
exports.firstOr = fp_1.curry((defaultValue, array) => {
    const arr = toArrayOrEmpty_1.toArrayOrEmpty(array);
    return arr.length ? arr[0] : defaultValue;
});
//# sourceMappingURL=firstOr.js.map

/***/ }),

/***/ "./node_modules/tofu-js/dist/arrays/firstOrNull.js":
/*!*********************************************************!*\
  !*** ./node_modules/tofu-js/dist/arrays/firstOrNull.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const firstOr_1 = __webpack_require__(/*! ./firstOr */ "./node_modules/tofu-js/dist/arrays/firstOr.js");
exports.firstOrNull = firstOr_1.firstOr(null);
//# sourceMappingURL=firstOrNull.js.map

/***/ }),

/***/ "./node_modules/tofu-js/dist/arrays/flatMap.js":
/*!*****************************************************!*\
  !*** ./node_modules/tofu-js/dist/arrays/flatMap.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = __webpack_require__(/*! ../fp */ "./node_modules/tofu-js/dist/fp/index.js");
const toArrayOrEmpty_1 = __webpack_require__(/*! ./toArrayOrEmpty */ "./node_modules/tofu-js/dist/arrays/toArrayOrEmpty.js");
const map_1 = __webpack_require__(/*! ./map */ "./node_modules/tofu-js/dist/arrays/map.js");
const flatten_1 = __webpack_require__(/*! ./flatten */ "./node_modules/tofu-js/dist/arrays/flatten.js");
exports.flatMap = fp_1.curry((func, array) => fp_1.pipe(toArrayOrEmpty_1.toArrayOrEmpty(array), map_1.map(func), flatten_1.flatten));
//# sourceMappingURL=flatMap.js.map

/***/ }),

/***/ "./node_modules/tofu-js/dist/arrays/flatten.js":
/*!*****************************************************!*\
  !*** ./node_modules/tofu-js/dist/arrays/flatten.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = __webpack_require__(/*! ../fp */ "./node_modules/tofu-js/dist/fp/index.js");
const toArrayOrEmpty_1 = __webpack_require__(/*! ./toArrayOrEmpty */ "./node_modules/tofu-js/dist/arrays/toArrayOrEmpty.js");
exports.flatten = fp_1.curry(array => [].concat(...toArrayOrEmpty_1.toArrayOrEmpty(array)));
//# sourceMappingURL=flatten.js.map

/***/ }),

/***/ "./node_modules/tofu-js/dist/arrays/fromPairs.js":
/*!*******************************************************!*\
  !*** ./node_modules/tofu-js/dist/arrays/fromPairs.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const toArrayOrEmpty_1 = __webpack_require__(/*! ./toArrayOrEmpty */ "./node_modules/tofu-js/dist/arrays/toArrayOrEmpty.js");
exports.fromPairs = (pairs) => {
    return toArrayOrEmpty_1.toArrayOrEmpty(pairs)
        .map(([key, val]) => ({ [key]: val }))
        .reduce((a, c) => Object.assign(a, c), {});
};
//# sourceMappingURL=fromPairs.js.map

/***/ }),

/***/ "./node_modules/tofu-js/dist/arrays/index.js":
/*!***************************************************!*\
  !*** ./node_modules/tofu-js/dist/arrays/index.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(/*! ./filter */ "./node_modules/tofu-js/dist/arrays/filter.js"));
__export(__webpack_require__(/*! ./flatMap */ "./node_modules/tofu-js/dist/arrays/flatMap.js"));
__export(__webpack_require__(/*! ./flatten */ "./node_modules/tofu-js/dist/arrays/flatten.js"));
__export(__webpack_require__(/*! ./limit */ "./node_modules/tofu-js/dist/arrays/limit.js"));
__export(__webpack_require__(/*! ./map */ "./node_modules/tofu-js/dist/arrays/map.js"));
__export(__webpack_require__(/*! ./scan */ "./node_modules/tofu-js/dist/arrays/scan.js"));
__export(__webpack_require__(/*! ./skip */ "./node_modules/tofu-js/dist/arrays/skip.js"));
__export(__webpack_require__(/*! ./tap */ "./node_modules/tofu-js/dist/arrays/tap.js"));
__export(__webpack_require__(/*! ./zip */ "./node_modules/tofu-js/dist/arrays/zip.js"));
__export(__webpack_require__(/*! ./takeWhile */ "./node_modules/tofu-js/dist/arrays/takeWhile.js"));
__export(__webpack_require__(/*! ./toArrayOrEmpty */ "./node_modules/tofu-js/dist/arrays/toArrayOrEmpty.js"));
__export(__webpack_require__(/*! ./reduce */ "./node_modules/tofu-js/dist/arrays/reduce.js"));
__export(__webpack_require__(/*! ./chunk */ "./node_modules/tofu-js/dist/arrays/chunk.js"));
__export(__webpack_require__(/*! ./fromPairs */ "./node_modules/tofu-js/dist/arrays/fromPairs.js"));
__export(__webpack_require__(/*! ./first */ "./node_modules/tofu-js/dist/arrays/first.js"));
__export(__webpack_require__(/*! ./firstOr */ "./node_modules/tofu-js/dist/arrays/firstOr.js"));
__export(__webpack_require__(/*! ./firstOrNull */ "./node_modules/tofu-js/dist/arrays/firstOrNull.js"));
__export(__webpack_require__(/*! ./join */ "./node_modules/tofu-js/dist/arrays/join.js"));
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/tofu-js/dist/arrays/join.js":
/*!**************************************************!*\
  !*** ./node_modules/tofu-js/dist/arrays/join.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const toArrayOrEmpty_1 = __webpack_require__(/*! ./toArrayOrEmpty */ "./node_modules/tofu-js/dist/arrays/toArrayOrEmpty.js");
const fp_1 = __webpack_require__(/*! ../fp */ "./node_modules/tofu-js/dist/fp/index.js");
exports.join = fp_1.curry((separator, arr) => toArrayOrEmpty_1.toArrayOrEmpty(arr).join(separator));
//# sourceMappingURL=join.js.map

/***/ }),

/***/ "./node_modules/tofu-js/dist/arrays/limit.js":
/*!***************************************************!*\
  !*** ./node_modules/tofu-js/dist/arrays/limit.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = __webpack_require__(/*! ../fp */ "./node_modules/tofu-js/dist/fp/index.js");
const toArrayOrEmpty_1 = __webpack_require__(/*! ./toArrayOrEmpty */ "./node_modules/tofu-js/dist/arrays/toArrayOrEmpty.js");
exports.limit = fp_1.curry((max, array) => toArrayOrEmpty_1.toArrayOrEmpty(array).splice(0, max));
//# sourceMappingURL=limit.js.map

/***/ }),

/***/ "./node_modules/tofu-js/dist/arrays/map.js":
/*!*************************************************!*\
  !*** ./node_modules/tofu-js/dist/arrays/map.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = __webpack_require__(/*! ../fp */ "./node_modules/tofu-js/dist/fp/index.js");
const toArrayOrEmpty_1 = __webpack_require__(/*! ./toArrayOrEmpty */ "./node_modules/tofu-js/dist/arrays/toArrayOrEmpty.js");
exports.map = fp_1.curry((func, array) => toArrayOrEmpty_1.toArrayOrEmpty(array).map(func));
//# sourceMappingURL=map.js.map

/***/ }),

/***/ "./node_modules/tofu-js/dist/arrays/reduce.js":
/*!****************************************************!*\
  !*** ./node_modules/tofu-js/dist/arrays/reduce.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = __webpack_require__(/*! ../fp */ "./node_modules/tofu-js/dist/fp/index.js");
const toArrayOrEmpty_1 = __webpack_require__(/*! ./toArrayOrEmpty */ "./node_modules/tofu-js/dist/arrays/toArrayOrEmpty.js");
exports.reduce = fp_1.curry((func, start, array) => toArrayOrEmpty_1.toArrayOrEmpty(array).reduce(func, start));
//# sourceMappingURL=reduce.js.map

/***/ }),

/***/ "./node_modules/tofu-js/dist/arrays/scan.js":
/*!**************************************************!*\
  !*** ./node_modules/tofu-js/dist/arrays/scan.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = __webpack_require__(/*! ../fp */ "./node_modules/tofu-js/dist/fp/index.js");
const toArrayOrEmpty_1 = __webpack_require__(/*! ./toArrayOrEmpty */ "./node_modules/tofu-js/dist/arrays/toArrayOrEmpty.js");
exports.scan = fp_1.curry((func, start, array) => {
    let accumulated = start;
    return toArrayOrEmpty_1.toArrayOrEmpty(array).map((elem) => {
        accumulated = func(accumulated, elem);
        return accumulated;
    });
});
//# sourceMappingURL=scan.js.map

/***/ }),

/***/ "./node_modules/tofu-js/dist/arrays/skip.js":
/*!**************************************************!*\
  !*** ./node_modules/tofu-js/dist/arrays/skip.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = __webpack_require__(/*! ../fp */ "./node_modules/tofu-js/dist/fp/index.js");
const toArrayOrEmpty_1 = __webpack_require__(/*! ./toArrayOrEmpty */ "./node_modules/tofu-js/dist/arrays/toArrayOrEmpty.js");
exports.skip = fp_1.curry((amt, array) => toArrayOrEmpty_1.toArrayOrEmpty(array).splice(amt));
//# sourceMappingURL=skip.js.map

/***/ }),

/***/ "./node_modules/tofu-js/dist/arrays/takeWhile.js":
/*!*******************************************************!*\
  !*** ./node_modules/tofu-js/dist/arrays/takeWhile.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = __webpack_require__(/*! ../fp */ "./node_modules/tofu-js/dist/fp/index.js");
const toArrayOrEmpty_1 = __webpack_require__(/*! ./toArrayOrEmpty */ "./node_modules/tofu-js/dist/arrays/toArrayOrEmpty.js");
exports.takeWhile = fp_1.curry((whileFunc, array) => {
    const arr = toArrayOrEmpty_1.toArrayOrEmpty(array);
    const res = [];
    for (const val of arr) {
        if (whileFunc(val))
            res.push(val);
        else
            return res;
    }
    return res;
});
//# sourceMappingURL=takeWhile.js.map

/***/ }),

/***/ "./node_modules/tofu-js/dist/arrays/tap.js":
/*!*************************************************!*\
  !*** ./node_modules/tofu-js/dist/arrays/tap.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = __webpack_require__(/*! ../fp */ "./node_modules/tofu-js/dist/fp/index.js");
const toArrayOrEmpty_1 = __webpack_require__(/*! ./toArrayOrEmpty */ "./node_modules/tofu-js/dist/arrays/toArrayOrEmpty.js");
exports.tap = fp_1.curry((func, array) => {
    toArrayOrEmpty_1.toArrayOrEmpty(array).forEach(func);
    return array;
});
//# sourceMappingURL=tap.js.map

/***/ }),

/***/ "./node_modules/tofu-js/dist/arrays/toArrayOrEmpty.js":
/*!************************************************************!*\
  !*** ./node_modules/tofu-js/dist/arrays/toArrayOrEmpty.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function toArrayOrEmpty(obj) {
    if (Array.isArray(obj))
        return obj;
    return [];
}
exports.toArrayOrEmpty = toArrayOrEmpty;
//# sourceMappingURL=toArrayOrEmpty.js.map

/***/ }),

/***/ "./node_modules/tofu-js/dist/arrays/zip.js":
/*!*************************************************!*\
  !*** ./node_modules/tofu-js/dist/arrays/zip.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = __webpack_require__(/*! ../fp */ "./node_modules/tofu-js/dist/fp/index.js");
exports.zip = fp_1.curry((arrLeft, arrRight, ...moreArrays) => {
    const arrays = [arrLeft, arrRight, ...moreArrays];
    const maxLen = Math.max(...arrays.map(a => a.length));
    const res = [];
    for (let i = 0; i < maxLen; ++i) {
        res.push(arrays.map(a => (i < a.length ? a[i] : null)));
    }
    return res;
});
//# sourceMappingURL=zip.js.map

/***/ }),

/***/ "./node_modules/tofu-js/dist/fp/curry.js":
/*!***********************************************!*\
  !*** ./node_modules/tofu-js/dist/fp/curry.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.curry = func => {
    const curryImpl = (providedArgs) => (...args) => {
        const concatArgs = providedArgs.concat(args);
        if (concatArgs.length < func.length) {
            return curryImpl(concatArgs);
        }
        return func(...concatArgs);
    };
    return curryImpl([]);
};
//# sourceMappingURL=curry.js.map

/***/ }),

/***/ "./node_modules/tofu-js/dist/fp/index.js":
/*!***********************************************!*\
  !*** ./node_modules/tofu-js/dist/fp/index.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(/*! ./curry */ "./node_modules/tofu-js/dist/fp/curry.js"));
__export(__webpack_require__(/*! ./pipe */ "./node_modules/tofu-js/dist/fp/pipe.js"));
__export(__webpack_require__(/*! ./predicate */ "./node_modules/tofu-js/dist/fp/predicate.js"));
__export(__webpack_require__(/*! ./reverseArgs */ "./node_modules/tofu-js/dist/fp/reverseArgs.js"));
__export(__webpack_require__(/*! ./reverseCurry */ "./node_modules/tofu-js/dist/fp/reverseCurry.js"));
__export(__webpack_require__(/*! ./spread */ "./node_modules/tofu-js/dist/fp/spread.js"));
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/tofu-js/dist/fp/pipe.js":
/*!**********************************************!*\
  !*** ./node_modules/tofu-js/dist/fp/pipe.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const is_1 = __webpack_require__(/*! ../is */ "./node_modules/tofu-js/dist/is/index.js");
exports.pipe = (paramOrFunc, ...functions) => {
    if (is_1.isFunction(paramOrFunc)) {
        return chain(paramOrFunc, ...functions);
    }
    return chain(...functions)(paramOrFunc);
};
function chain(...funcs) {
    return (param) => {
        let lastVal = param;
        for (const func of funcs) {
            lastVal = func(lastVal);
        }
        return lastVal;
    };
}
//# sourceMappingURL=pipe.js.map

/***/ }),

/***/ "./node_modules/tofu-js/dist/fp/predicate.js":
/*!***************************************************!*\
  !*** ./node_modules/tofu-js/dist/fp/predicate.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.and = (...predicates) => (param) => [...predicates].reduce((a, p) => a && p(param), true) && !!predicates.length;
exports.or = (...predicates) => (param) => [...predicates].reduce((a, p) => a || p(param), false);
exports.xor = (...predicates) => (param) => [...predicates].map(p => +p(param)).reduce((a, c) => a + c, 0) === 1;
exports.negate = (p1) => (param) => !p1(param);
exports.toPredicate = (p) => (param) => !!p(param);
exports.boolToPredicate = (b) => () => b;
//# sourceMappingURL=predicate.js.map

/***/ }),

/***/ "./node_modules/tofu-js/dist/fp/reverseArgs.js":
/*!*****************************************************!*\
  !*** ./node_modules/tofu-js/dist/fp/reverseArgs.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function reverseArgs(func) {
    return (...args) => {
        return func(...args.reverse());
    };
}
exports.reverseArgs = reverseArgs;
//# sourceMappingURL=reverseArgs.js.map

/***/ }),

/***/ "./node_modules/tofu-js/dist/fp/reverseCurry.js":
/*!******************************************************!*\
  !*** ./node_modules/tofu-js/dist/fp/reverseCurry.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const reverseArgs_1 = __webpack_require__(/*! ./reverseArgs */ "./node_modules/tofu-js/dist/fp/reverseArgs.js");
exports.reverseCurry = func => {
    const curryImpl = providedArgs => (...args) => {
        const concatArgs = providedArgs.concat(args);
        if (concatArgs.length < func.length) {
            return curryImpl(concatArgs);
        }
        return reverseArgs_1.reverseArgs(func)(...concatArgs);
    };
    return curryImpl([]);
};
//# sourceMappingURL=reverseCurry.js.map

/***/ }),

/***/ "./node_modules/tofu-js/dist/fp/spread.js":
/*!************************************************!*\
  !*** ./node_modules/tofu-js/dist/fp/spread.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const curry_1 = __webpack_require__(/*! ./curry */ "./node_modules/tofu-js/dist/fp/curry.js");
exports.spread = curry_1.curry((func, args) => func(...args));
//# sourceMappingURL=spread.js.map

/***/ }),

/***/ "./node_modules/tofu-js/dist/is/index.js":
/*!***********************************************!*\
  !*** ./node_modules/tofu-js/dist/is/index.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(/*! ./isFunction */ "./node_modules/tofu-js/dist/is/isFunction.js"));
__export(__webpack_require__(/*! ./isInfinite */ "./node_modules/tofu-js/dist/is/isInfinite.js"));
__export(__webpack_require__(/*! ./isIterable */ "./node_modules/tofu-js/dist/is/isIterable.js"));
__export(__webpack_require__(/*! ./isNil */ "./node_modules/tofu-js/dist/is/isNil.js"));
__export(__webpack_require__(/*! ./isNull */ "./node_modules/tofu-js/dist/is/isNull.js"));
__export(__webpack_require__(/*! ./isObject */ "./node_modules/tofu-js/dist/is/isObject.js"));
__export(__webpack_require__(/*! ./isUndefined */ "./node_modules/tofu-js/dist/is/isUndefined.js"));
__export(__webpack_require__(/*! ./isNumber */ "./node_modules/tofu-js/dist/is/isNumber.js"));
__export(__webpack_require__(/*! ./isString */ "./node_modules/tofu-js/dist/is/isString.js"));
__export(__webpack_require__(/*! ./isInteger */ "./node_modules/tofu-js/dist/is/isInteger.js"));
__export(__webpack_require__(/*! ./isFloat */ "./node_modules/tofu-js/dist/is/isFloat.js"));
__export(__webpack_require__(/*! ./isArray */ "./node_modules/tofu-js/dist/is/isArray.js"));
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/tofu-js/dist/is/isArray.js":
/*!*************************************************!*\
  !*** ./node_modules/tofu-js/dist/is/isArray.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.isArray = Array.isArray;
//# sourceMappingURL=isArray.js.map

/***/ }),

/***/ "./node_modules/tofu-js/dist/is/isFloat.js":
/*!*************************************************!*\
  !*** ./node_modules/tofu-js/dist/is/isFloat.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const isNumber_1 = __webpack_require__(/*! ./isNumber */ "./node_modules/tofu-js/dist/is/isNumber.js");
exports.isFloat = isNumber_1.isNumber;
//# sourceMappingURL=isFloat.js.map

/***/ }),

/***/ "./node_modules/tofu-js/dist/is/isFunction.js":
/*!****************************************************!*\
  !*** ./node_modules/tofu-js/dist/is/isFunction.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.isFunction = (param) => typeof param === 'function';
//# sourceMappingURL=isFunction.js.map

/***/ }),

/***/ "./node_modules/tofu-js/dist/is/isInfinite.js":
/*!****************************************************!*\
  !*** ./node_modules/tofu-js/dist/is/isInfinite.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.isInfinite = (param) => param === Infinity || param === -Infinity;
//# sourceMappingURL=isInfinite.js.map

/***/ }),

/***/ "./node_modules/tofu-js/dist/is/isInteger.js":
/*!***************************************************!*\
  !*** ./node_modules/tofu-js/dist/is/isInteger.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.isInteger = (param) => (param | 0) === param;
//# sourceMappingURL=isInteger.js.map

/***/ }),

/***/ "./node_modules/tofu-js/dist/is/isIterable.js":
/*!****************************************************!*\
  !*** ./node_modules/tofu-js/dist/is/isIterable.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const isObject_1 = __webpack_require__(/*! ./isObject */ "./node_modules/tofu-js/dist/is/isObject.js");
const isFunction_1 = __webpack_require__(/*! ./isFunction */ "./node_modules/tofu-js/dist/is/isFunction.js");
exports.isIterable = (param) => isObject_1.isObject(param) && isFunction_1.isFunction(param[Symbol.iterator]);
//# sourceMappingURL=isIterable.js.map

/***/ }),

/***/ "./node_modules/tofu-js/dist/is/isNil.js":
/*!***********************************************!*\
  !*** ./node_modules/tofu-js/dist/is/isNil.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const isNull_1 = __webpack_require__(/*! ./isNull */ "./node_modules/tofu-js/dist/is/isNull.js");
const isUndefined_1 = __webpack_require__(/*! ./isUndefined */ "./node_modules/tofu-js/dist/is/isUndefined.js");
exports.isNil = (param) => isNull_1.isNull(param) || isUndefined_1.isUndefined(param);
//# sourceMappingURL=isNil.js.map

/***/ }),

/***/ "./node_modules/tofu-js/dist/is/isNull.js":
/*!************************************************!*\
  !*** ./node_modules/tofu-js/dist/is/isNull.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.isNull = (param) => param === null;
//# sourceMappingURL=isNull.js.map

/***/ }),

/***/ "./node_modules/tofu-js/dist/is/isNumber.js":
/*!**************************************************!*\
  !*** ./node_modules/tofu-js/dist/is/isNumber.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.isNumber = (param) => typeof param === 'number';
//# sourceMappingURL=isNumber.js.map

/***/ }),

/***/ "./node_modules/tofu-js/dist/is/isObject.js":
/*!**************************************************!*\
  !*** ./node_modules/tofu-js/dist/is/isObject.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.isObject = (param) => param === Object(param);
//# sourceMappingURL=isObject.js.map

/***/ }),

/***/ "./node_modules/tofu-js/dist/is/isString.js":
/*!**************************************************!*\
  !*** ./node_modules/tofu-js/dist/is/isString.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.isString = (param) => typeof param === 'string';
//# sourceMappingURL=isString.js.map

/***/ }),

/***/ "./node_modules/tofu-js/dist/is/isUndefined.js":
/*!*****************************************************!*\
  !*** ./node_modules/tofu-js/dist/is/isUndefined.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.isUndefined = (param) => typeof param === 'undefined';
//# sourceMappingURL=isUndefined.js.map

/***/ }),

/***/ "./node_modules/tofu-js/dist/iterators/chunk.js":
/*!******************************************************!*\
  !*** ./node_modules/tofu-js/dist/iterators/chunk.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = __webpack_require__(/*! ../fp */ "./node_modules/tofu-js/dist/fp/index.js");
const toIterableOrEmpty_1 = __webpack_require__(/*! ./toIterableOrEmpty */ "./node_modules/tofu-js/dist/iterators/toIterableOrEmpty.js");
exports.chunk = fp_1.curry(function* (size, iterable) {
    const iter = toIterableOrEmpty_1.toIterableOrEmpty(iterable);
    let chunks = [];
    for (const elem of iter) {
        if (chunks.length >= size) {
            yield chunks;
            chunks = [];
        }
        chunks.push(elem);
    }
    if (chunks.length) {
        yield chunks;
    }
});
//# sourceMappingURL=chunk.js.map

/***/ }),

/***/ "./node_modules/tofu-js/dist/iterators/collectToArray.js":
/*!***************************************************************!*\
  !*** ./node_modules/tofu-js/dist/iterators/collectToArray.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const is_1 = __webpack_require__(/*! ../is */ "./node_modules/tofu-js/dist/is/index.js");
const limit_1 = __webpack_require__(/*! ./limit */ "./node_modules/tofu-js/dist/iterators/limit.js");
const toIterableOrEmpty_1 = __webpack_require__(/*! ./toIterableOrEmpty */ "./node_modules/tofu-js/dist/iterators/toIterableOrEmpty.js");
exports.collectToArray = (iterable, max = Infinity) => is_1.isInfinite(max)
    ? [...toIterableOrEmpty_1.toIterableOrEmpty(iterable)]
    : exports.collectToArray(limit_1.limit(max, toIterableOrEmpty_1.toIterableOrEmpty(iterable)));
//# sourceMappingURL=collectToArray.js.map

/***/ }),

/***/ "./node_modules/tofu-js/dist/iterators/filter.js":
/*!*******************************************************!*\
  !*** ./node_modules/tofu-js/dist/iterators/filter.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = __webpack_require__(/*! ../fp */ "./node_modules/tofu-js/dist/fp/index.js");
const toIterableOrEmpty_1 = __webpack_require__(/*! ./toIterableOrEmpty */ "./node_modules/tofu-js/dist/iterators/toIterableOrEmpty.js");
exports.filter = fp_1.curry(function* (func, iterable) {
    const iter = toIterableOrEmpty_1.toIterableOrEmpty(iterable);
    for (const val of iter) {
        if (func(val))
            yield val;
    }
});
//# sourceMappingURL=filter.js.map

/***/ }),

/***/ "./node_modules/tofu-js/dist/iterators/first.js":
/*!******************************************************!*\
  !*** ./node_modules/tofu-js/dist/iterators/first.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const take_1 = __webpack_require__(/*! ./take */ "./node_modules/tofu-js/dist/iterators/take.js");
exports.first = take_1.take(1);
//# sourceMappingURL=first.js.map

/***/ }),

/***/ "./node_modules/tofu-js/dist/iterators/firstOr.js":
/*!********************************************************!*\
  !*** ./node_modules/tofu-js/dist/iterators/firstOr.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = __webpack_require__(/*! ../fp */ "./node_modules/tofu-js/dist/fp/index.js");
exports.firstOr = fp_1.curry((defaultValue, iterable) => {
    for (const v of iterable) {
        return v;
    }
    return defaultValue;
});
//# sourceMappingURL=firstOr.js.map

/***/ }),

/***/ "./node_modules/tofu-js/dist/iterators/firstOrNull.js":
/*!************************************************************!*\
  !*** ./node_modules/tofu-js/dist/iterators/firstOrNull.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const firstOr_1 = __webpack_require__(/*! ./firstOr */ "./node_modules/tofu-js/dist/iterators/firstOr.js");
exports.firstOrNull = firstOr_1.firstOr(null);
//# sourceMappingURL=firstOrNull.js.map

/***/ }),

/***/ "./node_modules/tofu-js/dist/iterators/flatMap.js":
/*!********************************************************!*\
  !*** ./node_modules/tofu-js/dist/iterators/flatMap.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = __webpack_require__(/*! ../fp */ "./node_modules/tofu-js/dist/fp/index.js");
const is_1 = __webpack_require__(/*! ../is */ "./node_modules/tofu-js/dist/is/index.js");
const toIterableOrEmpty_1 = __webpack_require__(/*! ./toIterableOrEmpty */ "./node_modules/tofu-js/dist/iterators/toIterableOrEmpty.js");
exports.flatMap = fp_1.curry(function* (func, iterable) {
    const iter = toIterableOrEmpty_1.toIterableOrEmpty(iterable);
    for (const val of iter) {
        const newIterable = func(val);
        if (is_1.isIterable(newIterable)) {
            for (const newVal of newIterable)
                yield newVal;
        }
        else {
            yield newIterable;
        }
    }
});
//# sourceMappingURL=flatMap.js.map

/***/ }),

/***/ "./node_modules/tofu-js/dist/iterators/flatten.js":
/*!********************************************************!*\
  !*** ./node_modules/tofu-js/dist/iterators/flatten.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = __webpack_require__(/*! ../fp */ "./node_modules/tofu-js/dist/fp/index.js");
const is_1 = __webpack_require__(/*! ../is */ "./node_modules/tofu-js/dist/is/index.js");
const toIterableOrEmpty_1 = __webpack_require__(/*! ./toIterableOrEmpty */ "./node_modules/tofu-js/dist/iterators/toIterableOrEmpty.js");
exports.flatten = fp_1.curry(function* (iterable) {
    const iter = toIterableOrEmpty_1.toIterableOrEmpty(iterable);
    for (const val of iter) {
        if (is_1.isIterable(val)) {
            for (const innerVal of val)
                yield innerVal;
        }
        else {
            yield val;
        }
    }
});
//# sourceMappingURL=flatten.js.map

/***/ }),

/***/ "./node_modules/tofu-js/dist/iterators/head.js":
/*!*****************************************************!*\
  !*** ./node_modules/tofu-js/dist/iterators/head.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const first_1 = __webpack_require__(/*! ./first */ "./node_modules/tofu-js/dist/iterators/first.js");
exports.head = first_1.first;
//# sourceMappingURL=head.js.map

/***/ }),

/***/ "./node_modules/tofu-js/dist/iterators/index.js":
/*!******************************************************!*\
  !*** ./node_modules/tofu-js/dist/iterators/index.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(/*! ./collectToArray */ "./node_modules/tofu-js/dist/iterators/collectToArray.js"));
__export(__webpack_require__(/*! ./filter */ "./node_modules/tofu-js/dist/iterators/filter.js"));
__export(__webpack_require__(/*! ./flatMap */ "./node_modules/tofu-js/dist/iterators/flatMap.js"));
__export(__webpack_require__(/*! ./flatten */ "./node_modules/tofu-js/dist/iterators/flatten.js"));
__export(__webpack_require__(/*! ./limit */ "./node_modules/tofu-js/dist/iterators/limit.js"));
__export(__webpack_require__(/*! ./map */ "./node_modules/tofu-js/dist/iterators/map.js"));
__export(__webpack_require__(/*! ./scan */ "./node_modules/tofu-js/dist/iterators/scan.js"));
__export(__webpack_require__(/*! ./skip */ "./node_modules/tofu-js/dist/iterators/skip.js"));
__export(__webpack_require__(/*! ./tap */ "./node_modules/tofu-js/dist/iterators/tap.js"));
__export(__webpack_require__(/*! ./zip */ "./node_modules/tofu-js/dist/iterators/zip.js"));
__export(__webpack_require__(/*! ./takeWhile */ "./node_modules/tofu-js/dist/iterators/takeWhile.js"));
__export(__webpack_require__(/*! ./chunk */ "./node_modules/tofu-js/dist/iterators/chunk.js"));
__export(__webpack_require__(/*! ./first */ "./node_modules/tofu-js/dist/iterators/first.js"));
__export(__webpack_require__(/*! ./take */ "./node_modules/tofu-js/dist/iterators/take.js"));
__export(__webpack_require__(/*! ./head */ "./node_modules/tofu-js/dist/iterators/head.js"));
__export(__webpack_require__(/*! ./firstOr */ "./node_modules/tofu-js/dist/iterators/firstOr.js"));
__export(__webpack_require__(/*! ./firstOrNull */ "./node_modules/tofu-js/dist/iterators/firstOrNull.js"));
__export(__webpack_require__(/*! ./join */ "./node_modules/tofu-js/dist/iterators/join.js"));
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/tofu-js/dist/iterators/join.js":
/*!*****************************************************!*\
  !*** ./node_modules/tofu-js/dist/iterators/join.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const toIterableOrEmpty_1 = __webpack_require__(/*! ./toIterableOrEmpty */ "./node_modules/tofu-js/dist/iterators/toIterableOrEmpty.js");
const fp_1 = __webpack_require__(/*! ../fp */ "./node_modules/tofu-js/dist/fp/index.js");
const collectToArray_1 = __webpack_require__(/*! ./collectToArray */ "./node_modules/tofu-js/dist/iterators/collectToArray.js");
exports.join = fp_1.curry(function* (separator, iterable) {
    yield collectToArray_1.collectToArray(toIterableOrEmpty_1.toIterableOrEmpty(iterable)).join(separator);
});
//# sourceMappingURL=join.js.map

/***/ }),

/***/ "./node_modules/tofu-js/dist/iterators/limit.js":
/*!******************************************************!*\
  !*** ./node_modules/tofu-js/dist/iterators/limit.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = __webpack_require__(/*! ../fp */ "./node_modules/tofu-js/dist/fp/index.js");
const toIterableOrEmpty_1 = __webpack_require__(/*! ./toIterableOrEmpty */ "./node_modules/tofu-js/dist/iterators/toIterableOrEmpty.js");
exports.limit = fp_1.curry(function* (max, iterable) {
    const iter = toIterableOrEmpty_1.toIterableOrEmpty(iterable);
    let count = 0;
    for (const val of iter) {
        if (count++ < (max | 0)) {
            yield val;
        }
        else {
            break;
        }
    }
});
//# sourceMappingURL=limit.js.map

/***/ }),

/***/ "./node_modules/tofu-js/dist/iterators/map.js":
/*!****************************************************!*\
  !*** ./node_modules/tofu-js/dist/iterators/map.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = __webpack_require__(/*! ../fp */ "./node_modules/tofu-js/dist/fp/index.js");
const toIterableOrEmpty_1 = __webpack_require__(/*! ./toIterableOrEmpty */ "./node_modules/tofu-js/dist/iterators/toIterableOrEmpty.js");
exports.map = fp_1.curry(function* (func, iterable) {
    const iter = toIterableOrEmpty_1.toIterableOrEmpty(iterable);
    for (const val of iter)
        yield func(val);
});
//# sourceMappingURL=map.js.map

/***/ }),

/***/ "./node_modules/tofu-js/dist/iterators/scan.js":
/*!*****************************************************!*\
  !*** ./node_modules/tofu-js/dist/iterators/scan.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = __webpack_require__(/*! ../fp */ "./node_modules/tofu-js/dist/fp/index.js");
const toIterableOrEmpty_1 = __webpack_require__(/*! ./toIterableOrEmpty */ "./node_modules/tofu-js/dist/iterators/toIterableOrEmpty.js");
exports.scan = fp_1.curry(function* (func, start, iterable) {
    const iter = toIterableOrEmpty_1.toIterableOrEmpty(iterable);
    let accumulated = start;
    for (const val of iter) {
        accumulated = func(accumulated, val);
        yield accumulated;
    }
});
//# sourceMappingURL=scan.js.map

/***/ }),

/***/ "./node_modules/tofu-js/dist/iterators/skip.js":
/*!*****************************************************!*\
  !*** ./node_modules/tofu-js/dist/iterators/skip.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = __webpack_require__(/*! ../fp */ "./node_modules/tofu-js/dist/fp/index.js");
const toIterableOrEmpty_1 = __webpack_require__(/*! ./toIterableOrEmpty */ "./node_modules/tofu-js/dist/iterators/toIterableOrEmpty.js");
exports.skip = fp_1.curry(function* (amt = 1, iterable) {
    const iter = toIterableOrEmpty_1.toIterableOrEmpty(iterable)[Symbol.iterator]();
    let isDone = false;
    for (let i = 0; i < amt && !isDone; ++i) {
        isDone = iter.next().done;
    }
    if (isDone)
        return;
    while (true) {
        const { done, value } = iter.next();
        if (done)
            return;
        yield value;
    }
});
//# sourceMappingURL=skip.js.map

/***/ }),

/***/ "./node_modules/tofu-js/dist/iterators/take.js":
/*!*****************************************************!*\
  !*** ./node_modules/tofu-js/dist/iterators/take.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const toIterableOrEmpty_1 = __webpack_require__(/*! ./toIterableOrEmpty */ "./node_modules/tofu-js/dist/iterators/toIterableOrEmpty.js");
const fp_1 = __webpack_require__(/*! ../fp */ "./node_modules/tofu-js/dist/fp/index.js");
exports.take = fp_1.curry(function* (limit, iterable) {
    let i = 0;
    const iter = toIterableOrEmpty_1.toIterableOrEmpty(iterable);
    for (const v of iter) {
        if (i++ < limit) {
            yield v;
        }
        else {
            return;
        }
    }
});
//# sourceMappingURL=take.js.map

/***/ }),

/***/ "./node_modules/tofu-js/dist/iterators/takeWhile.js":
/*!**********************************************************!*\
  !*** ./node_modules/tofu-js/dist/iterators/takeWhile.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = __webpack_require__(/*! ../fp */ "./node_modules/tofu-js/dist/fp/index.js");
const is_1 = __webpack_require__(/*! ../is */ "./node_modules/tofu-js/dist/is/index.js");
exports.takeWhile = fp_1.curry(function* (whileFunc, iter) {
    if (is_1.isIterable(whileFunc)) {
        const whileIter = whileFunc[Symbol.iterator]();
        for (const val of iter) {
            const quitIndicator = whileIter.next();
            if (!quitIndicator.value || quitIndicator.done)
                return;
            yield val;
        }
    }
    else {
        for (const val of iter) {
            if (whileFunc(val))
                yield val;
            else
                return;
        }
    }
});
exports.takeWhilePullPush = fp_1.curry(function* (whileIterable, iter) {
    const whileIter = whileIterable[Symbol.iterator]();
    for (const val of iter) {
        let quitIndicator = whileIter.next();
        if (quitIndicator.done || !quitIndicator.value)
            return;
        quitIndicator = whileIter.next(val);
        if (quitIndicator.done || !quitIndicator.value)
            return;
        yield val;
    }
});
//# sourceMappingURL=takeWhile.js.map

/***/ }),

/***/ "./node_modules/tofu-js/dist/iterators/tap.js":
/*!****************************************************!*\
  !*** ./node_modules/tofu-js/dist/iterators/tap.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = __webpack_require__(/*! ../fp */ "./node_modules/tofu-js/dist/fp/index.js");
const toIterableOrEmpty_1 = __webpack_require__(/*! ./toIterableOrEmpty */ "./node_modules/tofu-js/dist/iterators/toIterableOrEmpty.js");
exports.tap = fp_1.curry(function* (func, iterable) {
    const iter = toIterableOrEmpty_1.toIterableOrEmpty(iterable);
    for (const val of iter) {
        func(val);
        yield val;
    }
});
//# sourceMappingURL=tap.js.map

/***/ }),

/***/ "./node_modules/tofu-js/dist/iterators/toIterableOrEmpty.js":
/*!******************************************************************!*\
  !*** ./node_modules/tofu-js/dist/iterators/toIterableOrEmpty.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const is_1 = __webpack_require__(/*! ../is */ "./node_modules/tofu-js/dist/is/index.js");
function toIterableOrEmpty(param) {
    if (!is_1.isIterable(param))
        return [];
    return param;
}
exports.toIterableOrEmpty = toIterableOrEmpty;
//# sourceMappingURL=toIterableOrEmpty.js.map

/***/ }),

/***/ "./node_modules/tofu-js/dist/iterators/zip.js":
/*!****************************************************!*\
  !*** ./node_modules/tofu-js/dist/iterators/zip.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = __webpack_require__(/*! ../fp */ "./node_modules/tofu-js/dist/fp/index.js");
const toIterableOrEmpty_1 = __webpack_require__(/*! ./toIterableOrEmpty */ "./node_modules/tofu-js/dist/iterators/toIterableOrEmpty.js");
exports.zip = fp_1.curry(function* (iterableLeft, iterableRight, ...moreIterables) {
    const iterators = [iterableLeft, iterableRight]
        .concat(moreIterables)
        .map(toIterableOrEmpty_1.toIterableOrEmpty)
        .map(iterable => iterable[Symbol.iterator]());
    while (true) {
        const next = iterators.map(iterator => iterator.next());
        const items = next.map(({ value, done }) => (done ? null : value));
        if (next.reduce((acc, cur) => acc && cur.done, true))
            return;
        yield items;
    }
});
//# sourceMappingURL=zip.js.map

/***/ }),

/***/ "./node_modules/tofu-js/dist/objects/entries.js":
/*!******************************************************!*\
  !*** ./node_modules/tofu-js/dist/objects/entries.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const is_1 = __webpack_require__(/*! ../is */ "./node_modules/tofu-js/dist/is/index.js");
const iterators_1 = __webpack_require__(/*! ../iterators */ "./node_modules/tofu-js/dist/iterators/index.js");
exports.entries = (param) => {
    if (param instanceof Map) {
        return iterators_1.collectToArray(param.entries());
    }
    else if (param instanceof Set) {
        return iterators_1.collectToArray(param.entries());
    }
    else if (is_1.isObject(param)) {
        if (is_1.isFunction(param.entries)) {
            const paramEntries = param.entries();
            if (is_1.isIterable(paramEntries))
                return iterators_1.collectToArray(paramEntries);
        }
        return Object.entries(param);
    }
    else if (is_1.isArray(param)) {
        return param.map((v, i) => [i, v]);
    }
    else {
        return [];
    }
};
//# sourceMappingURL=entries.js.map

/***/ }),

/***/ "./node_modules/tofu-js/dist/objects/index.js":
/*!****************************************************!*\
  !*** ./node_modules/tofu-js/dist/objects/index.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(/*! ./toPairs */ "./node_modules/tofu-js/dist/objects/toPairs.js"));
__export(__webpack_require__(/*! ./entries */ "./node_modules/tofu-js/dist/objects/entries.js"));
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/tofu-js/dist/objects/toPairs.js":
/*!******************************************************!*\
  !*** ./node_modules/tofu-js/dist/objects/toPairs.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const entries_1 = __webpack_require__(/*! ./entries */ "./node_modules/tofu-js/dist/objects/entries.js");
exports.toPairs = entries_1.entries;
//# sourceMappingURL=toPairs.js.map

/***/ }),

/***/ "./src/grammar.ts":
/*!************************!*\
  !*** ./src/grammar.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
}); // Generated automatically by nearley, version 2.15.1
// http://github.com/Hardmath123/nearley

function id(x) {
  return x[0];
}

var grammar = {
  Lexer: undefined,
  ParserRules: [{
    name: 'Main',
    symbols: ['EDN'],
    postprocess: function postprocess(data) {
      return data[0];
    }
  }, {
    name: 'EDN',
    symbols: ['Exp'],
    postprocess: function postprocess(data) {
      return data[0];
    }
  }, {
    name: 'Exp$subexpression$1',
    symbols: ['ElementSpace']
  }, {
    name: 'Exp$subexpression$1',
    symbols: ['ElementNoSpace']
  }, {
    name: 'Exp',
    symbols: ['Exp$subexpression$1'],
    postprocess: function postprocess(data) {
      return [].concat.apply([], data[0]);
    }
  }, {
    name: '_Exp',
    symbols: ['__exp']
  }, {
    name: '_Exp',
    symbols: ['__char'],
    postprocess: function postprocess(data) {
      return data[0];
    }
  }, {
    name: '__exp',
    symbols: ['_', 'Exp'],
    postprocess: function postprocess(data) {
      return data[1];
    }
  }, {
    name: '__char$ebnf$1$subexpression$1',
    symbols: ['_Exp']
  }, {
    name: '__char$ebnf$1$subexpression$1',
    symbols: ['ElementNoSpace']
  }, {
    name: '__char$ebnf$1',
    symbols: ['__char$ebnf$1$subexpression$1'],
    postprocess: id
  }, {
    name: '__char$ebnf$1',
    symbols: [],
    postprocess: function postprocess() {
      return null;
    }
  }, {
    name: '__char',
    symbols: ['Character', '__char$ebnf$1'],
    postprocess: function postprocess(data) {
      return [].concat.apply([], [data[0]].concat(data[1] ? [].concat.apply([], data[1]) : []));
    }
  }, {
    name: 'ElementSpace$subexpression$1',
    symbols: ['Number']
  }, {
    name: 'ElementSpace$subexpression$1',
    symbols: ['Character']
  }, {
    name: 'ElementSpace$subexpression$1',
    symbols: ['Reserved']
  }, {
    name: 'ElementSpace$subexpression$1',
    symbols: ['Symbol']
  }, {
    name: 'ElementSpace$subexpression$1',
    symbols: ['Keyword']
  }, {
    name: 'ElementSpace$subexpression$1',
    symbols: ['Tag']
  }, {
    name: 'ElementSpace$subexpression$1',
    symbols: ['Discard']
  }, {
    name: 'ElementSpace$ebnf$1$subexpression$1',
    symbols: ['_Exp']
  }, {
    name: 'ElementSpace$ebnf$1$subexpression$1',
    symbols: ['ElementNoSpace']
  }, {
    name: 'ElementSpace$ebnf$1',
    symbols: ['ElementSpace$ebnf$1$subexpression$1'],
    postprocess: id
  }, {
    name: 'ElementSpace$ebnf$1',
    symbols: [],
    postprocess: function postprocess() {
      return null;
    }
  }, {
    name: 'ElementSpace',
    symbols: ['ElementSpace$subexpression$1', 'ElementSpace$ebnf$1'],
    postprocess: function postprocess(data) {
      return [].concat.apply([], [data[0][0]].concat(data[1] ? [].concat.apply([], data[1]) : []));
    }
  }, {
    name: 'ElementNoSpace$ebnf$1$subexpression$1$ebnf$1',
    symbols: ['_'],
    postprocess: id
  }, {
    name: 'ElementNoSpace$ebnf$1$subexpression$1$ebnf$1',
    symbols: [],
    postprocess: function postprocess() {
      return null;
    }
  }, {
    name: 'ElementNoSpace$ebnf$1$subexpression$1',
    symbols: ['ElementNoSpace$ebnf$1$subexpression$1$ebnf$1', 'Exp']
  }, {
    name: 'ElementNoSpace$ebnf$1',
    symbols: ['ElementNoSpace$ebnf$1$subexpression$1'],
    postprocess: id
  }, {
    name: 'ElementNoSpace$ebnf$1',
    symbols: [],
    postprocess: function postprocess() {
      return null;
    }
  }, {
    name: 'ElementNoSpace',
    symbols: ['mapElementNoSpace', 'ElementNoSpace$ebnf$1'],
    postprocess: function postprocess(data) {
      return [data[0]].concat(data[1] ? data[1][1] : []);
    }
  }, {
    name: 'Element$subexpression$1',
    symbols: ['Number']
  }, {
    name: 'Element$subexpression$1',
    symbols: ['Character']
  }, {
    name: 'Element$subexpression$1',
    symbols: ['Reserved']
  }, {
    name: 'Element$subexpression$1',
    symbols: ['Symbol']
  }, {
    name: 'Element$subexpression$1',
    symbols: ['Keyword']
  }, {
    name: 'Element$subexpression$1',
    symbols: ['Vector']
  }, {
    name: 'Element$subexpression$1',
    symbols: ['List']
  }, {
    name: 'Element$subexpression$1',
    symbols: ['String']
  }, {
    name: 'Element$subexpression$1',
    symbols: ['Map']
  }, {
    name: 'Element$subexpression$1',
    symbols: ['Set']
  }, {
    name: 'Element',
    symbols: ['Element$subexpression$1'],
    postprocess: function postprocess(data) {
      return data[0][0];
    }
  }, {
    name: 'Vector$ebnf$1',
    symbols: ['_'],
    postprocess: id
  }, {
    name: 'Vector$ebnf$1',
    symbols: [],
    postprocess: function postprocess() {
      return null;
    }
  }, {
    name: 'Vector$ebnf$2$subexpression$1$ebnf$1',
    symbols: ['_'],
    postprocess: id
  }, {
    name: 'Vector$ebnf$2$subexpression$1$ebnf$1',
    symbols: [],
    postprocess: function postprocess() {
      return null;
    }
  }, {
    name: 'Vector$ebnf$2$subexpression$1',
    symbols: ['Exp', 'Vector$ebnf$2$subexpression$1$ebnf$1']
  }, {
    name: 'Vector$ebnf$2',
    symbols: ['Vector$ebnf$2$subexpression$1'],
    postprocess: id
  }, {
    name: 'Vector$ebnf$2',
    symbols: [],
    postprocess: function postprocess() {
      return null;
    }
  }, {
    name: 'Vector',
    symbols: [{
      literal: '['
    }, 'Vector$ebnf$1', 'Vector$ebnf$2', {
      literal: ']'
    }],
    postprocess: function postprocess(data) {
      return {
        type: 'vector',
        data: data[2] ? data[2][0] : []
      };
    }
  }, {
    name: 'List$ebnf$1',
    symbols: ['_'],
    postprocess: id
  }, {
    name: 'List$ebnf$1',
    symbols: [],
    postprocess: function postprocess() {
      return null;
    }
  }, {
    name: 'List$ebnf$2$subexpression$1$ebnf$1',
    symbols: ['_'],
    postprocess: id
  }, {
    name: 'List$ebnf$2$subexpression$1$ebnf$1',
    symbols: [],
    postprocess: function postprocess() {
      return null;
    }
  }, {
    name: 'List$ebnf$2$subexpression$1',
    symbols: ['Exp', 'List$ebnf$2$subexpression$1$ebnf$1']
  }, {
    name: 'List$ebnf$2',
    symbols: ['List$ebnf$2$subexpression$1'],
    postprocess: id
  }, {
    name: 'List$ebnf$2',
    symbols: [],
    postprocess: function postprocess() {
      return null;
    }
  }, {
    name: 'List',
    symbols: [{
      literal: '('
    }, 'List$ebnf$1', 'List$ebnf$2', {
      literal: ')'
    }],
    postprocess: function postprocess(data) {
      return {
        type: 'list',
        data: data[2] ? data[2][0] : []
      };
    }
  }, {
    name: 'Map$ebnf$1',
    symbols: ['_'],
    postprocess: id
  }, {
    name: 'Map$ebnf$1',
    symbols: [],
    postprocess: function postprocess() {
      return null;
    }
  }, {
    name: 'Map$ebnf$2$subexpression$1$ebnf$1',
    symbols: ['_'],
    postprocess: id
  }, {
    name: 'Map$ebnf$2$subexpression$1$ebnf$1',
    symbols: [],
    postprocess: function postprocess() {
      return null;
    }
  }, {
    name: 'Map$ebnf$2$subexpression$1',
    symbols: ['MapElem', 'Map$ebnf$2$subexpression$1$ebnf$1']
  }, {
    name: 'Map$ebnf$2',
    symbols: ['Map$ebnf$2$subexpression$1'],
    postprocess: id
  }, {
    name: 'Map$ebnf$2',
    symbols: [],
    postprocess: function postprocess() {
      return null;
    }
  }, {
    name: 'Map',
    symbols: [{
      literal: '{'
    }, 'Map$ebnf$1', 'Map$ebnf$2', {
      literal: '}'
    }],
    postprocess: function postprocess(data) {
      return {
        type: 'map',
        data: data[2] ? data[2][0] : []
      };
    }
  }, {
    name: 'Set$string$1',
    symbols: [{
      literal: '#'
    }, {
      literal: '{'
    }],
    postprocess: function joiner(d) {
      return d.join('');
    }
  }, {
    name: 'Set$ebnf$1',
    symbols: ['_'],
    postprocess: id
  }, {
    name: 'Set$ebnf$1',
    symbols: [],
    postprocess: function postprocess() {
      return null;
    }
  }, {
    name: 'Set$ebnf$2$subexpression$1$ebnf$1',
    symbols: ['_'],
    postprocess: id
  }, {
    name: 'Set$ebnf$2$subexpression$1$ebnf$1',
    symbols: [],
    postprocess: function postprocess() {
      return null;
    }
  }, {
    name: 'Set$ebnf$2$subexpression$1',
    symbols: ['Exp', 'Set$ebnf$2$subexpression$1$ebnf$1']
  }, {
    name: 'Set$ebnf$2',
    symbols: ['Set$ebnf$2$subexpression$1'],
    postprocess: id
  }, {
    name: 'Set$ebnf$2',
    symbols: [],
    postprocess: function postprocess() {
      return null;
    }
  }, {
    name: 'Set',
    symbols: ['Set$string$1', 'Set$ebnf$1', 'Set$ebnf$2', {
      literal: '}'
    }],
    postprocess: function postprocess(data) {
      return {
        type: 'set',
        data: data[2] ? data[2][0] : []
      };
    }
  }, {
    name: 'Tag',
    symbols: [{
      literal: '#'
    }, 'Symbol', '_', 'Element'],
    postprocess: function postprocess(data, _l, reject) {
      if (data[1].data[0] === '_') return reject;
      return {
        type: 'tag',
        tag: data[1].data,
        data: data[3]
      };
    }
  }, {
    name: 'Discard$string$1',
    symbols: [{
      literal: '#'
    }, {
      literal: '_'
    }],
    postprocess: function joiner(d) {
      return d.join('');
    }
  }, {
    name: 'Discard$ebnf$1',
    symbols: ['_'],
    postprocess: id
  }, {
    name: 'Discard$ebnf$1',
    symbols: [],
    postprocess: function postprocess() {
      return null;
    }
  }, {
    name: 'Discard',
    symbols: ['Discard$string$1', 'Discard$ebnf$1', 'Element'],
    postprocess: function postprocess() {
      return {
        type: 'discard'
      };
    }
  }, {
    name: 'String$ebnf$1',
    symbols: []
  }, {
    name: 'String$ebnf$1',
    symbols: ['String$ebnf$1', 'string_char'],
    postprocess: function arrpush(d) {
      return d[0].concat([d[1]]);
    }
  }, {
    name: 'String',
    symbols: [{
      literal: '"'
    }, 'String$ebnf$1', {
      literal: '"'
    }],
    postprocess: function postprocess(data) {
      return {
        type: 'string',
        data: data[1].join('')
      };
    }
  }, {
    name: 'string_char',
    symbols: [/[^\\"]/]
  }, {
    name: 'string_char',
    symbols: ['backslash']
  }, {
    name: 'string_char',
    symbols: ['backslash_unicode'],
    postprocess: id
  }, {
    name: 'backslash',
    symbols: [{
      literal: '\\'
    }, /["trn\\]/],
    postprocess: function postprocess(data) {
      return data.join('');
    }
  }, {
    name: 'backslash_unicode',
    symbols: [{
      literal: '\\'
    }, 'unicode'],
    postprocess: function postprocess(data) {
      return data[1];
    }
  }, {
    name: 'Reserved$subexpression$1',
    symbols: ['boolean']
  }, {
    name: 'Reserved$subexpression$1',
    symbols: ['nil']
  }, {
    name: 'Reserved',
    symbols: ['Reserved$subexpression$1'],
    postprocess: function postprocess(data) {
      return data[0][0];
    }
  }, {
    name: 'boolean$subexpression$1',
    symbols: ['true']
  }, {
    name: 'boolean$subexpression$1',
    symbols: ['false']
  }, {
    name: 'boolean',
    symbols: ['boolean$subexpression$1'],
    postprocess: function postprocess(data) {
      return data[0][0];
    }
  }, {
    name: 'true$string$1',
    symbols: [{
      literal: 't'
    }, {
      literal: 'r'
    }, {
      literal: 'u'
    }, {
      literal: 'e'
    }],
    postprocess: function joiner(d) {
      return d.join('');
    }
  }, {
    name: 'true',
    symbols: ['true$string$1'],
    postprocess: function postprocess() {
      return {
        type: 'bool',
        data: true
      };
    }
  }, {
    name: 'false$string$1',
    symbols: [{
      literal: 'f'
    }, {
      literal: 'a'
    }, {
      literal: 'l'
    }, {
      literal: 's'
    }, {
      literal: 'e'
    }],
    postprocess: function joiner(d) {
      return d.join('');
    }
  }, {
    name: 'false',
    symbols: ['false$string$1'],
    postprocess: function postprocess() {
      return {
        type: 'bool',
        data: false
      };
    }
  }, {
    name: 'nil$string$1',
    symbols: [{
      literal: 'n'
    }, {
      literal: 'i'
    }, {
      literal: 'l'
    }],
    postprocess: function joiner(d) {
      return d.join('');
    }
  }, {
    name: 'nil',
    symbols: ['nil$string$1'],
    postprocess: function postprocess() {
      return {
        type: 'nil',
        data: null
      };
    }
  }, {
    name: 'Symbol$subexpression$1',
    symbols: ['symbol']
  }, {
    name: 'Symbol$subexpression$1',
    symbols: [{
      literal: '/'
    }]
  }, {
    name: 'Symbol',
    symbols: ['Symbol$subexpression$1'],
    postprocess: function postprocess(data, _, reject) {
      if (data[0][0] === 'true' || data[0][0] === 'false' || data[0][0] === 'nil') return reject;
      return {
        type: 'symbol',
        data: data[0][0]
      };
    }
  }, {
    name: 'symbol$ebnf$1$subexpression$1',
    symbols: [{
      literal: '/'
    }, 'symbol_piece']
  }, {
    name: 'symbol$ebnf$1',
    symbols: ['symbol$ebnf$1$subexpression$1'],
    postprocess: id
  }, {
    name: 'symbol$ebnf$1',
    symbols: [],
    postprocess: function postprocess() {
      return null;
    }
  }, {
    name: 'symbol',
    symbols: ['symbol_piece', 'symbol$ebnf$1'],
    postprocess: function postprocess(data) {
      return data[0] + (data[1] ? data[1].join('') : '');
    }
  }, {
    name: 'symbol_piece',
    symbols: ['symbol_piece_basic']
  }, {
    name: 'symbol_piece',
    symbols: ['symbol_piece_num'],
    postprocess: id
  }, {
    name: 'symbol_piece_basic$ebnf$1',
    symbols: []
  }, {
    name: 'symbol_piece_basic$ebnf$1',
    symbols: ['symbol_piece_basic$ebnf$1', 'symbol_mid'],
    postprocess: function arrpush(d) {
      return d[0].concat([d[1]]);
    }
  }, {
    name: 'symbol_piece_basic',
    symbols: ['symbol_start', 'symbol_piece_basic$ebnf$1'],
    postprocess: function postprocess(data) {
      return data[0] + data[1].join('');
    }
  }, {
    name: 'symbol_piece_num$ebnf$1$subexpression$1$ebnf$1',
    symbols: []
  }, {
    name: 'symbol_piece_num$ebnf$1$subexpression$1$ebnf$1',
    symbols: ['symbol_piece_num$ebnf$1$subexpression$1$ebnf$1', 'symbol_mid'],
    postprocess: function arrpush(d) {
      return d[0].concat([d[1]]);
    }
  }, {
    name: 'symbol_piece_num$ebnf$1$subexpression$1',
    symbols: ['symbol_second_special', 'symbol_piece_num$ebnf$1$subexpression$1$ebnf$1']
  }, {
    name: 'symbol_piece_num$ebnf$1',
    symbols: ['symbol_piece_num$ebnf$1$subexpression$1'],
    postprocess: id
  }, {
    name: 'symbol_piece_num$ebnf$1',
    symbols: [],
    postprocess: function postprocess() {
      return null;
    }
  }, {
    name: 'symbol_piece_num',
    symbols: [/[\-+.]/, 'symbol_piece_num$ebnf$1'],
    postprocess: function postprocess(data) {
      return data[0] + (data[1] ? data[1][0] + data[1][1].join('') : '');
    }
  }, {
    name: 'symbol_basic$ebnf$1',
    symbols: []
  }, {
    name: 'symbol_basic$ebnf$1',
    symbols: ['symbol_basic$ebnf$1', 'symbol_mid'],
    postprocess: function arrpush(d) {
      return d[0].concat([d[1]]);
    }
  }, {
    name: 'symbol_basic$ebnf$2$subexpression$1',
    symbols: [{
      literal: '/'
    }, 'symbol_piece']
  }, {
    name: 'symbol_basic$ebnf$2',
    symbols: ['symbol_basic$ebnf$2$subexpression$1'],
    postprocess: id
  }, {
    name: 'symbol_basic$ebnf$2',
    symbols: [],
    postprocess: function postprocess() {
      return null;
    }
  }, {
    name: 'symbol_basic',
    symbols: ['symbol_start', 'symbol_basic$ebnf$1', 'symbol_basic$ebnf$2'],
    postprocess: function postprocess(data) {
      return data[0] + data[1].join('') + (data[2] ? data[2].join('') : '');
    }
  }, {
    name: 'symbol_start',
    symbols: ['letter']
  }, {
    name: 'symbol_start',
    symbols: [/[*~_!?$%&=<>]/],
    postprocess: function postprocess(data) {
      return data[0];
    }
  }, {
    name: 'symbol_mid',
    symbols: ['letter']
  }, {
    name: 'symbol_mid',
    symbols: ['digit']
  }, {
    name: 'symbol_mid',
    symbols: [/[.*\!\-+_?$%&=<>:#]/],
    postprocess: function postprocess(data) {
      return data[0];
    }
  }, {
    name: 'symbol_like_a_num$ebnf$1$subexpression$1$ebnf$1',
    symbols: []
  }, {
    name: 'symbol_like_a_num$ebnf$1$subexpression$1$ebnf$1',
    symbols: ['symbol_like_a_num$ebnf$1$subexpression$1$ebnf$1', 'symbol_mid'],
    postprocess: function arrpush(d) {
      return d[0].concat([d[1]]);
    }
  }, {
    name: 'symbol_like_a_num$ebnf$1$subexpression$1',
    symbols: ['symbol_second_special', 'symbol_like_a_num$ebnf$1$subexpression$1$ebnf$1']
  }, {
    name: 'symbol_like_a_num$ebnf$1',
    symbols: ['symbol_like_a_num$ebnf$1$subexpression$1'],
    postprocess: id
  }, {
    name: 'symbol_like_a_num$ebnf$1',
    symbols: [],
    postprocess: function postprocess() {
      return null;
    }
  }, {
    name: 'symbol_like_a_num$ebnf$2$subexpression$1',
    symbols: [{
      literal: '/'
    }, 'symbol_piece']
  }, {
    name: 'symbol_like_a_num$ebnf$2',
    symbols: ['symbol_like_a_num$ebnf$2$subexpression$1'],
    postprocess: id
  }, {
    name: 'symbol_like_a_num$ebnf$2',
    symbols: [],
    postprocess: function postprocess() {
      return null;
    }
  }, {
    name: 'symbol_like_a_num',
    symbols: [/[\-+.]/, 'symbol_like_a_num$ebnf$1', 'symbol_like_a_num$ebnf$2'],
    postprocess: function postprocess(data) {
      return data[0] + (data[1] ? data[1][0] + data[1][1].join('') : '') + (data[2] ? data[2].join('') : '');
    }
  }, {
    name: 'symbol_second_special',
    symbols: ['symbol_start']
  }, {
    name: 'symbol_second_special',
    symbols: [/[\-+.:#]/],
    postprocess: function postprocess(data) {
      return data[0];
    }
  }, {
    name: 'Keyword',
    symbols: [{
      literal: ':'
    }, 'Symbol'],
    postprocess: function postprocess(data) {
      return {
        type: 'keyword',
        data: ':' + data[1].data
      };
    }
  }, {
    name: 'Character',
    symbols: [{
      literal: '\\'
    }, 'char'],
    postprocess: function postprocess(data) {
      return {
        type: 'char',
        data: data[1][0]
      };
    }
  }, {
    name: 'char',
    symbols: [/[^ \t\r\n]/]
  }, {
    name: 'char$string$1',
    symbols: [{
      literal: 'n'
    }, {
      literal: 'e'
    }, {
      literal: 'w'
    }, {
      literal: 'l'
    }, {
      literal: 'i'
    }, {
      literal: 'n'
    }, {
      literal: 'e'
    }],
    postprocess: function joiner(d) {
      return d.join('');
    }
  }, {
    name: 'char',
    symbols: ['char$string$1']
  }, {
    name: 'char$string$2',
    symbols: [{
      literal: 'r'
    }, {
      literal: 'e'
    }, {
      literal: 't'
    }, {
      literal: 'u'
    }, {
      literal: 'r'
    }, {
      literal: 'n'
    }],
    postprocess: function joiner(d) {
      return d.join('');
    }
  }, {
    name: 'char',
    symbols: ['char$string$2']
  }, {
    name: 'char$string$3',
    symbols: [{
      literal: 's'
    }, {
      literal: 'p'
    }, {
      literal: 'a'
    }, {
      literal: 'c'
    }, {
      literal: 'e'
    }],
    postprocess: function joiner(d) {
      return d.join('');
    }
  }, {
    name: 'char',
    symbols: ['char$string$3']
  }, {
    name: 'char$string$4',
    symbols: [{
      literal: 't'
    }, {
      literal: 'a'
    }, {
      literal: 'b'
    }],
    postprocess: function joiner(d) {
      return d.join('');
    }
  }, {
    name: 'char',
    symbols: ['char$string$4']
  }, {
    name: 'char',
    symbols: ['unicode'],
    postprocess: function postprocess(data) {
      return data[0];
    }
  }, {
    name: 'Number',
    symbols: ['Integer']
  }, {
    name: 'Number',
    symbols: ['Float'],
    postprocess: function postprocess(data) {
      return data[0];
    }
  }, {
    name: 'Float',
    symbols: ['float'],
    postprocess: function postprocess(data) {
      return {
        type: 'double',
        data: data[0][0],
        arbitrary: !!data[0][1]
      };
    }
  }, {
    name: 'Integer$ebnf$1',
    symbols: [{
      literal: 'N'
    }],
    postprocess: id
  }, {
    name: 'Integer$ebnf$1',
    symbols: [],
    postprocess: function postprocess() {
      return null;
    }
  }, {
    name: 'Integer',
    symbols: ['int', 'Integer$ebnf$1'],
    postprocess: function postprocess(data) {
      return {
        type: 'int',
        data: data[0][0],
        arbitrary: !!data[1]
      };
    }
  }, {
    name: 'float',
    symbols: ['int', {
      literal: 'M'
    }],
    postprocess: function postprocess(data) {
      return [data.slice(0, 1).join(''), data[1]];
    }
  }, {
    name: 'float$ebnf$1',
    symbols: [{
      literal: 'M'
    }],
    postprocess: id
  }, {
    name: 'float$ebnf$1',
    symbols: [],
    postprocess: function postprocess() {
      return null;
    }
  }, {
    name: 'float',
    symbols: ['int', 'frac', 'float$ebnf$1'],
    postprocess: function postprocess(data) {
      return [data.slice(0, 2).join(''), data[2]];
    }
  }, {
    name: 'float$ebnf$2',
    symbols: [{
      literal: 'M'
    }],
    postprocess: id
  }, {
    name: 'float$ebnf$2',
    symbols: [],
    postprocess: function postprocess() {
      return null;
    }
  }, {
    name: 'float',
    symbols: ['int', 'exp', 'float$ebnf$2'],
    postprocess: function postprocess(data) {
      return [data.slice(0, 2).join(''), data[2]];
    }
  }, {
    name: 'float$ebnf$3',
    symbols: [{
      literal: 'M'
    }],
    postprocess: id
  }, {
    name: 'float$ebnf$3',
    symbols: [],
    postprocess: function postprocess() {
      return null;
    }
  }, {
    name: 'float',
    symbols: ['int', 'frac', 'exp', 'float$ebnf$3'],
    postprocess: function postprocess(data) {
      return [data.slice(0, 3).join(''), data[2]];
    }
  }, {
    name: 'frac$ebnf$1',
    symbols: []
  }, {
    name: 'frac$ebnf$1',
    symbols: ['frac$ebnf$1', 'digit'],
    postprocess: function arrpush(d) {
      return d[0].concat([d[1]]);
    }
  }, {
    name: 'frac',
    symbols: [{
      literal: '.'
    }, 'frac$ebnf$1'],
    postprocess: function postprocess(data) {
      return data[0] + data[1].join('');
    }
  }, {
    name: 'exp',
    symbols: ['ex', 'digits'],
    postprocess: function postprocess(data) {
      return data.join('');
    }
  }, {
    name: 'ex$subexpression$1',
    symbols: [{
      literal: 'e'
    }]
  }, {
    name: 'ex$subexpression$1',
    symbols: [{
      literal: 'E'
    }]
  }, {
    name: 'ex$ebnf$1$subexpression$1',
    symbols: [{
      literal: '+'
    }]
  }, {
    name: 'ex$ebnf$1$subexpression$1',
    symbols: [{
      literal: '-'
    }]
  }, {
    name: 'ex$ebnf$1',
    symbols: ['ex$ebnf$1$subexpression$1'],
    postprocess: id
  }, {
    name: 'ex$ebnf$1',
    symbols: [],
    postprocess: function postprocess() {
      return null;
    }
  }, {
    name: 'ex',
    symbols: ['ex$subexpression$1', 'ex$ebnf$1'],
    postprocess: function postprocess(data) {
      return 'e' + (data[1] || '+');
    }
  }, {
    name: 'int',
    symbols: ['int_no_prefix']
  }, {
    name: 'int',
    symbols: [{
      literal: '+'
    }, 'int_no_prefix'],
    postprocess: function postprocess(data) {
      return data.join('');
    }
  }, {
    name: 'int',
    symbols: [{
      literal: '-'
    }, 'int_no_prefix'],
    postprocess: function postprocess(data) {
      return data.join('');
    }
  }, {
    name: 'int_no_prefix',
    symbols: [{
      literal: '0'
    }],
    postprocess: function postprocess(data) {
      return data.join('');
    }
  }, {
    name: 'int_no_prefix$ebnf$1',
    symbols: []
  }, {
    name: 'int_no_prefix$ebnf$1',
    symbols: ['int_no_prefix$ebnf$1', 'digit'],
    postprocess: function arrpush(d) {
      return d[0].concat([d[1]]);
    }
  }, {
    name: 'int_no_prefix',
    symbols: ['oneToNine', 'int_no_prefix$ebnf$1'],
    postprocess: function postprocess(data) {
      return data[0] + data[1].join('');
    }
  }, {
    name: 'oneToNine',
    symbols: [/[1-9]/],
    postprocess: function postprocess(data) {
      return data.join('');
    }
  }, {
    name: 'MapElem',
    symbols: ['mapKey', 'mapValue'],
    postprocess: function postprocess(data) {
      return [[data[0][0], data[1][0]]].concat(data[1].slice(1));
    }
  }, {
    name: 'mapKey$subexpression$1',
    symbols: ['mapKeySpace']
  }, {
    name: 'mapKey$subexpression$1',
    symbols: ['mapKeyNoSpace']
  }, {
    name: 'mapKey',
    symbols: ['mapKey$subexpression$1'],
    postprocess: function postprocess(data) {
      return data[0];
    }
  }, {
    name: 'mapValue$subexpression$1',
    symbols: ['mapValueSpace']
  }, {
    name: 'mapValue$subexpression$1',
    symbols: ['mapValueNoSpace']
  }, {
    name: 'mapValue',
    symbols: ['mapValue$subexpression$1'],
    postprocess: function postprocess(data) {
      return data[0][0];
    }
  }, {
    name: 'mapKeySpace$ebnf$1',
    symbols: []
  }, {
    name: 'mapKeySpace$ebnf$1$subexpression$1',
    symbols: ['Discard', '_']
  }, {
    name: 'mapKeySpace$ebnf$1',
    symbols: ['mapKeySpace$ebnf$1', 'mapKeySpace$ebnf$1$subexpression$1'],
    postprocess: function arrpush(d) {
      return d[0].concat([d[1]]);
    }
  }, {
    name: 'mapKeySpace',
    symbols: ['mapKeySpace$ebnf$1', 'mapElementSpace', '_'],
    postprocess: function postprocess(data) {
      return data[1];
    }
  }, {
    name: 'mapKeyNoSpace$ebnf$1',
    symbols: []
  }, {
    name: 'mapKeyNoSpace$ebnf$1$subexpression$1$ebnf$1',
    symbols: ['_'],
    postprocess: id
  }, {
    name: 'mapKeyNoSpace$ebnf$1$subexpression$1$ebnf$1',
    symbols: [],
    postprocess: function postprocess() {
      return null;
    }
  }, {
    name: 'mapKeyNoSpace$ebnf$1$subexpression$1',
    symbols: ['Discard', 'mapKeyNoSpace$ebnf$1$subexpression$1$ebnf$1']
  }, {
    name: 'mapKeyNoSpace$ebnf$1',
    symbols: ['mapKeyNoSpace$ebnf$1', 'mapKeyNoSpace$ebnf$1$subexpression$1'],
    postprocess: function arrpush(d) {
      return d[0].concat([d[1]]);
    }
  }, {
    name: 'mapKeyNoSpace$ebnf$2',
    symbols: ['_'],
    postprocess: id
  }, {
    name: 'mapKeyNoSpace$ebnf$2',
    symbols: [],
    postprocess: function postprocess() {
      return null;
    }
  }, {
    name: 'mapKeyNoSpace',
    symbols: ['mapKeyNoSpace$ebnf$1', 'mapElementNoSpace', 'mapKeyNoSpace$ebnf$2'],
    postprocess: function postprocess(data) {
      return data[1];
    }
  }, {
    name: 'mapValueSpace$ebnf$1',
    symbols: []
  }, {
    name: 'mapValueSpace$ebnf$1$subexpression$1',
    symbols: ['Discard', '_']
  }, {
    name: 'mapValueSpace$ebnf$1',
    symbols: ['mapValueSpace$ebnf$1', 'mapValueSpace$ebnf$1$subexpression$1'],
    postprocess: function arrpush(d) {
      return d[0].concat([d[1]]);
    }
  }, {
    name: 'mapValueSpace$ebnf$2$subexpression$1',
    symbols: ['_', 'MapElem']
  }, {
    name: 'mapValueSpace$ebnf$2',
    symbols: ['mapValueSpace$ebnf$2$subexpression$1'],
    postprocess: id
  }, {
    name: 'mapValueSpace$ebnf$2',
    symbols: [],
    postprocess: function postprocess() {
      return null;
    }
  }, {
    name: 'mapValueSpace',
    symbols: ['mapValueSpace$ebnf$1', 'mapElementSpace', 'mapValueSpace$ebnf$2'],
    postprocess: function postprocess(data) {
      return [data[1]].concat(data[2] ? data[2][1] : []);
    }
  }, {
    name: 'mapValueNoSpace$ebnf$1',
    symbols: []
  }, {
    name: 'mapValueNoSpace$ebnf$1$subexpression$1$ebnf$1',
    symbols: ['_'],
    postprocess: id
  }, {
    name: 'mapValueNoSpace$ebnf$1$subexpression$1$ebnf$1',
    symbols: [],
    postprocess: function postprocess() {
      return null;
    }
  }, {
    name: 'mapValueNoSpace$ebnf$1$subexpression$1',
    symbols: ['Discard', 'mapValueNoSpace$ebnf$1$subexpression$1$ebnf$1']
  }, {
    name: 'mapValueNoSpace$ebnf$1',
    symbols: ['mapValueNoSpace$ebnf$1', 'mapValueNoSpace$ebnf$1$subexpression$1'],
    postprocess: function arrpush(d) {
      return d[0].concat([d[1]]);
    }
  }, {
    name: 'mapValueNoSpace$ebnf$2$subexpression$1$ebnf$1',
    symbols: ['_'],
    postprocess: id
  }, {
    name: 'mapValueNoSpace$ebnf$2$subexpression$1$ebnf$1',
    symbols: [],
    postprocess: function postprocess() {
      return null;
    }
  }, {
    name: 'mapValueNoSpace$ebnf$2$subexpression$1',
    symbols: ['mapValueNoSpace$ebnf$2$subexpression$1$ebnf$1', 'MapElem']
  }, {
    name: 'mapValueNoSpace$ebnf$2',
    symbols: ['mapValueNoSpace$ebnf$2$subexpression$1'],
    postprocess: id
  }, {
    name: 'mapValueNoSpace$ebnf$2',
    symbols: [],
    postprocess: function postprocess() {
      return null;
    }
  }, {
    name: 'mapValueNoSpace',
    symbols: ['mapValueNoSpace$ebnf$1', 'mapElementNoSpace', 'mapValueNoSpace$ebnf$2'],
    postprocess: function postprocess(data) {
      return [data[1]].concat(data[2] ? data[2][1] : []);
    }
  }, {
    name: 'mapElementNoSpace$subexpression$1',
    symbols: ['Vector']
  }, {
    name: 'mapElementNoSpace$subexpression$1',
    symbols: ['List']
  }, {
    name: 'mapElementNoSpace$subexpression$1',
    symbols: ['String']
  }, {
    name: 'mapElementNoSpace$subexpression$1',
    symbols: ['Map']
  }, {
    name: 'mapElementNoSpace$subexpression$1',
    symbols: ['Set']
  }, {
    name: 'mapElementNoSpace',
    symbols: ['mapElementNoSpace$subexpression$1'],
    postprocess: function postprocess(data) {
      return data[0][0];
    }
  }, {
    name: 'mapElementSpace$subexpression$1',
    symbols: ['Number']
  }, {
    name: 'mapElementSpace$subexpression$1',
    symbols: ['Character']
  }, {
    name: 'mapElementSpace$subexpression$1',
    symbols: ['Reserved']
  }, {
    name: 'mapElementSpace$subexpression$1',
    symbols: ['Symbol']
  }, {
    name: 'mapElementSpace$subexpression$1',
    symbols: ['Keyword']
  }, {
    name: 'mapElementSpace$subexpression$1',
    symbols: ['Tag']
  }, {
    name: 'mapElementSpace',
    symbols: ['mapElementSpace$subexpression$1'],
    postprocess: function postprocess(data) {
      return [].concat.apply([], [data[0][0]])[0];
    }
  }, {
    name: 'hexDigit',
    symbols: [/[a-fA-F0-9]/],
    postprocess: function postprocess(data) {
      return data[0];
    }
  }, {
    name: 'unicode',
    symbols: [{
      literal: 'u'
    }, 'hexDigit', 'hexDigit', 'hexDigit', 'hexDigit'],
    postprocess: function postprocess(data) {
      return String.fromCharCode(parseInt(data.slice(1).join(''), 16));
    }
  }, {
    name: '_',
    symbols: ['space'],
    postprocess: function postprocess(data) {
      return data[0];
    }
  }, {
    name: 'space$ebnf$1',
    symbols: [/[\s,\n]/]
  }, {
    name: 'space$ebnf$1',
    symbols: ['space$ebnf$1', /[\s,\n]/],
    postprocess: function arrpush(d) {
      return d[0].concat([d[1]]);
    }
  }, {
    name: 'space',
    symbols: ['space$ebnf$1'],
    postprocess: function postprocess(data) {
      return data[0].join('');
    }
  }, {
    name: 'digits$ebnf$1',
    symbols: ['digit']
  }, {
    name: 'digits$ebnf$1',
    symbols: ['digits$ebnf$1', 'digit'],
    postprocess: function arrpush(d) {
      return d[0].concat([d[1]]);
    }
  }, {
    name: 'digits',
    symbols: ['digits$ebnf$1'],
    postprocess: function postprocess(data) {
      return data[0].join('');
    }
  }, {
    name: 'digit',
    symbols: [/[0-9]/],
    postprocess: function postprocess(data) {
      return data[0];
    }
  }, {
    name: 'letter',
    symbols: [/[a-zA-Z]/],
    postprocess: function postprocess(data) {
      return data[0];
    }
  }],
  ParserStart: 'Main'
}; // Do the parsing

var nearley_1 = __webpack_require__(/*! nearley */ "./node_modules/nearley/lib/nearley.js");

var preprocessor_1 = __webpack_require__(/*! ./preprocessor */ "./src/preprocessor.ts");

function parse(string) {
  var parser = new nearley_1.Parser(nearley_1.Grammar.fromCompiled(grammar));
  var str = preprocessor_1.preprocess(string);
  if (!str) return null;

  try {
    return parser.feed(preprocessor_1.preprocess(string)).results[0];
  } catch (_a) {
    return false;
  }
}

exports.parse = parse;

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) {
    if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  }
  result["default"] = mod;
  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var grammar_1 = __webpack_require__(/*! ./grammar */ "./src/grammar.ts");

var interpreter_1 = __webpack_require__(/*! ./interpreter */ "./src/interpreter.ts");

var stringify_1 = __webpack_require__(/*! ./stringify */ "./src/stringify.ts");

var json_interpreter_1 = __webpack_require__(/*! ./json_interpreter */ "./src/json_interpreter.ts");

var types = __importStar(__webpack_require__(/*! ./types */ "./src/types.ts"));

exports.Edn = {
  parse: function parse(str) {
    return interpreter_1.processTokens(grammar_1.parse(str));
  },
  parseJson: function parseJson(str) {
    return json_interpreter_1.processTokens(grammar_1.parse(str));
  },
  stringify: stringify_1.stringify,
  types: types
};

/***/ }),

/***/ "./src/interpreter.ts":
/*!****************************!*\
  !*** ./src/interpreter.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var types_1 = __webpack_require__(/*! ./types */ "./src/types.ts");

var arrays_1 = __webpack_require__(/*! tofu-js/dist/arrays */ "./node_modules/tofu-js/dist/arrays/index.js");

var is_1 = __webpack_require__(/*! tofu-js/dist/is */ "./node_modules/tofu-js/dist/is/index.js");

var strings_1 = __webpack_require__(/*! ./strings */ "./src/strings.ts");

function processTokens(tokens) {
  if (!is_1.isArray(tokens)) {
    throw 'Invalid EDN string';
  }

  return tokens.filter(function (t) {
    return t && t.type !== 'discard';
  }).map(processToken);
}

exports.processTokens = processTokens;

function processToken(token) {
  var data = token.data,
      type = token.type,
      tag = token.tag;

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

/***/ }),

/***/ "./src/json_interpreter.ts":
/*!*********************************!*\
  !*** ./src/json_interpreter.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var arrays_1 = __webpack_require__(/*! tofu-js/dist/arrays */ "./node_modules/tofu-js/dist/arrays/index.js");

var is_1 = __webpack_require__(/*! tofu-js/dist/is */ "./node_modules/tofu-js/dist/is/index.js");

var strings_1 = __webpack_require__(/*! ./strings */ "./src/strings.ts");

function processTokens(tokens) {
  if (!is_1.isArray(tokens)) {
    throw 'Invalid EDN string';
  }

  return tokens.filter(function (t) {
    return t && t.type !== 'discard';
  }).map(processToken);
}

exports.processTokens = processTokens;

function processToken(token) {
  var data = token.data,
      type = token.type,
      tag = token.tag;

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
      return {
        tag: tag,
        value: processToken(data)
      };

    case 'list':
    case 'vector':
      return processTokens(data);

    case 'set':
      return arrays_1.fromPairs(arrays_1.map(function (t) {
        return [t, t];
      }, processTokens(data)));

    case 'map':
      return arrays_1.fromPairs(arrays_1.chunk(2, arrays_1.flatMap(processTokens, data)));
  }

  return null;
}

/***/ }),

/***/ "./src/preprocessor.ts":
/*!*****************************!*\
  !*** ./src/preprocessor.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.preprocess = function (str) {
  return removeComments(str).trim();
};

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
    } else if (c === ';' && !inQuotes) {
      inComment = true;
    } else if (c === '\n') {
      newStr += '\n';
      inComment = false;
    } else if (!inComment) {
      newStr += c;
      if (c === '\\') skip = true;else if (c === '"') inQuotes = !inQuotes;
    }
  }

  return newStr;
}

/***/ }),

/***/ "./src/stringify.ts":
/*!**************************!*\
  !*** ./src/stringify.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var fp_1 = __webpack_require__(/*! tofu-js/dist/fp */ "./node_modules/tofu-js/dist/fp/index.js");

var iterators_1 = __webpack_require__(/*! tofu-js/dist/iterators */ "./node_modules/tofu-js/dist/iterators/index.js");

var arrays_1 = __webpack_require__(/*! tofu-js/dist/arrays */ "./node_modules/tofu-js/dist/arrays/index.js");

var types_1 = __webpack_require__(/*! ./types */ "./src/types.ts");

var objects_1 = __webpack_require__(/*! tofu-js/dist/objects */ "./node_modules/tofu-js/dist/objects/index.js");

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
  return '{' + fp_1.pipe(objects_1.entries(data), iterators_1.flatten, iterators_1.map(exports.stringify), iterators_1.collectToArray, arrays_1.join(' ')) + '}';
}

function stringifySet(data) {
  return '#{' + fp_1.pipe(data.values(), iterators_1.map(exports.stringify), iterators_1.collectToArray, arrays_1.join(' ')) + '}';
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

/***/ }),

/***/ "./src/strings.ts":
/*!************************!*\
  !*** ./src/strings.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

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

    default:
      return str;
  }
}

exports.unescapeChar = unescapeChar;

function unescapeStr(str) {
  var parts = str.split('\\');
  return parts.map(function (p, i) {
    return i ? unescapeChar(p) : p;
  }).join('');
}

exports.unescapeStr = unescapeStr;

/***/ }),

/***/ "./src/types.ts":
/*!**********************!*\
  !*** ./src/types.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var is_1 = __webpack_require__(/*! tofu-js/dist/is */ "./node_modules/tofu-js/dist/is/index.js");

var arrays_1 = __webpack_require__(/*! tofu-js/dist/arrays */ "./node_modules/tofu-js/dist/arrays/index.js");

var iterators_1 = __webpack_require__(/*! tofu-js/dist/iterators */ "./node_modules/tofu-js/dist/iterators/index.js");

var fp_1 = __webpack_require__(/*! tofu-js/dist/fp */ "./node_modules/tofu-js/dist/fp/index.js");

var EdnKeyword =
/** @class */
function () {
  function EdnKeyword(keyword) {
    this._keyword = '';
    this.keyword = keyword;
  }

  Object.defineProperty(EdnKeyword.prototype, "keyword", {
    get: function get() {
      return this._keyword;
    },
    set: function set(keyword) {
      if (keyword[0] === ':') {
        keyword = keyword.substr(1);
      }

      this._keyword = keyword;
    },
    enumerable: true,
    configurable: true
  });
  return EdnKeyword;
}();

exports.EdnKeyword = EdnKeyword;

var EdnSymbol =
/** @class */
function () {
  function EdnSymbol(symbol) {
    this.symbol = symbol;
  }

  return EdnSymbol;
}();

exports.EdnSymbol = EdnSymbol;

var EdnTag =
/** @class */
function () {
  function EdnTag(tag, data) {
    this.data = data;
    if (is_1.isString(tag)) this.tag = new EdnSymbol(tag);else this.tag = tag;
  }

  return EdnTag;
}();

exports.EdnTag = EdnTag;

var AnyKeyMap =
/** @class */
function () {
  function AnyKeyMap(data) {
    this.data = new Map();
    this.data = new Map(fp_1.pipe(data, arrays_1.chunk(2), arrays_1.map(function (_a) {
      var key = _a[0],
          value = _a[1];
      return [toKey(key), {
        key: key,
        value: value
      }];
    })));
  }

  AnyKeyMap.prototype.get = function (key) {
    var k = toKey(key);

    if (this.data.has(k)) {
      return this.data.get(k).value;
    } else {
      return null;
    }
  };

  AnyKeyMap.prototype.has = function (key) {
    return this.data.has(toKey(key));
  };

  AnyKeyMap.prototype.set = function (key, value) {
    this.data.set(toKey(key), {
      key: key,
      value: value
    });
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
      var key = _a.key,
          value = _a.value;
      return [key, value];
    }, this.data.values());
  };

  return AnyKeyMap;
}();

var EdnMap =
/** @class */
function () {
  function EdnMap(data) {
    var _this = this;

    this.has = function (key) {
      return _this.data.has(key);
    };

    this.clear = function () {
      return _this.data.clear();
    };

    this.delete = function (key) {
      return _this.data.delete(key);
    };

    this.entries = function () {
      return _this.data.entries();
    };

    this.get = function (key) {
      return _this.data.get(key);
    };

    this.keys = function () {
      return _this.data.keys();
    };

    this.set = function (key, value) {
      return _this.data.set(key, value);
    };

    this.values = function () {
      return _this.data.values();
    };

    this[Symbol.iterator] = function () {
      return _this.data[Symbol.iterator]();
    };

    this.data = new AnyKeyMap(data);
  }

  return EdnMap;
}();

exports.EdnMap = EdnMap;

var EdnSet =
/** @class */
function () {
  function EdnSet(data) {
    var _this = this;

    this.add = function (elem) {
      return _this.data.set(elem, elem);
    };

    this.clear = function () {
      return _this.data.clear();
    };

    this.has = function (elem) {
      return _this.data.has(elem);
    };

    this.delete = function (elem) {
      return _this.data.delete(elem);
    };

    this.entries = function () {
      return _this.data.entries();
    };

    this.values = function () {
      return _this.data.values();
    };

    this[Symbol.iterator] = function () {
      return _this.data[Symbol.iterator]();
    };

    this.data = new AnyKeyMap(fp_1.pipe(data, arrays_1.map(function (d) {
      return [d, d];
    }), arrays_1.flatten));
  }

  return EdnSet;
}();

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
  } else if (is_1.isNumber(input)) {
    return 'Number';
  } else if (is_1.isString(input)) {
    return 'String';
  } else if (input instanceof EdnTag) {
    return 'Tag';
  } else if (input instanceof EdnSymbol) {
    return 'Symbol';
  } else if (input instanceof EdnKeyword) {
    return 'Keyword';
  } else if (input instanceof EdnSet) {
    return 'Set';
  } else if (is_1.isArray(input)) {
    return 'Vector';
  } else if (is_1.isObject(input) || input instanceof EdnMap) {
    return 'Map';
  } else {
    return 'Other';
  }
}

exports.type = type;

exports.keyword = function (str) {
  return new EdnKeyword(str);
};

exports.symbol = function (str) {
  return new EdnSymbol(str);
};

exports.set = function (data) {
  return new EdnSet(data);
};

exports.map = function (data) {
  return new EdnMap(data);
};

exports.tag = function (tag, data) {
  return new EdnTag(tag, data);
};

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
  return '{' + fp_1.pipe(data.entries(), iterators_1.flatten, iterators_1.map(exports.stringify), iterators_1.collectToArray, arrays_1.join(' ')) + '}';
}

function stringifySet(data) {
  return '#{' + fp_1.pipe(data.values(), iterators_1.map(exports.stringify), iterators_1.collectToArray, arrays_1.join(' ')) + '}';
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

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL25lYXJsZXkvbGliL25lYXJsZXkuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RvZnUtanMvZGlzdC9hcnJheXMvY2h1bmsuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RvZnUtanMvZGlzdC9hcnJheXMvZmlsdGVyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90b2Z1LWpzL2Rpc3QvYXJyYXlzL2ZpcnN0LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90b2Z1LWpzL2Rpc3QvYXJyYXlzL2ZpcnN0T3IuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RvZnUtanMvZGlzdC9hcnJheXMvZmlyc3RPck51bGwuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RvZnUtanMvZGlzdC9hcnJheXMvZmxhdE1hcC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L2FycmF5cy9mbGF0dGVuLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90b2Z1LWpzL2Rpc3QvYXJyYXlzL2Zyb21QYWlycy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L2FycmF5cy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L2FycmF5cy9qb2luLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90b2Z1LWpzL2Rpc3QvYXJyYXlzL2xpbWl0LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90b2Z1LWpzL2Rpc3QvYXJyYXlzL21hcC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L2FycmF5cy9yZWR1Y2UuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RvZnUtanMvZGlzdC9hcnJheXMvc2Nhbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L2FycmF5cy9za2lwLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90b2Z1LWpzL2Rpc3QvYXJyYXlzL3Rha2VXaGlsZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L2FycmF5cy90YXAuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RvZnUtanMvZGlzdC9hcnJheXMvdG9BcnJheU9yRW1wdHkuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RvZnUtanMvZGlzdC9hcnJheXMvemlwLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90b2Z1LWpzL2Rpc3QvZnAvY3VycnkuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RvZnUtanMvZGlzdC9mcC9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L2ZwL3BpcGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RvZnUtanMvZGlzdC9mcC9wcmVkaWNhdGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RvZnUtanMvZGlzdC9mcC9yZXZlcnNlQXJncy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L2ZwL3JldmVyc2VDdXJyeS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L2ZwL3NwcmVhZC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L2lzL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90b2Z1LWpzL2Rpc3QvaXMvaXNBcnJheS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L2lzL2lzRmxvYXQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RvZnUtanMvZGlzdC9pcy9pc0Z1bmN0aW9uLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90b2Z1LWpzL2Rpc3QvaXMvaXNJbmZpbml0ZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L2lzL2lzSW50ZWdlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L2lzL2lzSXRlcmFibGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RvZnUtanMvZGlzdC9pcy9pc05pbC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L2lzL2lzTnVsbC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L2lzL2lzTnVtYmVyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90b2Z1LWpzL2Rpc3QvaXMvaXNPYmplY3QuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RvZnUtanMvZGlzdC9pcy9pc1N0cmluZy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L2lzL2lzVW5kZWZpbmVkLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90b2Z1LWpzL2Rpc3QvaXRlcmF0b3JzL2NodW5rLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90b2Z1LWpzL2Rpc3QvaXRlcmF0b3JzL2NvbGxlY3RUb0FycmF5LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90b2Z1LWpzL2Rpc3QvaXRlcmF0b3JzL2ZpbHRlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L2l0ZXJhdG9ycy9maXJzdC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L2l0ZXJhdG9ycy9maXJzdE9yLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90b2Z1LWpzL2Rpc3QvaXRlcmF0b3JzL2ZpcnN0T3JOdWxsLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90b2Z1LWpzL2Rpc3QvaXRlcmF0b3JzL2ZsYXRNYXAuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RvZnUtanMvZGlzdC9pdGVyYXRvcnMvZmxhdHRlbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L2l0ZXJhdG9ycy9oZWFkLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90b2Z1LWpzL2Rpc3QvaXRlcmF0b3JzL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90b2Z1LWpzL2Rpc3QvaXRlcmF0b3JzL2pvaW4uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RvZnUtanMvZGlzdC9pdGVyYXRvcnMvbGltaXQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RvZnUtanMvZGlzdC9pdGVyYXRvcnMvbWFwLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90b2Z1LWpzL2Rpc3QvaXRlcmF0b3JzL3NjYW4uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RvZnUtanMvZGlzdC9pdGVyYXRvcnMvc2tpcC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L2l0ZXJhdG9ycy90YWtlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90b2Z1LWpzL2Rpc3QvaXRlcmF0b3JzL3Rha2VXaGlsZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L2l0ZXJhdG9ycy90YXAuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RvZnUtanMvZGlzdC9pdGVyYXRvcnMvdG9JdGVyYWJsZU9yRW1wdHkuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RvZnUtanMvZGlzdC9pdGVyYXRvcnMvemlwLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90b2Z1LWpzL2Rpc3Qvb2JqZWN0cy9lbnRyaWVzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90b2Z1LWpzL2Rpc3Qvb2JqZWN0cy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L29iamVjdHMvdG9QYWlycy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZ3JhbW1hci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2ludGVycHJldGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9qc29uX2ludGVycHJldGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9wcmVwcm9jZXNzb3IudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N0cmluZ2lmeS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc3RyaW5ncy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdHlwZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0RBQTBDLGdDQUFnQztBQUMxRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdFQUF3RCxrQkFBa0I7QUFDMUU7QUFDQSx5REFBaUQsY0FBYztBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQXlDLGlDQUFpQztBQUMxRSx3SEFBZ0gsbUJBQW1CLEVBQUU7QUFDckk7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7O0FBR0E7QUFDQTs7Ozs7Ozs7Ozs7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QUFMLENBQVMsTUFBZixHQUF3QixHQUF4QixHQUE4QixrQkFBVSxJQUFJLENBQUMsSUFBZixDQUFyQztBQUNEOztBQUVELFNBQVMsZUFBVCxDQUF5QixJQUF6QixFQUF3QztBQUN0QyxTQUFPLElBQUksQ0FBQyxNQUFaO0FBQ0Q7O0FBRUQsU0FBUyxnQkFBVCxDQUEwQixJQUExQixFQUEwQztBQUN4QyxTQUFPLE1BQU0sSUFBSSxDQUFDLE9BQWxCO0FBQ0Q7O0FBRUQsU0FBUyxlQUFULENBQXlCLElBQXpCLEVBQW9DO0FBQ2xDLFNBQU8sTUFBTSxhQUFLLGlCQUFMLEVBQWdCLElBQWhCLEVBQXNCLElBQXRCLENBQTJCLEdBQTNCLENBQU4sR0FBd0MsR0FBL0M7QUFDRCxDIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2luZGV4LnRzXCIpO1xuIiwiKGZ1bmN0aW9uKHJvb3QsIGZhY3RvcnkpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcm9vdC5uZWFybGV5ID0gZmFjdG9yeSgpO1xuICAgIH1cbn0odGhpcywgZnVuY3Rpb24oKSB7XG5cbiAgICBmdW5jdGlvbiBSdWxlKG5hbWUsIHN5bWJvbHMsIHBvc3Rwcm9jZXNzKSB7XG4gICAgICAgIHRoaXMuaWQgPSArK1J1bGUuaGlnaGVzdElkO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLnN5bWJvbHMgPSBzeW1ib2xzOyAgICAgICAgLy8gYSBsaXN0IG9mIGxpdGVyYWwgfCByZWdleCBjbGFzcyB8IG5vbnRlcm1pbmFsXG4gICAgICAgIHRoaXMucG9zdHByb2Nlc3MgPSBwb3N0cHJvY2VzcztcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIFJ1bGUuaGlnaGVzdElkID0gMDtcblxuICAgIFJ1bGUucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24od2l0aEN1cnNvckF0KSB7XG4gICAgICAgIGZ1bmN0aW9uIHN0cmluZ2lmeVN5bWJvbFNlcXVlbmNlIChlKSB7XG4gICAgICAgICAgICByZXR1cm4gZS5saXRlcmFsID8gSlNPTi5zdHJpbmdpZnkoZS5saXRlcmFsKSA6XG4gICAgICAgICAgICAgICAgICAgZS50eXBlID8gJyUnICsgZS50eXBlIDogZS50b1N0cmluZygpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBzeW1ib2xTZXF1ZW5jZSA9ICh0eXBlb2Ygd2l0aEN1cnNvckF0ID09PSBcInVuZGVmaW5lZFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IHRoaXMuc3ltYm9scy5tYXAoc3RyaW5naWZ5U3ltYm9sU2VxdWVuY2UpLmpvaW4oJyAnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICggICB0aGlzLnN5bWJvbHMuc2xpY2UoMCwgd2l0aEN1cnNvckF0KS5tYXAoc3RyaW5naWZ5U3ltYm9sU2VxdWVuY2UpLmpvaW4oJyAnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBcIiDil48gXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgdGhpcy5zeW1ib2xzLnNsaWNlKHdpdGhDdXJzb3JBdCkubWFwKHN0cmluZ2lmeVN5bWJvbFNlcXVlbmNlKS5qb2luKCcgJykgICAgICk7XG4gICAgICAgIHJldHVybiB0aGlzLm5hbWUgKyBcIiDihpIgXCIgKyBzeW1ib2xTZXF1ZW5jZTtcbiAgICB9XG5cblxuICAgIC8vIGEgU3RhdGUgaXMgYSBydWxlIGF0IGEgcG9zaXRpb24gZnJvbSBhIGdpdmVuIHN0YXJ0aW5nIHBvaW50IGluIHRoZSBpbnB1dCBzdHJlYW0gKHJlZmVyZW5jZSlcbiAgICBmdW5jdGlvbiBTdGF0ZShydWxlLCBkb3QsIHJlZmVyZW5jZSwgd2FudGVkQnkpIHtcbiAgICAgICAgdGhpcy5ydWxlID0gcnVsZTtcbiAgICAgICAgdGhpcy5kb3QgPSBkb3Q7XG4gICAgICAgIHRoaXMucmVmZXJlbmNlID0gcmVmZXJlbmNlO1xuICAgICAgICB0aGlzLmRhdGEgPSBbXTtcbiAgICAgICAgdGhpcy53YW50ZWRCeSA9IHdhbnRlZEJ5O1xuICAgICAgICB0aGlzLmlzQ29tcGxldGUgPSB0aGlzLmRvdCA9PT0gcnVsZS5zeW1ib2xzLmxlbmd0aDtcbiAgICB9XG5cbiAgICBTdGF0ZS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIFwie1wiICsgdGhpcy5ydWxlLnRvU3RyaW5nKHRoaXMuZG90KSArIFwifSwgZnJvbTogXCIgKyAodGhpcy5yZWZlcmVuY2UgfHwgMCk7XG4gICAgfTtcblxuICAgIFN0YXRlLnByb3RvdHlwZS5uZXh0U3RhdGUgPSBmdW5jdGlvbihjaGlsZCkge1xuICAgICAgICB2YXIgc3RhdGUgPSBuZXcgU3RhdGUodGhpcy5ydWxlLCB0aGlzLmRvdCArIDEsIHRoaXMucmVmZXJlbmNlLCB0aGlzLndhbnRlZEJ5KTtcbiAgICAgICAgc3RhdGUubGVmdCA9IHRoaXM7XG4gICAgICAgIHN0YXRlLnJpZ2h0ID0gY2hpbGQ7XG4gICAgICAgIGlmIChzdGF0ZS5pc0NvbXBsZXRlKSB7XG4gICAgICAgICAgICBzdGF0ZS5kYXRhID0gc3RhdGUuYnVpbGQoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgfTtcblxuICAgIFN0YXRlLnByb3RvdHlwZS5idWlsZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgY2hpbGRyZW4gPSBbXTtcbiAgICAgICAgdmFyIG5vZGUgPSB0aGlzO1xuICAgICAgICBkbyB7XG4gICAgICAgICAgICBjaGlsZHJlbi5wdXNoKG5vZGUucmlnaHQuZGF0YSk7XG4gICAgICAgICAgICBub2RlID0gbm9kZS5sZWZ0O1xuICAgICAgICB9IHdoaWxlIChub2RlLmxlZnQpO1xuICAgICAgICBjaGlsZHJlbi5yZXZlcnNlKCk7XG4gICAgICAgIHJldHVybiBjaGlsZHJlbjtcbiAgICB9O1xuXG4gICAgU3RhdGUucHJvdG90eXBlLmZpbmlzaCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5ydWxlLnBvc3Rwcm9jZXNzKSB7XG4gICAgICAgICAgICB0aGlzLmRhdGEgPSB0aGlzLnJ1bGUucG9zdHByb2Nlc3ModGhpcy5kYXRhLCB0aGlzLnJlZmVyZW5jZSwgUGFyc2VyLmZhaWwpO1xuICAgICAgICB9XG4gICAgfTtcblxuXG4gICAgZnVuY3Rpb24gQ29sdW1uKGdyYW1tYXIsIGluZGV4KSB7XG4gICAgICAgIHRoaXMuZ3JhbW1hciA9IGdyYW1tYXI7XG4gICAgICAgIHRoaXMuaW5kZXggPSBpbmRleDtcbiAgICAgICAgdGhpcy5zdGF0ZXMgPSBbXTtcbiAgICAgICAgdGhpcy53YW50cyA9IHt9OyAvLyBzdGF0ZXMgaW5kZXhlZCBieSB0aGUgbm9uLXRlcm1pbmFsIHRoZXkgZXhwZWN0XG4gICAgICAgIHRoaXMuc2Nhbm5hYmxlID0gW107IC8vIGxpc3Qgb2Ygc3RhdGVzIHRoYXQgZXhwZWN0IGEgdG9rZW5cbiAgICAgICAgdGhpcy5jb21wbGV0ZWQgPSB7fTsgLy8gc3RhdGVzIHRoYXQgYXJlIG51bGxhYmxlXG4gICAgfVxuXG5cbiAgICBDb2x1bW4ucHJvdG90eXBlLnByb2Nlc3MgPSBmdW5jdGlvbihuZXh0Q29sdW1uKSB7XG4gICAgICAgIHZhciBzdGF0ZXMgPSB0aGlzLnN0YXRlcztcbiAgICAgICAgdmFyIHdhbnRzID0gdGhpcy53YW50cztcbiAgICAgICAgdmFyIGNvbXBsZXRlZCA9IHRoaXMuY29tcGxldGVkO1xuXG4gICAgICAgIGZvciAodmFyIHcgPSAwOyB3IDwgc3RhdGVzLmxlbmd0aDsgdysrKSB7IC8vIG5iLiB3ZSBwdXNoKCkgZHVyaW5nIGl0ZXJhdGlvblxuICAgICAgICAgICAgdmFyIHN0YXRlID0gc3RhdGVzW3ddO1xuXG4gICAgICAgICAgICBpZiAoc3RhdGUuaXNDb21wbGV0ZSkge1xuICAgICAgICAgICAgICAgIHN0YXRlLmZpbmlzaCgpO1xuICAgICAgICAgICAgICAgIGlmIChzdGF0ZS5kYXRhICE9PSBQYXJzZXIuZmFpbCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBjb21wbGV0ZVxuICAgICAgICAgICAgICAgICAgICB2YXIgd2FudGVkQnkgPSBzdGF0ZS53YW50ZWRCeTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IHdhbnRlZEJ5Lmxlbmd0aDsgaS0tOyApIHsgLy8gdGhpcyBsaW5lIGlzIGhvdFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxlZnQgPSB3YW50ZWRCeVtpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcGxldGUobGVmdCwgc3RhdGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gc3BlY2lhbC1jYXNlIG51bGxhYmxlc1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdGUucmVmZXJlbmNlID09PSB0aGlzLmluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBtYWtlIHN1cmUgZnV0dXJlIHByZWRpY3RvcnMgb2YgdGhpcyBydWxlIGdldCBjb21wbGV0ZWQuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZXhwID0gc3RhdGUucnVsZS5uYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgKHRoaXMuY29tcGxldGVkW2V4cF0gPSB0aGlzLmNvbXBsZXRlZFtleHBdIHx8IFtdKS5wdXNoKHN0YXRlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBxdWV1ZSBzY2FubmFibGUgc3RhdGVzXG4gICAgICAgICAgICAgICAgdmFyIGV4cCA9IHN0YXRlLnJ1bGUuc3ltYm9sc1tzdGF0ZS5kb3RdO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZXhwICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNjYW5uYWJsZS5wdXNoKHN0YXRlKTtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gcHJlZGljdFxuICAgICAgICAgICAgICAgIGlmICh3YW50c1tleHBdKSB7XG4gICAgICAgICAgICAgICAgICAgIHdhbnRzW2V4cF0ucHVzaChzdGF0ZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBsZXRlZC5oYXNPd25Qcm9wZXJ0eShleHApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbnVsbHMgPSBjb21wbGV0ZWRbZXhwXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbnVsbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmlnaHQgPSBudWxsc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbXBsZXRlKHN0YXRlLCByaWdodCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB3YW50c1tleHBdID0gW3N0YXRlXTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmVkaWN0KGV4cCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgQ29sdW1uLnByb3RvdHlwZS5wcmVkaWN0ID0gZnVuY3Rpb24oZXhwKSB7XG4gICAgICAgIHZhciBydWxlcyA9IHRoaXMuZ3JhbW1hci5ieU5hbWVbZXhwXSB8fCBbXTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJ1bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgciA9IHJ1bGVzW2ldO1xuICAgICAgICAgICAgdmFyIHdhbnRlZEJ5ID0gdGhpcy53YW50c1tleHBdO1xuICAgICAgICAgICAgdmFyIHMgPSBuZXcgU3RhdGUociwgMCwgdGhpcy5pbmRleCwgd2FudGVkQnkpO1xuICAgICAgICAgICAgdGhpcy5zdGF0ZXMucHVzaChzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIENvbHVtbi5wcm90b3R5cGUuY29tcGxldGUgPSBmdW5jdGlvbihsZWZ0LCByaWdodCkge1xuICAgICAgICB2YXIgY29weSA9IGxlZnQubmV4dFN0YXRlKHJpZ2h0KTtcbiAgICAgICAgdGhpcy5zdGF0ZXMucHVzaChjb3B5KTtcbiAgICB9XG5cblxuICAgIGZ1bmN0aW9uIEdyYW1tYXIocnVsZXMsIHN0YXJ0KSB7XG4gICAgICAgIHRoaXMucnVsZXMgPSBydWxlcztcbiAgICAgICAgdGhpcy5zdGFydCA9IHN0YXJ0IHx8IHRoaXMucnVsZXNbMF0ubmFtZTtcbiAgICAgICAgdmFyIGJ5TmFtZSA9IHRoaXMuYnlOYW1lID0ge307XG4gICAgICAgIHRoaXMucnVsZXMuZm9yRWFjaChmdW5jdGlvbihydWxlKSB7XG4gICAgICAgICAgICBpZiAoIWJ5TmFtZS5oYXNPd25Qcm9wZXJ0eShydWxlLm5hbWUpKSB7XG4gICAgICAgICAgICAgICAgYnlOYW1lW3J1bGUubmFtZV0gPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJ5TmFtZVtydWxlLm5hbWVdLnB1c2gocnVsZSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIFNvIHdlIGNhbiBhbGxvdyBwYXNzaW5nIChydWxlcywgc3RhcnQpIGRpcmVjdGx5IHRvIFBhcnNlciBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHlcbiAgICBHcmFtbWFyLmZyb21Db21waWxlZCA9IGZ1bmN0aW9uKHJ1bGVzLCBzdGFydCkge1xuICAgICAgICB2YXIgbGV4ZXIgPSBydWxlcy5MZXhlcjtcbiAgICAgICAgaWYgKHJ1bGVzLlBhcnNlclN0YXJ0KSB7XG4gICAgICAgICAgc3RhcnQgPSBydWxlcy5QYXJzZXJTdGFydDtcbiAgICAgICAgICBydWxlcyA9IHJ1bGVzLlBhcnNlclJ1bGVzO1xuICAgICAgICB9XG4gICAgICAgIHZhciBydWxlcyA9IHJ1bGVzLm1hcChmdW5jdGlvbiAocikgeyByZXR1cm4gKG5ldyBSdWxlKHIubmFtZSwgci5zeW1ib2xzLCByLnBvc3Rwcm9jZXNzKSk7IH0pO1xuICAgICAgICB2YXIgZyA9IG5ldyBHcmFtbWFyKHJ1bGVzLCBzdGFydCk7XG4gICAgICAgIGcubGV4ZXIgPSBsZXhlcjsgLy8gbmIuIHN0b3JpbmcgbGV4ZXIgb24gR3JhbW1hciBpcyBpZmZ5LCBidXQgdW5hdm9pZGFibGVcbiAgICAgICAgcmV0dXJuIGc7XG4gICAgfVxuXG5cbiAgICBmdW5jdGlvbiBTdHJlYW1MZXhlcigpIHtcbiAgICAgIHRoaXMucmVzZXQoXCJcIik7XG4gICAgfVxuXG4gICAgU3RyZWFtTGV4ZXIucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24oZGF0YSwgc3RhdGUpIHtcbiAgICAgICAgdGhpcy5idWZmZXIgPSBkYXRhO1xuICAgICAgICB0aGlzLmluZGV4ID0gMDtcbiAgICAgICAgdGhpcy5saW5lID0gc3RhdGUgPyBzdGF0ZS5saW5lIDogMTtcbiAgICAgICAgdGhpcy5sYXN0TGluZUJyZWFrID0gc3RhdGUgPyAtc3RhdGUuY29sIDogMDtcbiAgICB9XG5cbiAgICBTdHJlYW1MZXhlci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5pbmRleCA8IHRoaXMuYnVmZmVyLmxlbmd0aCkge1xuICAgICAgICAgICAgdmFyIGNoID0gdGhpcy5idWZmZXJbdGhpcy5pbmRleCsrXTtcbiAgICAgICAgICAgIGlmIChjaCA9PT0gJ1xcbicpIHtcbiAgICAgICAgICAgICAgdGhpcy5saW5lICs9IDE7XG4gICAgICAgICAgICAgIHRoaXMubGFzdExpbmVCcmVhayA9IHRoaXMuaW5kZXg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4ge3ZhbHVlOiBjaH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBTdHJlYW1MZXhlci5wcm90b3R5cGUuc2F2ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbGluZTogdGhpcy5saW5lLFxuICAgICAgICBjb2w6IHRoaXMuaW5kZXggLSB0aGlzLmxhc3RMaW5lQnJlYWssXG4gICAgICB9XG4gICAgfVxuXG4gICAgU3RyZWFtTGV4ZXIucHJvdG90eXBlLmZvcm1hdEVycm9yID0gZnVuY3Rpb24odG9rZW4sIG1lc3NhZ2UpIHtcbiAgICAgICAgLy8gbmIuIHRoaXMgZ2V0cyBjYWxsZWQgYWZ0ZXIgY29uc3VtaW5nIHRoZSBvZmZlbmRpbmcgdG9rZW4sXG4gICAgICAgIC8vIHNvIHRoZSBjdWxwcml0IGlzIGluZGV4LTFcbiAgICAgICAgdmFyIGJ1ZmZlciA9IHRoaXMuYnVmZmVyO1xuICAgICAgICBpZiAodHlwZW9mIGJ1ZmZlciA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHZhciBuZXh0TGluZUJyZWFrID0gYnVmZmVyLmluZGV4T2YoJ1xcbicsIHRoaXMuaW5kZXgpO1xuICAgICAgICAgICAgaWYgKG5leHRMaW5lQnJlYWsgPT09IC0xKSBuZXh0TGluZUJyZWFrID0gYnVmZmVyLmxlbmd0aDtcbiAgICAgICAgICAgIHZhciBsaW5lID0gYnVmZmVyLnN1YnN0cmluZyh0aGlzLmxhc3RMaW5lQnJlYWssIG5leHRMaW5lQnJlYWspXG4gICAgICAgICAgICB2YXIgY29sID0gdGhpcy5pbmRleCAtIHRoaXMubGFzdExpbmVCcmVhaztcbiAgICAgICAgICAgIG1lc3NhZ2UgKz0gXCIgYXQgbGluZSBcIiArIHRoaXMubGluZSArIFwiIGNvbCBcIiArIGNvbCArIFwiOlxcblxcblwiO1xuICAgICAgICAgICAgbWVzc2FnZSArPSBcIiAgXCIgKyBsaW5lICsgXCJcXG5cIlxuICAgICAgICAgICAgbWVzc2FnZSArPSBcIiAgXCIgKyBBcnJheShjb2wpLmpvaW4oXCIgXCIpICsgXCJeXCJcbiAgICAgICAgICAgIHJldHVybiBtZXNzYWdlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG1lc3NhZ2UgKyBcIiBhdCBpbmRleCBcIiArICh0aGlzLmluZGV4IC0gMSk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIGZ1bmN0aW9uIFBhcnNlcihydWxlcywgc3RhcnQsIG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKHJ1bGVzIGluc3RhbmNlb2YgR3JhbW1hcikge1xuICAgICAgICAgICAgdmFyIGdyYW1tYXIgPSBydWxlcztcbiAgICAgICAgICAgIHZhciBvcHRpb25zID0gc3RhcnQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgZ3JhbW1hciA9IEdyYW1tYXIuZnJvbUNvbXBpbGVkKHJ1bGVzLCBzdGFydCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5ncmFtbWFyID0gZ3JhbW1hcjtcblxuICAgICAgICAvLyBSZWFkIG9wdGlvbnNcbiAgICAgICAgdGhpcy5vcHRpb25zID0ge1xuICAgICAgICAgICAga2VlcEhpc3Rvcnk6IGZhbHNlLFxuICAgICAgICAgICAgbGV4ZXI6IGdyYW1tYXIubGV4ZXIgfHwgbmV3IFN0cmVhbUxleGVyLFxuICAgICAgICB9O1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gKG9wdGlvbnMgfHwge30pKSB7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnNba2V5XSA9IG9wdGlvbnNba2V5XTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFNldHVwIGxleGVyXG4gICAgICAgIHRoaXMubGV4ZXIgPSB0aGlzLm9wdGlvbnMubGV4ZXI7XG4gICAgICAgIHRoaXMubGV4ZXJTdGF0ZSA9IHVuZGVmaW5lZDtcblxuICAgICAgICAvLyBTZXR1cCBhIHRhYmxlXG4gICAgICAgIHZhciBjb2x1bW4gPSBuZXcgQ29sdW1uKGdyYW1tYXIsIDApO1xuICAgICAgICB2YXIgdGFibGUgPSB0aGlzLnRhYmxlID0gW2NvbHVtbl07XG5cbiAgICAgICAgLy8gSSBjb3VsZCBiZSBleHBlY3RpbmcgYW55dGhpbmcuXG4gICAgICAgIGNvbHVtbi53YW50c1tncmFtbWFyLnN0YXJ0XSA9IFtdO1xuICAgICAgICBjb2x1bW4ucHJlZGljdChncmFtbWFyLnN0YXJ0KTtcbiAgICAgICAgLy8gVE9ETyB3aGF0IGlmIHN0YXJ0IHJ1bGUgaXMgbnVsbGFibGU/XG4gICAgICAgIGNvbHVtbi5wcm9jZXNzKCk7XG4gICAgICAgIHRoaXMuY3VycmVudCA9IDA7IC8vIHRva2VuIGluZGV4XG4gICAgfVxuXG4gICAgLy8gY3JlYXRlIGEgcmVzZXJ2ZWQgdG9rZW4gZm9yIGluZGljYXRpbmcgYSBwYXJzZSBmYWlsXG4gICAgUGFyc2VyLmZhaWwgPSB7fTtcblxuICAgIFBhcnNlci5wcm90b3R5cGUuZmVlZCA9IGZ1bmN0aW9uKGNodW5rKSB7XG4gICAgICAgIHZhciBsZXhlciA9IHRoaXMubGV4ZXI7XG4gICAgICAgIGxleGVyLnJlc2V0KGNodW5rLCB0aGlzLmxleGVyU3RhdGUpO1xuXG4gICAgICAgIHZhciB0b2tlbjtcbiAgICAgICAgd2hpbGUgKHRva2VuID0gbGV4ZXIubmV4dCgpKSB7XG4gICAgICAgICAgICAvLyBXZSBhZGQgbmV3IHN0YXRlcyB0byB0YWJsZVtjdXJyZW50KzFdXG4gICAgICAgICAgICB2YXIgY29sdW1uID0gdGhpcy50YWJsZVt0aGlzLmN1cnJlbnRdO1xuXG4gICAgICAgICAgICAvLyBHQyB1bnVzZWQgc3RhdGVzXG4gICAgICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5rZWVwSGlzdG9yeSkge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnRhYmxlW3RoaXMuY3VycmVudCAtIDFdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgbiA9IHRoaXMuY3VycmVudCArIDE7XG4gICAgICAgICAgICB2YXIgbmV4dENvbHVtbiA9IG5ldyBDb2x1bW4odGhpcy5ncmFtbWFyLCBuKTtcbiAgICAgICAgICAgIHRoaXMudGFibGUucHVzaChuZXh0Q29sdW1uKTtcblxuICAgICAgICAgICAgLy8gQWR2YW5jZSBhbGwgdG9rZW5zIHRoYXQgZXhwZWN0IHRoZSBzeW1ib2xcbiAgICAgICAgICAgIHZhciBsaXRlcmFsID0gdG9rZW4udGV4dCAhPT0gdW5kZWZpbmVkID8gdG9rZW4udGV4dCA6IHRva2VuLnZhbHVlO1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gbGV4ZXIuY29uc3RydWN0b3IgPT09IFN0cmVhbUxleGVyID8gdG9rZW4udmFsdWUgOiB0b2tlbjtcbiAgICAgICAgICAgIHZhciBzY2FubmFibGUgPSBjb2x1bW4uc2Nhbm5hYmxlO1xuICAgICAgICAgICAgZm9yICh2YXIgdyA9IHNjYW5uYWJsZS5sZW5ndGg7IHctLTsgKSB7XG4gICAgICAgICAgICAgICAgdmFyIHN0YXRlID0gc2Nhbm5hYmxlW3ddO1xuICAgICAgICAgICAgICAgIHZhciBleHBlY3QgPSBzdGF0ZS5ydWxlLnN5bWJvbHNbc3RhdGUuZG90XTtcbiAgICAgICAgICAgICAgICAvLyBUcnkgdG8gY29uc3VtZSB0aGUgdG9rZW5cbiAgICAgICAgICAgICAgICAvLyBlaXRoZXIgcmVnZXggb3IgbGl0ZXJhbFxuICAgICAgICAgICAgICAgIGlmIChleHBlY3QudGVzdCA/IGV4cGVjdC50ZXN0KHZhbHVlKSA6XG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdC50eXBlID8gZXhwZWN0LnR5cGUgPT09IHRva2VuLnR5cGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBleHBlY3QubGl0ZXJhbCA9PT0gbGl0ZXJhbCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBBZGQgaXRcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5leHQgPSBzdGF0ZS5uZXh0U3RhdGUoe2RhdGE6IHZhbHVlLCB0b2tlbjogdG9rZW4sIGlzVG9rZW46IHRydWUsIHJlZmVyZW5jZTogbiAtIDF9KTtcbiAgICAgICAgICAgICAgICAgICAgbmV4dENvbHVtbi5zdGF0ZXMucHVzaChuZXh0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIE5leHQsIGZvciBlYWNoIG9mIHRoZSBydWxlcywgd2UgZWl0aGVyXG4gICAgICAgICAgICAvLyAoYSkgY29tcGxldGUgaXQsIGFuZCB0cnkgdG8gc2VlIGlmIHRoZSByZWZlcmVuY2Ugcm93IGV4cGVjdGVkIHRoYXRcbiAgICAgICAgICAgIC8vICAgICBydWxlXG4gICAgICAgICAgICAvLyAoYikgcHJlZGljdCB0aGUgbmV4dCBub250ZXJtaW5hbCBpdCBleHBlY3RzIGJ5IGFkZGluZyB0aGF0XG4gICAgICAgICAgICAvLyAgICAgbm9udGVybWluYWwncyBzdGFydCBzdGF0ZVxuICAgICAgICAgICAgLy8gVG8gcHJldmVudCBkdXBsaWNhdGlvbiwgd2UgYWxzbyBrZWVwIHRyYWNrIG9mIHJ1bGVzIHdlIGhhdmUgYWxyZWFkeVxuICAgICAgICAgICAgLy8gYWRkZWRcblxuICAgICAgICAgICAgbmV4dENvbHVtbi5wcm9jZXNzKCk7XG5cbiAgICAgICAgICAgIC8vIElmIG5lZWRlZCwgdGhyb3cgYW4gZXJyb3I6XG4gICAgICAgICAgICBpZiAobmV4dENvbHVtbi5zdGF0ZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgLy8gTm8gc3RhdGVzIGF0IGFsbCEgVGhpcyBpcyBub3QgZ29vZC5cbiAgICAgICAgICAgICAgICB2YXIgbWVzc2FnZSA9IHRoaXMubGV4ZXIuZm9ybWF0RXJyb3IodG9rZW4sIFwiaW52YWxpZCBzeW50YXhcIikgKyBcIlxcblwiO1xuICAgICAgICAgICAgICAgIG1lc3NhZ2UgKz0gXCJVbmV4cGVjdGVkIFwiICsgKHRva2VuLnR5cGUgPyB0b2tlbi50eXBlICsgXCIgdG9rZW46IFwiIDogXCJcIik7XG4gICAgICAgICAgICAgICAgbWVzc2FnZSArPSBKU09OLnN0cmluZ2lmeSh0b2tlbi52YWx1ZSAhPT0gdW5kZWZpbmVkID8gdG9rZW4udmFsdWUgOiB0b2tlbikgKyBcIlxcblwiO1xuICAgICAgICAgICAgICAgIHZhciBlcnIgPSBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgZXJyLm9mZnNldCA9IHRoaXMuY3VycmVudDtcbiAgICAgICAgICAgICAgICBlcnIudG9rZW4gPSB0b2tlbjtcbiAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIG1heWJlIHNhdmUgbGV4ZXIgc3RhdGVcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMua2VlcEhpc3RvcnkpIHtcbiAgICAgICAgICAgICAgY29sdW1uLmxleGVyU3RhdGUgPSBsZXhlci5zYXZlKClcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5jdXJyZW50Kys7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbHVtbikge1xuICAgICAgICAgIHRoaXMubGV4ZXJTdGF0ZSA9IGxleGVyLnNhdmUoKVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gSW5jcmVtZW50YWxseSBrZWVwIHRyYWNrIG9mIHJlc3VsdHNcbiAgICAgICAgdGhpcy5yZXN1bHRzID0gdGhpcy5maW5pc2goKTtcblxuICAgICAgICAvLyBBbGxvdyBjaGFpbmluZywgZm9yIHdoYXRldmVyIGl0J3Mgd29ydGhcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIFBhcnNlci5wcm90b3R5cGUuc2F2ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgY29sdW1uID0gdGhpcy50YWJsZVt0aGlzLmN1cnJlbnRdO1xuICAgICAgICBjb2x1bW4ubGV4ZXJTdGF0ZSA9IHRoaXMubGV4ZXJTdGF0ZTtcbiAgICAgICAgcmV0dXJuIGNvbHVtbjtcbiAgICB9O1xuXG4gICAgUGFyc2VyLnByb3RvdHlwZS5yZXN0b3JlID0gZnVuY3Rpb24oY29sdW1uKSB7XG4gICAgICAgIHZhciBpbmRleCA9IGNvbHVtbi5pbmRleDtcbiAgICAgICAgdGhpcy5jdXJyZW50ID0gaW5kZXg7XG4gICAgICAgIHRoaXMudGFibGVbaW5kZXhdID0gY29sdW1uO1xuICAgICAgICB0aGlzLnRhYmxlLnNwbGljZShpbmRleCArIDEpO1xuICAgICAgICB0aGlzLmxleGVyU3RhdGUgPSBjb2x1bW4ubGV4ZXJTdGF0ZTtcblxuICAgICAgICAvLyBJbmNyZW1lbnRhbGx5IGtlZXAgdHJhY2sgb2YgcmVzdWx0c1xuICAgICAgICB0aGlzLnJlc3VsdHMgPSB0aGlzLmZpbmlzaCgpO1xuICAgIH07XG5cbiAgICAvLyBuYi4gZGVwcmVjYXRlZDogdXNlIHNhdmUvcmVzdG9yZSBpbnN0ZWFkIVxuICAgIFBhcnNlci5wcm90b3R5cGUucmV3aW5kID0gZnVuY3Rpb24oaW5kZXgpIHtcbiAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMua2VlcEhpc3RvcnkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignc2V0IG9wdGlvbiBga2VlcEhpc3RvcnlgIHRvIGVuYWJsZSByZXdpbmRpbmcnKVxuICAgICAgICB9XG4gICAgICAgIC8vIG5iLiByZWNhbGwgY29sdW1uICh0YWJsZSkgaW5kaWNpZXMgZmFsbCBiZXR3ZWVuIHRva2VuIGluZGljaWVzLlxuICAgICAgICAvLyAgICAgICAgY29sIDAgICAtLSAgIHRva2VuIDAgICAtLSAgIGNvbCAxXG4gICAgICAgIHRoaXMucmVzdG9yZSh0aGlzLnRhYmxlW2luZGV4XSk7XG4gICAgfTtcblxuICAgIFBhcnNlci5wcm90b3R5cGUuZmluaXNoID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIFJldHVybiB0aGUgcG9zc2libGUgcGFyc2luZ3NcbiAgICAgICAgdmFyIGNvbnNpZGVyYXRpb25zID0gW107XG4gICAgICAgIHZhciBzdGFydCA9IHRoaXMuZ3JhbW1hci5zdGFydDtcbiAgICAgICAgdmFyIGNvbHVtbiA9IHRoaXMudGFibGVbdGhpcy50YWJsZS5sZW5ndGggLSAxXVxuICAgICAgICBjb2x1bW4uc3RhdGVzLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgIGlmICh0LnJ1bGUubmFtZSA9PT0gc3RhcnRcbiAgICAgICAgICAgICAgICAgICAgJiYgdC5kb3QgPT09IHQucnVsZS5zeW1ib2xzLmxlbmd0aFxuICAgICAgICAgICAgICAgICAgICAmJiB0LnJlZmVyZW5jZSA9PT0gMFxuICAgICAgICAgICAgICAgICAgICAmJiB0LmRhdGEgIT09IFBhcnNlci5mYWlsKSB7XG4gICAgICAgICAgICAgICAgY29uc2lkZXJhdGlvbnMucHVzaCh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBjb25zaWRlcmF0aW9ucy5tYXAoZnVuY3Rpb24oYykge3JldHVybiBjLmRhdGE7IH0pO1xuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBQYXJzZXI6IFBhcnNlcixcbiAgICAgICAgR3JhbW1hcjogR3JhbW1hcixcbiAgICAgICAgUnVsZTogUnVsZSxcbiAgICB9O1xuXG59KSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBmcF8xID0gcmVxdWlyZShcIi4uL2ZwXCIpO1xyXG5jb25zdCB0b0FycmF5T3JFbXB0eV8xID0gcmVxdWlyZShcIi4vdG9BcnJheU9yRW1wdHlcIik7XHJcbmV4cG9ydHMuY2h1bmsgPSBmcF8xLmN1cnJ5KChzaXplLCBhcnJheSkgPT4ge1xyXG4gICAgY29uc3QgYXJyID0gdG9BcnJheU9yRW1wdHlfMS50b0FycmF5T3JFbXB0eShhcnJheSk7XHJcbiAgICBjb25zdCBvdXRwdXQgPSBbXTtcclxuICAgIGxldCBjaHVuayA9IFtdO1xyXG4gICAgZm9yIChsZXQgZWxlbSBvZiBhcnIpIHtcclxuICAgICAgICBpZiAoY2h1bmsubGVuZ3RoID49IHNpemUpIHtcclxuICAgICAgICAgICAgb3V0cHV0LnB1c2goY2h1bmspO1xyXG4gICAgICAgICAgICBjaHVuayA9IFtdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjaHVuay5wdXNoKGVsZW0pO1xyXG4gICAgfVxyXG4gICAgaWYgKGNodW5rLmxlbmd0aCkge1xyXG4gICAgICAgIG91dHB1dC5wdXNoKGNodW5rKTtcclxuICAgIH1cclxuICAgIHJldHVybiBvdXRwdXQ7XHJcbn0pO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1jaHVuay5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBmcF8xID0gcmVxdWlyZShcIi4uL2ZwXCIpO1xyXG5jb25zdCB0b0FycmF5T3JFbXB0eV8xID0gcmVxdWlyZShcIi4vdG9BcnJheU9yRW1wdHlcIik7XHJcbmV4cG9ydHMuZmlsdGVyID0gZnBfMS5jdXJyeSgoZnVuYywgYXJyYXkpID0+IHRvQXJyYXlPckVtcHR5XzEudG9BcnJheU9yRW1wdHkoYXJyYXkpLmZpbHRlcihmdW5jKSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZpbHRlci5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBmaXJzdE9yTnVsbF8xID0gcmVxdWlyZShcIi4vZmlyc3RPck51bGxcIik7XHJcbmV4cG9ydHMuZmlyc3QgPSBmaXJzdE9yTnVsbF8xLmZpcnN0T3JOdWxsO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1maXJzdC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCB0b0FycmF5T3JFbXB0eV8xID0gcmVxdWlyZShcIi4vdG9BcnJheU9yRW1wdHlcIik7XHJcbmNvbnN0IGZwXzEgPSByZXF1aXJlKFwiLi4vZnBcIik7XHJcbmV4cG9ydHMuZmlyc3RPciA9IGZwXzEuY3VycnkoKGRlZmF1bHRWYWx1ZSwgYXJyYXkpID0+IHtcclxuICAgIGNvbnN0IGFyciA9IHRvQXJyYXlPckVtcHR5XzEudG9BcnJheU9yRW1wdHkoYXJyYXkpO1xyXG4gICAgcmV0dXJuIGFyci5sZW5ndGggPyBhcnJbMF0gOiBkZWZhdWx0VmFsdWU7XHJcbn0pO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1maXJzdE9yLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IGZpcnN0T3JfMSA9IHJlcXVpcmUoXCIuL2ZpcnN0T3JcIik7XHJcbmV4cG9ydHMuZmlyc3RPck51bGwgPSBmaXJzdE9yXzEuZmlyc3RPcihudWxsKTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Zmlyc3RPck51bGwuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgZnBfMSA9IHJlcXVpcmUoXCIuLi9mcFwiKTtcclxuY29uc3QgdG9BcnJheU9yRW1wdHlfMSA9IHJlcXVpcmUoXCIuL3RvQXJyYXlPckVtcHR5XCIpO1xyXG5jb25zdCBtYXBfMSA9IHJlcXVpcmUoXCIuL21hcFwiKTtcclxuY29uc3QgZmxhdHRlbl8xID0gcmVxdWlyZShcIi4vZmxhdHRlblwiKTtcclxuZXhwb3J0cy5mbGF0TWFwID0gZnBfMS5jdXJyeSgoZnVuYywgYXJyYXkpID0+IGZwXzEucGlwZSh0b0FycmF5T3JFbXB0eV8xLnRvQXJyYXlPckVtcHR5KGFycmF5KSwgbWFwXzEubWFwKGZ1bmMpLCBmbGF0dGVuXzEuZmxhdHRlbikpO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1mbGF0TWFwLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IGZwXzEgPSByZXF1aXJlKFwiLi4vZnBcIik7XHJcbmNvbnN0IHRvQXJyYXlPckVtcHR5XzEgPSByZXF1aXJlKFwiLi90b0FycmF5T3JFbXB0eVwiKTtcclxuZXhwb3J0cy5mbGF0dGVuID0gZnBfMS5jdXJyeShhcnJheSA9PiBbXS5jb25jYXQoLi4udG9BcnJheU9yRW1wdHlfMS50b0FycmF5T3JFbXB0eShhcnJheSkpKTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmxhdHRlbi5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCB0b0FycmF5T3JFbXB0eV8xID0gcmVxdWlyZShcIi4vdG9BcnJheU9yRW1wdHlcIik7XHJcbmV4cG9ydHMuZnJvbVBhaXJzID0gKHBhaXJzKSA9PiB7XHJcbiAgICByZXR1cm4gdG9BcnJheU9yRW1wdHlfMS50b0FycmF5T3JFbXB0eShwYWlycylcclxuICAgICAgICAubWFwKChba2V5LCB2YWxdKSA9PiAoeyBba2V5XTogdmFsIH0pKVxyXG4gICAgICAgIC5yZWR1Y2UoKGEsIGMpID0+IE9iamVjdC5hc3NpZ24oYSwgYyksIHt9KTtcclxufTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZnJvbVBhaXJzLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5mdW5jdGlvbiBfX2V4cG9ydChtKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmICghZXhwb3J0cy5oYXNPd25Qcm9wZXJ0eShwKSkgZXhwb3J0c1twXSA9IG1bcF07XHJcbn1cclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5fX2V4cG9ydChyZXF1aXJlKFwiLi9maWx0ZXJcIikpO1xyXG5fX2V4cG9ydChyZXF1aXJlKFwiLi9mbGF0TWFwXCIpKTtcclxuX19leHBvcnQocmVxdWlyZShcIi4vZmxhdHRlblwiKSk7XHJcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL2xpbWl0XCIpKTtcclxuX19leHBvcnQocmVxdWlyZShcIi4vbWFwXCIpKTtcclxuX19leHBvcnQocmVxdWlyZShcIi4vc2NhblwiKSk7XHJcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL3NraXBcIikpO1xyXG5fX2V4cG9ydChyZXF1aXJlKFwiLi90YXBcIikpO1xyXG5fX2V4cG9ydChyZXF1aXJlKFwiLi96aXBcIikpO1xyXG5fX2V4cG9ydChyZXF1aXJlKFwiLi90YWtlV2hpbGVcIikpO1xyXG5fX2V4cG9ydChyZXF1aXJlKFwiLi90b0FycmF5T3JFbXB0eVwiKSk7XHJcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL3JlZHVjZVwiKSk7XHJcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL2NodW5rXCIpKTtcclxuX19leHBvcnQocmVxdWlyZShcIi4vZnJvbVBhaXJzXCIpKTtcclxuX19leHBvcnQocmVxdWlyZShcIi4vZmlyc3RcIikpO1xyXG5fX2V4cG9ydChyZXF1aXJlKFwiLi9maXJzdE9yXCIpKTtcclxuX19leHBvcnQocmVxdWlyZShcIi4vZmlyc3RPck51bGxcIikpO1xyXG5fX2V4cG9ydChyZXF1aXJlKFwiLi9qb2luXCIpKTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgdG9BcnJheU9yRW1wdHlfMSA9IHJlcXVpcmUoXCIuL3RvQXJyYXlPckVtcHR5XCIpO1xyXG5jb25zdCBmcF8xID0gcmVxdWlyZShcIi4uL2ZwXCIpO1xyXG5leHBvcnRzLmpvaW4gPSBmcF8xLmN1cnJ5KChzZXBhcmF0b3IsIGFycikgPT4gdG9BcnJheU9yRW1wdHlfMS50b0FycmF5T3JFbXB0eShhcnIpLmpvaW4oc2VwYXJhdG9yKSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWpvaW4uanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgZnBfMSA9IHJlcXVpcmUoXCIuLi9mcFwiKTtcclxuY29uc3QgdG9BcnJheU9yRW1wdHlfMSA9IHJlcXVpcmUoXCIuL3RvQXJyYXlPckVtcHR5XCIpO1xyXG5leHBvcnRzLmxpbWl0ID0gZnBfMS5jdXJyeSgobWF4LCBhcnJheSkgPT4gdG9BcnJheU9yRW1wdHlfMS50b0FycmF5T3JFbXB0eShhcnJheSkuc3BsaWNlKDAsIG1heCkpO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1saW1pdC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBmcF8xID0gcmVxdWlyZShcIi4uL2ZwXCIpO1xyXG5jb25zdCB0b0FycmF5T3JFbXB0eV8xID0gcmVxdWlyZShcIi4vdG9BcnJheU9yRW1wdHlcIik7XHJcbmV4cG9ydHMubWFwID0gZnBfMS5jdXJyeSgoZnVuYywgYXJyYXkpID0+IHRvQXJyYXlPckVtcHR5XzEudG9BcnJheU9yRW1wdHkoYXJyYXkpLm1hcChmdW5jKSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1hcC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBmcF8xID0gcmVxdWlyZShcIi4uL2ZwXCIpO1xyXG5jb25zdCB0b0FycmF5T3JFbXB0eV8xID0gcmVxdWlyZShcIi4vdG9BcnJheU9yRW1wdHlcIik7XHJcbmV4cG9ydHMucmVkdWNlID0gZnBfMS5jdXJyeSgoZnVuYywgc3RhcnQsIGFycmF5KSA9PiB0b0FycmF5T3JFbXB0eV8xLnRvQXJyYXlPckVtcHR5KGFycmF5KS5yZWR1Y2UoZnVuYywgc3RhcnQpKTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cmVkdWNlLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IGZwXzEgPSByZXF1aXJlKFwiLi4vZnBcIik7XHJcbmNvbnN0IHRvQXJyYXlPckVtcHR5XzEgPSByZXF1aXJlKFwiLi90b0FycmF5T3JFbXB0eVwiKTtcclxuZXhwb3J0cy5zY2FuID0gZnBfMS5jdXJyeSgoZnVuYywgc3RhcnQsIGFycmF5KSA9PiB7XHJcbiAgICBsZXQgYWNjdW11bGF0ZWQgPSBzdGFydDtcclxuICAgIHJldHVybiB0b0FycmF5T3JFbXB0eV8xLnRvQXJyYXlPckVtcHR5KGFycmF5KS5tYXAoKGVsZW0pID0+IHtcclxuICAgICAgICBhY2N1bXVsYXRlZCA9IGZ1bmMoYWNjdW11bGF0ZWQsIGVsZW0pO1xyXG4gICAgICAgIHJldHVybiBhY2N1bXVsYXRlZDtcclxuICAgIH0pO1xyXG59KTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c2Nhbi5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBmcF8xID0gcmVxdWlyZShcIi4uL2ZwXCIpO1xyXG5jb25zdCB0b0FycmF5T3JFbXB0eV8xID0gcmVxdWlyZShcIi4vdG9BcnJheU9yRW1wdHlcIik7XHJcbmV4cG9ydHMuc2tpcCA9IGZwXzEuY3VycnkoKGFtdCwgYXJyYXkpID0+IHRvQXJyYXlPckVtcHR5XzEudG9BcnJheU9yRW1wdHkoYXJyYXkpLnNwbGljZShhbXQpKTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c2tpcC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBmcF8xID0gcmVxdWlyZShcIi4uL2ZwXCIpO1xyXG5jb25zdCB0b0FycmF5T3JFbXB0eV8xID0gcmVxdWlyZShcIi4vdG9BcnJheU9yRW1wdHlcIik7XHJcbmV4cG9ydHMudGFrZVdoaWxlID0gZnBfMS5jdXJyeSgod2hpbGVGdW5jLCBhcnJheSkgPT4ge1xyXG4gICAgY29uc3QgYXJyID0gdG9BcnJheU9yRW1wdHlfMS50b0FycmF5T3JFbXB0eShhcnJheSk7XHJcbiAgICBjb25zdCByZXMgPSBbXTtcclxuICAgIGZvciAoY29uc3QgdmFsIG9mIGFycikge1xyXG4gICAgICAgIGlmICh3aGlsZUZ1bmModmFsKSlcclxuICAgICAgICAgICAgcmVzLnB1c2godmFsKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHJldHVybiByZXM7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzO1xyXG59KTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dGFrZVdoaWxlLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IGZwXzEgPSByZXF1aXJlKFwiLi4vZnBcIik7XHJcbmNvbnN0IHRvQXJyYXlPckVtcHR5XzEgPSByZXF1aXJlKFwiLi90b0FycmF5T3JFbXB0eVwiKTtcclxuZXhwb3J0cy50YXAgPSBmcF8xLmN1cnJ5KChmdW5jLCBhcnJheSkgPT4ge1xyXG4gICAgdG9BcnJheU9yRW1wdHlfMS50b0FycmF5T3JFbXB0eShhcnJheSkuZm9yRWFjaChmdW5jKTtcclxuICAgIHJldHVybiBhcnJheTtcclxufSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRhcC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5mdW5jdGlvbiB0b0FycmF5T3JFbXB0eShvYmopIHtcclxuICAgIGlmIChBcnJheS5pc0FycmF5KG9iaikpXHJcbiAgICAgICAgcmV0dXJuIG9iajtcclxuICAgIHJldHVybiBbXTtcclxufVxyXG5leHBvcnRzLnRvQXJyYXlPckVtcHR5ID0gdG9BcnJheU9yRW1wdHk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRvQXJyYXlPckVtcHR5LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IGZwXzEgPSByZXF1aXJlKFwiLi4vZnBcIik7XHJcbmV4cG9ydHMuemlwID0gZnBfMS5jdXJyeSgoYXJyTGVmdCwgYXJyUmlnaHQsIC4uLm1vcmVBcnJheXMpID0+IHtcclxuICAgIGNvbnN0IGFycmF5cyA9IFthcnJMZWZ0LCBhcnJSaWdodCwgLi4ubW9yZUFycmF5c107XHJcbiAgICBjb25zdCBtYXhMZW4gPSBNYXRoLm1heCguLi5hcnJheXMubWFwKGEgPT4gYS5sZW5ndGgpKTtcclxuICAgIGNvbnN0IHJlcyA9IFtdO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXhMZW47ICsraSkge1xyXG4gICAgICAgIHJlcy5wdXNoKGFycmF5cy5tYXAoYSA9PiAoaSA8IGEubGVuZ3RoID8gYVtpXSA6IG51bGwpKSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzO1xyXG59KTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9emlwLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuY3VycnkgPSBmdW5jID0+IHtcclxuICAgIGNvbnN0IGN1cnJ5SW1wbCA9IChwcm92aWRlZEFyZ3MpID0+ICguLi5hcmdzKSA9PiB7XHJcbiAgICAgICAgY29uc3QgY29uY2F0QXJncyA9IHByb3ZpZGVkQXJncy5jb25jYXQoYXJncyk7XHJcbiAgICAgICAgaWYgKGNvbmNhdEFyZ3MubGVuZ3RoIDwgZnVuYy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGN1cnJ5SW1wbChjb25jYXRBcmdzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZ1bmMoLi4uY29uY2F0QXJncyk7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIGN1cnJ5SW1wbChbXSk7XHJcbn07XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWN1cnJ5LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5mdW5jdGlvbiBfX2V4cG9ydChtKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmICghZXhwb3J0cy5oYXNPd25Qcm9wZXJ0eShwKSkgZXhwb3J0c1twXSA9IG1bcF07XHJcbn1cclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5fX2V4cG9ydChyZXF1aXJlKFwiLi9jdXJyeVwiKSk7XHJcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL3BpcGVcIikpO1xyXG5fX2V4cG9ydChyZXF1aXJlKFwiLi9wcmVkaWNhdGVcIikpO1xyXG5fX2V4cG9ydChyZXF1aXJlKFwiLi9yZXZlcnNlQXJnc1wiKSk7XHJcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL3JldmVyc2VDdXJyeVwiKSk7XHJcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL3NwcmVhZFwiKSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IGlzXzEgPSByZXF1aXJlKFwiLi4vaXNcIik7XHJcbmV4cG9ydHMucGlwZSA9IChwYXJhbU9yRnVuYywgLi4uZnVuY3Rpb25zKSA9PiB7XHJcbiAgICBpZiAoaXNfMS5pc0Z1bmN0aW9uKHBhcmFtT3JGdW5jKSkge1xyXG4gICAgICAgIHJldHVybiBjaGFpbihwYXJhbU9yRnVuYywgLi4uZnVuY3Rpb25zKTtcclxuICAgIH1cclxuICAgIHJldHVybiBjaGFpbiguLi5mdW5jdGlvbnMpKHBhcmFtT3JGdW5jKTtcclxufTtcclxuZnVuY3Rpb24gY2hhaW4oLi4uZnVuY3MpIHtcclxuICAgIHJldHVybiAocGFyYW0pID0+IHtcclxuICAgICAgICBsZXQgbGFzdFZhbCA9IHBhcmFtO1xyXG4gICAgICAgIGZvciAoY29uc3QgZnVuYyBvZiBmdW5jcykge1xyXG4gICAgICAgICAgICBsYXN0VmFsID0gZnVuYyhsYXN0VmFsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGxhc3RWYWw7XHJcbiAgICB9O1xyXG59XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBpcGUuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5hbmQgPSAoLi4ucHJlZGljYXRlcykgPT4gKHBhcmFtKSA9PiBbLi4ucHJlZGljYXRlc10ucmVkdWNlKChhLCBwKSA9PiBhICYmIHAocGFyYW0pLCB0cnVlKSAmJiAhIXByZWRpY2F0ZXMubGVuZ3RoO1xyXG5leHBvcnRzLm9yID0gKC4uLnByZWRpY2F0ZXMpID0+IChwYXJhbSkgPT4gWy4uLnByZWRpY2F0ZXNdLnJlZHVjZSgoYSwgcCkgPT4gYSB8fCBwKHBhcmFtKSwgZmFsc2UpO1xyXG5leHBvcnRzLnhvciA9ICguLi5wcmVkaWNhdGVzKSA9PiAocGFyYW0pID0+IFsuLi5wcmVkaWNhdGVzXS5tYXAocCA9PiArcChwYXJhbSkpLnJlZHVjZSgoYSwgYykgPT4gYSArIGMsIDApID09PSAxO1xyXG5leHBvcnRzLm5lZ2F0ZSA9IChwMSkgPT4gKHBhcmFtKSA9PiAhcDEocGFyYW0pO1xyXG5leHBvcnRzLnRvUHJlZGljYXRlID0gKHApID0+IChwYXJhbSkgPT4gISFwKHBhcmFtKTtcclxuZXhwb3J0cy5ib29sVG9QcmVkaWNhdGUgPSAoYikgPT4gKCkgPT4gYjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cHJlZGljYXRlLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmZ1bmN0aW9uIHJldmVyc2VBcmdzKGZ1bmMpIHtcclxuICAgIHJldHVybiAoLi4uYXJncykgPT4ge1xyXG4gICAgICAgIHJldHVybiBmdW5jKC4uLmFyZ3MucmV2ZXJzZSgpKTtcclxuICAgIH07XHJcbn1cclxuZXhwb3J0cy5yZXZlcnNlQXJncyA9IHJldmVyc2VBcmdzO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1yZXZlcnNlQXJncy5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCByZXZlcnNlQXJnc18xID0gcmVxdWlyZShcIi4vcmV2ZXJzZUFyZ3NcIik7XHJcbmV4cG9ydHMucmV2ZXJzZUN1cnJ5ID0gZnVuYyA9PiB7XHJcbiAgICBjb25zdCBjdXJyeUltcGwgPSBwcm92aWRlZEFyZ3MgPT4gKC4uLmFyZ3MpID0+IHtcclxuICAgICAgICBjb25zdCBjb25jYXRBcmdzID0gcHJvdmlkZWRBcmdzLmNvbmNhdChhcmdzKTtcclxuICAgICAgICBpZiAoY29uY2F0QXJncy5sZW5ndGggPCBmdW5jLmxlbmd0aCkge1xyXG4gICAgICAgICAgICByZXR1cm4gY3VycnlJbXBsKGNvbmNhdEFyZ3MpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmV2ZXJzZUFyZ3NfMS5yZXZlcnNlQXJncyhmdW5jKSguLi5jb25jYXRBcmdzKTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gY3VycnlJbXBsKFtdKTtcclxufTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cmV2ZXJzZUN1cnJ5LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IGN1cnJ5XzEgPSByZXF1aXJlKFwiLi9jdXJyeVwiKTtcclxuZXhwb3J0cy5zcHJlYWQgPSBjdXJyeV8xLmN1cnJ5KChmdW5jLCBhcmdzKSA9PiBmdW5jKC4uLmFyZ3MpKTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c3ByZWFkLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5mdW5jdGlvbiBfX2V4cG9ydChtKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmICghZXhwb3J0cy5oYXNPd25Qcm9wZXJ0eShwKSkgZXhwb3J0c1twXSA9IG1bcF07XHJcbn1cclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5fX2V4cG9ydChyZXF1aXJlKFwiLi9pc0Z1bmN0aW9uXCIpKTtcclxuX19leHBvcnQocmVxdWlyZShcIi4vaXNJbmZpbml0ZVwiKSk7XHJcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL2lzSXRlcmFibGVcIikpO1xyXG5fX2V4cG9ydChyZXF1aXJlKFwiLi9pc05pbFwiKSk7XHJcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL2lzTnVsbFwiKSk7XHJcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL2lzT2JqZWN0XCIpKTtcclxuX19leHBvcnQocmVxdWlyZShcIi4vaXNVbmRlZmluZWRcIikpO1xyXG5fX2V4cG9ydChyZXF1aXJlKFwiLi9pc051bWJlclwiKSk7XHJcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL2lzU3RyaW5nXCIpKTtcclxuX19leHBvcnQocmVxdWlyZShcIi4vaXNJbnRlZ2VyXCIpKTtcclxuX19leHBvcnQocmVxdWlyZShcIi4vaXNGbG9hdFwiKSk7XHJcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL2lzQXJyYXlcIikpO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmlzQXJyYXkgPSBBcnJheS5pc0FycmF5O1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1pc0FycmF5LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IGlzTnVtYmVyXzEgPSByZXF1aXJlKFwiLi9pc051bWJlclwiKTtcclxuZXhwb3J0cy5pc0Zsb2F0ID0gaXNOdW1iZXJfMS5pc051bWJlcjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aXNGbG9hdC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmlzRnVuY3Rpb24gPSAocGFyYW0pID0+IHR5cGVvZiBwYXJhbSA9PT0gJ2Z1bmN0aW9uJztcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aXNGdW5jdGlvbi5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmlzSW5maW5pdGUgPSAocGFyYW0pID0+IHBhcmFtID09PSBJbmZpbml0eSB8fCBwYXJhbSA9PT0gLUluZmluaXR5O1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1pc0luZmluaXRlLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuaXNJbnRlZ2VyID0gKHBhcmFtKSA9PiAocGFyYW0gfCAwKSA9PT0gcGFyYW07XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWlzSW50ZWdlci5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBpc09iamVjdF8xID0gcmVxdWlyZShcIi4vaXNPYmplY3RcIik7XHJcbmNvbnN0IGlzRnVuY3Rpb25fMSA9IHJlcXVpcmUoXCIuL2lzRnVuY3Rpb25cIik7XHJcbmV4cG9ydHMuaXNJdGVyYWJsZSA9IChwYXJhbSkgPT4gaXNPYmplY3RfMS5pc09iamVjdChwYXJhbSkgJiYgaXNGdW5jdGlvbl8xLmlzRnVuY3Rpb24ocGFyYW1bU3ltYm9sLml0ZXJhdG9yXSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWlzSXRlcmFibGUuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgaXNOdWxsXzEgPSByZXF1aXJlKFwiLi9pc051bGxcIik7XHJcbmNvbnN0IGlzVW5kZWZpbmVkXzEgPSByZXF1aXJlKFwiLi9pc1VuZGVmaW5lZFwiKTtcclxuZXhwb3J0cy5pc05pbCA9IChwYXJhbSkgPT4gaXNOdWxsXzEuaXNOdWxsKHBhcmFtKSB8fCBpc1VuZGVmaW5lZF8xLmlzVW5kZWZpbmVkKHBhcmFtKTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aXNOaWwuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5pc051bGwgPSAocGFyYW0pID0+IHBhcmFtID09PSBudWxsO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1pc051bGwuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5pc051bWJlciA9IChwYXJhbSkgPT4gdHlwZW9mIHBhcmFtID09PSAnbnVtYmVyJztcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aXNOdW1iZXIuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5pc09iamVjdCA9IChwYXJhbSkgPT4gcGFyYW0gPT09IE9iamVjdChwYXJhbSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWlzT2JqZWN0LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuaXNTdHJpbmcgPSAocGFyYW0pID0+IHR5cGVvZiBwYXJhbSA9PT0gJ3N0cmluZyc7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWlzU3RyaW5nLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuaXNVbmRlZmluZWQgPSAocGFyYW0pID0+IHR5cGVvZiBwYXJhbSA9PT0gJ3VuZGVmaW5lZCc7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWlzVW5kZWZpbmVkLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IGZwXzEgPSByZXF1aXJlKFwiLi4vZnBcIik7XHJcbmNvbnN0IHRvSXRlcmFibGVPckVtcHR5XzEgPSByZXF1aXJlKFwiLi90b0l0ZXJhYmxlT3JFbXB0eVwiKTtcclxuZXhwb3J0cy5jaHVuayA9IGZwXzEuY3VycnkoZnVuY3Rpb24qIChzaXplLCBpdGVyYWJsZSkge1xyXG4gICAgY29uc3QgaXRlciA9IHRvSXRlcmFibGVPckVtcHR5XzEudG9JdGVyYWJsZU9yRW1wdHkoaXRlcmFibGUpO1xyXG4gICAgbGV0IGNodW5rcyA9IFtdO1xyXG4gICAgZm9yIChjb25zdCBlbGVtIG9mIGl0ZXIpIHtcclxuICAgICAgICBpZiAoY2h1bmtzLmxlbmd0aCA+PSBzaXplKSB7XHJcbiAgICAgICAgICAgIHlpZWxkIGNodW5rcztcclxuICAgICAgICAgICAgY2h1bmtzID0gW107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNodW5rcy5wdXNoKGVsZW0pO1xyXG4gICAgfVxyXG4gICAgaWYgKGNodW5rcy5sZW5ndGgpIHtcclxuICAgICAgICB5aWVsZCBjaHVua3M7XHJcbiAgICB9XHJcbn0pO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1jaHVuay5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBpc18xID0gcmVxdWlyZShcIi4uL2lzXCIpO1xyXG5jb25zdCBsaW1pdF8xID0gcmVxdWlyZShcIi4vbGltaXRcIik7XHJcbmNvbnN0IHRvSXRlcmFibGVPckVtcHR5XzEgPSByZXF1aXJlKFwiLi90b0l0ZXJhYmxlT3JFbXB0eVwiKTtcclxuZXhwb3J0cy5jb2xsZWN0VG9BcnJheSA9IChpdGVyYWJsZSwgbWF4ID0gSW5maW5pdHkpID0+IGlzXzEuaXNJbmZpbml0ZShtYXgpXHJcbiAgICA/IFsuLi50b0l0ZXJhYmxlT3JFbXB0eV8xLnRvSXRlcmFibGVPckVtcHR5KGl0ZXJhYmxlKV1cclxuICAgIDogZXhwb3J0cy5jb2xsZWN0VG9BcnJheShsaW1pdF8xLmxpbWl0KG1heCwgdG9JdGVyYWJsZU9yRW1wdHlfMS50b0l0ZXJhYmxlT3JFbXB0eShpdGVyYWJsZSkpKTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y29sbGVjdFRvQXJyYXkuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgZnBfMSA9IHJlcXVpcmUoXCIuLi9mcFwiKTtcclxuY29uc3QgdG9JdGVyYWJsZU9yRW1wdHlfMSA9IHJlcXVpcmUoXCIuL3RvSXRlcmFibGVPckVtcHR5XCIpO1xyXG5leHBvcnRzLmZpbHRlciA9IGZwXzEuY3VycnkoZnVuY3Rpb24qIChmdW5jLCBpdGVyYWJsZSkge1xyXG4gICAgY29uc3QgaXRlciA9IHRvSXRlcmFibGVPckVtcHR5XzEudG9JdGVyYWJsZU9yRW1wdHkoaXRlcmFibGUpO1xyXG4gICAgZm9yIChjb25zdCB2YWwgb2YgaXRlcikge1xyXG4gICAgICAgIGlmIChmdW5jKHZhbCkpXHJcbiAgICAgICAgICAgIHlpZWxkIHZhbDtcclxuICAgIH1cclxufSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZpbHRlci5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCB0YWtlXzEgPSByZXF1aXJlKFwiLi90YWtlXCIpO1xyXG5leHBvcnRzLmZpcnN0ID0gdGFrZV8xLnRha2UoMSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZpcnN0LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IGZwXzEgPSByZXF1aXJlKFwiLi4vZnBcIik7XHJcbmV4cG9ydHMuZmlyc3RPciA9IGZwXzEuY3VycnkoKGRlZmF1bHRWYWx1ZSwgaXRlcmFibGUpID0+IHtcclxuICAgIGZvciAoY29uc3QgdiBvZiBpdGVyYWJsZSkge1xyXG4gICAgICAgIHJldHVybiB2O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcclxufSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZpcnN0T3IuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgZmlyc3RPcl8xID0gcmVxdWlyZShcIi4vZmlyc3RPclwiKTtcclxuZXhwb3J0cy5maXJzdE9yTnVsbCA9IGZpcnN0T3JfMS5maXJzdE9yKG51bGwpO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1maXJzdE9yTnVsbC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBmcF8xID0gcmVxdWlyZShcIi4uL2ZwXCIpO1xyXG5jb25zdCBpc18xID0gcmVxdWlyZShcIi4uL2lzXCIpO1xyXG5jb25zdCB0b0l0ZXJhYmxlT3JFbXB0eV8xID0gcmVxdWlyZShcIi4vdG9JdGVyYWJsZU9yRW1wdHlcIik7XHJcbmV4cG9ydHMuZmxhdE1hcCA9IGZwXzEuY3VycnkoZnVuY3Rpb24qIChmdW5jLCBpdGVyYWJsZSkge1xyXG4gICAgY29uc3QgaXRlciA9IHRvSXRlcmFibGVPckVtcHR5XzEudG9JdGVyYWJsZU9yRW1wdHkoaXRlcmFibGUpO1xyXG4gICAgZm9yIChjb25zdCB2YWwgb2YgaXRlcikge1xyXG4gICAgICAgIGNvbnN0IG5ld0l0ZXJhYmxlID0gZnVuYyh2YWwpO1xyXG4gICAgICAgIGlmIChpc18xLmlzSXRlcmFibGUobmV3SXRlcmFibGUpKSB7XHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgbmV3VmFsIG9mIG5ld0l0ZXJhYmxlKVxyXG4gICAgICAgICAgICAgICAgeWllbGQgbmV3VmFsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgeWllbGQgbmV3SXRlcmFibGU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmxhdE1hcC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBmcF8xID0gcmVxdWlyZShcIi4uL2ZwXCIpO1xyXG5jb25zdCBpc18xID0gcmVxdWlyZShcIi4uL2lzXCIpO1xyXG5jb25zdCB0b0l0ZXJhYmxlT3JFbXB0eV8xID0gcmVxdWlyZShcIi4vdG9JdGVyYWJsZU9yRW1wdHlcIik7XHJcbmV4cG9ydHMuZmxhdHRlbiA9IGZwXzEuY3VycnkoZnVuY3Rpb24qIChpdGVyYWJsZSkge1xyXG4gICAgY29uc3QgaXRlciA9IHRvSXRlcmFibGVPckVtcHR5XzEudG9JdGVyYWJsZU9yRW1wdHkoaXRlcmFibGUpO1xyXG4gICAgZm9yIChjb25zdCB2YWwgb2YgaXRlcikge1xyXG4gICAgICAgIGlmIChpc18xLmlzSXRlcmFibGUodmFsKSkge1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGlubmVyVmFsIG9mIHZhbClcclxuICAgICAgICAgICAgICAgIHlpZWxkIGlubmVyVmFsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgeWllbGQgdmFsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZsYXR0ZW4uanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgZmlyc3RfMSA9IHJlcXVpcmUoXCIuL2ZpcnN0XCIpO1xyXG5leHBvcnRzLmhlYWQgPSBmaXJzdF8xLmZpcnN0O1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1oZWFkLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5mdW5jdGlvbiBfX2V4cG9ydChtKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmICghZXhwb3J0cy5oYXNPd25Qcm9wZXJ0eShwKSkgZXhwb3J0c1twXSA9IG1bcF07XHJcbn1cclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5fX2V4cG9ydChyZXF1aXJlKFwiLi9jb2xsZWN0VG9BcnJheVwiKSk7XHJcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL2ZpbHRlclwiKSk7XHJcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL2ZsYXRNYXBcIikpO1xyXG5fX2V4cG9ydChyZXF1aXJlKFwiLi9mbGF0dGVuXCIpKTtcclxuX19leHBvcnQocmVxdWlyZShcIi4vbGltaXRcIikpO1xyXG5fX2V4cG9ydChyZXF1aXJlKFwiLi9tYXBcIikpO1xyXG5fX2V4cG9ydChyZXF1aXJlKFwiLi9zY2FuXCIpKTtcclxuX19leHBvcnQocmVxdWlyZShcIi4vc2tpcFwiKSk7XHJcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL3RhcFwiKSk7XHJcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL3ppcFwiKSk7XHJcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL3Rha2VXaGlsZVwiKSk7XHJcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL2NodW5rXCIpKTtcclxuX19leHBvcnQocmVxdWlyZShcIi4vZmlyc3RcIikpO1xyXG5fX2V4cG9ydChyZXF1aXJlKFwiLi90YWtlXCIpKTtcclxuX19leHBvcnQocmVxdWlyZShcIi4vaGVhZFwiKSk7XHJcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL2ZpcnN0T3JcIikpO1xyXG5fX2V4cG9ydChyZXF1aXJlKFwiLi9maXJzdE9yTnVsbFwiKSk7XHJcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL2pvaW5cIikpO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCB0b0l0ZXJhYmxlT3JFbXB0eV8xID0gcmVxdWlyZShcIi4vdG9JdGVyYWJsZU9yRW1wdHlcIik7XHJcbmNvbnN0IGZwXzEgPSByZXF1aXJlKFwiLi4vZnBcIik7XHJcbmNvbnN0IGNvbGxlY3RUb0FycmF5XzEgPSByZXF1aXJlKFwiLi9jb2xsZWN0VG9BcnJheVwiKTtcclxuZXhwb3J0cy5qb2luID0gZnBfMS5jdXJyeShmdW5jdGlvbiogKHNlcGFyYXRvciwgaXRlcmFibGUpIHtcclxuICAgIHlpZWxkIGNvbGxlY3RUb0FycmF5XzEuY29sbGVjdFRvQXJyYXkodG9JdGVyYWJsZU9yRW1wdHlfMS50b0l0ZXJhYmxlT3JFbXB0eShpdGVyYWJsZSkpLmpvaW4oc2VwYXJhdG9yKTtcclxufSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWpvaW4uanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgZnBfMSA9IHJlcXVpcmUoXCIuLi9mcFwiKTtcclxuY29uc3QgdG9JdGVyYWJsZU9yRW1wdHlfMSA9IHJlcXVpcmUoXCIuL3RvSXRlcmFibGVPckVtcHR5XCIpO1xyXG5leHBvcnRzLmxpbWl0ID0gZnBfMS5jdXJyeShmdW5jdGlvbiogKG1heCwgaXRlcmFibGUpIHtcclxuICAgIGNvbnN0IGl0ZXIgPSB0b0l0ZXJhYmxlT3JFbXB0eV8xLnRvSXRlcmFibGVPckVtcHR5KGl0ZXJhYmxlKTtcclxuICAgIGxldCBjb3VudCA9IDA7XHJcbiAgICBmb3IgKGNvbnN0IHZhbCBvZiBpdGVyKSB7XHJcbiAgICAgICAgaWYgKGNvdW50KysgPCAobWF4IHwgMCkpIHtcclxuICAgICAgICAgICAgeWllbGQgdmFsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bGltaXQuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgZnBfMSA9IHJlcXVpcmUoXCIuLi9mcFwiKTtcclxuY29uc3QgdG9JdGVyYWJsZU9yRW1wdHlfMSA9IHJlcXVpcmUoXCIuL3RvSXRlcmFibGVPckVtcHR5XCIpO1xyXG5leHBvcnRzLm1hcCA9IGZwXzEuY3VycnkoZnVuY3Rpb24qIChmdW5jLCBpdGVyYWJsZSkge1xyXG4gICAgY29uc3QgaXRlciA9IHRvSXRlcmFibGVPckVtcHR5XzEudG9JdGVyYWJsZU9yRW1wdHkoaXRlcmFibGUpO1xyXG4gICAgZm9yIChjb25zdCB2YWwgb2YgaXRlcilcclxuICAgICAgICB5aWVsZCBmdW5jKHZhbCk7XHJcbn0pO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1tYXAuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgZnBfMSA9IHJlcXVpcmUoXCIuLi9mcFwiKTtcclxuY29uc3QgdG9JdGVyYWJsZU9yRW1wdHlfMSA9IHJlcXVpcmUoXCIuL3RvSXRlcmFibGVPckVtcHR5XCIpO1xyXG5leHBvcnRzLnNjYW4gPSBmcF8xLmN1cnJ5KGZ1bmN0aW9uKiAoZnVuYywgc3RhcnQsIGl0ZXJhYmxlKSB7XHJcbiAgICBjb25zdCBpdGVyID0gdG9JdGVyYWJsZU9yRW1wdHlfMS50b0l0ZXJhYmxlT3JFbXB0eShpdGVyYWJsZSk7XHJcbiAgICBsZXQgYWNjdW11bGF0ZWQgPSBzdGFydDtcclxuICAgIGZvciAoY29uc3QgdmFsIG9mIGl0ZXIpIHtcclxuICAgICAgICBhY2N1bXVsYXRlZCA9IGZ1bmMoYWNjdW11bGF0ZWQsIHZhbCk7XHJcbiAgICAgICAgeWllbGQgYWNjdW11bGF0ZWQ7XHJcbiAgICB9XHJcbn0pO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1zY2FuLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IGZwXzEgPSByZXF1aXJlKFwiLi4vZnBcIik7XHJcbmNvbnN0IHRvSXRlcmFibGVPckVtcHR5XzEgPSByZXF1aXJlKFwiLi90b0l0ZXJhYmxlT3JFbXB0eVwiKTtcclxuZXhwb3J0cy5za2lwID0gZnBfMS5jdXJyeShmdW5jdGlvbiogKGFtdCA9IDEsIGl0ZXJhYmxlKSB7XHJcbiAgICBjb25zdCBpdGVyID0gdG9JdGVyYWJsZU9yRW1wdHlfMS50b0l0ZXJhYmxlT3JFbXB0eShpdGVyYWJsZSlbU3ltYm9sLml0ZXJhdG9yXSgpO1xyXG4gICAgbGV0IGlzRG9uZSA9IGZhbHNlO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhbXQgJiYgIWlzRG9uZTsgKytpKSB7XHJcbiAgICAgICAgaXNEb25lID0gaXRlci5uZXh0KCkuZG9uZTtcclxuICAgIH1cclxuICAgIGlmIChpc0RvbmUpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgd2hpbGUgKHRydWUpIHtcclxuICAgICAgICBjb25zdCB7IGRvbmUsIHZhbHVlIH0gPSBpdGVyLm5leHQoKTtcclxuICAgICAgICBpZiAoZG9uZSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHlpZWxkIHZhbHVlO1xyXG4gICAgfVxyXG59KTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c2tpcC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCB0b0l0ZXJhYmxlT3JFbXB0eV8xID0gcmVxdWlyZShcIi4vdG9JdGVyYWJsZU9yRW1wdHlcIik7XHJcbmNvbnN0IGZwXzEgPSByZXF1aXJlKFwiLi4vZnBcIik7XHJcbmV4cG9ydHMudGFrZSA9IGZwXzEuY3VycnkoZnVuY3Rpb24qIChsaW1pdCwgaXRlcmFibGUpIHtcclxuICAgIGxldCBpID0gMDtcclxuICAgIGNvbnN0IGl0ZXIgPSB0b0l0ZXJhYmxlT3JFbXB0eV8xLnRvSXRlcmFibGVPckVtcHR5KGl0ZXJhYmxlKTtcclxuICAgIGZvciAoY29uc3QgdiBvZiBpdGVyKSB7XHJcbiAgICAgICAgaWYgKGkrKyA8IGxpbWl0KSB7XHJcbiAgICAgICAgICAgIHlpZWxkIHY7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dGFrZS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBmcF8xID0gcmVxdWlyZShcIi4uL2ZwXCIpO1xyXG5jb25zdCBpc18xID0gcmVxdWlyZShcIi4uL2lzXCIpO1xyXG5leHBvcnRzLnRha2VXaGlsZSA9IGZwXzEuY3VycnkoZnVuY3Rpb24qICh3aGlsZUZ1bmMsIGl0ZXIpIHtcclxuICAgIGlmIChpc18xLmlzSXRlcmFibGUod2hpbGVGdW5jKSkge1xyXG4gICAgICAgIGNvbnN0IHdoaWxlSXRlciA9IHdoaWxlRnVuY1tTeW1ib2wuaXRlcmF0b3JdKCk7XHJcbiAgICAgICAgZm9yIChjb25zdCB2YWwgb2YgaXRlcikge1xyXG4gICAgICAgICAgICBjb25zdCBxdWl0SW5kaWNhdG9yID0gd2hpbGVJdGVyLm5leHQoKTtcclxuICAgICAgICAgICAgaWYgKCFxdWl0SW5kaWNhdG9yLnZhbHVlIHx8IHF1aXRJbmRpY2F0b3IuZG9uZSlcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgeWllbGQgdmFsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGZvciAoY29uc3QgdmFsIG9mIGl0ZXIpIHtcclxuICAgICAgICAgICAgaWYgKHdoaWxlRnVuYyh2YWwpKVxyXG4gICAgICAgICAgICAgICAgeWllbGQgdmFsO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KTtcclxuZXhwb3J0cy50YWtlV2hpbGVQdWxsUHVzaCA9IGZwXzEuY3VycnkoZnVuY3Rpb24qICh3aGlsZUl0ZXJhYmxlLCBpdGVyKSB7XHJcbiAgICBjb25zdCB3aGlsZUl0ZXIgPSB3aGlsZUl0ZXJhYmxlW1N5bWJvbC5pdGVyYXRvcl0oKTtcclxuICAgIGZvciAoY29uc3QgdmFsIG9mIGl0ZXIpIHtcclxuICAgICAgICBsZXQgcXVpdEluZGljYXRvciA9IHdoaWxlSXRlci5uZXh0KCk7XHJcbiAgICAgICAgaWYgKHF1aXRJbmRpY2F0b3IuZG9uZSB8fCAhcXVpdEluZGljYXRvci52YWx1ZSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHF1aXRJbmRpY2F0b3IgPSB3aGlsZUl0ZXIubmV4dCh2YWwpO1xyXG4gICAgICAgIGlmIChxdWl0SW5kaWNhdG9yLmRvbmUgfHwgIXF1aXRJbmRpY2F0b3IudmFsdWUpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB5aWVsZCB2YWw7XHJcbiAgICB9XHJcbn0pO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD10YWtlV2hpbGUuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgZnBfMSA9IHJlcXVpcmUoXCIuLi9mcFwiKTtcclxuY29uc3QgdG9JdGVyYWJsZU9yRW1wdHlfMSA9IHJlcXVpcmUoXCIuL3RvSXRlcmFibGVPckVtcHR5XCIpO1xyXG5leHBvcnRzLnRhcCA9IGZwXzEuY3VycnkoZnVuY3Rpb24qIChmdW5jLCBpdGVyYWJsZSkge1xyXG4gICAgY29uc3QgaXRlciA9IHRvSXRlcmFibGVPckVtcHR5XzEudG9JdGVyYWJsZU9yRW1wdHkoaXRlcmFibGUpO1xyXG4gICAgZm9yIChjb25zdCB2YWwgb2YgaXRlcikge1xyXG4gICAgICAgIGZ1bmModmFsKTtcclxuICAgICAgICB5aWVsZCB2YWw7XHJcbiAgICB9XHJcbn0pO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD10YXAuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgaXNfMSA9IHJlcXVpcmUoXCIuLi9pc1wiKTtcclxuZnVuY3Rpb24gdG9JdGVyYWJsZU9yRW1wdHkocGFyYW0pIHtcclxuICAgIGlmICghaXNfMS5pc0l0ZXJhYmxlKHBhcmFtKSlcclxuICAgICAgICByZXR1cm4gW107XHJcbiAgICByZXR1cm4gcGFyYW07XHJcbn1cclxuZXhwb3J0cy50b0l0ZXJhYmxlT3JFbXB0eSA9IHRvSXRlcmFibGVPckVtcHR5O1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD10b0l0ZXJhYmxlT3JFbXB0eS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBmcF8xID0gcmVxdWlyZShcIi4uL2ZwXCIpO1xyXG5jb25zdCB0b0l0ZXJhYmxlT3JFbXB0eV8xID0gcmVxdWlyZShcIi4vdG9JdGVyYWJsZU9yRW1wdHlcIik7XHJcbmV4cG9ydHMuemlwID0gZnBfMS5jdXJyeShmdW5jdGlvbiogKGl0ZXJhYmxlTGVmdCwgaXRlcmFibGVSaWdodCwgLi4ubW9yZUl0ZXJhYmxlcykge1xyXG4gICAgY29uc3QgaXRlcmF0b3JzID0gW2l0ZXJhYmxlTGVmdCwgaXRlcmFibGVSaWdodF1cclxuICAgICAgICAuY29uY2F0KG1vcmVJdGVyYWJsZXMpXHJcbiAgICAgICAgLm1hcCh0b0l0ZXJhYmxlT3JFbXB0eV8xLnRvSXRlcmFibGVPckVtcHR5KVxyXG4gICAgICAgIC5tYXAoaXRlcmFibGUgPT4gaXRlcmFibGVbU3ltYm9sLml0ZXJhdG9yXSgpKTtcclxuICAgIHdoaWxlICh0cnVlKSB7XHJcbiAgICAgICAgY29uc3QgbmV4dCA9IGl0ZXJhdG9ycy5tYXAoaXRlcmF0b3IgPT4gaXRlcmF0b3IubmV4dCgpKTtcclxuICAgICAgICBjb25zdCBpdGVtcyA9IG5leHQubWFwKCh7IHZhbHVlLCBkb25lIH0pID0+IChkb25lID8gbnVsbCA6IHZhbHVlKSk7XHJcbiAgICAgICAgaWYgKG5leHQucmVkdWNlKChhY2MsIGN1cikgPT4gYWNjICYmIGN1ci5kb25lLCB0cnVlKSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHlpZWxkIGl0ZW1zO1xyXG4gICAgfVxyXG59KTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9emlwLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IGlzXzEgPSByZXF1aXJlKFwiLi4vaXNcIik7XHJcbmNvbnN0IGl0ZXJhdG9yc18xID0gcmVxdWlyZShcIi4uL2l0ZXJhdG9yc1wiKTtcclxuZXhwb3J0cy5lbnRyaWVzID0gKHBhcmFtKSA9PiB7XHJcbiAgICBpZiAocGFyYW0gaW5zdGFuY2VvZiBNYXApIHtcclxuICAgICAgICByZXR1cm4gaXRlcmF0b3JzXzEuY29sbGVjdFRvQXJyYXkocGFyYW0uZW50cmllcygpKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHBhcmFtIGluc3RhbmNlb2YgU2V0KSB7XHJcbiAgICAgICAgcmV0dXJuIGl0ZXJhdG9yc18xLmNvbGxlY3RUb0FycmF5KHBhcmFtLmVudHJpZXMoKSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChpc18xLmlzT2JqZWN0KHBhcmFtKSkge1xyXG4gICAgICAgIGlmIChpc18xLmlzRnVuY3Rpb24ocGFyYW0uZW50cmllcykpIHtcclxuICAgICAgICAgICAgY29uc3QgcGFyYW1FbnRyaWVzID0gcGFyYW0uZW50cmllcygpO1xyXG4gICAgICAgICAgICBpZiAoaXNfMS5pc0l0ZXJhYmxlKHBhcmFtRW50cmllcykpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlcmF0b3JzXzEuY29sbGVjdFRvQXJyYXkocGFyYW1FbnRyaWVzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIE9iamVjdC5lbnRyaWVzKHBhcmFtKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGlzXzEuaXNBcnJheShwYXJhbSkpIHtcclxuICAgICAgICByZXR1cm4gcGFyYW0ubWFwKCh2LCBpKSA9PiBbaSwgdl0pO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgfVxyXG59O1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1lbnRyaWVzLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5mdW5jdGlvbiBfX2V4cG9ydChtKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmICghZXhwb3J0cy5oYXNPd25Qcm9wZXJ0eShwKSkgZXhwb3J0c1twXSA9IG1bcF07XHJcbn1cclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5fX2V4cG9ydChyZXF1aXJlKFwiLi90b1BhaXJzXCIpKTtcclxuX19leHBvcnQocmVxdWlyZShcIi4vZW50cmllc1wiKSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IGVudHJpZXNfMSA9IHJlcXVpcmUoXCIuL2VudHJpZXNcIik7XHJcbmV4cG9ydHMudG9QYWlycyA9IGVudHJpZXNfMS5lbnRyaWVzO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD10b1BhaXJzLmpzLm1hcCIsIi8vIEdlbmVyYXRlZCBhdXRvbWF0aWNhbGx5IGJ5IG5lYXJsZXksIHZlcnNpb24gMi4xNS4xXHJcbi8vIGh0dHA6Ly9naXRodWIuY29tL0hhcmRtYXRoMTIzL25lYXJsZXlcclxuZnVuY3Rpb24gaWQoeCkge1xyXG4gIHJldHVybiB4WzBdO1xyXG59XHJcbmNvbnN0IGdyYW1tYXIgPSB7XHJcbiAgTGV4ZXI6IHVuZGVmaW5lZCxcclxuICBQYXJzZXJSdWxlczogW1xyXG4gICAgeyBuYW1lOiAnTWFpbicsIHN5bWJvbHM6IFsnRUROJ10sIHBvc3Rwcm9jZXNzOiBkYXRhID0+IGRhdGFbMF0gfSxcclxuICAgIHsgbmFtZTogJ0VETicsIHN5bWJvbHM6IFsnRXhwJ10sIHBvc3Rwcm9jZXNzOiBkYXRhID0+IGRhdGFbMF0gfSxcclxuICAgIHsgbmFtZTogJ0V4cCRzdWJleHByZXNzaW9uJDEnLCBzeW1ib2xzOiBbJ0VsZW1lbnRTcGFjZSddIH0sXHJcbiAgICB7IG5hbWU6ICdFeHAkc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogWydFbGVtZW50Tm9TcGFjZSddIH0sXHJcbiAgICB7IG5hbWU6ICdFeHAnLCBzeW1ib2xzOiBbJ0V4cCRzdWJleHByZXNzaW9uJDEnXSwgcG9zdHByb2Nlc3M6IGRhdGEgPT4gW10uY29uY2F0KC4uLmRhdGFbMF0pIH0sXHJcbiAgICB7IG5hbWU6ICdfRXhwJywgc3ltYm9sczogWydfX2V4cCddIH0sXHJcbiAgICB7IG5hbWU6ICdfRXhwJywgc3ltYm9sczogWydfX2NoYXInXSwgcG9zdHByb2Nlc3M6IGRhdGEgPT4gZGF0YVswXSB9LFxyXG4gICAgeyBuYW1lOiAnX19leHAnLCBzeW1ib2xzOiBbJ18nLCAnRXhwJ10sIHBvc3Rwcm9jZXNzOiBkYXRhID0+IGRhdGFbMV0gfSxcclxuICAgIHsgbmFtZTogJ19fY2hhciRlYm5mJDEkc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogWydfRXhwJ10gfSxcclxuICAgIHsgbmFtZTogJ19fY2hhciRlYm5mJDEkc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogWydFbGVtZW50Tm9TcGFjZSddIH0sXHJcbiAgICB7IG5hbWU6ICdfX2NoYXIkZWJuZiQxJywgc3ltYm9sczogWydfX2NoYXIkZWJuZiQxJHN1YmV4cHJlc3Npb24kMSddLCBwb3N0cHJvY2VzczogaWQgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ19fY2hhciRlYm5mJDEnLFxyXG4gICAgICBzeW1ib2xzOiBbXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnX19jaGFyJyxcclxuICAgICAgc3ltYm9sczogWydDaGFyYWN0ZXInLCAnX19jaGFyJGVibmYkMSddLFxyXG4gICAgICBwb3N0cHJvY2VzczogZGF0YSA9PiBbXS5jb25jYXQoLi4uW2RhdGFbMF1dLmNvbmNhdChkYXRhWzFdID8gW10uY29uY2F0KC4uLmRhdGFbMV0pIDogW10pKVxyXG4gICAgfSxcclxuICAgIHsgbmFtZTogJ0VsZW1lbnRTcGFjZSRzdWJleHByZXNzaW9uJDEnLCBzeW1ib2xzOiBbJ051bWJlciddIH0sXHJcbiAgICB7IG5hbWU6ICdFbGVtZW50U3BhY2Ukc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogWydDaGFyYWN0ZXInXSB9LFxyXG4gICAgeyBuYW1lOiAnRWxlbWVudFNwYWNlJHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFsnUmVzZXJ2ZWQnXSB9LFxyXG4gICAgeyBuYW1lOiAnRWxlbWVudFNwYWNlJHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFsnU3ltYm9sJ10gfSxcclxuICAgIHsgbmFtZTogJ0VsZW1lbnRTcGFjZSRzdWJleHByZXNzaW9uJDEnLCBzeW1ib2xzOiBbJ0tleXdvcmQnXSB9LFxyXG4gICAgeyBuYW1lOiAnRWxlbWVudFNwYWNlJHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFsnVGFnJ10gfSxcclxuICAgIHsgbmFtZTogJ0VsZW1lbnRTcGFjZSRzdWJleHByZXNzaW9uJDEnLCBzeW1ib2xzOiBbJ0Rpc2NhcmQnXSB9LFxyXG4gICAgeyBuYW1lOiAnRWxlbWVudFNwYWNlJGVibmYkMSRzdWJleHByZXNzaW9uJDEnLCBzeW1ib2xzOiBbJ19FeHAnXSB9LFxyXG4gICAgeyBuYW1lOiAnRWxlbWVudFNwYWNlJGVibmYkMSRzdWJleHByZXNzaW9uJDEnLCBzeW1ib2xzOiBbJ0VsZW1lbnROb1NwYWNlJ10gfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ0VsZW1lbnRTcGFjZSRlYm5mJDEnLFxyXG4gICAgICBzeW1ib2xzOiBbJ0VsZW1lbnRTcGFjZSRlYm5mJDEkc3ViZXhwcmVzc2lvbiQxJ10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBpZFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ0VsZW1lbnRTcGFjZSRlYm5mJDEnLFxyXG4gICAgICBzeW1ib2xzOiBbXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnRWxlbWVudFNwYWNlJyxcclxuICAgICAgc3ltYm9sczogWydFbGVtZW50U3BhY2Ukc3ViZXhwcmVzc2lvbiQxJywgJ0VsZW1lbnRTcGFjZSRlYm5mJDEnXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGRhdGEgPT4gW10uY29uY2F0KC4uLltkYXRhWzBdWzBdXS5jb25jYXQoZGF0YVsxXSA/IFtdLmNvbmNhdCguLi5kYXRhWzFdKSA6IFtdKSlcclxuICAgIH0sXHJcbiAgICB7IG5hbWU6ICdFbGVtZW50Tm9TcGFjZSRlYm5mJDEkc3ViZXhwcmVzc2lvbiQxJGVibmYkMScsIHN5bWJvbHM6IFsnXyddLCBwb3N0cHJvY2VzczogaWQgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ0VsZW1lbnROb1NwYWNlJGVibmYkMSRzdWJleHByZXNzaW9uJDEkZWJuZiQxJyxcclxuICAgICAgc3ltYm9sczogW10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ0VsZW1lbnROb1NwYWNlJGVibmYkMSRzdWJleHByZXNzaW9uJDEnLFxyXG4gICAgICBzeW1ib2xzOiBbJ0VsZW1lbnROb1NwYWNlJGVibmYkMSRzdWJleHByZXNzaW9uJDEkZWJuZiQxJywgJ0V4cCddXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnRWxlbWVudE5vU3BhY2UkZWJuZiQxJyxcclxuICAgICAgc3ltYm9sczogWydFbGVtZW50Tm9TcGFjZSRlYm5mJDEkc3ViZXhwcmVzc2lvbiQxJ10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBpZFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ0VsZW1lbnROb1NwYWNlJGVibmYkMScsXHJcbiAgICAgIHN5bWJvbHM6IFtdLFxyXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdFbGVtZW50Tm9TcGFjZScsXHJcbiAgICAgIHN5bWJvbHM6IFsnbWFwRWxlbWVudE5vU3BhY2UnLCAnRWxlbWVudE5vU3BhY2UkZWJuZiQxJ10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBkYXRhID0+IFtkYXRhWzBdXS5jb25jYXQoZGF0YVsxXSA/IGRhdGFbMV1bMV0gOiBbXSlcclxuICAgIH0sXHJcbiAgICB7IG5hbWU6ICdFbGVtZW50JHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFsnTnVtYmVyJ10gfSxcclxuICAgIHsgbmFtZTogJ0VsZW1lbnQkc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogWydDaGFyYWN0ZXInXSB9LFxyXG4gICAgeyBuYW1lOiAnRWxlbWVudCRzdWJleHByZXNzaW9uJDEnLCBzeW1ib2xzOiBbJ1Jlc2VydmVkJ10gfSxcclxuICAgIHsgbmFtZTogJ0VsZW1lbnQkc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogWydTeW1ib2wnXSB9LFxyXG4gICAgeyBuYW1lOiAnRWxlbWVudCRzdWJleHByZXNzaW9uJDEnLCBzeW1ib2xzOiBbJ0tleXdvcmQnXSB9LFxyXG4gICAgeyBuYW1lOiAnRWxlbWVudCRzdWJleHByZXNzaW9uJDEnLCBzeW1ib2xzOiBbJ1ZlY3RvciddIH0sXHJcbiAgICB7IG5hbWU6ICdFbGVtZW50JHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFsnTGlzdCddIH0sXHJcbiAgICB7IG5hbWU6ICdFbGVtZW50JHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFsnU3RyaW5nJ10gfSxcclxuICAgIHsgbmFtZTogJ0VsZW1lbnQkc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogWydNYXAnXSB9LFxyXG4gICAgeyBuYW1lOiAnRWxlbWVudCRzdWJleHByZXNzaW9uJDEnLCBzeW1ib2xzOiBbJ1NldCddIH0sXHJcbiAgICB7IG5hbWU6ICdFbGVtZW50Jywgc3ltYm9sczogWydFbGVtZW50JHN1YmV4cHJlc3Npb24kMSddLCBwb3N0cHJvY2VzczogZGF0YSA9PiBkYXRhWzBdWzBdIH0sXHJcbiAgICB7IG5hbWU6ICdWZWN0b3IkZWJuZiQxJywgc3ltYm9sczogWydfJ10sIHBvc3Rwcm9jZXNzOiBpZCB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnVmVjdG9yJGVibmYkMScsXHJcbiAgICAgIHN5bWJvbHM6IFtdLFxyXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7IG5hbWU6ICdWZWN0b3IkZWJuZiQyJHN1YmV4cHJlc3Npb24kMSRlYm5mJDEnLCBzeW1ib2xzOiBbJ18nXSwgcG9zdHByb2Nlc3M6IGlkIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdWZWN0b3IkZWJuZiQyJHN1YmV4cHJlc3Npb24kMSRlYm5mJDEnLFxyXG4gICAgICBzeW1ib2xzOiBbXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnVmVjdG9yJGVibmYkMiRzdWJleHByZXNzaW9uJDEnLFxyXG4gICAgICBzeW1ib2xzOiBbJ0V4cCcsICdWZWN0b3IkZWJuZiQyJHN1YmV4cHJlc3Npb24kMSRlYm5mJDEnXVxyXG4gICAgfSxcclxuICAgIHsgbmFtZTogJ1ZlY3RvciRlYm5mJDInLCBzeW1ib2xzOiBbJ1ZlY3RvciRlYm5mJDIkc3ViZXhwcmVzc2lvbiQxJ10sIHBvc3Rwcm9jZXNzOiBpZCB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnVmVjdG9yJGVibmYkMicsXHJcbiAgICAgIHN5bWJvbHM6IFtdLFxyXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdWZWN0b3InLFxyXG4gICAgICBzeW1ib2xzOiBbeyBsaXRlcmFsOiAnWycgfSwgJ1ZlY3RvciRlYm5mJDEnLCAnVmVjdG9yJGVibmYkMicsIHsgbGl0ZXJhbDogJ10nIH1dLFxyXG4gICAgICBwb3N0cHJvY2VzczogZGF0YSA9PiAoeyB0eXBlOiAndmVjdG9yJywgZGF0YTogZGF0YVsyXSA/IGRhdGFbMl1bMF0gOiBbXSB9KVxyXG4gICAgfSxcclxuICAgIHsgbmFtZTogJ0xpc3QkZWJuZiQxJywgc3ltYm9sczogWydfJ10sIHBvc3Rwcm9jZXNzOiBpZCB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnTGlzdCRlYm5mJDEnLFxyXG4gICAgICBzeW1ib2xzOiBbXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgeyBuYW1lOiAnTGlzdCRlYm5mJDIkc3ViZXhwcmVzc2lvbiQxJGVibmYkMScsIHN5bWJvbHM6IFsnXyddLCBwb3N0cHJvY2VzczogaWQgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ0xpc3QkZWJuZiQyJHN1YmV4cHJlc3Npb24kMSRlYm5mJDEnLFxyXG4gICAgICBzeW1ib2xzOiBbXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgeyBuYW1lOiAnTGlzdCRlYm5mJDIkc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogWydFeHAnLCAnTGlzdCRlYm5mJDIkc3ViZXhwcmVzc2lvbiQxJGVibmYkMSddIH0sXHJcbiAgICB7IG5hbWU6ICdMaXN0JGVibmYkMicsIHN5bWJvbHM6IFsnTGlzdCRlYm5mJDIkc3ViZXhwcmVzc2lvbiQxJ10sIHBvc3Rwcm9jZXNzOiBpZCB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnTGlzdCRlYm5mJDInLFxyXG4gICAgICBzeW1ib2xzOiBbXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnTGlzdCcsXHJcbiAgICAgIHN5bWJvbHM6IFt7IGxpdGVyYWw6ICcoJyB9LCAnTGlzdCRlYm5mJDEnLCAnTGlzdCRlYm5mJDInLCB7IGxpdGVyYWw6ICcpJyB9XSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGRhdGEgPT4gKHsgdHlwZTogJ2xpc3QnLCBkYXRhOiBkYXRhWzJdID8gZGF0YVsyXVswXSA6IFtdIH0pXHJcbiAgICB9LFxyXG4gICAgeyBuYW1lOiAnTWFwJGVibmYkMScsIHN5bWJvbHM6IFsnXyddLCBwb3N0cHJvY2VzczogaWQgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ01hcCRlYm5mJDEnLFxyXG4gICAgICBzeW1ib2xzOiBbXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgeyBuYW1lOiAnTWFwJGVibmYkMiRzdWJleHByZXNzaW9uJDEkZWJuZiQxJywgc3ltYm9sczogWydfJ10sIHBvc3Rwcm9jZXNzOiBpZCB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnTWFwJGVibmYkMiRzdWJleHByZXNzaW9uJDEkZWJuZiQxJyxcclxuICAgICAgc3ltYm9sczogW10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ01hcCRlYm5mJDIkc3ViZXhwcmVzc2lvbiQxJyxcclxuICAgICAgc3ltYm9sczogWydNYXBFbGVtJywgJ01hcCRlYm5mJDIkc3ViZXhwcmVzc2lvbiQxJGVibmYkMSddXHJcbiAgICB9LFxyXG4gICAgeyBuYW1lOiAnTWFwJGVibmYkMicsIHN5bWJvbHM6IFsnTWFwJGVibmYkMiRzdWJleHByZXNzaW9uJDEnXSwgcG9zdHByb2Nlc3M6IGlkIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdNYXAkZWJuZiQyJyxcclxuICAgICAgc3ltYm9sczogW10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ01hcCcsXHJcbiAgICAgIHN5bWJvbHM6IFt7IGxpdGVyYWw6ICd7JyB9LCAnTWFwJGVibmYkMScsICdNYXAkZWJuZiQyJywgeyBsaXRlcmFsOiAnfScgfV0sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBkYXRhID0+ICh7IHR5cGU6ICdtYXAnLCBkYXRhOiBkYXRhWzJdID8gZGF0YVsyXVswXSA6IFtdIH0pXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnU2V0JHN0cmluZyQxJyxcclxuICAgICAgc3ltYm9sczogW3sgbGl0ZXJhbDogJyMnIH0sIHsgbGl0ZXJhbDogJ3snIH1dLFxyXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24gam9pbmVyKGQpIHtcclxuICAgICAgICByZXR1cm4gZC5qb2luKCcnKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHsgbmFtZTogJ1NldCRlYm5mJDEnLCBzeW1ib2xzOiBbJ18nXSwgcG9zdHByb2Nlc3M6IGlkIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdTZXQkZWJuZiQxJyxcclxuICAgICAgc3ltYm9sczogW10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHsgbmFtZTogJ1NldCRlYm5mJDIkc3ViZXhwcmVzc2lvbiQxJGVibmYkMScsIHN5bWJvbHM6IFsnXyddLCBwb3N0cHJvY2VzczogaWQgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ1NldCRlYm5mJDIkc3ViZXhwcmVzc2lvbiQxJGVibmYkMScsXHJcbiAgICAgIHN5bWJvbHM6IFtdLFxyXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7IG5hbWU6ICdTZXQkZWJuZiQyJHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFsnRXhwJywgJ1NldCRlYm5mJDIkc3ViZXhwcmVzc2lvbiQxJGVibmYkMSddIH0sXHJcbiAgICB7IG5hbWU6ICdTZXQkZWJuZiQyJywgc3ltYm9sczogWydTZXQkZWJuZiQyJHN1YmV4cHJlc3Npb24kMSddLCBwb3N0cHJvY2VzczogaWQgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ1NldCRlYm5mJDInLFxyXG4gICAgICBzeW1ib2xzOiBbXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnU2V0JyxcclxuICAgICAgc3ltYm9sczogWydTZXQkc3RyaW5nJDEnLCAnU2V0JGVibmYkMScsICdTZXQkZWJuZiQyJywgeyBsaXRlcmFsOiAnfScgfV0sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBkYXRhID0+ICh7IHR5cGU6ICdzZXQnLCBkYXRhOiBkYXRhWzJdID8gZGF0YVsyXVswXSA6IFtdIH0pXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnVGFnJyxcclxuICAgICAgc3ltYm9sczogW3sgbGl0ZXJhbDogJyMnIH0sICdTeW1ib2wnLCAnXycsICdFbGVtZW50J10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiAoZGF0YSwgX2wsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgIGlmIChkYXRhWzFdLmRhdGFbMF0gPT09ICdfJykgcmV0dXJuIHJlamVjdDtcclxuICAgICAgICByZXR1cm4geyB0eXBlOiAndGFnJywgdGFnOiBkYXRhWzFdLmRhdGEsIGRhdGE6IGRhdGFbM10gfTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ0Rpc2NhcmQkc3RyaW5nJDEnLFxyXG4gICAgICBzeW1ib2xzOiBbeyBsaXRlcmFsOiAnIycgfSwgeyBsaXRlcmFsOiAnXycgfV0sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBmdW5jdGlvbiBqb2luZXIoZCkge1xyXG4gICAgICAgIHJldHVybiBkLmpvaW4oJycpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgeyBuYW1lOiAnRGlzY2FyZCRlYm5mJDEnLCBzeW1ib2xzOiBbJ18nXSwgcG9zdHByb2Nlc3M6IGlkIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdEaXNjYXJkJGVibmYkMScsXHJcbiAgICAgIHN5bWJvbHM6IFtdLFxyXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdEaXNjYXJkJyxcclxuICAgICAgc3ltYm9sczogWydEaXNjYXJkJHN0cmluZyQxJywgJ0Rpc2NhcmQkZWJuZiQxJywgJ0VsZW1lbnQnXSxcclxuICAgICAgcG9zdHByb2Nlc3M6ICgpID0+ICh7IHR5cGU6ICdkaXNjYXJkJyB9KVxyXG4gICAgfSxcclxuICAgIHsgbmFtZTogJ1N0cmluZyRlYm5mJDEnLCBzeW1ib2xzOiBbXSB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnU3RyaW5nJGVibmYkMScsXHJcbiAgICAgIHN5bWJvbHM6IFsnU3RyaW5nJGVibmYkMScsICdzdHJpbmdfY2hhciddLFxyXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24gYXJycHVzaChkKSB7XHJcbiAgICAgICAgcmV0dXJuIGRbMF0uY29uY2F0KFtkWzFdXSk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdTdHJpbmcnLFxyXG4gICAgICBzeW1ib2xzOiBbeyBsaXRlcmFsOiAnXCInIH0sICdTdHJpbmckZWJuZiQxJywgeyBsaXRlcmFsOiAnXCInIH1dLFxyXG4gICAgICBwb3N0cHJvY2VzczogZGF0YSA9PiAoeyB0eXBlOiAnc3RyaW5nJywgZGF0YTogZGF0YVsxXS5qb2luKCcnKSB9KVxyXG4gICAgfSxcclxuICAgIHsgbmFtZTogJ3N0cmluZ19jaGFyJywgc3ltYm9sczogWy9bXlxcXFxcIl0vXSB9LFxyXG4gICAgeyBuYW1lOiAnc3RyaW5nX2NoYXInLCBzeW1ib2xzOiBbJ2JhY2tzbGFzaCddIH0sXHJcbiAgICB7IG5hbWU6ICdzdHJpbmdfY2hhcicsIHN5bWJvbHM6IFsnYmFja3NsYXNoX3VuaWNvZGUnXSwgcG9zdHByb2Nlc3M6IGlkIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdiYWNrc2xhc2gnLFxyXG4gICAgICBzeW1ib2xzOiBbeyBsaXRlcmFsOiAnXFxcXCcgfSwgL1tcInRyblxcXFxdL10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBkYXRhID0+IGRhdGEuam9pbignJylcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdiYWNrc2xhc2hfdW5pY29kZScsXHJcbiAgICAgIHN5bWJvbHM6IFt7IGxpdGVyYWw6ICdcXFxcJyB9LCAndW5pY29kZSddLFxyXG4gICAgICBwb3N0cHJvY2VzczogZGF0YSA9PiBkYXRhWzFdXHJcbiAgICB9LFxyXG4gICAgeyBuYW1lOiAnUmVzZXJ2ZWQkc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogWydib29sZWFuJ10gfSxcclxuICAgIHsgbmFtZTogJ1Jlc2VydmVkJHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFsnbmlsJ10gfSxcclxuICAgIHsgbmFtZTogJ1Jlc2VydmVkJywgc3ltYm9sczogWydSZXNlcnZlZCRzdWJleHByZXNzaW9uJDEnXSwgcG9zdHByb2Nlc3M6IGRhdGEgPT4gZGF0YVswXVswXSB9LFxyXG4gICAgeyBuYW1lOiAnYm9vbGVhbiRzdWJleHByZXNzaW9uJDEnLCBzeW1ib2xzOiBbJ3RydWUnXSB9LFxyXG4gICAgeyBuYW1lOiAnYm9vbGVhbiRzdWJleHByZXNzaW9uJDEnLCBzeW1ib2xzOiBbJ2ZhbHNlJ10gfSxcclxuICAgIHsgbmFtZTogJ2Jvb2xlYW4nLCBzeW1ib2xzOiBbJ2Jvb2xlYW4kc3ViZXhwcmVzc2lvbiQxJ10sIHBvc3Rwcm9jZXNzOiBkYXRhID0+IGRhdGFbMF1bMF0gfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ3RydWUkc3RyaW5nJDEnLFxyXG4gICAgICBzeW1ib2xzOiBbeyBsaXRlcmFsOiAndCcgfSwgeyBsaXRlcmFsOiAncicgfSwgeyBsaXRlcmFsOiAndScgfSwgeyBsaXRlcmFsOiAnZScgfV0sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBmdW5jdGlvbiBqb2luZXIoZCkge1xyXG4gICAgICAgIHJldHVybiBkLmpvaW4oJycpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgeyBuYW1lOiAndHJ1ZScsIHN5bWJvbHM6IFsndHJ1ZSRzdHJpbmckMSddLCBwb3N0cHJvY2VzczogKCkgPT4gKHsgdHlwZTogJ2Jvb2wnLCBkYXRhOiB0cnVlIH0pIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdmYWxzZSRzdHJpbmckMScsXHJcbiAgICAgIHN5bWJvbHM6IFtcclxuICAgICAgICB7IGxpdGVyYWw6ICdmJyB9LFxyXG4gICAgICAgIHsgbGl0ZXJhbDogJ2EnIH0sXHJcbiAgICAgICAgeyBsaXRlcmFsOiAnbCcgfSxcclxuICAgICAgICB7IGxpdGVyYWw6ICdzJyB9LFxyXG4gICAgICAgIHsgbGl0ZXJhbDogJ2UnIH1cclxuICAgICAgXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uIGpvaW5lcihkKSB7XHJcbiAgICAgICAgcmV0dXJuIGQuam9pbignJyk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdmYWxzZScsXHJcbiAgICAgIHN5bWJvbHM6IFsnZmFsc2Ukc3RyaW5nJDEnXSxcclxuICAgICAgcG9zdHByb2Nlc3M6ICgpID0+ICh7IHR5cGU6ICdib29sJywgZGF0YTogZmFsc2UgfSlcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICduaWwkc3RyaW5nJDEnLFxyXG4gICAgICBzeW1ib2xzOiBbeyBsaXRlcmFsOiAnbicgfSwgeyBsaXRlcmFsOiAnaScgfSwgeyBsaXRlcmFsOiAnbCcgfV0sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBmdW5jdGlvbiBqb2luZXIoZCkge1xyXG4gICAgICAgIHJldHVybiBkLmpvaW4oJycpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgeyBuYW1lOiAnbmlsJywgc3ltYm9sczogWyduaWwkc3RyaW5nJDEnXSwgcG9zdHByb2Nlc3M6ICgpID0+ICh7IHR5cGU6ICduaWwnLCBkYXRhOiBudWxsIH0pIH0sXHJcbiAgICB7IG5hbWU6ICdTeW1ib2wkc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogWydzeW1ib2wnXSB9LFxyXG4gICAgeyBuYW1lOiAnU3ltYm9sJHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFt7IGxpdGVyYWw6ICcvJyB9XSB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnU3ltYm9sJyxcclxuICAgICAgc3ltYm9sczogWydTeW1ib2wkc3ViZXhwcmVzc2lvbiQxJ10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiAoZGF0YSwgXywgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgaWYgKGRhdGFbMF1bMF0gPT09ICd0cnVlJyB8fCBkYXRhWzBdWzBdID09PSAnZmFsc2UnIHx8IGRhdGFbMF1bMF0gPT09ICduaWwnKSByZXR1cm4gcmVqZWN0O1xyXG4gICAgICAgIHJldHVybiB7IHR5cGU6ICdzeW1ib2wnLCBkYXRhOiBkYXRhWzBdWzBdIH07XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7IG5hbWU6ICdzeW1ib2wkZWJuZiQxJHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFt7IGxpdGVyYWw6ICcvJyB9LCAnc3ltYm9sX3BpZWNlJ10gfSxcclxuICAgIHsgbmFtZTogJ3N5bWJvbCRlYm5mJDEnLCBzeW1ib2xzOiBbJ3N5bWJvbCRlYm5mJDEkc3ViZXhwcmVzc2lvbiQxJ10sIHBvc3Rwcm9jZXNzOiBpZCB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnc3ltYm9sJGVibmYkMScsXHJcbiAgICAgIHN5bWJvbHM6IFtdLFxyXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdzeW1ib2wnLFxyXG4gICAgICBzeW1ib2xzOiBbJ3N5bWJvbF9waWVjZScsICdzeW1ib2wkZWJuZiQxJ10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBkYXRhID0+IGRhdGFbMF0gKyAoZGF0YVsxXSA/IGRhdGFbMV0uam9pbignJykgOiAnJylcclxuICAgIH0sXHJcbiAgICB7IG5hbWU6ICdzeW1ib2xfcGllY2UnLCBzeW1ib2xzOiBbJ3N5bWJvbF9waWVjZV9iYXNpYyddIH0sXHJcbiAgICB7IG5hbWU6ICdzeW1ib2xfcGllY2UnLCBzeW1ib2xzOiBbJ3N5bWJvbF9waWVjZV9udW0nXSwgcG9zdHByb2Nlc3M6IGlkIH0sXHJcbiAgICB7IG5hbWU6ICdzeW1ib2xfcGllY2VfYmFzaWMkZWJuZiQxJywgc3ltYm9sczogW10gfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ3N5bWJvbF9waWVjZV9iYXNpYyRlYm5mJDEnLFxyXG4gICAgICBzeW1ib2xzOiBbJ3N5bWJvbF9waWVjZV9iYXNpYyRlYm5mJDEnLCAnc3ltYm9sX21pZCddLFxyXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24gYXJycHVzaChkKSB7XHJcbiAgICAgICAgcmV0dXJuIGRbMF0uY29uY2F0KFtkWzFdXSk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdzeW1ib2xfcGllY2VfYmFzaWMnLFxyXG4gICAgICBzeW1ib2xzOiBbJ3N5bWJvbF9zdGFydCcsICdzeW1ib2xfcGllY2VfYmFzaWMkZWJuZiQxJ10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBkYXRhID0+IGRhdGFbMF0gKyBkYXRhWzFdLmpvaW4oJycpXHJcbiAgICB9LFxyXG4gICAgeyBuYW1lOiAnc3ltYm9sX3BpZWNlX251bSRlYm5mJDEkc3ViZXhwcmVzc2lvbiQxJGVibmYkMScsIHN5bWJvbHM6IFtdIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdzeW1ib2xfcGllY2VfbnVtJGVibmYkMSRzdWJleHByZXNzaW9uJDEkZWJuZiQxJyxcclxuICAgICAgc3ltYm9sczogWydzeW1ib2xfcGllY2VfbnVtJGVibmYkMSRzdWJleHByZXNzaW9uJDEkZWJuZiQxJywgJ3N5bWJvbF9taWQnXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uIGFycnB1c2goZCkge1xyXG4gICAgICAgIHJldHVybiBkWzBdLmNvbmNhdChbZFsxXV0pO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnc3ltYm9sX3BpZWNlX251bSRlYm5mJDEkc3ViZXhwcmVzc2lvbiQxJyxcclxuICAgICAgc3ltYm9sczogWydzeW1ib2xfc2Vjb25kX3NwZWNpYWwnLCAnc3ltYm9sX3BpZWNlX251bSRlYm5mJDEkc3ViZXhwcmVzc2lvbiQxJGVibmYkMSddXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnc3ltYm9sX3BpZWNlX251bSRlYm5mJDEnLFxyXG4gICAgICBzeW1ib2xzOiBbJ3N5bWJvbF9waWVjZV9udW0kZWJuZiQxJHN1YmV4cHJlc3Npb24kMSddLFxyXG4gICAgICBwb3N0cHJvY2VzczogaWRcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdzeW1ib2xfcGllY2VfbnVtJGVibmYkMScsXHJcbiAgICAgIHN5bWJvbHM6IFtdLFxyXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdzeW1ib2xfcGllY2VfbnVtJyxcclxuICAgICAgc3ltYm9sczogWy9bXFwtKy5dLywgJ3N5bWJvbF9waWVjZV9udW0kZWJuZiQxJ10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBkYXRhID0+IGRhdGFbMF0gKyAoZGF0YVsxXSA/IGRhdGFbMV1bMF0gKyBkYXRhWzFdWzFdLmpvaW4oJycpIDogJycpXHJcbiAgICB9LFxyXG4gICAgeyBuYW1lOiAnc3ltYm9sX2Jhc2ljJGVibmYkMScsIHN5bWJvbHM6IFtdIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdzeW1ib2xfYmFzaWMkZWJuZiQxJyxcclxuICAgICAgc3ltYm9sczogWydzeW1ib2xfYmFzaWMkZWJuZiQxJywgJ3N5bWJvbF9taWQnXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uIGFycnB1c2goZCkge1xyXG4gICAgICAgIHJldHVybiBkWzBdLmNvbmNhdChbZFsxXV0pO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgeyBuYW1lOiAnc3ltYm9sX2Jhc2ljJGVibmYkMiRzdWJleHByZXNzaW9uJDEnLCBzeW1ib2xzOiBbeyBsaXRlcmFsOiAnLycgfSwgJ3N5bWJvbF9waWVjZSddIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdzeW1ib2xfYmFzaWMkZWJuZiQyJyxcclxuICAgICAgc3ltYm9sczogWydzeW1ib2xfYmFzaWMkZWJuZiQyJHN1YmV4cHJlc3Npb24kMSddLFxyXG4gICAgICBwb3N0cHJvY2VzczogaWRcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdzeW1ib2xfYmFzaWMkZWJuZiQyJyxcclxuICAgICAgc3ltYm9sczogW10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ3N5bWJvbF9iYXNpYycsXHJcbiAgICAgIHN5bWJvbHM6IFsnc3ltYm9sX3N0YXJ0JywgJ3N5bWJvbF9iYXNpYyRlYm5mJDEnLCAnc3ltYm9sX2Jhc2ljJGVibmYkMiddLFxyXG4gICAgICBwb3N0cHJvY2VzczogZGF0YSA9PiBkYXRhWzBdICsgZGF0YVsxXS5qb2luKCcnKSArIChkYXRhWzJdID8gZGF0YVsyXS5qb2luKCcnKSA6ICcnKVxyXG4gICAgfSxcclxuICAgIHsgbmFtZTogJ3N5bWJvbF9zdGFydCcsIHN5bWJvbHM6IFsnbGV0dGVyJ10gfSxcclxuICAgIHsgbmFtZTogJ3N5bWJvbF9zdGFydCcsIHN5bWJvbHM6IFsvWyp+XyE/JCUmPTw+XS9dLCBwb3N0cHJvY2VzczogZGF0YSA9PiBkYXRhWzBdIH0sXHJcbiAgICB7IG5hbWU6ICdzeW1ib2xfbWlkJywgc3ltYm9sczogWydsZXR0ZXInXSB9LFxyXG4gICAgeyBuYW1lOiAnc3ltYm9sX21pZCcsIHN5bWJvbHM6IFsnZGlnaXQnXSB9LFxyXG4gICAgeyBuYW1lOiAnc3ltYm9sX21pZCcsIHN5bWJvbHM6IFsvWy4qXFwhXFwtK18/JCUmPTw+OiNdL10sIHBvc3Rwcm9jZXNzOiBkYXRhID0+IGRhdGFbMF0gfSxcclxuICAgIHsgbmFtZTogJ3N5bWJvbF9saWtlX2FfbnVtJGVibmYkMSRzdWJleHByZXNzaW9uJDEkZWJuZiQxJywgc3ltYm9sczogW10gfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ3N5bWJvbF9saWtlX2FfbnVtJGVibmYkMSRzdWJleHByZXNzaW9uJDEkZWJuZiQxJyxcclxuICAgICAgc3ltYm9sczogWydzeW1ib2xfbGlrZV9hX251bSRlYm5mJDEkc3ViZXhwcmVzc2lvbiQxJGVibmYkMScsICdzeW1ib2xfbWlkJ10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBmdW5jdGlvbiBhcnJwdXNoKGQpIHtcclxuICAgICAgICByZXR1cm4gZFswXS5jb25jYXQoW2RbMV1dKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ3N5bWJvbF9saWtlX2FfbnVtJGVibmYkMSRzdWJleHByZXNzaW9uJDEnLFxyXG4gICAgICBzeW1ib2xzOiBbJ3N5bWJvbF9zZWNvbmRfc3BlY2lhbCcsICdzeW1ib2xfbGlrZV9hX251bSRlYm5mJDEkc3ViZXhwcmVzc2lvbiQxJGVibmYkMSddXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnc3ltYm9sX2xpa2VfYV9udW0kZWJuZiQxJyxcclxuICAgICAgc3ltYm9sczogWydzeW1ib2xfbGlrZV9hX251bSRlYm5mJDEkc3ViZXhwcmVzc2lvbiQxJ10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBpZFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ3N5bWJvbF9saWtlX2FfbnVtJGVibmYkMScsXHJcbiAgICAgIHN5bWJvbHM6IFtdLFxyXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdzeW1ib2xfbGlrZV9hX251bSRlYm5mJDIkc3ViZXhwcmVzc2lvbiQxJyxcclxuICAgICAgc3ltYm9sczogW3sgbGl0ZXJhbDogJy8nIH0sICdzeW1ib2xfcGllY2UnXVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ3N5bWJvbF9saWtlX2FfbnVtJGVibmYkMicsXHJcbiAgICAgIHN5bWJvbHM6IFsnc3ltYm9sX2xpa2VfYV9udW0kZWJuZiQyJHN1YmV4cHJlc3Npb24kMSddLFxyXG4gICAgICBwb3N0cHJvY2VzczogaWRcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdzeW1ib2xfbGlrZV9hX251bSRlYm5mJDInLFxyXG4gICAgICBzeW1ib2xzOiBbXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnc3ltYm9sX2xpa2VfYV9udW0nLFxyXG4gICAgICBzeW1ib2xzOiBbL1tcXC0rLl0vLCAnc3ltYm9sX2xpa2VfYV9udW0kZWJuZiQxJywgJ3N5bWJvbF9saWtlX2FfbnVtJGVibmYkMiddLFxyXG4gICAgICBwb3N0cHJvY2VzczogZGF0YSA9PlxyXG4gICAgICAgIGRhdGFbMF0gK1xyXG4gICAgICAgIChkYXRhWzFdID8gZGF0YVsxXVswXSArIGRhdGFbMV1bMV0uam9pbignJykgOiAnJykgK1xyXG4gICAgICAgIChkYXRhWzJdID8gZGF0YVsyXS5qb2luKCcnKSA6ICcnKVxyXG4gICAgfSxcclxuICAgIHsgbmFtZTogJ3N5bWJvbF9zZWNvbmRfc3BlY2lhbCcsIHN5bWJvbHM6IFsnc3ltYm9sX3N0YXJ0J10gfSxcclxuICAgIHsgbmFtZTogJ3N5bWJvbF9zZWNvbmRfc3BlY2lhbCcsIHN5bWJvbHM6IFsvW1xcLSsuOiNdL10sIHBvc3Rwcm9jZXNzOiBkYXRhID0+IGRhdGFbMF0gfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ0tleXdvcmQnLFxyXG4gICAgICBzeW1ib2xzOiBbeyBsaXRlcmFsOiAnOicgfSwgJ1N5bWJvbCddLFxyXG4gICAgICBwb3N0cHJvY2VzczogZGF0YSA9PiAoeyB0eXBlOiAna2V5d29yZCcsIGRhdGE6ICc6JyArIGRhdGFbMV0uZGF0YSB9KVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ0NoYXJhY3RlcicsXHJcbiAgICAgIHN5bWJvbHM6IFt7IGxpdGVyYWw6ICdcXFxcJyB9LCAnY2hhciddLFxyXG4gICAgICBwb3N0cHJvY2VzczogZGF0YSA9PiAoeyB0eXBlOiAnY2hhcicsIGRhdGE6IGRhdGFbMV1bMF0gfSlcclxuICAgIH0sXHJcbiAgICB7IG5hbWU6ICdjaGFyJywgc3ltYm9sczogWy9bXiBcXHRcXHJcXG5dL10gfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ2NoYXIkc3RyaW5nJDEnLFxyXG4gICAgICBzeW1ib2xzOiBbXHJcbiAgICAgICAgeyBsaXRlcmFsOiAnbicgfSxcclxuICAgICAgICB7IGxpdGVyYWw6ICdlJyB9LFxyXG4gICAgICAgIHsgbGl0ZXJhbDogJ3cnIH0sXHJcbiAgICAgICAgeyBsaXRlcmFsOiAnbCcgfSxcclxuICAgICAgICB7IGxpdGVyYWw6ICdpJyB9LFxyXG4gICAgICAgIHsgbGl0ZXJhbDogJ24nIH0sXHJcbiAgICAgICAgeyBsaXRlcmFsOiAnZScgfVxyXG4gICAgICBdLFxyXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24gam9pbmVyKGQpIHtcclxuICAgICAgICByZXR1cm4gZC5qb2luKCcnKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHsgbmFtZTogJ2NoYXInLCBzeW1ib2xzOiBbJ2NoYXIkc3RyaW5nJDEnXSB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnY2hhciRzdHJpbmckMicsXHJcbiAgICAgIHN5bWJvbHM6IFtcclxuICAgICAgICB7IGxpdGVyYWw6ICdyJyB9LFxyXG4gICAgICAgIHsgbGl0ZXJhbDogJ2UnIH0sXHJcbiAgICAgICAgeyBsaXRlcmFsOiAndCcgfSxcclxuICAgICAgICB7IGxpdGVyYWw6ICd1JyB9LFxyXG4gICAgICAgIHsgbGl0ZXJhbDogJ3InIH0sXHJcbiAgICAgICAgeyBsaXRlcmFsOiAnbicgfVxyXG4gICAgICBdLFxyXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24gam9pbmVyKGQpIHtcclxuICAgICAgICByZXR1cm4gZC5qb2luKCcnKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHsgbmFtZTogJ2NoYXInLCBzeW1ib2xzOiBbJ2NoYXIkc3RyaW5nJDInXSB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnY2hhciRzdHJpbmckMycsXHJcbiAgICAgIHN5bWJvbHM6IFtcclxuICAgICAgICB7IGxpdGVyYWw6ICdzJyB9LFxyXG4gICAgICAgIHsgbGl0ZXJhbDogJ3AnIH0sXHJcbiAgICAgICAgeyBsaXRlcmFsOiAnYScgfSxcclxuICAgICAgICB7IGxpdGVyYWw6ICdjJyB9LFxyXG4gICAgICAgIHsgbGl0ZXJhbDogJ2UnIH1cclxuICAgICAgXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uIGpvaW5lcihkKSB7XHJcbiAgICAgICAgcmV0dXJuIGQuam9pbignJyk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7IG5hbWU6ICdjaGFyJywgc3ltYm9sczogWydjaGFyJHN0cmluZyQzJ10gfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ2NoYXIkc3RyaW5nJDQnLFxyXG4gICAgICBzeW1ib2xzOiBbeyBsaXRlcmFsOiAndCcgfSwgeyBsaXRlcmFsOiAnYScgfSwgeyBsaXRlcmFsOiAnYicgfV0sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBmdW5jdGlvbiBqb2luZXIoZCkge1xyXG4gICAgICAgIHJldHVybiBkLmpvaW4oJycpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgeyBuYW1lOiAnY2hhcicsIHN5bWJvbHM6IFsnY2hhciRzdHJpbmckNCddIH0sXHJcbiAgICB7IG5hbWU6ICdjaGFyJywgc3ltYm9sczogWyd1bmljb2RlJ10sIHBvc3Rwcm9jZXNzOiBkYXRhID0+IGRhdGFbMF0gfSxcclxuICAgIHsgbmFtZTogJ051bWJlcicsIHN5bWJvbHM6IFsnSW50ZWdlciddIH0sXHJcbiAgICB7IG5hbWU6ICdOdW1iZXInLCBzeW1ib2xzOiBbJ0Zsb2F0J10sIHBvc3Rwcm9jZXNzOiBkYXRhID0+IGRhdGFbMF0gfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ0Zsb2F0JyxcclxuICAgICAgc3ltYm9sczogWydmbG9hdCddLFxyXG4gICAgICBwb3N0cHJvY2VzczogZGF0YSA9PiAoeyB0eXBlOiAnZG91YmxlJywgZGF0YTogZGF0YVswXVswXSwgYXJiaXRyYXJ5OiAhIWRhdGFbMF1bMV0gfSlcclxuICAgIH0sXHJcbiAgICB7IG5hbWU6ICdJbnRlZ2VyJGVibmYkMScsIHN5bWJvbHM6IFt7IGxpdGVyYWw6ICdOJyB9XSwgcG9zdHByb2Nlc3M6IGlkIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdJbnRlZ2VyJGVibmYkMScsXHJcbiAgICAgIHN5bWJvbHM6IFtdLFxyXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdJbnRlZ2VyJyxcclxuICAgICAgc3ltYm9sczogWydpbnQnLCAnSW50ZWdlciRlYm5mJDEnXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGRhdGEgPT4gKHsgdHlwZTogJ2ludCcsIGRhdGE6IGRhdGFbMF1bMF0sIGFyYml0cmFyeTogISFkYXRhWzFdIH0pXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnZmxvYXQnLFxyXG4gICAgICBzeW1ib2xzOiBbJ2ludCcsIHsgbGl0ZXJhbDogJ00nIH1dLFxyXG4gICAgICBwb3N0cHJvY2VzczogZGF0YSA9PiBbZGF0YS5zbGljZSgwLCAxKS5qb2luKCcnKSwgZGF0YVsxXV1cclxuICAgIH0sXHJcbiAgICB7IG5hbWU6ICdmbG9hdCRlYm5mJDEnLCBzeW1ib2xzOiBbeyBsaXRlcmFsOiAnTScgfV0sIHBvc3Rwcm9jZXNzOiBpZCB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnZmxvYXQkZWJuZiQxJyxcclxuICAgICAgc3ltYm9sczogW10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ2Zsb2F0JyxcclxuICAgICAgc3ltYm9sczogWydpbnQnLCAnZnJhYycsICdmbG9hdCRlYm5mJDEnXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGRhdGEgPT4gW2RhdGEuc2xpY2UoMCwgMikuam9pbignJyksIGRhdGFbMl1dXHJcbiAgICB9LFxyXG4gICAgeyBuYW1lOiAnZmxvYXQkZWJuZiQyJywgc3ltYm9sczogW3sgbGl0ZXJhbDogJ00nIH1dLCBwb3N0cHJvY2VzczogaWQgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ2Zsb2F0JGVibmYkMicsXHJcbiAgICAgIHN5bWJvbHM6IFtdLFxyXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdmbG9hdCcsXHJcbiAgICAgIHN5bWJvbHM6IFsnaW50JywgJ2V4cCcsICdmbG9hdCRlYm5mJDInXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGRhdGEgPT4gW2RhdGEuc2xpY2UoMCwgMikuam9pbignJyksIGRhdGFbMl1dXHJcbiAgICB9LFxyXG4gICAgeyBuYW1lOiAnZmxvYXQkZWJuZiQzJywgc3ltYm9sczogW3sgbGl0ZXJhbDogJ00nIH1dLCBwb3N0cHJvY2VzczogaWQgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ2Zsb2F0JGVibmYkMycsXHJcbiAgICAgIHN5bWJvbHM6IFtdLFxyXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdmbG9hdCcsXHJcbiAgICAgIHN5bWJvbHM6IFsnaW50JywgJ2ZyYWMnLCAnZXhwJywgJ2Zsb2F0JGVibmYkMyddLFxyXG4gICAgICBwb3N0cHJvY2VzczogZGF0YSA9PiBbZGF0YS5zbGljZSgwLCAzKS5qb2luKCcnKSwgZGF0YVsyXV1cclxuICAgIH0sXHJcbiAgICB7IG5hbWU6ICdmcmFjJGVibmYkMScsIHN5bWJvbHM6IFtdIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdmcmFjJGVibmYkMScsXHJcbiAgICAgIHN5bWJvbHM6IFsnZnJhYyRlYm5mJDEnLCAnZGlnaXQnXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uIGFycnB1c2goZCkge1xyXG4gICAgICAgIHJldHVybiBkWzBdLmNvbmNhdChbZFsxXV0pO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnZnJhYycsXHJcbiAgICAgIHN5bWJvbHM6IFt7IGxpdGVyYWw6ICcuJyB9LCAnZnJhYyRlYm5mJDEnXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGRhdGEgPT4gZGF0YVswXSArIGRhdGFbMV0uam9pbignJylcclxuICAgIH0sXHJcbiAgICB7IG5hbWU6ICdleHAnLCBzeW1ib2xzOiBbJ2V4JywgJ2RpZ2l0cyddLCBwb3N0cHJvY2VzczogZGF0YSA9PiBkYXRhLmpvaW4oJycpIH0sXHJcbiAgICB7IG5hbWU6ICdleCRzdWJleHByZXNzaW9uJDEnLCBzeW1ib2xzOiBbeyBsaXRlcmFsOiAnZScgfV0gfSxcclxuICAgIHsgbmFtZTogJ2V4JHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFt7IGxpdGVyYWw6ICdFJyB9XSB9LFxyXG4gICAgeyBuYW1lOiAnZXgkZWJuZiQxJHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFt7IGxpdGVyYWw6ICcrJyB9XSB9LFxyXG4gICAgeyBuYW1lOiAnZXgkZWJuZiQxJHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFt7IGxpdGVyYWw6ICctJyB9XSB9LFxyXG4gICAgeyBuYW1lOiAnZXgkZWJuZiQxJywgc3ltYm9sczogWydleCRlYm5mJDEkc3ViZXhwcmVzc2lvbiQxJ10sIHBvc3Rwcm9jZXNzOiBpZCB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnZXgkZWJuZiQxJyxcclxuICAgICAgc3ltYm9sczogW10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ2V4JyxcclxuICAgICAgc3ltYm9sczogWydleCRzdWJleHByZXNzaW9uJDEnLCAnZXgkZWJuZiQxJ10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBkYXRhID0+ICdlJyArIChkYXRhWzFdIHx8ICcrJylcclxuICAgIH0sXHJcbiAgICB7IG5hbWU6ICdpbnQnLCBzeW1ib2xzOiBbJ2ludF9ub19wcmVmaXgnXSB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnaW50JyxcclxuICAgICAgc3ltYm9sczogW3sgbGl0ZXJhbDogJysnIH0sICdpbnRfbm9fcHJlZml4J10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBkYXRhID0+IGRhdGEuam9pbignJylcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdpbnQnLFxyXG4gICAgICBzeW1ib2xzOiBbeyBsaXRlcmFsOiAnLScgfSwgJ2ludF9ub19wcmVmaXgnXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGRhdGEgPT4gZGF0YS5qb2luKCcnKVxyXG4gICAgfSxcclxuICAgIHsgbmFtZTogJ2ludF9ub19wcmVmaXgnLCBzeW1ib2xzOiBbeyBsaXRlcmFsOiAnMCcgfV0sIHBvc3Rwcm9jZXNzOiBkYXRhID0+IGRhdGEuam9pbignJykgfSxcclxuICAgIHsgbmFtZTogJ2ludF9ub19wcmVmaXgkZWJuZiQxJywgc3ltYm9sczogW10gfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ2ludF9ub19wcmVmaXgkZWJuZiQxJyxcclxuICAgICAgc3ltYm9sczogWydpbnRfbm9fcHJlZml4JGVibmYkMScsICdkaWdpdCddLFxyXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24gYXJycHVzaChkKSB7XHJcbiAgICAgICAgcmV0dXJuIGRbMF0uY29uY2F0KFtkWzFdXSk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdpbnRfbm9fcHJlZml4JyxcclxuICAgICAgc3ltYm9sczogWydvbmVUb05pbmUnLCAnaW50X25vX3ByZWZpeCRlYm5mJDEnXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGRhdGEgPT4gZGF0YVswXSArIGRhdGFbMV0uam9pbignJylcclxuICAgIH0sXHJcbiAgICB7IG5hbWU6ICdvbmVUb05pbmUnLCBzeW1ib2xzOiBbL1sxLTldL10sIHBvc3Rwcm9jZXNzOiBkYXRhID0+IGRhdGEuam9pbignJykgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ01hcEVsZW0nLFxyXG4gICAgICBzeW1ib2xzOiBbJ21hcEtleScsICdtYXBWYWx1ZSddLFxyXG4gICAgICBwb3N0cHJvY2VzczogZGF0YSA9PiBbW2RhdGFbMF1bMF0sIGRhdGFbMV1bMF1dXS5jb25jYXQoZGF0YVsxXS5zbGljZSgxKSlcclxuICAgIH0sXHJcbiAgICB7IG5hbWU6ICdtYXBLZXkkc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogWydtYXBLZXlTcGFjZSddIH0sXHJcbiAgICB7IG5hbWU6ICdtYXBLZXkkc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogWydtYXBLZXlOb1NwYWNlJ10gfSxcclxuICAgIHsgbmFtZTogJ21hcEtleScsIHN5bWJvbHM6IFsnbWFwS2V5JHN1YmV4cHJlc3Npb24kMSddLCBwb3N0cHJvY2VzczogZGF0YSA9PiBkYXRhWzBdIH0sXHJcbiAgICB7IG5hbWU6ICdtYXBWYWx1ZSRzdWJleHByZXNzaW9uJDEnLCBzeW1ib2xzOiBbJ21hcFZhbHVlU3BhY2UnXSB9LFxyXG4gICAgeyBuYW1lOiAnbWFwVmFsdWUkc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogWydtYXBWYWx1ZU5vU3BhY2UnXSB9LFxyXG4gICAgeyBuYW1lOiAnbWFwVmFsdWUnLCBzeW1ib2xzOiBbJ21hcFZhbHVlJHN1YmV4cHJlc3Npb24kMSddLCBwb3N0cHJvY2VzczogZGF0YSA9PiBkYXRhWzBdWzBdIH0sXHJcbiAgICB7IG5hbWU6ICdtYXBLZXlTcGFjZSRlYm5mJDEnLCBzeW1ib2xzOiBbXSB9LFxyXG4gICAgeyBuYW1lOiAnbWFwS2V5U3BhY2UkZWJuZiQxJHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFsnRGlzY2FyZCcsICdfJ10gfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ21hcEtleVNwYWNlJGVibmYkMScsXHJcbiAgICAgIHN5bWJvbHM6IFsnbWFwS2V5U3BhY2UkZWJuZiQxJywgJ21hcEtleVNwYWNlJGVibmYkMSRzdWJleHByZXNzaW9uJDEnXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uIGFycnB1c2goZCkge1xyXG4gICAgICAgIHJldHVybiBkWzBdLmNvbmNhdChbZFsxXV0pO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnbWFwS2V5U3BhY2UnLFxyXG4gICAgICBzeW1ib2xzOiBbJ21hcEtleVNwYWNlJGVibmYkMScsICdtYXBFbGVtZW50U3BhY2UnLCAnXyddLFxyXG4gICAgICBwb3N0cHJvY2VzczogZGF0YSA9PiBkYXRhWzFdXHJcbiAgICB9LFxyXG4gICAgeyBuYW1lOiAnbWFwS2V5Tm9TcGFjZSRlYm5mJDEnLCBzeW1ib2xzOiBbXSB9LFxyXG4gICAgeyBuYW1lOiAnbWFwS2V5Tm9TcGFjZSRlYm5mJDEkc3ViZXhwcmVzc2lvbiQxJGVibmYkMScsIHN5bWJvbHM6IFsnXyddLCBwb3N0cHJvY2VzczogaWQgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ21hcEtleU5vU3BhY2UkZWJuZiQxJHN1YmV4cHJlc3Npb24kMSRlYm5mJDEnLFxyXG4gICAgICBzeW1ib2xzOiBbXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnbWFwS2V5Tm9TcGFjZSRlYm5mJDEkc3ViZXhwcmVzc2lvbiQxJyxcclxuICAgICAgc3ltYm9sczogWydEaXNjYXJkJywgJ21hcEtleU5vU3BhY2UkZWJuZiQxJHN1YmV4cHJlc3Npb24kMSRlYm5mJDEnXVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ21hcEtleU5vU3BhY2UkZWJuZiQxJyxcclxuICAgICAgc3ltYm9sczogWydtYXBLZXlOb1NwYWNlJGVibmYkMScsICdtYXBLZXlOb1NwYWNlJGVibmYkMSRzdWJleHByZXNzaW9uJDEnXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uIGFycnB1c2goZCkge1xyXG4gICAgICAgIHJldHVybiBkWzBdLmNvbmNhdChbZFsxXV0pO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgeyBuYW1lOiAnbWFwS2V5Tm9TcGFjZSRlYm5mJDInLCBzeW1ib2xzOiBbJ18nXSwgcG9zdHByb2Nlc3M6IGlkIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdtYXBLZXlOb1NwYWNlJGVibmYkMicsXHJcbiAgICAgIHN5bWJvbHM6IFtdLFxyXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdtYXBLZXlOb1NwYWNlJyxcclxuICAgICAgc3ltYm9sczogWydtYXBLZXlOb1NwYWNlJGVibmYkMScsICdtYXBFbGVtZW50Tm9TcGFjZScsICdtYXBLZXlOb1NwYWNlJGVibmYkMiddLFxyXG4gICAgICBwb3N0cHJvY2VzczogZGF0YSA9PiBkYXRhWzFdXHJcbiAgICB9LFxyXG4gICAgeyBuYW1lOiAnbWFwVmFsdWVTcGFjZSRlYm5mJDEnLCBzeW1ib2xzOiBbXSB9LFxyXG4gICAgeyBuYW1lOiAnbWFwVmFsdWVTcGFjZSRlYm5mJDEkc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogWydEaXNjYXJkJywgJ18nXSB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnbWFwVmFsdWVTcGFjZSRlYm5mJDEnLFxyXG4gICAgICBzeW1ib2xzOiBbJ21hcFZhbHVlU3BhY2UkZWJuZiQxJywgJ21hcFZhbHVlU3BhY2UkZWJuZiQxJHN1YmV4cHJlc3Npb24kMSddLFxyXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24gYXJycHVzaChkKSB7XHJcbiAgICAgICAgcmV0dXJuIGRbMF0uY29uY2F0KFtkWzFdXSk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7IG5hbWU6ICdtYXBWYWx1ZVNwYWNlJGVibmYkMiRzdWJleHByZXNzaW9uJDEnLCBzeW1ib2xzOiBbJ18nLCAnTWFwRWxlbSddIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdtYXBWYWx1ZVNwYWNlJGVibmYkMicsXHJcbiAgICAgIHN5bWJvbHM6IFsnbWFwVmFsdWVTcGFjZSRlYm5mJDIkc3ViZXhwcmVzc2lvbiQxJ10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBpZFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ21hcFZhbHVlU3BhY2UkZWJuZiQyJyxcclxuICAgICAgc3ltYm9sczogW10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ21hcFZhbHVlU3BhY2UnLFxyXG4gICAgICBzeW1ib2xzOiBbJ21hcFZhbHVlU3BhY2UkZWJuZiQxJywgJ21hcEVsZW1lbnRTcGFjZScsICdtYXBWYWx1ZVNwYWNlJGVibmYkMiddLFxyXG4gICAgICBwb3N0cHJvY2VzczogZGF0YSA9PiBbZGF0YVsxXV0uY29uY2F0KGRhdGFbMl0gPyBkYXRhWzJdWzFdIDogW10pXHJcbiAgICB9LFxyXG4gICAgeyBuYW1lOiAnbWFwVmFsdWVOb1NwYWNlJGVibmYkMScsIHN5bWJvbHM6IFtdIH0sXHJcbiAgICB7IG5hbWU6ICdtYXBWYWx1ZU5vU3BhY2UkZWJuZiQxJHN1YmV4cHJlc3Npb24kMSRlYm5mJDEnLCBzeW1ib2xzOiBbJ18nXSwgcG9zdHByb2Nlc3M6IGlkIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdtYXBWYWx1ZU5vU3BhY2UkZWJuZiQxJHN1YmV4cHJlc3Npb24kMSRlYm5mJDEnLFxyXG4gICAgICBzeW1ib2xzOiBbXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnbWFwVmFsdWVOb1NwYWNlJGVibmYkMSRzdWJleHByZXNzaW9uJDEnLFxyXG4gICAgICBzeW1ib2xzOiBbJ0Rpc2NhcmQnLCAnbWFwVmFsdWVOb1NwYWNlJGVibmYkMSRzdWJleHByZXNzaW9uJDEkZWJuZiQxJ11cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdtYXBWYWx1ZU5vU3BhY2UkZWJuZiQxJyxcclxuICAgICAgc3ltYm9sczogWydtYXBWYWx1ZU5vU3BhY2UkZWJuZiQxJywgJ21hcFZhbHVlTm9TcGFjZSRlYm5mJDEkc3ViZXhwcmVzc2lvbiQxJ10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBmdW5jdGlvbiBhcnJwdXNoKGQpIHtcclxuICAgICAgICByZXR1cm4gZFswXS5jb25jYXQoW2RbMV1dKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHsgbmFtZTogJ21hcFZhbHVlTm9TcGFjZSRlYm5mJDIkc3ViZXhwcmVzc2lvbiQxJGVibmYkMScsIHN5bWJvbHM6IFsnXyddLCBwb3N0cHJvY2VzczogaWQgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ21hcFZhbHVlTm9TcGFjZSRlYm5mJDIkc3ViZXhwcmVzc2lvbiQxJGVibmYkMScsXHJcbiAgICAgIHN5bWJvbHM6IFtdLFxyXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdtYXBWYWx1ZU5vU3BhY2UkZWJuZiQyJHN1YmV4cHJlc3Npb24kMScsXHJcbiAgICAgIHN5bWJvbHM6IFsnbWFwVmFsdWVOb1NwYWNlJGVibmYkMiRzdWJleHByZXNzaW9uJDEkZWJuZiQxJywgJ01hcEVsZW0nXVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ21hcFZhbHVlTm9TcGFjZSRlYm5mJDInLFxyXG4gICAgICBzeW1ib2xzOiBbJ21hcFZhbHVlTm9TcGFjZSRlYm5mJDIkc3ViZXhwcmVzc2lvbiQxJ10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBpZFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ21hcFZhbHVlTm9TcGFjZSRlYm5mJDInLFxyXG4gICAgICBzeW1ib2xzOiBbXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnbWFwVmFsdWVOb1NwYWNlJyxcclxuICAgICAgc3ltYm9sczogWydtYXBWYWx1ZU5vU3BhY2UkZWJuZiQxJywgJ21hcEVsZW1lbnROb1NwYWNlJywgJ21hcFZhbHVlTm9TcGFjZSRlYm5mJDInXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGRhdGEgPT4gW2RhdGFbMV1dLmNvbmNhdChkYXRhWzJdID8gZGF0YVsyXVsxXSA6IFtdKVxyXG4gICAgfSxcclxuICAgIHsgbmFtZTogJ21hcEVsZW1lbnROb1NwYWNlJHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFsnVmVjdG9yJ10gfSxcclxuICAgIHsgbmFtZTogJ21hcEVsZW1lbnROb1NwYWNlJHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFsnTGlzdCddIH0sXHJcbiAgICB7IG5hbWU6ICdtYXBFbGVtZW50Tm9TcGFjZSRzdWJleHByZXNzaW9uJDEnLCBzeW1ib2xzOiBbJ1N0cmluZyddIH0sXHJcbiAgICB7IG5hbWU6ICdtYXBFbGVtZW50Tm9TcGFjZSRzdWJleHByZXNzaW9uJDEnLCBzeW1ib2xzOiBbJ01hcCddIH0sXHJcbiAgICB7IG5hbWU6ICdtYXBFbGVtZW50Tm9TcGFjZSRzdWJleHByZXNzaW9uJDEnLCBzeW1ib2xzOiBbJ1NldCddIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdtYXBFbGVtZW50Tm9TcGFjZScsXHJcbiAgICAgIHN5bWJvbHM6IFsnbWFwRWxlbWVudE5vU3BhY2Ukc3ViZXhwcmVzc2lvbiQxJ10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBkYXRhID0+IGRhdGFbMF1bMF1cclxuICAgIH0sXHJcbiAgICB7IG5hbWU6ICdtYXBFbGVtZW50U3BhY2Ukc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogWydOdW1iZXInXSB9LFxyXG4gICAgeyBuYW1lOiAnbWFwRWxlbWVudFNwYWNlJHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFsnQ2hhcmFjdGVyJ10gfSxcclxuICAgIHsgbmFtZTogJ21hcEVsZW1lbnRTcGFjZSRzdWJleHByZXNzaW9uJDEnLCBzeW1ib2xzOiBbJ1Jlc2VydmVkJ10gfSxcclxuICAgIHsgbmFtZTogJ21hcEVsZW1lbnRTcGFjZSRzdWJleHByZXNzaW9uJDEnLCBzeW1ib2xzOiBbJ1N5bWJvbCddIH0sXHJcbiAgICB7IG5hbWU6ICdtYXBFbGVtZW50U3BhY2Ukc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogWydLZXl3b3JkJ10gfSxcclxuICAgIHsgbmFtZTogJ21hcEVsZW1lbnRTcGFjZSRzdWJleHByZXNzaW9uJDEnLCBzeW1ib2xzOiBbJ1RhZyddIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdtYXBFbGVtZW50U3BhY2UnLFxyXG4gICAgICBzeW1ib2xzOiBbJ21hcEVsZW1lbnRTcGFjZSRzdWJleHByZXNzaW9uJDEnXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGRhdGEgPT4gW10uY29uY2F0KC4uLltkYXRhWzBdWzBdXSlbMF1cclxuICAgIH0sXHJcbiAgICB7IG5hbWU6ICdoZXhEaWdpdCcsIHN5bWJvbHM6IFsvW2EtZkEtRjAtOV0vXSwgcG9zdHByb2Nlc3M6IGRhdGEgPT4gZGF0YVswXSB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAndW5pY29kZScsXHJcbiAgICAgIHN5bWJvbHM6IFt7IGxpdGVyYWw6ICd1JyB9LCAnaGV4RGlnaXQnLCAnaGV4RGlnaXQnLCAnaGV4RGlnaXQnLCAnaGV4RGlnaXQnXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGRhdGEgPT4gU3RyaW5nLmZyb21DaGFyQ29kZShwYXJzZUludChkYXRhLnNsaWNlKDEpLmpvaW4oJycpLCAxNikpXHJcbiAgICB9LFxyXG4gICAgeyBuYW1lOiAnXycsIHN5bWJvbHM6IFsnc3BhY2UnXSwgcG9zdHByb2Nlc3M6IGRhdGEgPT4gZGF0YVswXSB9LFxyXG4gICAgeyBuYW1lOiAnc3BhY2UkZWJuZiQxJywgc3ltYm9sczogWy9bXFxzLFxcbl0vXSB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnc3BhY2UkZWJuZiQxJyxcclxuICAgICAgc3ltYm9sczogWydzcGFjZSRlYm5mJDEnLCAvW1xccyxcXG5dL10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBmdW5jdGlvbiBhcnJwdXNoKGQpIHtcclxuICAgICAgICByZXR1cm4gZFswXS5jb25jYXQoW2RbMV1dKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHsgbmFtZTogJ3NwYWNlJywgc3ltYm9sczogWydzcGFjZSRlYm5mJDEnXSwgcG9zdHByb2Nlc3M6IGRhdGEgPT4gZGF0YVswXS5qb2luKCcnKSB9LFxyXG4gICAgeyBuYW1lOiAnZGlnaXRzJGVibmYkMScsIHN5bWJvbHM6IFsnZGlnaXQnXSB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnZGlnaXRzJGVibmYkMScsXHJcbiAgICAgIHN5bWJvbHM6IFsnZGlnaXRzJGVibmYkMScsICdkaWdpdCddLFxyXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24gYXJycHVzaChkKSB7XHJcbiAgICAgICAgcmV0dXJuIGRbMF0uY29uY2F0KFtkWzFdXSk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7IG5hbWU6ICdkaWdpdHMnLCBzeW1ib2xzOiBbJ2RpZ2l0cyRlYm5mJDEnXSwgcG9zdHByb2Nlc3M6IGRhdGEgPT4gZGF0YVswXS5qb2luKCcnKSB9LFxyXG4gICAgeyBuYW1lOiAnZGlnaXQnLCBzeW1ib2xzOiBbL1swLTldL10sIHBvc3Rwcm9jZXNzOiBkYXRhID0+IGRhdGFbMF0gfSxcclxuICAgIHsgbmFtZTogJ2xldHRlcicsIHN5bWJvbHM6IFsvW2EtekEtWl0vXSwgcG9zdHByb2Nlc3M6IGRhdGEgPT4gZGF0YVswXSB9XHJcbiAgXSxcclxuICBQYXJzZXJTdGFydDogJ01haW4nXHJcbn07XHJcblxyXG4vLyBEbyB0aGUgcGFyc2luZ1xyXG5pbXBvcnQgeyBQYXJzZXIsIEdyYW1tYXIgfSBmcm9tICduZWFybGV5JztcclxuaW1wb3J0IHsgcHJlcHJvY2VzcyB9IGZyb20gJy4vcHJlcHJvY2Vzc29yJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBwYXJzZShzdHJpbmc6IHN0cmluZykge1xyXG4gIGNvbnN0IHBhcnNlciA9IG5ldyBQYXJzZXIoR3JhbW1hci5mcm9tQ29tcGlsZWQoZ3JhbW1hcikpO1xyXG4gIGNvbnN0IHN0ciA9IHByZXByb2Nlc3Moc3RyaW5nKTtcclxuICBpZiAoIXN0cikgcmV0dXJuIG51bGw7XHJcbiAgdHJ5IHtcclxuICAgIHJldHVybiBwYXJzZXIuZmVlZChwcmVwcm9jZXNzKHN0cmluZykpLnJlc3VsdHNbMF07XHJcbiAgfSBjYXRjaCB7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IHBhcnNlIH0gZnJvbSAnLi9ncmFtbWFyJztcclxuaW1wb3J0IHsgcHJvY2Vzc1Rva2VucyBhcyBjb3JyZWN0UHJvY2VzcyB9IGZyb20gJy4vaW50ZXJwcmV0ZXInO1xyXG5pbXBvcnQgeyBzdHJpbmdpZnkgfSBmcm9tICcuL3N0cmluZ2lmeSc7XHJcbmltcG9ydCB7IHByb2Nlc3NUb2tlbnMgYXMganNvblByb2Nlc3MgfSBmcm9tICcuL2pzb25faW50ZXJwcmV0ZXInO1xyXG5pbXBvcnQgKiBhcyB0eXBlcyBmcm9tICcuL3R5cGVzJztcclxuXHJcbmV4cG9ydCBjb25zdCBFZG4gPSB7XHJcbiAgcGFyc2U6IChzdHI6IHN0cmluZykgPT4gY29ycmVjdFByb2Nlc3MocGFyc2Uoc3RyKSksXHJcbiAgcGFyc2VKc29uOiAoc3RyOiBzdHJpbmcpID0+IGpzb25Qcm9jZXNzKHBhcnNlKHN0cikpLFxyXG4gIHN0cmluZ2lmeSxcclxuICB0eXBlc1xyXG59O1xyXG4iLCJpbXBvcnQgeyBrZXl3b3JkLCBtYXAsIHNldCwgc3ltYm9sLCB0YWcgfSBmcm9tICcuL3R5cGVzJztcclxuaW1wb3J0IHsgZmxhdE1hcCB9IGZyb20gJ3RvZnUtanMvZGlzdC9hcnJheXMnO1xyXG5pbXBvcnQgeyBpc0FycmF5IH0gZnJvbSAndG9mdS1qcy9kaXN0L2lzJztcclxuaW1wb3J0IHsgdW5lc2NhcGVTdHIgfSBmcm9tICcuL3N0cmluZ3MnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHByb2Nlc3NUb2tlbnModG9rZW5zOiBhbnlbXSB8IGJvb2xlYW4pIHtcclxuICBpZiAoIWlzQXJyYXkodG9rZW5zKSkge1xyXG4gICAgdGhyb3cgJ0ludmFsaWQgRUROIHN0cmluZyc7XHJcbiAgfVxyXG4gIHJldHVybiB0b2tlbnMuZmlsdGVyKHQgPT4gdCAmJiB0LnR5cGUgIT09ICdkaXNjYXJkJykubWFwKHByb2Nlc3NUb2tlbik7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHByb2Nlc3NUb2tlbih0b2tlbjogYW55KTogYW55IHtcclxuICBjb25zdCB7IGRhdGEsIHR5cGUsIHRhZyB9ID0gdG9rZW47XHJcbiAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICBjYXNlICdkb3VibGUnOlxyXG4gICAgICByZXR1cm4gcGFyc2VGbG9hdChkYXRhKTtcclxuICAgIGNhc2UgJ2ludCc6XHJcbiAgICAgIHJldHVybiBwYXJzZUludChkYXRhKTtcclxuICAgIGNhc2UgJ3N0cmluZyc6XHJcbiAgICAgIHJldHVybiB1bmVzY2FwZVN0cihkYXRhKTtcclxuICAgIGNhc2UgJ2NoYXInOlxyXG4gICAgICByZXR1cm4gZGF0YTtcclxuICAgIGNhc2UgJ2tleXdvcmQnOlxyXG4gICAgICByZXR1cm4ga2V5d29yZChkYXRhKTtcclxuICAgIGNhc2UgJ3N5bWJvbCc6XHJcbiAgICAgIHJldHVybiBzeW1ib2woZGF0YSk7XHJcbiAgICBjYXNlICdib29sZWFuJzpcclxuICAgICAgcmV0dXJuIGRhdGEgPT09ICd0cnVlJztcclxuICAgIGNhc2UgJ3RhZyc6XHJcbiAgICAgIHJldHVybiBwcm9jZXNzVGFnKHRhZywgZGF0YSk7XHJcbiAgICBjYXNlICdsaXN0JzpcclxuICAgIGNhc2UgJ3ZlY3Rvcic6XHJcbiAgICAgIHJldHVybiBwcm9jZXNzVG9rZW5zKGRhdGEpO1xyXG4gICAgY2FzZSAnc2V0JzpcclxuICAgICAgcmV0dXJuIHNldChwcm9jZXNzVG9rZW5zKGRhdGEpKTtcclxuICAgIGNhc2UgJ21hcCc6XHJcbiAgICAgIHJldHVybiBtYXAoZmxhdE1hcChwcm9jZXNzVG9rZW5zLCBkYXRhKSk7XHJcbiAgfVxyXG4gIHJldHVybiBudWxsO1xyXG59XHJcblxyXG5mdW5jdGlvbiBwcm9jZXNzVGFnKHRhZ05hbWU6IHN0cmluZywgZGF0YTogYW55KSB7XHJcbiAgcmV0dXJuIHRhZyh0YWdOYW1lLCBwcm9jZXNzVG9rZW4oZGF0YSkpO1xyXG59XHJcbiIsImltcG9ydCB7IGNodW5rLCBmbGF0TWFwLCBmcm9tUGFpcnMsIG1hcCB9IGZyb20gJ3RvZnUtanMvZGlzdC9hcnJheXMnO1xyXG5pbXBvcnQgeyBpc0FycmF5IH0gZnJvbSAndG9mdS1qcy9kaXN0L2lzJztcclxuaW1wb3J0IHsgdW5lc2NhcGVTdHIgfSBmcm9tICcuL3N0cmluZ3MnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHByb2Nlc3NUb2tlbnModG9rZW5zOiBhbnlbXSB8IGJvb2xlYW4pIHtcclxuICBpZiAoIWlzQXJyYXkodG9rZW5zKSkge1xyXG4gICAgdGhyb3cgJ0ludmFsaWQgRUROIHN0cmluZyc7XHJcbiAgfVxyXG4gIHJldHVybiB0b2tlbnMuZmlsdGVyKHQgPT4gdCAmJiB0LnR5cGUgIT09ICdkaXNjYXJkJykubWFwKHByb2Nlc3NUb2tlbik7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHByb2Nlc3NUb2tlbih0b2tlbjogYW55KTogYW55IHtcclxuICBjb25zdCB7IGRhdGEsIHR5cGUsIHRhZyB9ID0gdG9rZW47XHJcbiAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICBjYXNlICdkb3VibGUnOlxyXG4gICAgICByZXR1cm4gcGFyc2VGbG9hdChkYXRhKTtcclxuICAgIGNhc2UgJ2ludCc6XHJcbiAgICAgIHJldHVybiBwYXJzZUludChkYXRhKTtcclxuICAgIGNhc2UgJ3N0cmluZyc6XHJcbiAgICAgIHJldHVybiB1bmVzY2FwZVN0cihkYXRhKTtcclxuICAgIGNhc2UgJ2NoYXInOlxyXG4gICAgICByZXR1cm4gZGF0YTtcclxuICAgIGNhc2UgJ2tleXdvcmQnOlxyXG4gICAgICByZXR1cm4gZGF0YTtcclxuICAgIGNhc2UgJ3N5bWJvbCc6XHJcbiAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgY2FzZSAnYm9vbGVhbic6XHJcbiAgICAgIHJldHVybiBkYXRhID09PSAndHJ1ZSc7XHJcbiAgICBjYXNlICd0YWcnOlxyXG4gICAgICByZXR1cm4geyB0YWcsIHZhbHVlOiBwcm9jZXNzVG9rZW4oZGF0YSkgfTtcclxuICAgIGNhc2UgJ2xpc3QnOlxyXG4gICAgY2FzZSAndmVjdG9yJzpcclxuICAgICAgcmV0dXJuIHByb2Nlc3NUb2tlbnMoZGF0YSk7XHJcbiAgICBjYXNlICdzZXQnOlxyXG4gICAgICByZXR1cm4gZnJvbVBhaXJzKG1hcCh0ID0+IFt0LCB0XSwgcHJvY2Vzc1Rva2VucyhkYXRhKSkpO1xyXG4gICAgY2FzZSAnbWFwJzpcclxuICAgICAgcmV0dXJuIGZyb21QYWlycyhjaHVuaygyLCBmbGF0TWFwKHByb2Nlc3NUb2tlbnMsIGRhdGEpKSBhcyBhbnkpO1xyXG4gIH1cclxuICByZXR1cm4gbnVsbDtcclxufVxyXG4iLCJleHBvcnQgY29uc3QgcHJlcHJvY2VzcyA9IChzdHI6IHN0cmluZykgPT4gcmVtb3ZlQ29tbWVudHMoc3RyKS50cmltKCk7XHJcblxyXG5mdW5jdGlvbiByZW1vdmVDb21tZW50cyhzdHI6IHN0cmluZykge1xyXG4gIGxldCBuZXdTdHIgPSAnJztcclxuICBsZXQgaW5RdW90ZXMgPSBmYWxzZTtcclxuICBsZXQgaW5Db21tZW50ID0gZmFsc2U7XHJcbiAgbGV0IHNraXAgPSBmYWxzZTtcclxuICBmb3IgKGNvbnN0IGMgb2Ygc3RyKSB7XHJcbiAgICBpZiAoc2tpcCkge1xyXG4gICAgICBuZXdTdHIgKz0gYztcclxuICAgICAgc2tpcCA9IGZhbHNlO1xyXG4gICAgfSBlbHNlIGlmIChjID09PSAnOycgJiYgIWluUXVvdGVzKSB7XHJcbiAgICAgIGluQ29tbWVudCA9IHRydWU7XHJcbiAgICB9IGVsc2UgaWYgKGMgPT09ICdcXG4nKSB7XHJcbiAgICAgIG5ld1N0ciArPSAnXFxuJztcclxuICAgICAgaW5Db21tZW50ID0gZmFsc2U7XHJcbiAgICB9IGVsc2UgaWYgKCFpbkNvbW1lbnQpIHtcclxuICAgICAgbmV3U3RyICs9IGM7XHJcbiAgICAgIGlmIChjID09PSAnXFxcXCcpIHNraXAgPSB0cnVlO1xyXG4gICAgICBlbHNlIGlmIChjID09PSAnXCInKSBpblF1b3RlcyA9ICFpblF1b3RlcztcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIG5ld1N0cjtcclxufVxyXG4iLCJpbXBvcnQgeyBwaXBlIH0gZnJvbSAndG9mdS1qcy9kaXN0L2ZwJztcclxuaW1wb3J0IHsgY29sbGVjdFRvQXJyYXksIGZsYXR0ZW4gYXMgaWZsYXR0ZW4sIG1hcCBhcyBpbWFwIH0gZnJvbSAndG9mdS1qcy9kaXN0L2l0ZXJhdG9ycyc7XHJcbmltcG9ydCB7IGpvaW4sIG1hcCBhcyBhbWFwIH0gZnJvbSAndG9mdS1qcy9kaXN0L2FycmF5cyc7XHJcbmltcG9ydCB7IEVkbktleXdvcmQsIEVkbk1hcCwgRWRuU2V0LCBFZG5TeW1ib2wsIEVkblRhZywgdHlwZSB9IGZyb20gJy4vdHlwZXMnO1xyXG5pbXBvcnQgeyBlbnRyaWVzIH0gZnJvbSAndG9mdS1qcy9kaXN0L29iamVjdHMnO1xyXG5cclxuZXhwb3J0IGNvbnN0IHN0cmluZ2lmeSA9IChkYXRhOiBhbnkpID0+IHtcclxuICBjb25zdCB0eXBlT2YgPSB0eXBlKGRhdGEpO1xyXG4gIHN3aXRjaCAodHlwZU9mKSB7XHJcbiAgICBjYXNlICdOaWwnOlxyXG4gICAgICByZXR1cm4gJ25pbCc7XHJcbiAgICBjYXNlICdOdW1iZXInOlxyXG4gICAgICByZXR1cm4gJycgKyBkYXRhO1xyXG4gICAgY2FzZSAnU3RyaW5nJzpcclxuICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGRhdGEpO1xyXG4gICAgY2FzZSAnTWFwJzpcclxuICAgICAgcmV0dXJuIHN0cmluZ2lmeU1hcChkYXRhKTtcclxuICAgIGNhc2UgJ1NldCc6XHJcbiAgICAgIHJldHVybiBzdHJpbmdpZnlTZXQoZGF0YSk7XHJcbiAgICBjYXNlICdUYWcnOlxyXG4gICAgICByZXR1cm4gc3RyaW5naWZ5VGFnKGRhdGEpO1xyXG4gICAgY2FzZSAnU3ltYm9sJzpcclxuICAgICAgcmV0dXJuIHN0cmluZ2lmeVN5bWJvbChkYXRhKTtcclxuICAgIGNhc2UgJ0tleXdvcmQnOlxyXG4gICAgICByZXR1cm4gc3RyaW5naWZ5S2V5d29yZChkYXRhKTtcclxuICAgIGNhc2UgJ1ZlY3Rvcic6XHJcbiAgICAgIHJldHVybiBzdHJpbmdpZnlWZWN0b3IoZGF0YSk7XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICByZXR1cm4gJycgKyBkYXRhO1xyXG4gIH1cclxufTtcclxuXHJcbmZ1bmN0aW9uIHN0cmluZ2lmeU1hcChkYXRhOiBFZG5NYXAgfCBvYmplY3QpIHtcclxuICByZXR1cm4gKFxyXG4gICAgJ3snICtcclxuICAgIHBpcGUoXHJcbiAgICAgIGVudHJpZXMoZGF0YSksXHJcbiAgICAgIGlmbGF0dGVuLFxyXG4gICAgICBpbWFwKHN0cmluZ2lmeSksXHJcbiAgICAgIGNvbGxlY3RUb0FycmF5LFxyXG4gICAgICBqb2luKCcgJylcclxuICAgICkgK1xyXG4gICAgJ30nXHJcbiAgKTtcclxufVxyXG5cclxuZnVuY3Rpb24gc3RyaW5naWZ5U2V0KGRhdGE6IEVkblNldCkge1xyXG4gIHJldHVybiAoXHJcbiAgICAnI3snICtcclxuICAgIHBpcGUoXHJcbiAgICAgIGRhdGEudmFsdWVzKCksXHJcbiAgICAgIGltYXAoc3RyaW5naWZ5KSxcclxuICAgICAgY29sbGVjdFRvQXJyYXksXHJcbiAgICAgIGpvaW4oJyAnKVxyXG4gICAgKSArXHJcbiAgICAnfSdcclxuICApO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzdHJpbmdpZnlUYWcoZGF0YTogRWRuVGFnKSB7XHJcbiAgcmV0dXJuICcjJyArIGRhdGEudGFnLnN5bWJvbCArICcgJyArIHN0cmluZ2lmeShkYXRhLmRhdGEpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzdHJpbmdpZnlTeW1ib2woZGF0YTogRWRuU3ltYm9sKSB7XHJcbiAgcmV0dXJuIGRhdGEuc3ltYm9sO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzdHJpbmdpZnlLZXl3b3JkKGRhdGE6IEVkbktleXdvcmQpIHtcclxuICByZXR1cm4gJzonICsgZGF0YS5rZXl3b3JkO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzdHJpbmdpZnlWZWN0b3IoZGF0YTogYW55W10pIHtcclxuICByZXR1cm4gJ1snICsgYW1hcChzdHJpbmdpZnksIGRhdGEpLmpvaW4oJyAnKSArICddJztcclxufVxyXG4iLCJleHBvcnQgZnVuY3Rpb24gdW5lc2NhcGVDaGFyKHN0cjogc3RyaW5nKTogc3RyaW5nIHtcclxuICBpZiAoIXN0ci5sZW5ndGgpIHtcclxuICAgIHJldHVybiAnXFxcXCc7XHJcbiAgfVxyXG4gIGNvbnN0IGNoYXIgPSBzdHJbMF07XHJcbiAgY29uc3QgcmVzdCA9IHN0ci5zdWJzdHIoMSk7XHJcbiAgc3dpdGNoIChjaGFyLnRvTG93ZXJDYXNlKCkpIHtcclxuICAgIGNhc2UgJ24nOlxyXG4gICAgICByZXR1cm4gYFxcbiR7cmVzdH1gO1xyXG4gICAgY2FzZSAncic6XHJcbiAgICAgIHJldHVybiBgXFxyJHtyZXN0fWA7XHJcbiAgICBjYXNlICd0JzpcclxuICAgICAgcmV0dXJuIGBcXHQke3Jlc3R9YDtcclxuICAgIGNhc2UgJ1xcXFwnOlxyXG4gICAgICByZXR1cm4gYFxcXFwke3Jlc3R9YDtcclxuICAgIGNhc2UgXCInXCI6XHJcbiAgICAgIHJldHVybiBgXFwnJHtyZXN0fWA7XHJcbiAgICBjYXNlICdcIic6XHJcbiAgICAgIHJldHVybiBgXCIke3Jlc3R9YDtcclxuICAgIGNhc2UgJ2InOlxyXG4gICAgICByZXR1cm4gYFxcYiR7cmVzdH1gO1xyXG4gICAgY2FzZSAnZic6XHJcbiAgICAgIHJldHVybiBgXFxmJHtyZXN0fWA7XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICByZXR1cm4gc3RyO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVuZXNjYXBlU3RyKHN0cjogc3RyaW5nKTogc3RyaW5nIHtcclxuICBjb25zdCBwYXJ0cyA9IHN0ci5zcGxpdCgnXFxcXCcpO1xyXG4gIHJldHVybiBwYXJ0cy5tYXAoKHAsIGkpID0+IChpID8gdW5lc2NhcGVDaGFyKHApIDogcCkpLmpvaW4oJycpO1xyXG59XHJcbiIsImltcG9ydCB7IGlzTmlsLCBpc09iamVjdCwgaXNOdW1iZXIsIGlzU3RyaW5nLCBpc0FycmF5IH0gZnJvbSAndG9mdS1qcy9kaXN0L2lzJztcclxuaW1wb3J0IHsgY2h1bmssIGZsYXR0ZW4sIG1hcCBhcyBhbWFwLCBqb2luIH0gZnJvbSAndG9mdS1qcy9kaXN0L2FycmF5cyc7XHJcbmltcG9ydCB7IGNvbGxlY3RUb0FycmF5LCBtYXAgYXMgaW1hcCwgZmxhdHRlbiBhcyBpZmxhdHRlbiB9IGZyb20gJ3RvZnUtanMvZGlzdC9pdGVyYXRvcnMnO1xyXG5pbXBvcnQgeyBwaXBlIH0gZnJvbSAndG9mdS1qcy9kaXN0L2ZwJztcclxuXHJcbmV4cG9ydCBjbGFzcyBFZG5LZXl3b3JkIHtcclxuICBwcml2YXRlIF9rZXl3b3JkOiBzdHJpbmcgPSAnJztcclxuICBjb25zdHJ1Y3RvcihrZXl3b3JkOiBzdHJpbmcpIHtcclxuICAgIHRoaXMua2V5d29yZCA9IGtleXdvcmQ7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZ2V0IGtleXdvcmQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fa2V5d29yZDtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzZXQga2V5d29yZChrZXl3b3JkOiBzdHJpbmcpIHtcclxuICAgIGlmIChrZXl3b3JkWzBdID09PSAnOicpIHtcclxuICAgICAga2V5d29yZCA9IGtleXdvcmQuc3Vic3RyKDEpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5fa2V5d29yZCA9IGtleXdvcmQ7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgRWRuU3ltYm9sIHtcclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgc3ltYm9sOiBzdHJpbmcpIHt9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBFZG5UYWcge1xyXG4gIHB1YmxpYyB0YWc6IEVkblN5bWJvbDtcclxuICBjb25zdHJ1Y3Rvcih0YWc6IHN0cmluZyB8IEVkblN5bWJvbCwgcHVibGljIGRhdGE6IGFueSkge1xyXG4gICAgaWYgKGlzU3RyaW5nKHRhZykpIHRoaXMudGFnID0gbmV3IEVkblN5bWJvbCh0YWcpO1xyXG4gICAgZWxzZSB0aGlzLnRhZyA9IHRhZztcclxuICB9XHJcbn1cclxuXHJcbmNsYXNzIEFueUtleU1hcCB7XHJcbiAgcHJpdmF0ZSBkYXRhID0gbmV3IE1hcCgpO1xyXG5cclxuICBjb25zdHJ1Y3RvcihkYXRhOiBhbnlbXSkge1xyXG4gICAgdGhpcy5kYXRhID0gbmV3IE1hcChcclxuICAgICAgcGlwZShcclxuICAgICAgICBkYXRhLFxyXG4gICAgICAgIGNodW5rKDIpLFxyXG4gICAgICAgIGFtYXAoKFtrZXksIHZhbHVlXTogYW55W10pID0+IFt0b0tleShrZXkpLCB7IGtleSwgdmFsdWUgfV0pXHJcbiAgICAgIClcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBnZXQoa2V5OiBhbnkpIHtcclxuICAgIGNvbnN0IGsgPSB0b0tleShrZXkpO1xyXG4gICAgaWYgKHRoaXMuZGF0YS5oYXMoaykpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuZGF0YS5nZXQoaykudmFsdWU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGhhcyhrZXk6IGFueSkge1xyXG4gICAgcmV0dXJuIHRoaXMuZGF0YS5oYXModG9LZXkoa2V5KSk7XHJcbiAgfVxyXG5cclxuICBzZXQoa2V5OiBhbnksIHZhbHVlOiBhbnkpIHtcclxuICAgIHRoaXMuZGF0YS5zZXQodG9LZXkoa2V5KSwgeyBrZXksIHZhbHVlIH0pO1xyXG4gIH1cclxuXHJcbiAga2V5cygpIHtcclxuICAgIHJldHVybiBpbWFwKCh7IGtleSB9KSA9PiBrZXksIHRoaXMuZGF0YS52YWx1ZXMoKSk7XHJcbiAgfVxyXG5cclxuICB2YWx1ZXMoKSB7XHJcbiAgICByZXR1cm4gaW1hcCgoeyB2YWx1ZSB9KSA9PiB2YWx1ZSwgdGhpcy5kYXRhLnZhbHVlcygpKTtcclxuICB9XHJcblxyXG4gIGRlbGV0ZShrZXk6IGFueSkge1xyXG4gICAgcmV0dXJuIHRoaXMuZGF0YS5kZWxldGUodG9LZXkoa2V5KSk7XHJcbiAgfVxyXG5cclxuICBjbGVhcigpIHtcclxuICAgIHRoaXMuZGF0YS5jbGVhcigpO1xyXG4gIH1cclxuXHJcbiAgW1N5bWJvbC5pdGVyYXRvcl0oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5lbnRyaWVzKCk7XHJcbiAgfVxyXG5cclxuICBlbnRyaWVzKCkge1xyXG4gICAgcmV0dXJuIGltYXAoKHsga2V5LCB2YWx1ZSB9KSA9PiBba2V5LCB2YWx1ZV0sIHRoaXMuZGF0YS52YWx1ZXMoKSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgRWRuTWFwIHtcclxuICBwcml2YXRlIGRhdGE6IEFueUtleU1hcDtcclxuICBjb25zdHJ1Y3RvcihkYXRhOiBhbnlbXSkge1xyXG4gICAgdGhpcy5kYXRhID0gbmV3IEFueUtleU1hcChkYXRhKTtcclxuICB9XHJcblxyXG4gIGhhcyA9IChrZXk6IGFueSkgPT4gdGhpcy5kYXRhLmhhcyhrZXkpO1xyXG4gIGNsZWFyID0gKCkgPT4gdGhpcy5kYXRhLmNsZWFyKCk7XHJcbiAgZGVsZXRlID0gKGtleTogYW55KSA9PiB0aGlzLmRhdGEuZGVsZXRlKGtleSk7XHJcbiAgZW50cmllcyA9ICgpID0+IHRoaXMuZGF0YS5lbnRyaWVzKCk7XHJcbiAgZ2V0ID0gKGtleTogYW55KSA9PiB0aGlzLmRhdGEuZ2V0KGtleSk7XHJcbiAga2V5cyA9ICgpID0+IHRoaXMuZGF0YS5rZXlzKCk7XHJcbiAgc2V0ID0gKGtleTogYW55LCB2YWx1ZTogYW55KSA9PiB0aGlzLmRhdGEuc2V0KGtleSwgdmFsdWUpO1xyXG4gIHZhbHVlcyA9ICgpID0+IHRoaXMuZGF0YS52YWx1ZXMoKTtcclxuICBbU3ltYm9sLml0ZXJhdG9yXSA9ICgpID0+IHRoaXMuZGF0YVtTeW1ib2wuaXRlcmF0b3JdKCk7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBFZG5TZXQge1xyXG4gIHByaXZhdGUgZGF0YTogQW55S2V5TWFwO1xyXG4gIGNvbnN0cnVjdG9yKGRhdGE6IGFueVtdKSB7XHJcbiAgICB0aGlzLmRhdGEgPSBuZXcgQW55S2V5TWFwKFxyXG4gICAgICBwaXBlKFxyXG4gICAgICAgIGRhdGEsXHJcbiAgICAgICAgYW1hcChkID0+IFtkLCBkXSksXHJcbiAgICAgICAgZmxhdHRlblxyXG4gICAgICApXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgYWRkID0gKGVsZW06IGFueSkgPT4gdGhpcy5kYXRhLnNldChlbGVtLCBlbGVtKTtcclxuICBjbGVhciA9ICgpID0+IHRoaXMuZGF0YS5jbGVhcigpO1xyXG4gIGhhcyA9IChlbGVtOiBhbnkpID0+IHRoaXMuZGF0YS5oYXMoZWxlbSk7XHJcbiAgZGVsZXRlID0gKGVsZW06IGFueSkgPT4gdGhpcy5kYXRhLmRlbGV0ZShlbGVtKTtcclxuICBlbnRyaWVzID0gKCkgPT4gdGhpcy5kYXRhLmVudHJpZXMoKTtcclxuICB2YWx1ZXMgPSAoKSA9PiB0aGlzLmRhdGEudmFsdWVzKCk7XHJcbiAgW1N5bWJvbC5pdGVyYXRvcl0gPSAoKSA9PiB0aGlzLmRhdGFbU3ltYm9sLml0ZXJhdG9yXSgpO1xyXG59XHJcblxyXG5mdW5jdGlvbiB0b0tleShpbnB1dDogYW55KSB7XHJcbiAgcmV0dXJuIHR5cGUoaW5wdXQpICsgJyMnICsgdG9TdHJpbmcoaW5wdXQpO1xyXG59XHJcblxyXG5mdW5jdGlvbiB0b1N0cmluZyhpbnB1dDogYW55KSB7XHJcbiAgaWYgKGlzTmlsKGlucHV0KSkge1xyXG4gICAgcmV0dXJuICdudWxsJztcclxuICB9XHJcbiAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGlucHV0KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHR5cGUoaW5wdXQ6IGFueSkge1xyXG4gIGlmIChpc05pbChpbnB1dCkpIHtcclxuICAgIHJldHVybiAnTmlsJztcclxuICB9IGVsc2UgaWYgKGlzTnVtYmVyKGlucHV0KSkge1xyXG4gICAgcmV0dXJuICdOdW1iZXInO1xyXG4gIH0gZWxzZSBpZiAoaXNTdHJpbmcoaW5wdXQpKSB7XHJcbiAgICByZXR1cm4gJ1N0cmluZyc7XHJcbiAgfSBlbHNlIGlmIChpbnB1dCBpbnN0YW5jZW9mIEVkblRhZykge1xyXG4gICAgcmV0dXJuICdUYWcnO1xyXG4gIH0gZWxzZSBpZiAoaW5wdXQgaW5zdGFuY2VvZiBFZG5TeW1ib2wpIHtcclxuICAgIHJldHVybiAnU3ltYm9sJztcclxuICB9IGVsc2UgaWYgKGlucHV0IGluc3RhbmNlb2YgRWRuS2V5d29yZCkge1xyXG4gICAgcmV0dXJuICdLZXl3b3JkJztcclxuICB9IGVsc2UgaWYgKGlucHV0IGluc3RhbmNlb2YgRWRuU2V0KSB7XHJcbiAgICByZXR1cm4gJ1NldCc7XHJcbiAgfSBlbHNlIGlmIChpc0FycmF5KGlucHV0KSkge1xyXG4gICAgcmV0dXJuICdWZWN0b3InO1xyXG4gIH0gZWxzZSBpZiAoaXNPYmplY3QoaW5wdXQpIHx8IGlucHV0IGluc3RhbmNlb2YgRWRuTWFwKSB7XHJcbiAgICByZXR1cm4gJ01hcCc7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiAnT3RoZXInO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGtleXdvcmQgPSAoc3RyOiBzdHJpbmcpID0+IG5ldyBFZG5LZXl3b3JkKHN0cik7XHJcbmV4cG9ydCBjb25zdCBzeW1ib2wgPSAoc3RyOiBzdHJpbmcpID0+IG5ldyBFZG5TeW1ib2woc3RyKTtcclxuZXhwb3J0IGNvbnN0IHNldCA9IChkYXRhOiBhbnlbXSkgPT4gbmV3IEVkblNldChkYXRhKTtcclxuZXhwb3J0IGNvbnN0IG1hcCA9IChkYXRhOiBhbnlbXSkgPT4gbmV3IEVkbk1hcChkYXRhKTtcclxuZXhwb3J0IGNvbnN0IHRhZyA9ICh0YWcsIGRhdGEpID0+IG5ldyBFZG5UYWcodGFnLCBkYXRhKTtcclxuZXhwb3J0IGNvbnN0IHN0cmluZ2lmeSA9IChkYXRhOiBhbnkpID0+IHtcclxuICBjb25zdCB0eXBlT2YgPSB0eXBlKGRhdGEpO1xyXG4gIHN3aXRjaCAodHlwZU9mKSB7XHJcbiAgICBjYXNlICdOaWwnOlxyXG4gICAgICByZXR1cm4gJ25pbCc7XHJcbiAgICBjYXNlICdOdW1iZXInOlxyXG4gICAgICByZXR1cm4gJycgKyBkYXRhO1xyXG4gICAgY2FzZSAnU3RyaW5nJzpcclxuICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGRhdGEpO1xyXG4gICAgY2FzZSAnTWFwJzpcclxuICAgICAgcmV0dXJuIHN0cmluZ2lmeU1hcChkYXRhKTtcclxuICAgIGNhc2UgJ1NldCc6XHJcbiAgICAgIHJldHVybiBzdHJpbmdpZnlTZXQoZGF0YSk7XHJcbiAgICBjYXNlICdUYWcnOlxyXG4gICAgICByZXR1cm4gc3RyaW5naWZ5VGFnKGRhdGEpO1xyXG4gICAgY2FzZSAnU3ltYm9sJzpcclxuICAgICAgcmV0dXJuIHN0cmluZ2lmeVN5bWJvbChkYXRhKTtcclxuICAgIGNhc2UgJ0tleXdvcmQnOlxyXG4gICAgICByZXR1cm4gc3RyaW5naWZ5S2V5d29yZChkYXRhKTtcclxuICAgIGNhc2UgJ1ZlY3Rvcic6XHJcbiAgICAgIHJldHVybiBzdHJpbmdpZnlWZWN0b3IoZGF0YSk7XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICByZXR1cm4gJycgKyBkYXRhO1xyXG4gIH1cclxufTtcclxuXHJcbmZ1bmN0aW9uIHN0cmluZ2lmeU1hcChkYXRhOiBFZG5NYXApIHtcclxuICByZXR1cm4gKFxyXG4gICAgJ3snICtcclxuICAgIHBpcGUoXHJcbiAgICAgIGRhdGEuZW50cmllcygpLFxyXG4gICAgICBpZmxhdHRlbixcclxuICAgICAgaW1hcChzdHJpbmdpZnkpLFxyXG4gICAgICBjb2xsZWN0VG9BcnJheSxcclxuICAgICAgam9pbignICcpXHJcbiAgICApICtcclxuICAgICd9J1xyXG4gICk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHN0cmluZ2lmeVNldChkYXRhOiBFZG5TZXQpIHtcclxuICByZXR1cm4gKFxyXG4gICAgJyN7JyArXHJcbiAgICBwaXBlKFxyXG4gICAgICBkYXRhLnZhbHVlcygpLFxyXG4gICAgICBpbWFwKHN0cmluZ2lmeSksXHJcbiAgICAgIGNvbGxlY3RUb0FycmF5LFxyXG4gICAgICBqb2luKCcgJylcclxuICAgICkgK1xyXG4gICAgJ30nXHJcbiAgKTtcclxufVxyXG5cclxuZnVuY3Rpb24gc3RyaW5naWZ5VGFnKGRhdGE6IEVkblRhZykge1xyXG4gIHJldHVybiAnIycgKyBkYXRhLnRhZy5zeW1ib2wgKyAnICcgKyBzdHJpbmdpZnkoZGF0YS5kYXRhKTtcclxufVxyXG5cclxuZnVuY3Rpb24gc3RyaW5naWZ5U3ltYm9sKGRhdGE6IEVkblN5bWJvbCkge1xyXG4gIHJldHVybiBkYXRhLnN5bWJvbDtcclxufVxyXG5cclxuZnVuY3Rpb24gc3RyaW5naWZ5S2V5d29yZChkYXRhOiBFZG5LZXl3b3JkKSB7XHJcbiAgcmV0dXJuICc6JyArIGRhdGEua2V5d29yZDtcclxufVxyXG5cclxuZnVuY3Rpb24gc3RyaW5naWZ5VmVjdG9yKGRhdGE6IGFueVtdKSB7XHJcbiAgcmV0dXJuICdbJyArIGFtYXAoc3RyaW5naWZ5LCBkYXRhKS5qb2luKCcgJykgKyAnXSc7XHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiIifQ==