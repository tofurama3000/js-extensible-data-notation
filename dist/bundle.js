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
    case 'bool':
      return data === 'true' || data === true;

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
    case 'bool':
      return data === 'true' || data === true;

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
    /// TODO: Unescape unicode characters

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL25lYXJsZXkvbGliL25lYXJsZXkuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RvZnUtanMvZGlzdC9hcnJheXMvY2h1bmsuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RvZnUtanMvZGlzdC9hcnJheXMvZmlsdGVyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90b2Z1LWpzL2Rpc3QvYXJyYXlzL2ZpcnN0LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90b2Z1LWpzL2Rpc3QvYXJyYXlzL2ZpcnN0T3IuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RvZnUtanMvZGlzdC9hcnJheXMvZmlyc3RPck51bGwuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RvZnUtanMvZGlzdC9hcnJheXMvZmxhdE1hcC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L2FycmF5cy9mbGF0dGVuLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90b2Z1LWpzL2Rpc3QvYXJyYXlzL2Zyb21QYWlycy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L2FycmF5cy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L2FycmF5cy9qb2luLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90b2Z1LWpzL2Rpc3QvYXJyYXlzL2xpbWl0LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90b2Z1LWpzL2Rpc3QvYXJyYXlzL21hcC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L2FycmF5cy9yZWR1Y2UuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RvZnUtanMvZGlzdC9hcnJheXMvc2Nhbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L2FycmF5cy9za2lwLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90b2Z1LWpzL2Rpc3QvYXJyYXlzL3Rha2VXaGlsZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L2FycmF5cy90YXAuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RvZnUtanMvZGlzdC9hcnJheXMvdG9BcnJheU9yRW1wdHkuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RvZnUtanMvZGlzdC9hcnJheXMvemlwLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90b2Z1LWpzL2Rpc3QvZnAvY3VycnkuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RvZnUtanMvZGlzdC9mcC9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L2ZwL3BpcGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RvZnUtanMvZGlzdC9mcC9wcmVkaWNhdGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RvZnUtanMvZGlzdC9mcC9yZXZlcnNlQXJncy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L2ZwL3JldmVyc2VDdXJyeS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L2ZwL3NwcmVhZC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L2lzL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90b2Z1LWpzL2Rpc3QvaXMvaXNBcnJheS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L2lzL2lzRmxvYXQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RvZnUtanMvZGlzdC9pcy9pc0Z1bmN0aW9uLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90b2Z1LWpzL2Rpc3QvaXMvaXNJbmZpbml0ZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L2lzL2lzSW50ZWdlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L2lzL2lzSXRlcmFibGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RvZnUtanMvZGlzdC9pcy9pc05pbC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L2lzL2lzTnVsbC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L2lzL2lzTnVtYmVyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90b2Z1LWpzL2Rpc3QvaXMvaXNPYmplY3QuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RvZnUtanMvZGlzdC9pcy9pc1N0cmluZy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L2lzL2lzVW5kZWZpbmVkLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90b2Z1LWpzL2Rpc3QvaXRlcmF0b3JzL2NodW5rLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90b2Z1LWpzL2Rpc3QvaXRlcmF0b3JzL2NvbGxlY3RUb0FycmF5LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90b2Z1LWpzL2Rpc3QvaXRlcmF0b3JzL2ZpbHRlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L2l0ZXJhdG9ycy9maXJzdC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L2l0ZXJhdG9ycy9maXJzdE9yLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90b2Z1LWpzL2Rpc3QvaXRlcmF0b3JzL2ZpcnN0T3JOdWxsLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90b2Z1LWpzL2Rpc3QvaXRlcmF0b3JzL2ZsYXRNYXAuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RvZnUtanMvZGlzdC9pdGVyYXRvcnMvZmxhdHRlbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L2l0ZXJhdG9ycy9oZWFkLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90b2Z1LWpzL2Rpc3QvaXRlcmF0b3JzL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90b2Z1LWpzL2Rpc3QvaXRlcmF0b3JzL2pvaW4uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RvZnUtanMvZGlzdC9pdGVyYXRvcnMvbGltaXQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RvZnUtanMvZGlzdC9pdGVyYXRvcnMvbWFwLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90b2Z1LWpzL2Rpc3QvaXRlcmF0b3JzL3NjYW4uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RvZnUtanMvZGlzdC9pdGVyYXRvcnMvc2tpcC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L2l0ZXJhdG9ycy90YWtlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90b2Z1LWpzL2Rpc3QvaXRlcmF0b3JzL3Rha2VXaGlsZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L2l0ZXJhdG9ycy90YXAuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RvZnUtanMvZGlzdC9pdGVyYXRvcnMvdG9JdGVyYWJsZU9yRW1wdHkuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RvZnUtanMvZGlzdC9pdGVyYXRvcnMvemlwLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90b2Z1LWpzL2Rpc3Qvb2JqZWN0cy9lbnRyaWVzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90b2Z1LWpzL2Rpc3Qvb2JqZWN0cy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L29iamVjdHMvdG9QYWlycy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZ3JhbW1hci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2ludGVycHJldGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9qc29uX2ludGVycHJldGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9wcmVwcm9jZXNzb3IudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N0cmluZ2lmeS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc3RyaW5ncy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdHlwZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0RBQTBDLGdDQUFnQztBQUMxRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdFQUF3RCxrQkFBa0I7QUFDMUU7QUFDQSx5REFBaUQsY0FBYztBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQXlDLGlDQUFpQztBQUMxRSx3SEFBZ0gsbUJBQW1CLEVBQUU7QUFDckk7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7O0FBR0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxpQkFBaUIscUNBQXFDO0FBQ3REOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCO0FBQ3hCLDRCQUE0QjtBQUM1Qiw0QkFBNEI7QUFDNUI7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHVCQUF1QixtQkFBbUIsT0FBTztBQUNqRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQWlELEtBQUssSUFBSTtBQUMxRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVDQUF1QyxrQkFBa0I7QUFDekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsdUJBQXVCLGtCQUFrQjtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRDQUE0QyxxREFBcUQsRUFBRTtBQUNuRztBQUNBLHdCQUF3QjtBQUN4QjtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0M7QUFDdEM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekI7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMENBQTBDLEtBQUs7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdEQUFnRCwyREFBMkQ7QUFDM0c7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCwrQ0FBK0MsY0FBYyxFQUFFO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsQ0FBQzs7Ozs7Ozs7Ozs7OztBQ3JZWTtBQUNiLDhDQUE4QyxjQUFjO0FBQzVELGFBQWEsbUJBQU8sQ0FBQyxzREFBTztBQUM1Qix5QkFBeUIsbUJBQU8sQ0FBQyw4RUFBa0I7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELGlDOzs7Ozs7Ozs7Ozs7QUNwQmE7QUFDYiw4Q0FBOEMsY0FBYztBQUM1RCxhQUFhLG1CQUFPLENBQUMsc0RBQU87QUFDNUIseUJBQXlCLG1CQUFPLENBQUMsOEVBQWtCO0FBQ25EO0FBQ0Esa0M7Ozs7Ozs7Ozs7OztBQ0xhO0FBQ2IsOENBQThDLGNBQWM7QUFDNUQsc0JBQXNCLG1CQUFPLENBQUMsd0VBQWU7QUFDN0M7QUFDQSxpQzs7Ozs7Ozs7Ozs7O0FDSmE7QUFDYiw4Q0FBOEMsY0FBYztBQUM1RCx5QkFBeUIsbUJBQU8sQ0FBQyw4RUFBa0I7QUFDbkQsYUFBYSxtQkFBTyxDQUFDLHNEQUFPO0FBQzVCO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxtQzs7Ozs7Ozs7Ozs7O0FDUmE7QUFDYiw4Q0FBOEMsY0FBYztBQUM1RCxrQkFBa0IsbUJBQU8sQ0FBQyxnRUFBVztBQUNyQztBQUNBLHVDOzs7Ozs7Ozs7Ozs7QUNKYTtBQUNiLDhDQUE4QyxjQUFjO0FBQzVELGFBQWEsbUJBQU8sQ0FBQyxzREFBTztBQUM1Qix5QkFBeUIsbUJBQU8sQ0FBQyw4RUFBa0I7QUFDbkQsY0FBYyxtQkFBTyxDQUFDLHdEQUFPO0FBQzdCLGtCQUFrQixtQkFBTyxDQUFDLGdFQUFXO0FBQ3JDO0FBQ0EsbUM7Ozs7Ozs7Ozs7OztBQ1BhO0FBQ2IsOENBQThDLGNBQWM7QUFDNUQsYUFBYSxtQkFBTyxDQUFDLHNEQUFPO0FBQzVCLHlCQUF5QixtQkFBTyxDQUFDLDhFQUFrQjtBQUNuRDtBQUNBLG1DOzs7Ozs7Ozs7Ozs7QUNMYTtBQUNiLDhDQUE4QyxjQUFjO0FBQzVELHlCQUF5QixtQkFBTyxDQUFDLDhFQUFrQjtBQUNuRDtBQUNBO0FBQ0EsK0JBQStCLGFBQWE7QUFDNUMsaURBQWlEO0FBQ2pEO0FBQ0EscUM7Ozs7Ozs7Ozs7OztBQ1JhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsOENBQThDLGNBQWM7QUFDNUQsU0FBUyxtQkFBTyxDQUFDLDhEQUFVO0FBQzNCLFNBQVMsbUJBQU8sQ0FBQyxnRUFBVztBQUM1QixTQUFTLG1CQUFPLENBQUMsZ0VBQVc7QUFDNUIsU0FBUyxtQkFBTyxDQUFDLDREQUFTO0FBQzFCLFNBQVMsbUJBQU8sQ0FBQyx3REFBTztBQUN4QixTQUFTLG1CQUFPLENBQUMsMERBQVE7QUFDekIsU0FBUyxtQkFBTyxDQUFDLDBEQUFRO0FBQ3pCLFNBQVMsbUJBQU8sQ0FBQyx3REFBTztBQUN4QixTQUFTLG1CQUFPLENBQUMsd0RBQU87QUFDeEIsU0FBUyxtQkFBTyxDQUFDLG9FQUFhO0FBQzlCLFNBQVMsbUJBQU8sQ0FBQyw4RUFBa0I7QUFDbkMsU0FBUyxtQkFBTyxDQUFDLDhEQUFVO0FBQzNCLFNBQVMsbUJBQU8sQ0FBQyw0REFBUztBQUMxQixTQUFTLG1CQUFPLENBQUMsb0VBQWE7QUFDOUIsU0FBUyxtQkFBTyxDQUFDLDREQUFTO0FBQzFCLFNBQVMsbUJBQU8sQ0FBQyxnRUFBVztBQUM1QixTQUFTLG1CQUFPLENBQUMsd0VBQWU7QUFDaEMsU0FBUyxtQkFBTyxDQUFDLDBEQUFRO0FBQ3pCLGlDOzs7Ozs7Ozs7Ozs7QUN2QmE7QUFDYiw4Q0FBOEMsY0FBYztBQUM1RCx5QkFBeUIsbUJBQU8sQ0FBQyw4RUFBa0I7QUFDbkQsYUFBYSxtQkFBTyxDQUFDLHNEQUFPO0FBQzVCO0FBQ0EsZ0M7Ozs7Ozs7Ozs7OztBQ0xhO0FBQ2IsOENBQThDLGNBQWM7QUFDNUQsYUFBYSxtQkFBTyxDQUFDLHNEQUFPO0FBQzVCLHlCQUF5QixtQkFBTyxDQUFDLDhFQUFrQjtBQUNuRDtBQUNBLGlDOzs7Ozs7Ozs7Ozs7QUNMYTtBQUNiLDhDQUE4QyxjQUFjO0FBQzVELGFBQWEsbUJBQU8sQ0FBQyxzREFBTztBQUM1Qix5QkFBeUIsbUJBQU8sQ0FBQyw4RUFBa0I7QUFDbkQ7QUFDQSwrQjs7Ozs7Ozs7Ozs7O0FDTGE7QUFDYiw4Q0FBOEMsY0FBYztBQUM1RCxhQUFhLG1CQUFPLENBQUMsc0RBQU87QUFDNUIseUJBQXlCLG1CQUFPLENBQUMsOEVBQWtCO0FBQ25EO0FBQ0Esa0M7Ozs7Ozs7Ozs7OztBQ0xhO0FBQ2IsOENBQThDLGNBQWM7QUFDNUQsYUFBYSxtQkFBTyxDQUFDLHNEQUFPO0FBQzVCLHlCQUF5QixtQkFBTyxDQUFDLDhFQUFrQjtBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLENBQUM7QUFDRCxnQzs7Ozs7Ozs7Ozs7O0FDWGE7QUFDYiw4Q0FBOEMsY0FBYztBQUM1RCxhQUFhLG1CQUFPLENBQUMsc0RBQU87QUFDNUIseUJBQXlCLG1CQUFPLENBQUMsOEVBQWtCO0FBQ25EO0FBQ0EsZ0M7Ozs7Ozs7Ozs7OztBQ0xhO0FBQ2IsOENBQThDLGNBQWM7QUFDNUQsYUFBYSxtQkFBTyxDQUFDLHNEQUFPO0FBQzVCLHlCQUF5QixtQkFBTyxDQUFDLDhFQUFrQjtBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxxQzs7Ozs7Ozs7Ozs7O0FDZmE7QUFDYiw4Q0FBOEMsY0FBYztBQUM1RCxhQUFhLG1CQUFPLENBQUMsc0RBQU87QUFDNUIseUJBQXlCLG1CQUFPLENBQUMsOEVBQWtCO0FBQ25EO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCwrQjs7Ozs7Ozs7Ozs7O0FDUmE7QUFDYiw4Q0FBOEMsY0FBYztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQzs7Ozs7Ozs7Ozs7O0FDUmE7QUFDYiw4Q0FBOEMsY0FBYztBQUM1RCxhQUFhLG1CQUFPLENBQUMsc0RBQU87QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsWUFBWTtBQUMvQjtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsK0I7Ozs7Ozs7Ozs7OztBQ1phO0FBQ2IsOENBQThDLGNBQWM7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQzs7Ozs7Ozs7Ozs7O0FDWmE7QUFDYjtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEMsY0FBYztBQUM1RCxTQUFTLG1CQUFPLENBQUMsd0RBQVM7QUFDMUIsU0FBUyxtQkFBTyxDQUFDLHNEQUFRO0FBQ3pCLFNBQVMsbUJBQU8sQ0FBQyxnRUFBYTtBQUM5QixTQUFTLG1CQUFPLENBQUMsb0VBQWU7QUFDaEMsU0FBUyxtQkFBTyxDQUFDLHNFQUFnQjtBQUNqQyxTQUFTLG1CQUFPLENBQUMsMERBQVU7QUFDM0IsaUM7Ozs7Ozs7Ozs7OztBQ1hhO0FBQ2IsOENBQThDLGNBQWM7QUFDNUQsYUFBYSxtQkFBTyxDQUFDLHNEQUFPO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDOzs7Ozs7Ozs7Ozs7QUNsQmE7QUFDYiw4Q0FBOEMsY0FBYztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQzs7Ozs7Ozs7Ozs7O0FDUmE7QUFDYiw4Q0FBOEMsY0FBYztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Qzs7Ozs7Ozs7Ozs7O0FDUmE7QUFDYiw4Q0FBOEMsY0FBYztBQUM1RCxzQkFBc0IsbUJBQU8sQ0FBQyxvRUFBZTtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdDOzs7Ozs7Ozs7Ozs7QUNiYTtBQUNiLDhDQUE4QyxjQUFjO0FBQzVELGdCQUFnQixtQkFBTyxDQUFDLHdEQUFTO0FBQ2pDO0FBQ0Esa0M7Ozs7Ozs7Ozs7OztBQ0phO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsOENBQThDLGNBQWM7QUFDNUQsU0FBUyxtQkFBTyxDQUFDLGtFQUFjO0FBQy9CLFNBQVMsbUJBQU8sQ0FBQyxrRUFBYztBQUMvQixTQUFTLG1CQUFPLENBQUMsa0VBQWM7QUFDL0IsU0FBUyxtQkFBTyxDQUFDLHdEQUFTO0FBQzFCLFNBQVMsbUJBQU8sQ0FBQywwREFBVTtBQUMzQixTQUFTLG1CQUFPLENBQUMsOERBQVk7QUFDN0IsU0FBUyxtQkFBTyxDQUFDLG9FQUFlO0FBQ2hDLFNBQVMsbUJBQU8sQ0FBQyw4REFBWTtBQUM3QixTQUFTLG1CQUFPLENBQUMsOERBQVk7QUFDN0IsU0FBUyxtQkFBTyxDQUFDLGdFQUFhO0FBQzlCLFNBQVMsbUJBQU8sQ0FBQyw0REFBVztBQUM1QixTQUFTLG1CQUFPLENBQUMsNERBQVc7QUFDNUIsaUM7Ozs7Ozs7Ozs7OztBQ2pCYTtBQUNiLDhDQUE4QyxjQUFjO0FBQzVEO0FBQ0EsbUM7Ozs7Ozs7Ozs7OztBQ0hhO0FBQ2IsOENBQThDLGNBQWM7QUFDNUQsbUJBQW1CLG1CQUFPLENBQUMsOERBQVk7QUFDdkM7QUFDQSxtQzs7Ozs7Ozs7Ozs7O0FDSmE7QUFDYiw4Q0FBOEMsY0FBYztBQUM1RDtBQUNBLHNDOzs7Ozs7Ozs7Ozs7QUNIYTtBQUNiLDhDQUE4QyxjQUFjO0FBQzVEO0FBQ0Esc0M7Ozs7Ozs7Ozs7OztBQ0hhO0FBQ2IsOENBQThDLGNBQWM7QUFDNUQ7QUFDQSxxQzs7Ozs7Ozs7Ozs7O0FDSGE7QUFDYiw4Q0FBOEMsY0FBYztBQUM1RCxtQkFBbUIsbUJBQU8sQ0FBQyw4REFBWTtBQUN2QyxxQkFBcUIsbUJBQU8sQ0FBQyxrRUFBYztBQUMzQztBQUNBLHNDOzs7Ozs7Ozs7Ozs7QUNMYTtBQUNiLDhDQUE4QyxjQUFjO0FBQzVELGlCQUFpQixtQkFBTyxDQUFDLDBEQUFVO0FBQ25DLHNCQUFzQixtQkFBTyxDQUFDLG9FQUFlO0FBQzdDO0FBQ0EsaUM7Ozs7Ozs7Ozs7OztBQ0xhO0FBQ2IsOENBQThDLGNBQWM7QUFDNUQ7QUFDQSxrQzs7Ozs7Ozs7Ozs7O0FDSGE7QUFDYiw4Q0FBOEMsY0FBYztBQUM1RDtBQUNBLG9DOzs7Ozs7Ozs7Ozs7QUNIYTtBQUNiLDhDQUE4QyxjQUFjO0FBQzVEO0FBQ0Esb0M7Ozs7Ozs7Ozs7OztBQ0hhO0FBQ2IsOENBQThDLGNBQWM7QUFDNUQ7QUFDQSxvQzs7Ozs7Ozs7Ozs7O0FDSGE7QUFDYiw4Q0FBOEMsY0FBYztBQUM1RDtBQUNBLHVDOzs7Ozs7Ozs7Ozs7QUNIYTtBQUNiLDhDQUE4QyxjQUFjO0FBQzVELGFBQWEsbUJBQU8sQ0FBQyxzREFBTztBQUM1Qiw0QkFBNEIsbUJBQU8sQ0FBQyx1RkFBcUI7QUFDekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsaUM7Ozs7Ozs7Ozs7OztBQ2xCYTtBQUNiLDhDQUE4QyxjQUFjO0FBQzVELGFBQWEsbUJBQU8sQ0FBQyxzREFBTztBQUM1QixnQkFBZ0IsbUJBQU8sQ0FBQywrREFBUztBQUNqQyw0QkFBNEIsbUJBQU8sQ0FBQyx1RkFBcUI7QUFDekQ7QUFDQTtBQUNBO0FBQ0EsMEM7Ozs7Ozs7Ozs7OztBQ1JhO0FBQ2IsOENBQThDLGNBQWM7QUFDNUQsYUFBYSxtQkFBTyxDQUFDLHNEQUFPO0FBQzVCLDRCQUE0QixtQkFBTyxDQUFDLHVGQUFxQjtBQUN6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Qsa0M7Ozs7Ozs7Ozs7OztBQ1hhO0FBQ2IsOENBQThDLGNBQWM7QUFDNUQsZUFBZSxtQkFBTyxDQUFDLDZEQUFRO0FBQy9CO0FBQ0EsaUM7Ozs7Ozs7Ozs7OztBQ0phO0FBQ2IsOENBQThDLGNBQWM7QUFDNUQsYUFBYSxtQkFBTyxDQUFDLHNEQUFPO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsbUM7Ozs7Ozs7Ozs7OztBQ1RhO0FBQ2IsOENBQThDLGNBQWM7QUFDNUQsa0JBQWtCLG1CQUFPLENBQUMsbUVBQVc7QUFDckM7QUFDQSx1Qzs7Ozs7Ozs7Ozs7O0FDSmE7QUFDYiw4Q0FBOEMsY0FBYztBQUM1RCxhQUFhLG1CQUFPLENBQUMsc0RBQU87QUFDNUIsYUFBYSxtQkFBTyxDQUFDLHNEQUFPO0FBQzVCLDRCQUE0QixtQkFBTyxDQUFDLHVGQUFxQjtBQUN6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsbUM7Ozs7Ozs7Ozs7OztBQ2xCYTtBQUNiLDhDQUE4QyxjQUFjO0FBQzVELGFBQWEsbUJBQU8sQ0FBQyxzREFBTztBQUM1QixhQUFhLG1CQUFPLENBQUMsc0RBQU87QUFDNUIsNEJBQTRCLG1CQUFPLENBQUMsdUZBQXFCO0FBQ3pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsbUM7Ozs7Ozs7Ozs7OztBQ2pCYTtBQUNiLDhDQUE4QyxjQUFjO0FBQzVELGdCQUFnQixtQkFBTyxDQUFDLCtEQUFTO0FBQ2pDO0FBQ0EsZ0M7Ozs7Ozs7Ozs7OztBQ0phO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsOENBQThDLGNBQWM7QUFDNUQsU0FBUyxtQkFBTyxDQUFDLGlGQUFrQjtBQUNuQyxTQUFTLG1CQUFPLENBQUMsaUVBQVU7QUFDM0IsU0FBUyxtQkFBTyxDQUFDLG1FQUFXO0FBQzVCLFNBQVMsbUJBQU8sQ0FBQyxtRUFBVztBQUM1QixTQUFTLG1CQUFPLENBQUMsK0RBQVM7QUFDMUIsU0FBUyxtQkFBTyxDQUFDLDJEQUFPO0FBQ3hCLFNBQVMsbUJBQU8sQ0FBQyw2REFBUTtBQUN6QixTQUFTLG1CQUFPLENBQUMsNkRBQVE7QUFDekIsU0FBUyxtQkFBTyxDQUFDLDJEQUFPO0FBQ3hCLFNBQVMsbUJBQU8sQ0FBQywyREFBTztBQUN4QixTQUFTLG1CQUFPLENBQUMsdUVBQWE7QUFDOUIsU0FBUyxtQkFBTyxDQUFDLCtEQUFTO0FBQzFCLFNBQVMsbUJBQU8sQ0FBQywrREFBUztBQUMxQixTQUFTLG1CQUFPLENBQUMsNkRBQVE7QUFDekIsU0FBUyxtQkFBTyxDQUFDLDZEQUFRO0FBQ3pCLFNBQVMsbUJBQU8sQ0FBQyxtRUFBVztBQUM1QixTQUFTLG1CQUFPLENBQUMsMkVBQWU7QUFDaEMsU0FBUyxtQkFBTyxDQUFDLDZEQUFRO0FBQ3pCLGlDOzs7Ozs7Ozs7Ozs7QUN2QmE7QUFDYiw4Q0FBOEMsY0FBYztBQUM1RCw0QkFBNEIsbUJBQU8sQ0FBQyx1RkFBcUI7QUFDekQsYUFBYSxtQkFBTyxDQUFDLHNEQUFPO0FBQzVCLHlCQUF5QixtQkFBTyxDQUFDLGlGQUFrQjtBQUNuRDtBQUNBO0FBQ0EsQ0FBQztBQUNELGdDOzs7Ozs7Ozs7Ozs7QUNSYTtBQUNiLDhDQUE4QyxjQUFjO0FBQzVELGFBQWEsbUJBQU8sQ0FBQyxzREFBTztBQUM1Qiw0QkFBNEIsbUJBQU8sQ0FBQyx1RkFBcUI7QUFDekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxpQzs7Ozs7Ozs7Ozs7O0FDaEJhO0FBQ2IsOENBQThDLGNBQWM7QUFDNUQsYUFBYSxtQkFBTyxDQUFDLHNEQUFPO0FBQzVCLDRCQUE0QixtQkFBTyxDQUFDLHVGQUFxQjtBQUN6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCwrQjs7Ozs7Ozs7Ozs7O0FDVGE7QUFDYiw4Q0FBOEMsY0FBYztBQUM1RCxhQUFhLG1CQUFPLENBQUMsc0RBQU87QUFDNUIsNEJBQTRCLG1CQUFPLENBQUMsdUZBQXFCO0FBQ3pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELGdDOzs7Ozs7Ozs7Ozs7QUNaYTtBQUNiLDhDQUE4QyxjQUFjO0FBQzVELGFBQWEsbUJBQU8sQ0FBQyxzREFBTztBQUM1Qiw0QkFBNEIsbUJBQU8sQ0FBQyx1RkFBcUI7QUFDekQ7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLG9CQUFvQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxjQUFjO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELGdDOzs7Ozs7Ozs7Ozs7QUNuQmE7QUFDYiw4Q0FBOEMsY0FBYztBQUM1RCw0QkFBNEIsbUJBQU8sQ0FBQyx1RkFBcUI7QUFDekQsYUFBYSxtQkFBTyxDQUFDLHNEQUFPO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsZ0M7Ozs7Ozs7Ozs7OztBQ2hCYTtBQUNiLDhDQUE4QyxjQUFjO0FBQzVELGFBQWEsbUJBQU8sQ0FBQyxzREFBTztBQUM1QixhQUFhLG1CQUFPLENBQUMsc0RBQU87QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QscUM7Ozs7Ozs7Ozs7OztBQ25DYTtBQUNiLDhDQUE4QyxjQUFjO0FBQzVELGFBQWEsbUJBQU8sQ0FBQyxzREFBTztBQUM1Qiw0QkFBNEIsbUJBQU8sQ0FBQyx1RkFBcUI7QUFDekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELCtCOzs7Ozs7Ozs7Ozs7QUNYYTtBQUNiLDhDQUE4QyxjQUFjO0FBQzVELGFBQWEsbUJBQU8sQ0FBQyxzREFBTztBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2Qzs7Ozs7Ozs7Ozs7O0FDVGE7QUFDYiw4Q0FBOEMsY0FBYztBQUM1RCxhQUFhLG1CQUFPLENBQUMsc0RBQU87QUFDNUIsNEJBQTRCLG1CQUFPLENBQUMsdUZBQXFCO0FBQ3pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDLGNBQWM7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsK0I7Ozs7Ozs7Ozs7OztBQ2pCYTtBQUNiLDhDQUE4QyxjQUFjO0FBQzVELGFBQWEsbUJBQU8sQ0FBQyxzREFBTztBQUM1QixvQkFBb0IsbUJBQU8sQ0FBQyxvRUFBYztBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DOzs7Ozs7Ozs7Ozs7QUMxQmE7QUFDYjtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEMsY0FBYztBQUM1RCxTQUFTLG1CQUFPLENBQUMsaUVBQVc7QUFDNUIsU0FBUyxtQkFBTyxDQUFDLGlFQUFXO0FBQzVCLGlDOzs7Ozs7Ozs7Ozs7QUNQYTtBQUNiLDhDQUE4QyxjQUFjO0FBQzVELGtCQUFrQixtQkFBTyxDQUFDLGlFQUFXO0FBQ3JDO0FBQ0EsbUM7Ozs7Ozs7Ozs7Ozs7Ozs7SUNKQTtBQUNBOztBQUNBLFNBQVMsRUFBVCxDQUFZLENBQVosRUFBYTtBQUNYLFNBQU8sQ0FBQyxDQUFDLENBQUQsQ0FBUjtBQUNEOztBQUNELElBQU0sT0FBTyxHQUFHO0FBQ2QsT0FBSyxFQUFFLFNBRE87QUFFZCxhQUFXLEVBQUUsQ0FDWDtBQUFFLFFBQUksRUFBRSxNQUFSO0FBQWdCLFdBQU8sRUFBRSxDQUFDLEtBQUQsQ0FBekI7QUFBa0MsZUFBVyxFQUFFLDJCQUFJO0FBQUksaUJBQUksQ0FBSixDQUFJLENBQUo7QUFBTztBQUE5RCxHQURXLEVBRVg7QUFBRSxRQUFJLEVBQUUsS0FBUjtBQUFlLFdBQU8sRUFBRSxDQUFDLEtBQUQsQ0FBeEI7QUFBaUMsZUFBVyxFQUFFLDJCQUFJO0FBQUksaUJBQUksQ0FBSixDQUFJLENBQUo7QUFBTztBQUE3RCxHQUZXLEVBR1g7QUFBRSxRQUFJLEVBQUUscUJBQVI7QUFBK0IsV0FBTyxFQUFFLENBQUMsY0FBRDtBQUF4QyxHQUhXLEVBSVg7QUFBRSxRQUFJLEVBQUUscUJBQVI7QUFBK0IsV0FBTyxFQUFFLENBQUMsZ0JBQUQ7QUFBeEMsR0FKVyxFQUtYO0FBQUUsUUFBSSxFQUFFLEtBQVI7QUFBZSxXQUFPLEVBQUUsQ0FBQyxxQkFBRCxDQUF4QjtBQUFpRCxlQUFXLEVBQUUsMkJBQUk7QUFBSSxnQkFBRyxNQUFILENBQVMsS0FBVCxLQUFhLElBQUksQ0FBakIsQ0FBaUIsQ0FBakI7QUFBcUI7QUFBM0YsR0FMVyxFQU1YO0FBQUUsUUFBSSxFQUFFLE1BQVI7QUFBZ0IsV0FBTyxFQUFFLENBQUMsT0FBRDtBQUF6QixHQU5XLEVBT1g7QUFBRSxRQUFJLEVBQUUsTUFBUjtBQUFnQixXQUFPLEVBQUUsQ0FBQyxRQUFELENBQXpCO0FBQXFDLGVBQVcsRUFBRSwyQkFBSTtBQUFJLGlCQUFJLENBQUosQ0FBSSxDQUFKO0FBQU87QUFBakUsR0FQVyxFQVFYO0FBQUUsUUFBSSxFQUFFLE9BQVI7QUFBaUIsV0FBTyxFQUFFLENBQUMsR0FBRCxFQUFNLEtBQU4sQ0FBMUI7QUFBd0MsZUFBVyxFQUFFLDJCQUFJO0FBQUksaUJBQUksQ0FBSixDQUFJLENBQUo7QUFBTztBQUFwRSxHQVJXLEVBU1g7QUFBRSxRQUFJLEVBQUUsK0JBQVI7QUFBeUMsV0FBTyxFQUFFLENBQUMsTUFBRDtBQUFsRCxHQVRXLEVBVVg7QUFBRSxRQUFJLEVBQUUsK0JBQVI7QUFBeUMsV0FBTyxFQUFFLENBQUMsZ0JBQUQ7QUFBbEQsR0FWVyxFQVdYO0FBQUUsUUFBSSxFQUFFLGVBQVI7QUFBeUIsV0FBTyxFQUFFLENBQUMsK0JBQUQsQ0FBbEM7QUFBcUUsZUFBVyxFQUFFO0FBQWxGLEdBWFcsRUFZWDtBQUNFLFFBQUksRUFBRSxlQURSO0FBRUUsV0FBTyxFQUFFLEVBRlg7QUFHRSxlQUFXLEVBQUU7QUFDWCxhQUFPLElBQVA7QUFDRDtBQUxILEdBWlcsRUFtQlg7QUFDRSxRQUFJLEVBQUUsUUFEUjtBQUVFLFdBQU8sRUFBRSxDQUFDLFdBQUQsRUFBYyxlQUFkLENBRlg7QUFHRSxlQUFXLEVBQUUsMkJBQUk7QUFBSSxnQkFBRyxNQUFILENBQVMsS0FBVCxLQUFhLENBQUMsSUFBSSxDQUFDLENBQUQsQ0FBTCxFQUFVLE1BQVYsQ0FBaUIsSUFBSSxDQUFDLENBQUQsQ0FBSixHQUFVLEdBQUcsTUFBSCxDQUFTLEtBQVQsS0FBYSxJQUFJLENBQUMsQ0FBRCxDQUFqQixDQUFWLEdBQTlCLEVBQWEsQ0FBYjtBQUFvRTtBQUgzRixHQW5CVyxFQXdCWDtBQUFFLFFBQUksRUFBRSw4QkFBUjtBQUF3QyxXQUFPLEVBQUUsQ0FBQyxRQUFEO0FBQWpELEdBeEJXLEVBeUJYO0FBQUUsUUFBSSxFQUFFLDhCQUFSO0FBQXdDLFdBQU8sRUFBRSxDQUFDLFdBQUQ7QUFBakQsR0F6QlcsRUEwQlg7QUFBRSxRQUFJLEVBQUUsOEJBQVI7QUFBd0MsV0FBTyxFQUFFLENBQUMsVUFBRDtBQUFqRCxHQTFCVyxFQTJCWDtBQUFFLFFBQUksRUFBRSw4QkFBUjtBQUF3QyxXQUFPLEVBQUUsQ0FBQyxRQUFEO0FBQWpELEdBM0JXLEVBNEJYO0FBQUUsUUFBSSxFQUFFLDhCQUFSO0FBQXdDLFdBQU8sRUFBRSxDQUFDLFNBQUQ7QUFBakQsR0E1QlcsRUE2Qlg7QUFBRSxRQUFJLEVBQUUsOEJBQVI7QUFBd0MsV0FBTyxFQUFFLENBQUMsS0FBRDtBQUFqRCxHQTdCVyxFQThCWDtBQUFFLFFBQUksRUFBRSw4QkFBUjtBQUF3QyxXQUFPLEVBQUUsQ0FBQyxTQUFEO0FBQWpELEdBOUJXLEVBK0JYO0FBQUUsUUFBSSxFQUFFLHFDQUFSO0FBQStDLFdBQU8sRUFBRSxDQUFDLE1BQUQ7QUFBeEQsR0EvQlcsRUFnQ1g7QUFBRSxRQUFJLEVBQUUscUNBQVI7QUFBK0MsV0FBTyxFQUFFLENBQUMsZ0JBQUQ7QUFBeEQsR0FoQ1csRUFpQ1g7QUFDRSxRQUFJLEVBQUUscUJBRFI7QUFFRSxXQUFPLEVBQUUsQ0FBQyxxQ0FBRCxDQUZYO0FBR0UsZUFBVyxFQUFFO0FBSGYsR0FqQ1csRUFzQ1g7QUFDRSxRQUFJLEVBQUUscUJBRFI7QUFFRSxXQUFPLEVBQUUsRUFGWDtBQUdFLGVBQVcsRUFBRTtBQUNYLGFBQU8sSUFBUDtBQUNEO0FBTEgsR0F0Q1csRUE2Q1g7QUFDRSxRQUFJLEVBQUUsY0FEUjtBQUVFLFdBQU8sRUFBRSxDQUFDLDhCQUFELEVBQWlDLHFCQUFqQyxDQUZYO0FBR0UsZUFBVyxFQUFFLDJCQUFJO0FBQUksZ0JBQUcsTUFBSCxDQUFTLEtBQVQsS0FBYSxDQUFDLElBQUksQ0FBQyxDQUFELENBQUosQ0FBUSxDQUFSLENBQUQsRUFBYSxNQUFiLENBQW9CLElBQUksQ0FBQyxDQUFELENBQUosR0FBVSxHQUFHLE1BQUgsQ0FBUyxLQUFULEtBQWEsSUFBSSxDQUFDLENBQUQsQ0FBakIsQ0FBVixHQUFqQyxFQUFhLENBQWI7QUFBdUU7QUFIOUYsR0E3Q1csRUFrRFg7QUFBRSxRQUFJLEVBQUUsOENBQVI7QUFBd0QsV0FBTyxFQUFFLENBQUMsR0FBRCxDQUFqRTtBQUF3RSxlQUFXLEVBQUU7QUFBckYsR0FsRFcsRUFtRFg7QUFDRSxRQUFJLEVBQUUsOENBRFI7QUFFRSxXQUFPLEVBQUUsRUFGWDtBQUdFLGVBQVcsRUFBRTtBQUNYLGFBQU8sSUFBUDtBQUNEO0FBTEgsR0FuRFcsRUEwRFg7QUFDRSxRQUFJLEVBQUUsdUNBRFI7QUFFRSxXQUFPLEVBQUUsQ0FBQyw4Q0FBRCxFQUFpRCxLQUFqRDtBQUZYLEdBMURXLEVBOERYO0FBQ0UsUUFBSSxFQUFFLHVCQURSO0FBRUUsV0FBTyxFQUFFLENBQUMsdUNBQUQsQ0FGWDtBQUdFLGVBQVcsRUFBRTtBQUhmLEdBOURXLEVBbUVYO0FBQ0UsUUFBSSxFQUFFLHVCQURSO0FBRUUsV0FBTyxFQUFFLEVBRlg7QUFHRSxlQUFXLEVBQUU7QUFDWCxhQUFPLElBQVA7QUFDRDtBQUxILEdBbkVXLEVBMEVYO0FBQ0UsUUFBSSxFQUFFLGdCQURSO0FBRUUsV0FBTyxFQUFFLENBQUMsbUJBQUQsRUFBc0IsdUJBQXRCLENBRlg7QUFHRSxlQUFXLEVBQUUsMkJBQUk7QUFBSSxjQUFDLElBQUksQ0FBQyxDQUFELENBQUwsRUFBVSxNQUFWLENBQWlCLElBQUksQ0FBQyxDQUFELENBQUosR0FBVSxJQUFJLENBQUMsQ0FBRCxDQUFKLENBQVEsQ0FBUixDQUFWLEdBQWpCO0FBQTJDO0FBSGxFLEdBMUVXLEVBK0VYO0FBQUUsUUFBSSxFQUFFLHlCQUFSO0FBQW1DLFdBQU8sRUFBRSxDQUFDLFFBQUQ7QUFBNUMsR0EvRVcsRUFnRlg7QUFBRSxRQUFJLEVBQUUseUJBQVI7QUFBbUMsV0FBTyxFQUFFLENBQUMsV0FBRDtBQUE1QyxHQWhGVyxFQWlGWDtBQUFFLFFBQUksRUFBRSx5QkFBUjtBQUFtQyxXQUFPLEVBQUUsQ0FBQyxVQUFEO0FBQTVDLEdBakZXLEVBa0ZYO0FBQUUsUUFBSSxFQUFFLHlCQUFSO0FBQW1DLFdBQU8sRUFBRSxDQUFDLFFBQUQ7QUFBNUMsR0FsRlcsRUFtRlg7QUFBRSxRQUFJLEVBQUUseUJBQVI7QUFBbUMsV0FBTyxFQUFFLENBQUMsU0FBRDtBQUE1QyxHQW5GVyxFQW9GWDtBQUFFLFFBQUksRUFBRSx5QkFBUjtBQUFtQyxXQUFPLEVBQUUsQ0FBQyxRQUFEO0FBQTVDLEdBcEZXLEVBcUZYO0FBQUUsUUFBSSxFQUFFLHlCQUFSO0FBQW1DLFdBQU8sRUFBRSxDQUFDLE1BQUQ7QUFBNUMsR0FyRlcsRUFzRlg7QUFBRSxRQUFJLEVBQUUseUJBQVI7QUFBbUMsV0FBTyxFQUFFLENBQUMsUUFBRDtBQUE1QyxHQXRGVyxFQXVGWDtBQUFFLFFBQUksRUFBRSx5QkFBUjtBQUFtQyxXQUFPLEVBQUUsQ0FBQyxLQUFEO0FBQTVDLEdBdkZXLEVBd0ZYO0FBQUUsUUFBSSxFQUFFLHlCQUFSO0FBQW1DLFdBQU8sRUFBRSxDQUFDLEtBQUQ7QUFBNUMsR0F4RlcsRUF5Rlg7QUFBRSxRQUFJLEVBQUUsU0FBUjtBQUFtQixXQUFPLEVBQUUsQ0FBQyx5QkFBRCxDQUE1QjtBQUF5RCxlQUFXLEVBQUUsMkJBQUk7QUFBSSxpQkFBSSxDQUFDLENBQUQsQ0FBSjtBQUFVO0FBQXhGLEdBekZXLEVBMEZYO0FBQUUsUUFBSSxFQUFFLGVBQVI7QUFBeUIsV0FBTyxFQUFFLENBQUMsR0FBRCxDQUFsQztBQUF5QyxlQUFXLEVBQUU7QUFBdEQsR0ExRlcsRUEyRlg7QUFDRSxRQUFJLEVBQUUsZUFEUjtBQUVFLFdBQU8sRUFBRSxFQUZYO0FBR0UsZUFBVyxFQUFFO0FBQ1gsYUFBTyxJQUFQO0FBQ0Q7QUFMSCxHQTNGVyxFQWtHWDtBQUFFLFFBQUksRUFBRSxzQ0FBUjtBQUFnRCxXQUFPLEVBQUUsQ0FBQyxHQUFELENBQXpEO0FBQWdFLGVBQVcsRUFBRTtBQUE3RSxHQWxHVyxFQW1HWDtBQUNFLFFBQUksRUFBRSxzQ0FEUjtBQUVFLFdBQU8sRUFBRSxFQUZYO0FBR0UsZUFBVyxFQUFFO0FBQ1gsYUFBTyxJQUFQO0FBQ0Q7QUFMSCxHQW5HVyxFQTBHWDtBQUNFLFFBQUksRUFBRSwrQkFEUjtBQUVFLFdBQU8sRUFBRSxDQUFDLEtBQUQsRUFBUSxzQ0FBUjtBQUZYLEdBMUdXLEVBOEdYO0FBQUUsUUFBSSxFQUFFLGVBQVI7QUFBeUIsV0FBTyxFQUFFLENBQUMsK0JBQUQsQ0FBbEM7QUFBcUUsZUFBVyxFQUFFO0FBQWxGLEdBOUdXLEVBK0dYO0FBQ0UsUUFBSSxFQUFFLGVBRFI7QUFFRSxXQUFPLEVBQUUsRUFGWDtBQUdFLGVBQVcsRUFBRTtBQUNYLGFBQU8sSUFBUDtBQUNEO0FBTEgsR0EvR1csRUFzSFg7QUFDRSxRQUFJLEVBQUUsUUFEUjtBQUVFLFdBQU8sRUFBRSxDQUFDO0FBQUUsYUFBTyxFQUFFO0FBQVgsS0FBRCxFQUFtQixlQUFuQixFQUFvQyxlQUFwQyxFQUFxRDtBQUFFLGFBQU8sRUFBRTtBQUFYLEtBQXJELENBRlg7QUFHRSxlQUFXLEVBQUUsMkJBQUk7QUFBSSxhQUFDO0FBQUUsWUFBSSxFQUFFLFFBQVI7QUFBa0IsWUFBSSxFQUFFLElBQUksQ0FBQyxDQUFELENBQUosR0FBVSxJQUFJLENBQUMsQ0FBRCxDQUFKLENBQVEsQ0FBUixDQUFWLEdBQXpCO0FBQUMsT0FBRDtBQUFxRDtBQUg1RSxHQXRIVyxFQTJIWDtBQUFFLFFBQUksRUFBRSxhQUFSO0FBQXVCLFdBQU8sRUFBRSxDQUFDLEdBQUQsQ0FBaEM7QUFBdUMsZUFBVyxFQUFFO0FBQXBELEdBM0hXLEVBNEhYO0FBQ0UsUUFBSSxFQUFFLGFBRFI7QUFFRSxXQUFPLEVBQUUsRUFGWDtBQUdFLGVBQVcsRUFBRTtBQUNYLGFBQU8sSUFBUDtBQUNEO0FBTEgsR0E1SFcsRUFtSVg7QUFBRSxRQUFJLEVBQUUsb0NBQVI7QUFBOEMsV0FBTyxFQUFFLENBQUMsR0FBRCxDQUF2RDtBQUE4RCxlQUFXLEVBQUU7QUFBM0UsR0FuSVcsRUFvSVg7QUFDRSxRQUFJLEVBQUUsb0NBRFI7QUFFRSxXQUFPLEVBQUUsRUFGWDtBQUdFLGVBQVcsRUFBRTtBQUNYLGFBQU8sSUFBUDtBQUNEO0FBTEgsR0FwSVcsRUEySVg7QUFBRSxRQUFJLEVBQUUsNkJBQVI7QUFBdUMsV0FBTyxFQUFFLENBQUMsS0FBRCxFQUFRLG9DQUFSO0FBQWhELEdBM0lXLEVBNElYO0FBQUUsUUFBSSxFQUFFLGFBQVI7QUFBdUIsV0FBTyxFQUFFLENBQUMsNkJBQUQsQ0FBaEM7QUFBaUUsZUFBVyxFQUFFO0FBQTlFLEdBNUlXLEVBNklYO0FBQ0UsUUFBSSxFQUFFLGFBRFI7QUFFRSxXQUFPLEVBQUUsRUFGWDtBQUdFLGVBQVcsRUFBRTtBQUNYLGFBQU8sSUFBUDtBQUNEO0FBTEgsR0E3SVcsRUFvSlg7QUFDRSxRQUFJLEVBQUUsTUFEUjtBQUVFLFdBQU8sRUFBRSxDQUFDO0FBQUUsYUFBTyxFQUFFO0FBQVgsS0FBRCxFQUFtQixhQUFuQixFQUFrQyxhQUFsQyxFQUFpRDtBQUFFLGFBQU8sRUFBRTtBQUFYLEtBQWpELENBRlg7QUFHRSxlQUFXLEVBQUUsMkJBQUk7QUFBSSxhQUFDO0FBQUUsWUFBSSxFQUFFLE1BQVI7QUFBZ0IsWUFBSSxFQUFFLElBQUksQ0FBQyxDQUFELENBQUosR0FBVSxJQUFJLENBQUMsQ0FBRCxDQUFKLENBQVEsQ0FBUixDQUFWLEdBQXZCO0FBQUMsT0FBRDtBQUFtRDtBQUgxRSxHQXBKVyxFQXlKWDtBQUFFLFFBQUksRUFBRSxZQUFSO0FBQXNCLFdBQU8sRUFBRSxDQUFDLEdBQUQsQ0FBL0I7QUFBc0MsZUFBVyxFQUFFO0FBQW5ELEdBekpXLEVBMEpYO0FBQ0UsUUFBSSxFQUFFLFlBRFI7QUFFRSxXQUFPLEVBQUUsRUFGWDtBQUdFLGVBQVcsRUFBRTtBQUNYLGFBQU8sSUFBUDtBQUNEO0FBTEgsR0ExSlcsRUFpS1g7QUFBRSxRQUFJLEVBQUUsbUNBQVI7QUFBNkMsV0FBTyxFQUFFLENBQUMsR0FBRCxDQUF0RDtBQUE2RCxlQUFXLEVBQUU7QUFBMUUsR0FqS1csRUFrS1g7QUFDRSxRQUFJLEVBQUUsbUNBRFI7QUFFRSxXQUFPLEVBQUUsRUFGWDtBQUdFLGVBQVcsRUFBRTtBQUNYLGFBQU8sSUFBUDtBQUNEO0FBTEgsR0FsS1csRUF5S1g7QUFDRSxRQUFJLEVBQUUsNEJBRFI7QUFFRSxXQUFPLEVBQUUsQ0FBQyxTQUFELEVBQVksbUNBQVo7QUFGWCxHQXpLVyxFQTZLWDtBQUFFLFFBQUksRUFBRSxZQUFSO0FBQXNCLFdBQU8sRUFBRSxDQUFDLDRCQUFELENBQS9CO0FBQStELGVBQVcsRUFBRTtBQUE1RSxHQTdLVyxFQThLWDtBQUNFLFFBQUksRUFBRSxZQURSO0FBRUUsV0FBTyxFQUFFLEVBRlg7QUFHRSxlQUFXLEVBQUU7QUFDWCxhQUFPLElBQVA7QUFDRDtBQUxILEdBOUtXLEVBcUxYO0FBQ0UsUUFBSSxFQUFFLEtBRFI7QUFFRSxXQUFPLEVBQUUsQ0FBQztBQUFFLGFBQU8sRUFBRTtBQUFYLEtBQUQsRUFBbUIsWUFBbkIsRUFBaUMsWUFBakMsRUFBK0M7QUFBRSxhQUFPLEVBQUU7QUFBWCxLQUEvQyxDQUZYO0FBR0UsZUFBVyxFQUFFLDJCQUFJO0FBQUksYUFBQztBQUFFLFlBQUksRUFBRSxLQUFSO0FBQWUsWUFBSSxFQUFFLElBQUksQ0FBQyxDQUFELENBQUosR0FBVSxJQUFJLENBQUMsQ0FBRCxDQUFKLENBQVEsQ0FBUixDQUFWLEdBQXRCO0FBQUMsT0FBRDtBQUFrRDtBQUh6RSxHQXJMVyxFQTBMWDtBQUNFLFFBQUksRUFBRSxjQURSO0FBRUUsV0FBTyxFQUFFLENBQUM7QUFBRSxhQUFPLEVBQUU7QUFBWCxLQUFELEVBQW1CO0FBQUUsYUFBTyxFQUFFO0FBQVgsS0FBbkIsQ0FGWDtBQUdFLGVBQVcsRUFBRSxTQUFTLE1BQVQsQ0FBZ0IsQ0FBaEIsRUFBaUI7QUFDNUIsYUFBTyxDQUFDLENBQUMsSUFBRixDQUFPLEVBQVAsQ0FBUDtBQUNEO0FBTEgsR0ExTFcsRUFpTVg7QUFBRSxRQUFJLEVBQUUsWUFBUjtBQUFzQixXQUFPLEVBQUUsQ0FBQyxHQUFELENBQS9CO0FBQXNDLGVBQVcsRUFBRTtBQUFuRCxHQWpNVyxFQWtNWDtBQUNFLFFBQUksRUFBRSxZQURSO0FBRUUsV0FBTyxFQUFFLEVBRlg7QUFHRSxlQUFXLEVBQUU7QUFDWCxhQUFPLElBQVA7QUFDRDtBQUxILEdBbE1XLEVBeU1YO0FBQUUsUUFBSSxFQUFFLG1DQUFSO0FBQTZDLFdBQU8sRUFBRSxDQUFDLEdBQUQsQ0FBdEQ7QUFBNkQsZUFBVyxFQUFFO0FBQTFFLEdBek1XLEVBME1YO0FBQ0UsUUFBSSxFQUFFLG1DQURSO0FBRUUsV0FBTyxFQUFFLEVBRlg7QUFHRSxlQUFXLEVBQUU7QUFDWCxhQUFPLElBQVA7QUFDRDtBQUxILEdBMU1XLEVBaU5YO0FBQUUsUUFBSSxFQUFFLDRCQUFSO0FBQXNDLFdBQU8sRUFBRSxDQUFDLEtBQUQsRUFBUSxtQ0FBUjtBQUEvQyxHQWpOVyxFQWtOWDtBQUFFLFFBQUksRUFBRSxZQUFSO0FBQXNCLFdBQU8sRUFBRSxDQUFDLDRCQUFELENBQS9CO0FBQStELGVBQVcsRUFBRTtBQUE1RSxHQWxOVyxFQW1OWDtBQUNFLFFBQUksRUFBRSxZQURSO0FBRUUsV0FBTyxFQUFFLEVBRlg7QUFHRSxlQUFXLEVBQUU7QUFDWCxhQUFPLElBQVA7QUFDRDtBQUxILEdBbk5XLEVBME5YO0FBQ0UsUUFBSSxFQUFFLEtBRFI7QUFFRSxXQUFPLEVBQUUsQ0FBQyxjQUFELEVBQWlCLFlBQWpCLEVBQStCLFlBQS9CLEVBQTZDO0FBQUUsYUFBTyxFQUFFO0FBQVgsS0FBN0MsQ0FGWDtBQUdFLGVBQVcsRUFBRSwyQkFBSTtBQUFJLGFBQUM7QUFBRSxZQUFJLEVBQUUsS0FBUjtBQUFlLFlBQUksRUFBRSxJQUFJLENBQUMsQ0FBRCxDQUFKLEdBQVUsSUFBSSxDQUFDLENBQUQsQ0FBSixDQUFRLENBQVIsQ0FBVixHQUF0QjtBQUFDLE9BQUQ7QUFBa0Q7QUFIekUsR0ExTlcsRUErTlg7QUFDRSxRQUFJLEVBQUUsS0FEUjtBQUVFLFdBQU8sRUFBRSxDQUFDO0FBQUUsYUFBTyxFQUFFO0FBQVgsS0FBRCxFQUFtQixRQUFuQixFQUE2QixHQUE3QixFQUFrQyxTQUFsQyxDQUZYO0FBR0UsZUFBVyxFQUFFLHFCQUFDLElBQUQsRUFBTyxFQUFQLEVBQVcsTUFBWCxFQUFpQjtBQUM1QixVQUFJLElBQUksQ0FBQyxDQUFELENBQUosQ0FBUSxJQUFSLENBQWEsQ0FBYixNQUFvQixHQUF4QixFQUE2QixPQUFPLE1BQVA7QUFDN0IsYUFBTztBQUFFLFlBQUksRUFBRSxLQUFSO0FBQWUsV0FBRyxFQUFFLElBQUksQ0FBQyxDQUFELENBQUosQ0FBUSxJQUE1QjtBQUFrQyxZQUFJLEVBQUUsSUFBSSxDQUFDLENBQUQ7QUFBNUMsT0FBUDtBQUNEO0FBTkgsR0EvTlcsRUF1T1g7QUFDRSxRQUFJLEVBQUUsa0JBRFI7QUFFRSxXQUFPLEVBQUUsQ0FBQztBQUFFLGFBQU8sRUFBRTtBQUFYLEtBQUQsRUFBbUI7QUFBRSxhQUFPLEVBQUU7QUFBWCxLQUFuQixDQUZYO0FBR0UsZUFBVyxFQUFFLFNBQVMsTUFBVCxDQUFnQixDQUFoQixFQUFpQjtBQUM1QixhQUFPLENBQUMsQ0FBQyxJQUFGLENBQU8sRUFBUCxDQUFQO0FBQ0Q7QUFMSCxHQXZPVyxFQThPWDtBQUFFLFFBQUksRUFBRSxnQkFBUjtBQUEwQixXQUFPLEVBQUUsQ0FBQyxHQUFELENBQW5DO0FBQTBDLGVBQVcsRUFBRTtBQUF2RCxHQTlPVyxFQStPWDtBQUNFLFFBQUksRUFBRSxnQkFEUjtBQUVFLFdBQU8sRUFBRSxFQUZYO0FBR0UsZUFBVyxFQUFFO0FBQ1gsYUFBTyxJQUFQO0FBQ0Q7QUFMSCxHQS9PVyxFQXNQWDtBQUNFLFFBQUksRUFBRSxTQURSO0FBRUUsV0FBTyxFQUFFLENBQUMsa0JBQUQsRUFBcUIsZ0JBQXJCLEVBQXVDLFNBQXZDLENBRlg7QUFHRSxlQUFXLEVBQUU7QUFBTSxhQUFDO0FBQUUsWUFBSSxFQUFQO0FBQUMsT0FBRDtBQUFxQjtBQUgxQyxHQXRQVyxFQTJQWDtBQUFFLFFBQUksRUFBRSxlQUFSO0FBQXlCLFdBQU8sRUFBRTtBQUFsQyxHQTNQVyxFQTRQWDtBQUNFLFFBQUksRUFBRSxlQURSO0FBRUUsV0FBTyxFQUFFLENBQUMsZUFBRCxFQUFrQixhQUFsQixDQUZYO0FBR0UsZUFBVyxFQUFFLFNBQVMsT0FBVCxDQUFpQixDQUFqQixFQUFrQjtBQUM3QixhQUFPLENBQUMsQ0FBQyxDQUFELENBQUQsQ0FBSyxNQUFMLENBQVksQ0FBQyxDQUFDLENBQUMsQ0FBRCxDQUFGLENBQVosQ0FBUDtBQUNEO0FBTEgsR0E1UFcsRUFtUVg7QUFDRSxRQUFJLEVBQUUsUUFEUjtBQUVFLFdBQU8sRUFBRSxDQUFDO0FBQUUsYUFBTyxFQUFFO0FBQVgsS0FBRCxFQUFtQixlQUFuQixFQUFvQztBQUFFLGFBQU8sRUFBRTtBQUFYLEtBQXBDLENBRlg7QUFHRSxlQUFXLEVBQUUsMkJBQUk7QUFBSSxhQUFDO0FBQUUsWUFBSSxFQUFFLFFBQVI7QUFBa0IsWUFBSSxFQUFFLElBQUksQ0FBQyxDQUFELENBQUosQ0FBUSxJQUFSLENBQXpCLEVBQXlCO0FBQXhCLE9BQUQ7QUFBNEM7QUFIbkUsR0FuUVcsRUF3UVg7QUFBRSxRQUFJLEVBQUUsYUFBUjtBQUF1QixXQUFPLEVBQUUsQ0FBQyxRQUFEO0FBQWhDLEdBeFFXLEVBeVFYO0FBQUUsUUFBSSxFQUFFLGFBQVI7QUFBdUIsV0FBTyxFQUFFLENBQUMsV0FBRDtBQUFoQyxHQXpRVyxFQTBRWDtBQUFFLFFBQUksRUFBRSxhQUFSO0FBQXVCLFdBQU8sRUFBRSxDQUFDLG1CQUFELENBQWhDO0FBQXVELGVBQVcsRUFBRTtBQUFwRSxHQTFRVyxFQTJRWDtBQUNFLFFBQUksRUFBRSxXQURSO0FBRUUsV0FBTyxFQUFFLENBQUM7QUFBRSxhQUFPLEVBQUU7QUFBWCxLQUFELEVBQW9CLFVBQXBCLENBRlg7QUFHRSxlQUFXLEVBQUUsMkJBQUk7QUFBSSxpQkFBSSxDQUFDLElBQUw7QUFBYTtBQUhwQyxHQTNRVyxFQWdSWDtBQUNFLFFBQUksRUFBRSxtQkFEUjtBQUVFLFdBQU8sRUFBRSxDQUFDO0FBQUUsYUFBTyxFQUFFO0FBQVgsS0FBRCxFQUFvQixTQUFwQixDQUZYO0FBR0UsZUFBVyxFQUFFLDJCQUFJO0FBQUksaUJBQUksQ0FBSixDQUFJLENBQUo7QUFBTztBQUg5QixHQWhSVyxFQXFSWDtBQUFFLFFBQUksRUFBRSwwQkFBUjtBQUFvQyxXQUFPLEVBQUUsQ0FBQyxTQUFEO0FBQTdDLEdBclJXLEVBc1JYO0FBQUUsUUFBSSxFQUFFLDBCQUFSO0FBQW9DLFdBQU8sRUFBRSxDQUFDLEtBQUQ7QUFBN0MsR0F0UlcsRUF1Ulg7QUFBRSxRQUFJLEVBQUUsVUFBUjtBQUFvQixXQUFPLEVBQUUsQ0FBQywwQkFBRCxDQUE3QjtBQUEyRCxlQUFXLEVBQUUsMkJBQUk7QUFBSSxpQkFBSSxDQUFDLENBQUQsQ0FBSjtBQUFVO0FBQTFGLEdBdlJXLEVBd1JYO0FBQUUsUUFBSSxFQUFFLHlCQUFSO0FBQW1DLFdBQU8sRUFBRSxDQUFDLE1BQUQ7QUFBNUMsR0F4UlcsRUF5Ulg7QUFBRSxRQUFJLEVBQUUseUJBQVI7QUFBbUMsV0FBTyxFQUFFLENBQUMsT0FBRDtBQUE1QyxHQXpSVyxFQTBSWDtBQUFFLFFBQUksRUFBRSxTQUFSO0FBQW1CLFdBQU8sRUFBRSxDQUFDLHlCQUFELENBQTVCO0FBQXlELGVBQVcsRUFBRSwyQkFBSTtBQUFJLGlCQUFJLENBQUMsQ0FBRCxDQUFKO0FBQVU7QUFBeEYsR0ExUlcsRUEyUlg7QUFDRSxRQUFJLEVBQUUsZUFEUjtBQUVFLFdBQU8sRUFBRSxDQUFDO0FBQUUsYUFBTyxFQUFFO0FBQVgsS0FBRCxFQUFtQjtBQUFFLGFBQU8sRUFBRTtBQUFYLEtBQW5CLEVBQXFDO0FBQUUsYUFBTyxFQUFFO0FBQVgsS0FBckMsRUFBdUQ7QUFBRSxhQUFPLEVBQUU7QUFBWCxLQUF2RCxDQUZYO0FBR0UsZUFBVyxFQUFFLFNBQVMsTUFBVCxDQUFnQixDQUFoQixFQUFpQjtBQUM1QixhQUFPLENBQUMsQ0FBQyxJQUFGLENBQU8sRUFBUCxDQUFQO0FBQ0Q7QUFMSCxHQTNSVyxFQWtTWDtBQUFFLFFBQUksRUFBRSxNQUFSO0FBQWdCLFdBQU8sRUFBRSxDQUFDLGVBQUQsQ0FBekI7QUFBNEMsZUFBVyxFQUFFO0FBQU0sYUFBQztBQUFFLFlBQUksRUFBRSxNQUFSO0FBQWdCLFlBQUksRUFBckI7QUFBQyxPQUFEO0FBQThCO0FBQTdGLEdBbFNXLEVBbVNYO0FBQ0UsUUFBSSxFQUFFLGdCQURSO0FBRUUsV0FBTyxFQUFFLENBQ1A7QUFBRSxhQUFPLEVBQUU7QUFBWCxLQURPLEVBRVA7QUFBRSxhQUFPLEVBQUU7QUFBWCxLQUZPLEVBR1A7QUFBRSxhQUFPLEVBQUU7QUFBWCxLQUhPLEVBSVA7QUFBRSxhQUFPLEVBQUU7QUFBWCxLQUpPLEVBS1A7QUFBRSxhQUFPLEVBQUU7QUFBWCxLQUxPLENBRlg7QUFTRSxlQUFXLEVBQUUsU0FBUyxNQUFULENBQWdCLENBQWhCLEVBQWlCO0FBQzVCLGFBQU8sQ0FBQyxDQUFDLElBQUYsQ0FBTyxFQUFQLENBQVA7QUFDRDtBQVhILEdBblNXLEVBZ1RYO0FBQ0UsUUFBSSxFQUFFLE9BRFI7QUFFRSxXQUFPLEVBQUUsQ0FBQyxnQkFBRCxDQUZYO0FBR0UsZUFBVyxFQUFFO0FBQU0sYUFBQztBQUFFLFlBQUksRUFBRSxNQUFSO0FBQWdCLFlBQUksRUFBckI7QUFBQyxPQUFEO0FBQStCO0FBSHBELEdBaFRXLEVBcVRYO0FBQ0UsUUFBSSxFQUFFLGNBRFI7QUFFRSxXQUFPLEVBQUUsQ0FBQztBQUFFLGFBQU8sRUFBRTtBQUFYLEtBQUQsRUFBbUI7QUFBRSxhQUFPLEVBQUU7QUFBWCxLQUFuQixFQUFxQztBQUFFLGFBQU8sRUFBRTtBQUFYLEtBQXJDLENBRlg7QUFHRSxlQUFXLEVBQUUsU0FBUyxNQUFULENBQWdCLENBQWhCLEVBQWlCO0FBQzVCLGFBQU8sQ0FBQyxDQUFDLElBQUYsQ0FBTyxFQUFQLENBQVA7QUFDRDtBQUxILEdBclRXLEVBNFRYO0FBQUUsUUFBSSxFQUFFLEtBQVI7QUFBZSxXQUFPLEVBQUUsQ0FBQyxjQUFELENBQXhCO0FBQTBDLGVBQVcsRUFBRTtBQUFNLGFBQUM7QUFBRSxZQUFJLEVBQUUsS0FBUjtBQUFlLFlBQUksRUFBcEI7QUFBQyxPQUFEO0FBQTZCO0FBQTFGLEdBNVRXLEVBNlRYO0FBQUUsUUFBSSxFQUFFLHdCQUFSO0FBQWtDLFdBQU8sRUFBRSxDQUFDLFFBQUQ7QUFBM0MsR0E3VFcsRUE4VFg7QUFBRSxRQUFJLEVBQUUsd0JBQVI7QUFBa0MsV0FBTyxFQUFFLENBQUM7QUFBRSxhQUFPLEVBQUU7QUFBWCxLQUFEO0FBQTNDLEdBOVRXLEVBK1RYO0FBQ0UsUUFBSSxFQUFFLFFBRFI7QUFFRSxXQUFPLEVBQUUsQ0FBQyx3QkFBRCxDQUZYO0FBR0UsZUFBVyxFQUFFLHFCQUFDLElBQUQsRUFBTyxDQUFQLEVBQVUsTUFBVixFQUFnQjtBQUMzQixVQUFJLElBQUksQ0FBQyxDQUFELENBQUosQ0FBUSxDQUFSLE1BQWUsTUFBZixJQUF5QixJQUFJLENBQUMsQ0FBRCxDQUFKLENBQVEsQ0FBUixNQUFlLE9BQXhDLElBQW1ELElBQUksQ0FBQyxDQUFELENBQUosQ0FBUSxDQUFSLE1BQWUsS0FBdEUsRUFBNkUsT0FBTyxNQUFQO0FBQzdFLGFBQU87QUFBRSxZQUFJLEVBQUUsUUFBUjtBQUFrQixZQUFJLEVBQUUsSUFBSSxDQUFDLENBQUQsQ0FBSixDQUFRLENBQVI7QUFBeEIsT0FBUDtBQUNEO0FBTkgsR0EvVFcsRUF1VVg7QUFBRSxRQUFJLEVBQUUsK0JBQVI7QUFBeUMsV0FBTyxFQUFFLENBQUM7QUFBRSxhQUFPLEVBQUU7QUFBWCxLQUFELEVBQW1CLGNBQW5CO0FBQWxELEdBdlVXLEVBd1VYO0FBQUUsUUFBSSxFQUFFLGVBQVI7QUFBeUIsV0FBTyxFQUFFLENBQUMsK0JBQUQsQ0FBbEM7QUFBcUUsZUFBVyxFQUFFO0FBQWxGLEdBeFVXLEVBeVVYO0FBQ0UsUUFBSSxFQUFFLGVBRFI7QUFFRSxXQUFPLEVBQUUsRUFGWDtBQUdFLGVBQVcsRUFBRTtBQUNYLGFBQU8sSUFBUDtBQUNEO0FBTEgsR0F6VVcsRUFnVlg7QUFDRSxRQUFJLEVBQUUsUUFEUjtBQUVFLFdBQU8sRUFBRSxDQUFDLGNBQUQsRUFBaUIsZUFBakIsQ0FGWDtBQUdFLGVBQVcsRUFBRSwyQkFBSTtBQUFJLGlCQUFJLENBQUMsQ0FBRCxDQUFKLElBQVcsSUFBSSxDQUFDLENBQUQsQ0FBSixHQUFVLElBQUksQ0FBQyxDQUFELENBQUosQ0FBUSxJQUFSLENBQWEsRUFBYixDQUFWLEdBQVg7QUFBMkM7QUFIbEUsR0FoVlcsRUFxVlg7QUFBRSxRQUFJLEVBQUUsY0FBUjtBQUF3QixXQUFPLEVBQUUsQ0FBQyxvQkFBRDtBQUFqQyxHQXJWVyxFQXNWWDtBQUFFLFFBQUksRUFBRSxjQUFSO0FBQXdCLFdBQU8sRUFBRSxDQUFDLGtCQUFELENBQWpDO0FBQXVELGVBQVcsRUFBRTtBQUFwRSxHQXRWVyxFQXVWWDtBQUFFLFFBQUksRUFBRSwyQkFBUjtBQUFxQyxXQUFPLEVBQUU7QUFBOUMsR0F2VlcsRUF3Vlg7QUFDRSxRQUFJLEVBQUUsMkJBRFI7QUFFRSxXQUFPLEVBQUUsQ0FBQywyQkFBRCxFQUE4QixZQUE5QixDQUZYO0FBR0UsZUFBVyxFQUFFLFNBQVMsT0FBVCxDQUFpQixDQUFqQixFQUFrQjtBQUM3QixhQUFPLENBQUMsQ0FBQyxDQUFELENBQUQsQ0FBSyxNQUFMLENBQVksQ0FBQyxDQUFDLENBQUMsQ0FBRCxDQUFGLENBQVosQ0FBUDtBQUNEO0FBTEgsR0F4VlcsRUErVlg7QUFDRSxRQUFJLEVBQUUsb0JBRFI7QUFFRSxXQUFPLEVBQUUsQ0FBQyxjQUFELEVBQWlCLDJCQUFqQixDQUZYO0FBR0UsZUFBVyxFQUFFLDJCQUFJO0FBQUksaUJBQUksQ0FBQyxDQUFELENBQUosR0FBVSxJQUFJLENBQUMsQ0FBRCxDQUFKLENBQVEsSUFBUixDQUFWLEVBQVUsQ0FBVjtBQUEwQjtBQUhqRCxHQS9WVyxFQW9XWDtBQUFFLFFBQUksRUFBRSxnREFBUjtBQUEwRCxXQUFPLEVBQUU7QUFBbkUsR0FwV1csRUFxV1g7QUFDRSxRQUFJLEVBQUUsZ0RBRFI7QUFFRSxXQUFPLEVBQUUsQ0FBQyxnREFBRCxFQUFtRCxZQUFuRCxDQUZYO0FBR0UsZUFBVyxFQUFFLFNBQVMsT0FBVCxDQUFpQixDQUFqQixFQUFrQjtBQUM3QixhQUFPLENBQUMsQ0FBQyxDQUFELENBQUQsQ0FBSyxNQUFMLENBQVksQ0FBQyxDQUFDLENBQUMsQ0FBRCxDQUFGLENBQVosQ0FBUDtBQUNEO0FBTEgsR0FyV1csRUE0V1g7QUFDRSxRQUFJLEVBQUUseUNBRFI7QUFFRSxXQUFPLEVBQUUsQ0FBQyx1QkFBRCxFQUEwQixnREFBMUI7QUFGWCxHQTVXVyxFQWdYWDtBQUNFLFFBQUksRUFBRSx5QkFEUjtBQUVFLFdBQU8sRUFBRSxDQUFDLHlDQUFELENBRlg7QUFHRSxlQUFXLEVBQUU7QUFIZixHQWhYVyxFQXFYWDtBQUNFLFFBQUksRUFBRSx5QkFEUjtBQUVFLFdBQU8sRUFBRSxFQUZYO0FBR0UsZUFBVyxFQUFFO0FBQ1gsYUFBTyxJQUFQO0FBQ0Q7QUFMSCxHQXJYVyxFQTRYWDtBQUNFLFFBQUksRUFBRSxrQkFEUjtBQUVFLFdBQU8sRUFBRSxDQUFDLFFBQUQsRUFBVyx5QkFBWCxDQUZYO0FBR0UsZUFBVyxFQUFFLDJCQUFJO0FBQUksaUJBQUksQ0FBQyxDQUFELENBQUosSUFBVyxJQUFJLENBQUMsQ0FBRCxDQUFKLEdBQVUsSUFBSSxDQUFDLENBQUQsQ0FBSixDQUFRLENBQVIsSUFBYSxJQUFJLENBQUMsQ0FBRCxDQUFKLENBQVEsQ0FBUixFQUFXLElBQVgsQ0FBZ0IsRUFBaEIsQ0FBdkIsR0FBWDtBQUEyRDtBQUhsRixHQTVYVyxFQWlZWDtBQUFFLFFBQUksRUFBRSxxQkFBUjtBQUErQixXQUFPLEVBQUU7QUFBeEMsR0FqWVcsRUFrWVg7QUFDRSxRQUFJLEVBQUUscUJBRFI7QUFFRSxXQUFPLEVBQUUsQ0FBQyxxQkFBRCxFQUF3QixZQUF4QixDQUZYO0FBR0UsZUFBVyxFQUFFLFNBQVMsT0FBVCxDQUFpQixDQUFqQixFQUFrQjtBQUM3QixhQUFPLENBQUMsQ0FBQyxDQUFELENBQUQsQ0FBSyxNQUFMLENBQVksQ0FBQyxDQUFDLENBQUMsQ0FBRCxDQUFGLENBQVosQ0FBUDtBQUNEO0FBTEgsR0FsWVcsRUF5WVg7QUFBRSxRQUFJLEVBQUUscUNBQVI7QUFBK0MsV0FBTyxFQUFFLENBQUM7QUFBRSxhQUFPLEVBQUU7QUFBWCxLQUFELEVBQW1CLGNBQW5CO0FBQXhELEdBellXLEVBMFlYO0FBQ0UsUUFBSSxFQUFFLHFCQURSO0FBRUUsV0FBTyxFQUFFLENBQUMscUNBQUQsQ0FGWDtBQUdFLGVBQVcsRUFBRTtBQUhmLEdBMVlXLEVBK1lYO0FBQ0UsUUFBSSxFQUFFLHFCQURSO0FBRUUsV0FBTyxFQUFFLEVBRlg7QUFHRSxlQUFXLEVBQUU7QUFDWCxhQUFPLElBQVA7QUFDRDtBQUxILEdBL1lXLEVBc1pYO0FBQ0UsUUFBSSxFQUFFLGNBRFI7QUFFRSxXQUFPLEVBQUUsQ0FBQyxjQUFELEVBQWlCLHFCQUFqQixFQUF3QyxxQkFBeEMsQ0FGWDtBQUdFLGVBQVcsRUFBRSwyQkFBSTtBQUFJLGlCQUFJLENBQUMsQ0FBRCxDQUFKLEdBQVUsSUFBSSxDQUFDLENBQUQsQ0FBSixDQUFRLElBQVIsQ0FBYSxFQUFiLENBQVYsSUFBOEIsSUFBSSxDQUFDLENBQUQsQ0FBSixHQUFVLElBQUksQ0FBQyxDQUFELENBQUosQ0FBUSxJQUFSLENBQWEsRUFBYixDQUFWLEdBQTlCO0FBQThEO0FBSHJGLEdBdFpXLEVBMlpYO0FBQUUsUUFBSSxFQUFFLGNBQVI7QUFBd0IsV0FBTyxFQUFFLENBQUMsUUFBRDtBQUFqQyxHQTNaVyxFQTRaWDtBQUFFLFFBQUksRUFBRSxjQUFSO0FBQXdCLFdBQU8sRUFBRSxDQUFDLGVBQUQsQ0FBakM7QUFBb0QsZUFBVyxFQUFFLDJCQUFJO0FBQUksaUJBQUksQ0FBSixDQUFJLENBQUo7QUFBTztBQUFoRixHQTVaVyxFQTZaWDtBQUFFLFFBQUksRUFBRSxZQUFSO0FBQXNCLFdBQU8sRUFBRSxDQUFDLFFBQUQ7QUFBL0IsR0E3WlcsRUE4Wlg7QUFBRSxRQUFJLEVBQUUsWUFBUjtBQUFzQixXQUFPLEVBQUUsQ0FBQyxPQUFEO0FBQS9CLEdBOVpXLEVBK1pYO0FBQUUsUUFBSSxFQUFFLFlBQVI7QUFBc0IsV0FBTyxFQUFFLENBQUMscUJBQUQsQ0FBL0I7QUFBd0QsZUFBVyxFQUFFLDJCQUFJO0FBQUksaUJBQUksQ0FBSixDQUFJLENBQUo7QUFBTztBQUFwRixHQS9aVyxFQWdhWDtBQUFFLFFBQUksRUFBRSxpREFBUjtBQUEyRCxXQUFPLEVBQUU7QUFBcEUsR0FoYVcsRUFpYVg7QUFDRSxRQUFJLEVBQUUsaURBRFI7QUFFRSxXQUFPLEVBQUUsQ0FBQyxpREFBRCxFQUFvRCxZQUFwRCxDQUZYO0FBR0UsZUFBVyxFQUFFLFNBQVMsT0FBVCxDQUFpQixDQUFqQixFQUFrQjtBQUM3QixhQUFPLENBQUMsQ0FBQyxDQUFELENBQUQsQ0FBSyxNQUFMLENBQVksQ0FBQyxDQUFDLENBQUMsQ0FBRCxDQUFGLENBQVosQ0FBUDtBQUNEO0FBTEgsR0FqYVcsRUF3YVg7QUFDRSxRQUFJLEVBQUUsMENBRFI7QUFFRSxXQUFPLEVBQUUsQ0FBQyx1QkFBRCxFQUEwQixpREFBMUI7QUFGWCxHQXhhVyxFQTRhWDtBQUNFLFFBQUksRUFBRSwwQkFEUjtBQUVFLFdBQU8sRUFBRSxDQUFDLDBDQUFELENBRlg7QUFHRSxlQUFXLEVBQUU7QUFIZixHQTVhVyxFQWliWDtBQUNFLFFBQUksRUFBRSwwQkFEUjtBQUVFLFdBQU8sRUFBRSxFQUZYO0FBR0UsZUFBVyxFQUFFO0FBQ1gsYUFBTyxJQUFQO0FBQ0Q7QUFMSCxHQWpiVyxFQXdiWDtBQUNFLFFBQUksRUFBRSwwQ0FEUjtBQUVFLFdBQU8sRUFBRSxDQUFDO0FBQUUsYUFBTyxFQUFFO0FBQVgsS0FBRCxFQUFtQixjQUFuQjtBQUZYLEdBeGJXLEVBNGJYO0FBQ0UsUUFBSSxFQUFFLDBCQURSO0FBRUUsV0FBTyxFQUFFLENBQUMsMENBQUQsQ0FGWDtBQUdFLGVBQVcsRUFBRTtBQUhmLEdBNWJXLEVBaWNYO0FBQ0UsUUFBSSxFQUFFLDBCQURSO0FBRUUsV0FBTyxFQUFFLEVBRlg7QUFHRSxlQUFXLEVBQUU7QUFDWCxhQUFPLElBQVA7QUFDRDtBQUxILEdBamNXLEVBd2NYO0FBQ0UsUUFBSSxFQUFFLG1CQURSO0FBRUUsV0FBTyxFQUFFLENBQUMsUUFBRCxFQUFXLDBCQUFYLEVBQXVDLDBCQUF2QyxDQUZYO0FBR0UsZUFBVyxFQUFFLDJCQUFJO0FBQ2YsaUJBQUksQ0FBQyxDQUFELENBQUosSUFDQyxJQUFJLENBQUMsQ0FBRCxDQUFKLEdBQVUsSUFBSSxDQUFDLENBQUQsQ0FBSixDQUFRLENBQVIsSUFBYSxJQUFJLENBQUMsQ0FBRCxDQUFKLENBQVEsQ0FBUixFQUFXLElBQVgsQ0FBZ0IsRUFBaEIsQ0FBdkIsR0FBNkMsRUFEOUMsS0FFQyxJQUFJLENBQUMsQ0FBRCxDQUFKLEdBQVUsSUFBSSxDQUFDLENBQUQsQ0FBSixDQUFRLElBQVIsQ0FBYSxFQUFiLENBQVYsR0FBNkIsRUFGOUI7QUFFaUM7QUFOckMsR0F4Y1csRUFnZFg7QUFBRSxRQUFJLEVBQUUsdUJBQVI7QUFBaUMsV0FBTyxFQUFFLENBQUMsY0FBRDtBQUExQyxHQWhkVyxFQWlkWDtBQUFFLFFBQUksRUFBRSx1QkFBUjtBQUFpQyxXQUFPLEVBQUUsQ0FBQyxVQUFELENBQTFDO0FBQXdELGVBQVcsRUFBRSwyQkFBSTtBQUFJLGlCQUFJLENBQUosQ0FBSSxDQUFKO0FBQU87QUFBcEYsR0FqZFcsRUFrZFg7QUFDRSxRQUFJLEVBQUUsU0FEUjtBQUVFLFdBQU8sRUFBRSxDQUFDO0FBQUUsYUFBTyxFQUFFO0FBQVgsS0FBRCxFQUFtQixRQUFuQixDQUZYO0FBR0UsZUFBVyxFQUFFLDJCQUFJO0FBQUksYUFBQztBQUFFLFlBQUksRUFBRSxTQUFSO0FBQW1CLFlBQUksRUFBRSxNQUFNLElBQUksQ0FBQyxDQUFELENBQUosQ0FBaEM7QUFBQyxPQUFEO0FBQStDO0FBSHRFLEdBbGRXLEVBdWRYO0FBQ0UsUUFBSSxFQUFFLFdBRFI7QUFFRSxXQUFPLEVBQUUsQ0FBQztBQUFFLGFBQU8sRUFBRTtBQUFYLEtBQUQsRUFBb0IsTUFBcEIsQ0FGWDtBQUdFLGVBQVcsRUFBRSwyQkFBSTtBQUFJLGFBQUM7QUFBRSxZQUFJLEVBQUUsTUFBUjtBQUFnQixZQUFJLEVBQUUsSUFBSSxDQUFDLENBQUQsQ0FBSixDQUF2QixDQUF1QjtBQUF0QixPQUFEO0FBQW9DO0FBSDNELEdBdmRXLEVBNGRYO0FBQUUsUUFBSSxFQUFFLE1BQVI7QUFBZ0IsV0FBTyxFQUFFLENBQUMsWUFBRDtBQUF6QixHQTVkVyxFQTZkWDtBQUNFLFFBQUksRUFBRSxlQURSO0FBRUUsV0FBTyxFQUFFLENBQ1A7QUFBRSxhQUFPLEVBQUU7QUFBWCxLQURPLEVBRVA7QUFBRSxhQUFPLEVBQUU7QUFBWCxLQUZPLEVBR1A7QUFBRSxhQUFPLEVBQUU7QUFBWCxLQUhPLEVBSVA7QUFBRSxhQUFPLEVBQUU7QUFBWCxLQUpPLEVBS1A7QUFBRSxhQUFPLEVBQUU7QUFBWCxLQUxPLEVBTVA7QUFBRSxhQUFPLEVBQUU7QUFBWCxLQU5PLEVBT1A7QUFBRSxhQUFPLEVBQUU7QUFBWCxLQVBPLENBRlg7QUFXRSxlQUFXLEVBQUUsU0FBUyxNQUFULENBQWdCLENBQWhCLEVBQWlCO0FBQzVCLGFBQU8sQ0FBQyxDQUFDLElBQUYsQ0FBTyxFQUFQLENBQVA7QUFDRDtBQWJILEdBN2RXLEVBNGVYO0FBQUUsUUFBSSxFQUFFLE1BQVI7QUFBZ0IsV0FBTyxFQUFFLENBQUMsZUFBRDtBQUF6QixHQTVlVyxFQTZlWDtBQUNFLFFBQUksRUFBRSxlQURSO0FBRUUsV0FBTyxFQUFFLENBQ1A7QUFBRSxhQUFPLEVBQUU7QUFBWCxLQURPLEVBRVA7QUFBRSxhQUFPLEVBQUU7QUFBWCxLQUZPLEVBR1A7QUFBRSxhQUFPLEVBQUU7QUFBWCxLQUhPLEVBSVA7QUFBRSxhQUFPLEVBQUU7QUFBWCxLQUpPLEVBS1A7QUFBRSxhQUFPLEVBQUU7QUFBWCxLQUxPLEVBTVA7QUFBRSxhQUFPLEVBQUU7QUFBWCxLQU5PLENBRlg7QUFVRSxlQUFXLEVBQUUsU0FBUyxNQUFULENBQWdCLENBQWhCLEVBQWlCO0FBQzVCLGFBQU8sQ0FBQyxDQUFDLElBQUYsQ0FBTyxFQUFQLENBQVA7QUFDRDtBQVpILEdBN2VXLEVBMmZYO0FBQUUsUUFBSSxFQUFFLE1BQVI7QUFBZ0IsV0FBTyxFQUFFLENBQUMsZUFBRDtBQUF6QixHQTNmVyxFQTRmWDtBQUNFLFFBQUksRUFBRSxlQURSO0FBRUUsV0FBTyxFQUFFLENBQ1A7QUFBRSxhQUFPLEVBQUU7QUFBWCxLQURPLEVBRVA7QUFBRSxhQUFPLEVBQUU7QUFBWCxLQUZPLEVBR1A7QUFBRSxhQUFPLEVBQUU7QUFBWCxLQUhPLEVBSVA7QUFBRSxhQUFPLEVBQUU7QUFBWCxLQUpPLEVBS1A7QUFBRSxhQUFPLEVBQUU7QUFBWCxLQUxPLENBRlg7QUFTRSxlQUFXLEVBQUUsU0FBUyxNQUFULENBQWdCLENBQWhCLEVBQWlCO0FBQzVCLGFBQU8sQ0FBQyxDQUFDLElBQUYsQ0FBTyxFQUFQLENBQVA7QUFDRDtBQVhILEdBNWZXLEVBeWdCWDtBQUFFLFFBQUksRUFBRSxNQUFSO0FBQWdCLFdBQU8sRUFBRSxDQUFDLGVBQUQ7QUFBekIsR0F6Z0JXLEVBMGdCWDtBQUNFLFFBQUksRUFBRSxlQURSO0FBRUUsV0FBTyxFQUFFLENBQUM7QUFBRSxhQUFPLEVBQUU7QUFBWCxLQUFELEVBQW1CO0FBQUUsYUFBTyxFQUFFO0FBQVgsS0FBbkIsRUFBcUM7QUFBRSxhQUFPLEVBQUU7QUFBWCxLQUFyQyxDQUZYO0FBR0UsZUFBVyxFQUFFLFNBQVMsTUFBVCxDQUFnQixDQUFoQixFQUFpQjtBQUM1QixhQUFPLENBQUMsQ0FBQyxJQUFGLENBQU8sRUFBUCxDQUFQO0FBQ0Q7QUFMSCxHQTFnQlcsRUFpaEJYO0FBQUUsUUFBSSxFQUFFLE1BQVI7QUFBZ0IsV0FBTyxFQUFFLENBQUMsZUFBRDtBQUF6QixHQWpoQlcsRUFraEJYO0FBQUUsUUFBSSxFQUFFLE1BQVI7QUFBZ0IsV0FBTyxFQUFFLENBQUMsU0FBRCxDQUF6QjtBQUFzQyxlQUFXLEVBQUUsMkJBQUk7QUFBSSxpQkFBSSxDQUFKLENBQUksQ0FBSjtBQUFPO0FBQWxFLEdBbGhCVyxFQW1oQlg7QUFBRSxRQUFJLEVBQUUsUUFBUjtBQUFrQixXQUFPLEVBQUUsQ0FBQyxTQUFEO0FBQTNCLEdBbmhCVyxFQW9oQlg7QUFBRSxRQUFJLEVBQUUsUUFBUjtBQUFrQixXQUFPLEVBQUUsQ0FBQyxPQUFELENBQTNCO0FBQXNDLGVBQVcsRUFBRSwyQkFBSTtBQUFJLGlCQUFJLENBQUosQ0FBSSxDQUFKO0FBQU87QUFBbEUsR0FwaEJXLEVBcWhCWDtBQUNFLFFBQUksRUFBRSxPQURSO0FBRUUsV0FBTyxFQUFFLENBQUMsT0FBRCxDQUZYO0FBR0UsZUFBVyxFQUFFLDJCQUFJO0FBQUksYUFBQztBQUFFLFlBQUksRUFBRSxRQUFSO0FBQWtCLFlBQUksRUFBRSxJQUFJLENBQUMsQ0FBRCxDQUFKLENBQVEsQ0FBUixDQUF4QjtBQUFvQyxpQkFBUyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBRCxDQUFKLENBQWxELENBQWtEO0FBQWpELE9BQUQ7QUFBK0Q7QUFIdEYsR0FyaEJXLEVBMGhCWDtBQUFFLFFBQUksRUFBRSxnQkFBUjtBQUEwQixXQUFPLEVBQUUsQ0FBQztBQUFFLGFBQU8sRUFBRTtBQUFYLEtBQUQsQ0FBbkM7QUFBdUQsZUFBVyxFQUFFO0FBQXBFLEdBMWhCVyxFQTJoQlg7QUFDRSxRQUFJLEVBQUUsZ0JBRFI7QUFFRSxXQUFPLEVBQUUsRUFGWDtBQUdFLGVBQVcsRUFBRTtBQUNYLGFBQU8sSUFBUDtBQUNEO0FBTEgsR0EzaEJXLEVBa2lCWDtBQUNFLFFBQUksRUFBRSxTQURSO0FBRUUsV0FBTyxFQUFFLENBQUMsS0FBRCxFQUFRLGdCQUFSLENBRlg7QUFHRSxlQUFXLEVBQUUsMkJBQUk7QUFBSSxhQUFDO0FBQUUsWUFBSSxFQUFFLEtBQVI7QUFBZSxZQUFJLEVBQUUsSUFBSSxDQUFDLENBQUQsQ0FBSixDQUFRLENBQVIsQ0FBckI7QUFBaUMsaUJBQVMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFuRCxDQUFtRDtBQUFsRCxPQUFEO0FBQXlEO0FBSGhGLEdBbGlCVyxFQXVpQlg7QUFDRSxRQUFJLEVBQUUsT0FEUjtBQUVFLFdBQU8sRUFBRSxDQUFDLEtBQUQsRUFBUTtBQUFFLGFBQU8sRUFBRTtBQUFYLEtBQVIsQ0FGWDtBQUdFLGVBQVcsRUFBRSwyQkFBSTtBQUFJLGNBQUMsSUFBSSxDQUFDLEtBQUwsQ0FBVyxDQUFYLEVBQWMsQ0FBZCxFQUFpQixJQUFqQixDQUFzQixFQUF0QixDQUFELEVBQTRCLElBQUksQ0FBaEMsQ0FBZ0MsQ0FBaEM7QUFBb0M7QUFIM0QsR0F2aUJXLEVBNGlCWDtBQUFFLFFBQUksRUFBRSxjQUFSO0FBQXdCLFdBQU8sRUFBRSxDQUFDO0FBQUUsYUFBTyxFQUFFO0FBQVgsS0FBRCxDQUFqQztBQUFxRCxlQUFXLEVBQUU7QUFBbEUsR0E1aUJXLEVBNmlCWDtBQUNFLFFBQUksRUFBRSxjQURSO0FBRUUsV0FBTyxFQUFFLEVBRlg7QUFHRSxlQUFXLEVBQUU7QUFDWCxhQUFPLElBQVA7QUFDRDtBQUxILEdBN2lCVyxFQW9qQlg7QUFDRSxRQUFJLEVBQUUsT0FEUjtBQUVFLFdBQU8sRUFBRSxDQUFDLEtBQUQsRUFBUSxNQUFSLEVBQWdCLGNBQWhCLENBRlg7QUFHRSxlQUFXLEVBQUUsMkJBQUk7QUFBSSxjQUFDLElBQUksQ0FBQyxLQUFMLENBQVcsQ0FBWCxFQUFjLENBQWQsRUFBaUIsSUFBakIsQ0FBc0IsRUFBdEIsQ0FBRCxFQUE0QixJQUFJLENBQWhDLENBQWdDLENBQWhDO0FBQW9DO0FBSDNELEdBcGpCVyxFQXlqQlg7QUFBRSxRQUFJLEVBQUUsY0FBUjtBQUF3QixXQUFPLEVBQUUsQ0FBQztBQUFFLGFBQU8sRUFBRTtBQUFYLEtBQUQsQ0FBakM7QUFBcUQsZUFBVyxFQUFFO0FBQWxFLEdBempCVyxFQTBqQlg7QUFDRSxRQUFJLEVBQUUsY0FEUjtBQUVFLFdBQU8sRUFBRSxFQUZYO0FBR0UsZUFBVyxFQUFFO0FBQ1gsYUFBTyxJQUFQO0FBQ0Q7QUFMSCxHQTFqQlcsRUFpa0JYO0FBQ0UsUUFBSSxFQUFFLE9BRFI7QUFFRSxXQUFPLEVBQUUsQ0FBQyxLQUFELEVBQVEsS0FBUixFQUFlLGNBQWYsQ0FGWDtBQUdFLGVBQVcsRUFBRSwyQkFBSTtBQUFJLGNBQUMsSUFBSSxDQUFDLEtBQUwsQ0FBVyxDQUFYLEVBQWMsQ0FBZCxFQUFpQixJQUFqQixDQUFzQixFQUF0QixDQUFELEVBQTRCLElBQUksQ0FBaEMsQ0FBZ0MsQ0FBaEM7QUFBb0M7QUFIM0QsR0Fqa0JXLEVBc2tCWDtBQUFFLFFBQUksRUFBRSxjQUFSO0FBQXdCLFdBQU8sRUFBRSxDQUFDO0FBQUUsYUFBTyxFQUFFO0FBQVgsS0FBRCxDQUFqQztBQUFxRCxlQUFXLEVBQUU7QUFBbEUsR0F0a0JXLEVBdWtCWDtBQUNFLFFBQUksRUFBRSxjQURSO0FBRUUsV0FBTyxFQUFFLEVBRlg7QUFHRSxlQUFXLEVBQUU7QUFDWCxhQUFPLElBQVA7QUFDRDtBQUxILEdBdmtCVyxFQThrQlg7QUFDRSxRQUFJLEVBQUUsT0FEUjtBQUVFLFdBQU8sRUFBRSxDQUFDLEtBQUQsRUFBUSxNQUFSLEVBQWdCLEtBQWhCLEVBQXVCLGNBQXZCLENBRlg7QUFHRSxlQUFXLEVBQUUsMkJBQUk7QUFBSSxjQUFDLElBQUksQ0FBQyxLQUFMLENBQVcsQ0FBWCxFQUFjLENBQWQsRUFBaUIsSUFBakIsQ0FBc0IsRUFBdEIsQ0FBRCxFQUE0QixJQUFJLENBQWhDLENBQWdDLENBQWhDO0FBQW9DO0FBSDNELEdBOWtCVyxFQW1sQlg7QUFBRSxRQUFJLEVBQUUsYUFBUjtBQUF1QixXQUFPLEVBQUU7QUFBaEMsR0FubEJXLEVBb2xCWDtBQUNFLFFBQUksRUFBRSxhQURSO0FBRUUsV0FBTyxFQUFFLENBQUMsYUFBRCxFQUFnQixPQUFoQixDQUZYO0FBR0UsZUFBVyxFQUFFLFNBQVMsT0FBVCxDQUFpQixDQUFqQixFQUFrQjtBQUM3QixhQUFPLENBQUMsQ0FBQyxDQUFELENBQUQsQ0FBSyxNQUFMLENBQVksQ0FBQyxDQUFDLENBQUMsQ0FBRCxDQUFGLENBQVosQ0FBUDtBQUNEO0FBTEgsR0FwbEJXLEVBMmxCWDtBQUNFLFFBQUksRUFBRSxNQURSO0FBRUUsV0FBTyxFQUFFLENBQUM7QUFBRSxhQUFPLEVBQUU7QUFBWCxLQUFELEVBQW1CLGFBQW5CLENBRlg7QUFHRSxlQUFXLEVBQUUsMkJBQUk7QUFBSSxpQkFBSSxDQUFDLENBQUQsQ0FBSixHQUFVLElBQUksQ0FBQyxDQUFELENBQUosQ0FBUSxJQUFSLENBQVYsRUFBVSxDQUFWO0FBQTBCO0FBSGpELEdBM2xCVyxFQWdtQlg7QUFBRSxRQUFJLEVBQUUsS0FBUjtBQUFlLFdBQU8sRUFBRSxDQUFDLElBQUQsRUFBTyxRQUFQLENBQXhCO0FBQTBDLGVBQVcsRUFBRSwyQkFBSTtBQUFJLGlCQUFJLENBQUMsSUFBTDtBQUFhO0FBQTVFLEdBaG1CVyxFQWltQlg7QUFBRSxRQUFJLEVBQUUsb0JBQVI7QUFBOEIsV0FBTyxFQUFFLENBQUM7QUFBRSxhQUFPLEVBQUU7QUFBWCxLQUFEO0FBQXZDLEdBam1CVyxFQWttQlg7QUFBRSxRQUFJLEVBQUUsb0JBQVI7QUFBOEIsV0FBTyxFQUFFLENBQUM7QUFBRSxhQUFPLEVBQUU7QUFBWCxLQUFEO0FBQXZDLEdBbG1CVyxFQW1tQlg7QUFBRSxRQUFJLEVBQUUsMkJBQVI7QUFBcUMsV0FBTyxFQUFFLENBQUM7QUFBRSxhQUFPLEVBQUU7QUFBWCxLQUFEO0FBQTlDLEdBbm1CVyxFQW9tQlg7QUFBRSxRQUFJLEVBQUUsMkJBQVI7QUFBcUMsV0FBTyxFQUFFLENBQUM7QUFBRSxhQUFPLEVBQUU7QUFBWCxLQUFEO0FBQTlDLEdBcG1CVyxFQXFtQlg7QUFBRSxRQUFJLEVBQUUsV0FBUjtBQUFxQixXQUFPLEVBQUUsQ0FBQywyQkFBRCxDQUE5QjtBQUE2RCxlQUFXLEVBQUU7QUFBMUUsR0FybUJXLEVBc21CWDtBQUNFLFFBQUksRUFBRSxXQURSO0FBRUUsV0FBTyxFQUFFLEVBRlg7QUFHRSxlQUFXLEVBQUU7QUFDWCxhQUFPLElBQVA7QUFDRDtBQUxILEdBdG1CVyxFQTZtQlg7QUFDRSxRQUFJLEVBQUUsSUFEUjtBQUVFLFdBQU8sRUFBRSxDQUFDLG9CQUFELEVBQXVCLFdBQXZCLENBRlg7QUFHRSxlQUFXLEVBQUUsMkJBQUk7QUFBSSxvQkFBTyxJQUFJLENBQUMsQ0FBRCxDQUFKLElBQVA7QUFBc0I7QUFIN0MsR0E3bUJXLEVBa25CWDtBQUFFLFFBQUksRUFBRSxLQUFSO0FBQWUsV0FBTyxFQUFFLENBQUMsZUFBRDtBQUF4QixHQWxuQlcsRUFtbkJYO0FBQ0UsUUFBSSxFQUFFLEtBRFI7QUFFRSxXQUFPLEVBQUUsQ0FBQztBQUFFLGFBQU8sRUFBRTtBQUFYLEtBQUQsRUFBbUIsZUFBbkIsQ0FGWDtBQUdFLGVBQVcsRUFBRSwyQkFBSTtBQUFJLGlCQUFJLENBQUMsSUFBTDtBQUFhO0FBSHBDLEdBbm5CVyxFQXduQlg7QUFDRSxRQUFJLEVBQUUsS0FEUjtBQUVFLFdBQU8sRUFBRSxDQUFDO0FBQUUsYUFBTyxFQUFFO0FBQVgsS0FBRCxFQUFtQixlQUFuQixDQUZYO0FBR0UsZUFBVyxFQUFFLDJCQUFJO0FBQUksaUJBQUksQ0FBQyxJQUFMO0FBQWE7QUFIcEMsR0F4bkJXLEVBNm5CWDtBQUFFLFFBQUksRUFBRSxlQUFSO0FBQXlCLFdBQU8sRUFBRSxDQUFDO0FBQUUsYUFBTyxFQUFFO0FBQVgsS0FBRCxDQUFsQztBQUFzRCxlQUFXLEVBQUUsMkJBQUk7QUFBSSxpQkFBSSxDQUFDLElBQUw7QUFBYTtBQUF4RixHQTduQlcsRUE4bkJYO0FBQUUsUUFBSSxFQUFFLHNCQUFSO0FBQWdDLFdBQU8sRUFBRTtBQUF6QyxHQTluQlcsRUErbkJYO0FBQ0UsUUFBSSxFQUFFLHNCQURSO0FBRUUsV0FBTyxFQUFFLENBQUMsc0JBQUQsRUFBeUIsT0FBekIsQ0FGWDtBQUdFLGVBQVcsRUFBRSxTQUFTLE9BQVQsQ0FBaUIsQ0FBakIsRUFBa0I7QUFDN0IsYUFBTyxDQUFDLENBQUMsQ0FBRCxDQUFELENBQUssTUFBTCxDQUFZLENBQUMsQ0FBQyxDQUFDLENBQUQsQ0FBRixDQUFaLENBQVA7QUFDRDtBQUxILEdBL25CVyxFQXNvQlg7QUFDRSxRQUFJLEVBQUUsZUFEUjtBQUVFLFdBQU8sRUFBRSxDQUFDLFdBQUQsRUFBYyxzQkFBZCxDQUZYO0FBR0UsZUFBVyxFQUFFLDJCQUFJO0FBQUksaUJBQUksQ0FBQyxDQUFELENBQUosR0FBVSxJQUFJLENBQUMsQ0FBRCxDQUFKLENBQVEsSUFBUixDQUFWLEVBQVUsQ0FBVjtBQUEwQjtBQUhqRCxHQXRvQlcsRUEyb0JYO0FBQUUsUUFBSSxFQUFFLFdBQVI7QUFBcUIsV0FBTyxFQUFFLENBQUMsT0FBRCxDQUE5QjtBQUF5QyxlQUFXLEVBQUUsMkJBQUk7QUFBSSxpQkFBSSxDQUFDLElBQUw7QUFBYTtBQUEzRSxHQTNvQlcsRUE0b0JYO0FBQ0UsUUFBSSxFQUFFLFNBRFI7QUFFRSxXQUFPLEVBQUUsQ0FBQyxRQUFELEVBQVcsVUFBWCxDQUZYO0FBR0UsZUFBVyxFQUFFLDJCQUFJO0FBQUksY0FBQyxDQUFDLElBQUksQ0FBQyxDQUFELENBQUosQ0FBUSxDQUFSLENBQUQsRUFBYSxJQUFJLENBQUMsQ0FBRCxDQUFKLENBQVEsQ0FBUixDQUFiLENBQUQsRUFBMkIsTUFBM0IsQ0FBa0MsSUFBSSxDQUFDLENBQUQsQ0FBSixDQUFRLEtBQVIsQ0FBbEMsQ0FBa0MsQ0FBbEM7QUFBbUQ7QUFIMUUsR0E1b0JXLEVBaXBCWDtBQUFFLFFBQUksRUFBRSx3QkFBUjtBQUFrQyxXQUFPLEVBQUUsQ0FBQyxhQUFEO0FBQTNDLEdBanBCVyxFQWtwQlg7QUFBRSxRQUFJLEVBQUUsd0JBQVI7QUFBa0MsV0FBTyxFQUFFLENBQUMsZUFBRDtBQUEzQyxHQWxwQlcsRUFtcEJYO0FBQUUsUUFBSSxFQUFFLFFBQVI7QUFBa0IsV0FBTyxFQUFFLENBQUMsd0JBQUQsQ0FBM0I7QUFBdUQsZUFBVyxFQUFFLDJCQUFJO0FBQUksaUJBQUksQ0FBSixDQUFJLENBQUo7QUFBTztBQUFuRixHQW5wQlcsRUFvcEJYO0FBQUUsUUFBSSxFQUFFLDBCQUFSO0FBQW9DLFdBQU8sRUFBRSxDQUFDLGVBQUQ7QUFBN0MsR0FwcEJXLEVBcXBCWDtBQUFFLFFBQUksRUFBRSwwQkFBUjtBQUFvQyxXQUFPLEVBQUUsQ0FBQyxpQkFBRDtBQUE3QyxHQXJwQlcsRUFzcEJYO0FBQUUsUUFBSSxFQUFFLFVBQVI7QUFBb0IsV0FBTyxFQUFFLENBQUMsMEJBQUQsQ0FBN0I7QUFBMkQsZUFBVyxFQUFFLDJCQUFJO0FBQUksaUJBQUksQ0FBQyxDQUFELENBQUo7QUFBVTtBQUExRixHQXRwQlcsRUF1cEJYO0FBQUUsUUFBSSxFQUFFLG9CQUFSO0FBQThCLFdBQU8sRUFBRTtBQUF2QyxHQXZwQlcsRUF3cEJYO0FBQUUsUUFBSSxFQUFFLG9DQUFSO0FBQThDLFdBQU8sRUFBRSxDQUFDLFNBQUQsRUFBWSxHQUFaO0FBQXZELEdBeHBCVyxFQXlwQlg7QUFDRSxRQUFJLEVBQUUsb0JBRFI7QUFFRSxXQUFPLEVBQUUsQ0FBQyxvQkFBRCxFQUF1QixvQ0FBdkIsQ0FGWDtBQUdFLGVBQVcsRUFBRSxTQUFTLE9BQVQsQ0FBaUIsQ0FBakIsRUFBa0I7QUFDN0IsYUFBTyxDQUFDLENBQUMsQ0FBRCxDQUFELENBQUssTUFBTCxDQUFZLENBQUMsQ0FBQyxDQUFDLENBQUQsQ0FBRixDQUFaLENBQVA7QUFDRDtBQUxILEdBenBCVyxFQWdxQlg7QUFDRSxRQUFJLEVBQUUsYUFEUjtBQUVFLFdBQU8sRUFBRSxDQUFDLG9CQUFELEVBQXVCLGlCQUF2QixFQUEwQyxHQUExQyxDQUZYO0FBR0UsZUFBVyxFQUFFLDJCQUFJO0FBQUksaUJBQUksQ0FBSixDQUFJLENBQUo7QUFBTztBQUg5QixHQWhxQlcsRUFxcUJYO0FBQUUsUUFBSSxFQUFFLHNCQUFSO0FBQWdDLFdBQU8sRUFBRTtBQUF6QyxHQXJxQlcsRUFzcUJYO0FBQUUsUUFBSSxFQUFFLDZDQUFSO0FBQXVELFdBQU8sRUFBRSxDQUFDLEdBQUQsQ0FBaEU7QUFBdUUsZUFBVyxFQUFFO0FBQXBGLEdBdHFCVyxFQXVxQlg7QUFDRSxRQUFJLEVBQUUsNkNBRFI7QUFFRSxXQUFPLEVBQUUsRUFGWDtBQUdFLGVBQVcsRUFBRTtBQUNYLGFBQU8sSUFBUDtBQUNEO0FBTEgsR0F2cUJXLEVBOHFCWDtBQUNFLFFBQUksRUFBRSxzQ0FEUjtBQUVFLFdBQU8sRUFBRSxDQUFDLFNBQUQsRUFBWSw2Q0FBWjtBQUZYLEdBOXFCVyxFQWtyQlg7QUFDRSxRQUFJLEVBQUUsc0JBRFI7QUFFRSxXQUFPLEVBQUUsQ0FBQyxzQkFBRCxFQUF5QixzQ0FBekIsQ0FGWDtBQUdFLGVBQVcsRUFBRSxTQUFTLE9BQVQsQ0FBaUIsQ0FBakIsRUFBa0I7QUFDN0IsYUFBTyxDQUFDLENBQUMsQ0FBRCxDQUFELENBQUssTUFBTCxDQUFZLENBQUMsQ0FBQyxDQUFDLENBQUQsQ0FBRixDQUFaLENBQVA7QUFDRDtBQUxILEdBbHJCVyxFQXlyQlg7QUFBRSxRQUFJLEVBQUUsc0JBQVI7QUFBZ0MsV0FBTyxFQUFFLENBQUMsR0FBRCxDQUF6QztBQUFnRCxlQUFXLEVBQUU7QUFBN0QsR0F6ckJXLEVBMHJCWDtBQUNFLFFBQUksRUFBRSxzQkFEUjtBQUVFLFdBQU8sRUFBRSxFQUZYO0FBR0UsZUFBVyxFQUFFO0FBQ1gsYUFBTyxJQUFQO0FBQ0Q7QUFMSCxHQTFyQlcsRUFpc0JYO0FBQ0UsUUFBSSxFQUFFLGVBRFI7QUFFRSxXQUFPLEVBQUUsQ0FBQyxzQkFBRCxFQUF5QixtQkFBekIsRUFBOEMsc0JBQTlDLENBRlg7QUFHRSxlQUFXLEVBQUUsMkJBQUk7QUFBSSxpQkFBSSxDQUFKLENBQUksQ0FBSjtBQUFPO0FBSDlCLEdBanNCVyxFQXNzQlg7QUFBRSxRQUFJLEVBQUUsc0JBQVI7QUFBZ0MsV0FBTyxFQUFFO0FBQXpDLEdBdHNCVyxFQXVzQlg7QUFBRSxRQUFJLEVBQUUsc0NBQVI7QUFBZ0QsV0FBTyxFQUFFLENBQUMsU0FBRCxFQUFZLEdBQVo7QUFBekQsR0F2c0JXLEVBd3NCWDtBQUNFLFFBQUksRUFBRSxzQkFEUjtBQUVFLFdBQU8sRUFBRSxDQUFDLHNCQUFELEVBQXlCLHNDQUF6QixDQUZYO0FBR0UsZUFBVyxFQUFFLFNBQVMsT0FBVCxDQUFpQixDQUFqQixFQUFrQjtBQUM3QixhQUFPLENBQUMsQ0FBQyxDQUFELENBQUQsQ0FBSyxNQUFMLENBQVksQ0FBQyxDQUFDLENBQUMsQ0FBRCxDQUFGLENBQVosQ0FBUDtBQUNEO0FBTEgsR0F4c0JXLEVBK3NCWDtBQUFFLFFBQUksRUFBRSxzQ0FBUjtBQUFnRCxXQUFPLEVBQUUsQ0FBQyxHQUFELEVBQU0sU0FBTjtBQUF6RCxHQS9zQlcsRUFndEJYO0FBQ0UsUUFBSSxFQUFFLHNCQURSO0FBRUUsV0FBTyxFQUFFLENBQUMsc0NBQUQsQ0FGWDtBQUdFLGVBQVcsRUFBRTtBQUhmLEdBaHRCVyxFQXF0Qlg7QUFDRSxRQUFJLEVBQUUsc0JBRFI7QUFFRSxXQUFPLEVBQUUsRUFGWDtBQUdFLGVBQVcsRUFBRTtBQUNYLGFBQU8sSUFBUDtBQUNEO0FBTEgsR0FydEJXLEVBNHRCWDtBQUNFLFFBQUksRUFBRSxlQURSO0FBRUUsV0FBTyxFQUFFLENBQUMsc0JBQUQsRUFBeUIsaUJBQXpCLEVBQTRDLHNCQUE1QyxDQUZYO0FBR0UsZUFBVyxFQUFFLDJCQUFJO0FBQUksY0FBQyxJQUFJLENBQUMsQ0FBRCxDQUFMLEVBQVUsTUFBVixDQUFpQixJQUFJLENBQUMsQ0FBRCxDQUFKLEdBQVUsSUFBSSxDQUFDLENBQUQsQ0FBSixDQUFRLENBQVIsQ0FBVixHQUFqQjtBQUEyQztBQUhsRSxHQTV0QlcsRUFpdUJYO0FBQUUsUUFBSSxFQUFFLHdCQUFSO0FBQWtDLFdBQU8sRUFBRTtBQUEzQyxHQWp1QlcsRUFrdUJYO0FBQUUsUUFBSSxFQUFFLCtDQUFSO0FBQXlELFdBQU8sRUFBRSxDQUFDLEdBQUQsQ0FBbEU7QUFBeUUsZUFBVyxFQUFFO0FBQXRGLEdBbHVCVyxFQW11Qlg7QUFDRSxRQUFJLEVBQUUsK0NBRFI7QUFFRSxXQUFPLEVBQUUsRUFGWDtBQUdFLGVBQVcsRUFBRTtBQUNYLGFBQU8sSUFBUDtBQUNEO0FBTEgsR0FudUJXLEVBMHVCWDtBQUNFLFFBQUksRUFBRSx3Q0FEUjtBQUVFLFdBQU8sRUFBRSxDQUFDLFNBQUQsRUFBWSwrQ0FBWjtBQUZYLEdBMXVCVyxFQTh1Qlg7QUFDRSxRQUFJLEVBQUUsd0JBRFI7QUFFRSxXQUFPLEVBQUUsQ0FBQyx3QkFBRCxFQUEyQix3Q0FBM0IsQ0FGWDtBQUdFLGVBQVcsRUFBRSxTQUFTLE9BQVQsQ0FBaUIsQ0FBakIsRUFBa0I7QUFDN0IsYUFBTyxDQUFDLENBQUMsQ0FBRCxDQUFELENBQUssTUFBTCxDQUFZLENBQUMsQ0FBQyxDQUFDLENBQUQsQ0FBRixDQUFaLENBQVA7QUFDRDtBQUxILEdBOXVCVyxFQXF2Qlg7QUFBRSxRQUFJLEVBQUUsK0NBQVI7QUFBeUQsV0FBTyxFQUFFLENBQUMsR0FBRCxDQUFsRTtBQUF5RSxlQUFXLEVBQUU7QUFBdEYsR0FydkJXLEVBc3ZCWDtBQUNFLFFBQUksRUFBRSwrQ0FEUjtBQUVFLFdBQU8sRUFBRSxFQUZYO0FBR0UsZUFBVyxFQUFFO0FBQ1gsYUFBTyxJQUFQO0FBQ0Q7QUFMSCxHQXR2QlcsRUE2dkJYO0FBQ0UsUUFBSSxFQUFFLHdDQURSO0FBRUUsV0FBTyxFQUFFLENBQUMsK0NBQUQsRUFBa0QsU0FBbEQ7QUFGWCxHQTd2QlcsRUFpd0JYO0FBQ0UsUUFBSSxFQUFFLHdCQURSO0FBRUUsV0FBTyxFQUFFLENBQUMsd0NBQUQsQ0FGWDtBQUdFLGVBQVcsRUFBRTtBQUhmLEdBandCVyxFQXN3Qlg7QUFDRSxRQUFJLEVBQUUsd0JBRFI7QUFFRSxXQUFPLEVBQUUsRUFGWDtBQUdFLGVBQVcsRUFBRTtBQUNYLGFBQU8sSUFBUDtBQUNEO0FBTEgsR0F0d0JXLEVBNndCWDtBQUNFLFFBQUksRUFBRSxpQkFEUjtBQUVFLFdBQU8sRUFBRSxDQUFDLHdCQUFELEVBQTJCLG1CQUEzQixFQUFnRCx3QkFBaEQsQ0FGWDtBQUdFLGVBQVcsRUFBRSwyQkFBSTtBQUFJLGNBQUMsSUFBSSxDQUFDLENBQUQsQ0FBTCxFQUFVLE1BQVYsQ0FBaUIsSUFBSSxDQUFDLENBQUQsQ0FBSixHQUFVLElBQUksQ0FBQyxDQUFELENBQUosQ0FBUSxDQUFSLENBQVYsR0FBakI7QUFBMkM7QUFIbEUsR0E3d0JXLEVBa3hCWDtBQUFFLFFBQUksRUFBRSxtQ0FBUjtBQUE2QyxXQUFPLEVBQUUsQ0FBQyxRQUFEO0FBQXRELEdBbHhCVyxFQW14Qlg7QUFBRSxRQUFJLEVBQUUsbUNBQVI7QUFBNkMsV0FBTyxFQUFFLENBQUMsTUFBRDtBQUF0RCxHQW54QlcsRUFveEJYO0FBQUUsUUFBSSxFQUFFLG1DQUFSO0FBQTZDLFdBQU8sRUFBRSxDQUFDLFFBQUQ7QUFBdEQsR0FweEJXLEVBcXhCWDtBQUFFLFFBQUksRUFBRSxtQ0FBUjtBQUE2QyxXQUFPLEVBQUUsQ0FBQyxLQUFEO0FBQXRELEdBcnhCVyxFQXN4Qlg7QUFBRSxRQUFJLEVBQUUsbUNBQVI7QUFBNkMsV0FBTyxFQUFFLENBQUMsS0FBRDtBQUF0RCxHQXR4QlcsRUF1eEJYO0FBQ0UsUUFBSSxFQUFFLG1CQURSO0FBRUUsV0FBTyxFQUFFLENBQUMsbUNBQUQsQ0FGWDtBQUdFLGVBQVcsRUFBRSwyQkFBSTtBQUFJLGlCQUFJLENBQUMsQ0FBRCxDQUFKO0FBQVU7QUFIakMsR0F2eEJXLEVBNHhCWDtBQUFFLFFBQUksRUFBRSxpQ0FBUjtBQUEyQyxXQUFPLEVBQUUsQ0FBQyxRQUFEO0FBQXBELEdBNXhCVyxFQTZ4Qlg7QUFBRSxRQUFJLEVBQUUsaUNBQVI7QUFBMkMsV0FBTyxFQUFFLENBQUMsV0FBRDtBQUFwRCxHQTd4QlcsRUE4eEJYO0FBQUUsUUFBSSxFQUFFLGlDQUFSO0FBQTJDLFdBQU8sRUFBRSxDQUFDLFVBQUQ7QUFBcEQsR0E5eEJXLEVBK3hCWDtBQUFFLFFBQUksRUFBRSxpQ0FBUjtBQUEyQyxXQUFPLEVBQUUsQ0FBQyxRQUFEO0FBQXBELEdBL3hCVyxFQWd5Qlg7QUFBRSxRQUFJLEVBQUUsaUNBQVI7QUFBMkMsV0FBTyxFQUFFLENBQUMsU0FBRDtBQUFwRCxHQWh5QlcsRUFpeUJYO0FBQUUsUUFBSSxFQUFFLGlDQUFSO0FBQTJDLFdBQU8sRUFBRSxDQUFDLEtBQUQ7QUFBcEQsR0FqeUJXLEVBa3lCWDtBQUNFLFFBQUksRUFBRSxpQkFEUjtBQUVFLFdBQU8sRUFBRSxDQUFDLGlDQUFELENBRlg7QUFHRSxlQUFXLEVBQUUsMkJBQUk7QUFBSSxnQkFBRyxNQUFILENBQVMsS0FBVCxLQUFhLENBQUMsSUFBSSxDQUFDLENBQUQsQ0FBSixDQUFRLENBQVIsQ0FBRCxDQUFiO0FBQTZCO0FBSHBELEdBbHlCVyxFQXV5Qlg7QUFBRSxRQUFJLEVBQUUsVUFBUjtBQUFvQixXQUFPLEVBQUUsQ0FBQyxhQUFELENBQTdCO0FBQThDLGVBQVcsRUFBRSwyQkFBSTtBQUFJLGlCQUFJLENBQUosQ0FBSSxDQUFKO0FBQU87QUFBMUUsR0F2eUJXLEVBd3lCWDtBQUNFLFFBQUksRUFBRSxTQURSO0FBRUUsV0FBTyxFQUFFLENBQUM7QUFBRSxhQUFPLEVBQUU7QUFBWCxLQUFELEVBQW1CLFVBQW5CLEVBQStCLFVBQS9CLEVBQTJDLFVBQTNDLEVBQXVELFVBQXZELENBRlg7QUFHRSxlQUFXLEVBQUUsMkJBQUk7QUFBSSxtQkFBTSxDQUFDLFlBQVAsQ0FBb0IsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFMLENBQVcsQ0FBWCxFQUFjLElBQWQsQ0FBbUIsRUFBbkIsQ0FBRCxFQUE1QixFQUE0QixDQUE1QjtBQUF5RDtBQUhoRixHQXh5QlcsRUE2eUJYO0FBQUUsUUFBSSxFQUFFLEdBQVI7QUFBYSxXQUFPLEVBQUUsQ0FBQyxPQUFELENBQXRCO0FBQWlDLGVBQVcsRUFBRSwyQkFBSTtBQUFJLGlCQUFJLENBQUosQ0FBSSxDQUFKO0FBQU87QUFBN0QsR0E3eUJXLEVBOHlCWDtBQUFFLFFBQUksRUFBRSxjQUFSO0FBQXdCLFdBQU8sRUFBRSxDQUFDLFNBQUQ7QUFBakMsR0E5eUJXLEVBK3lCWDtBQUNFLFFBQUksRUFBRSxjQURSO0FBRUUsV0FBTyxFQUFFLENBQUMsY0FBRCxFQUFpQixTQUFqQixDQUZYO0FBR0UsZUFBVyxFQUFFLFNBQVMsT0FBVCxDQUFpQixDQUFqQixFQUFrQjtBQUM3QixhQUFPLENBQUMsQ0FBQyxDQUFELENBQUQsQ0FBSyxNQUFMLENBQVksQ0FBQyxDQUFDLENBQUMsQ0FBRCxDQUFGLENBQVosQ0FBUDtBQUNEO0FBTEgsR0EveUJXLEVBc3pCWDtBQUFFLFFBQUksRUFBRSxPQUFSO0FBQWlCLFdBQU8sRUFBRSxDQUFDLGNBQUQsQ0FBMUI7QUFBNEMsZUFBVyxFQUFFLDJCQUFJO0FBQUksaUJBQUksQ0FBQyxDQUFELENBQUosQ0FBUSxJQUFSO0FBQWdCO0FBQWpGLEdBdHpCVyxFQXV6Qlg7QUFBRSxRQUFJLEVBQUUsZUFBUjtBQUF5QixXQUFPLEVBQUUsQ0FBQyxPQUFEO0FBQWxDLEdBdnpCVyxFQXd6Qlg7QUFDRSxRQUFJLEVBQUUsZUFEUjtBQUVFLFdBQU8sRUFBRSxDQUFDLGVBQUQsRUFBa0IsT0FBbEIsQ0FGWDtBQUdFLGVBQVcsRUFBRSxTQUFTLE9BQVQsQ0FBaUIsQ0FBakIsRUFBa0I7QUFDN0IsYUFBTyxDQUFDLENBQUMsQ0FBRCxDQUFELENBQUssTUFBTCxDQUFZLENBQUMsQ0FBQyxDQUFDLENBQUQsQ0FBRixDQUFaLENBQVA7QUFDRDtBQUxILEdBeHpCVyxFQSt6Qlg7QUFBRSxRQUFJLEVBQUUsUUFBUjtBQUFrQixXQUFPLEVBQUUsQ0FBQyxlQUFELENBQTNCO0FBQThDLGVBQVcsRUFBRSwyQkFBSTtBQUFJLGlCQUFJLENBQUMsQ0FBRCxDQUFKLENBQVEsSUFBUjtBQUFnQjtBQUFuRixHQS96QlcsRUFnMEJYO0FBQUUsUUFBSSxFQUFFLE9BQVI7QUFBaUIsV0FBTyxFQUFFLENBQUMsT0FBRCxDQUExQjtBQUFxQyxlQUFXLEVBQUUsMkJBQUk7QUFBSSxpQkFBSSxDQUFKLENBQUksQ0FBSjtBQUFPO0FBQWpFLEdBaDBCVyxFQWkwQlg7QUFBRSxRQUFJLEVBQUUsUUFBUjtBQUFrQixXQUFPLEVBQUUsQ0FBQyxVQUFELENBQTNCO0FBQXlDLGVBQVcsRUFBRSwyQkFBSTtBQUFJLGlCQUFJLENBQUosQ0FBSSxDQUFKO0FBQU87QUFBckUsR0FqMEJXLENBRkM7QUFxMEJkLGFBQVcsRUFBRTtBQXIwQkMsQ0FBaEIsQyxDQXcwQkE7O0FBQ0E7O0FBQ0E7O0FBRUEsU0FBZ0IsS0FBaEIsQ0FBc0IsTUFBdEIsRUFBb0M7QUFDbEMsTUFBTSxNQUFNLEdBQUcsSUFBSSxnQkFBSixDQUFXLGtCQUFRLFlBQVIsQ0FBcUIsT0FBckIsQ0FBWCxDQUFmO0FBQ0EsTUFBTSxHQUFHLEdBQUcsMEJBQVcsTUFBWCxDQUFaO0FBQ0EsTUFBSSxDQUFDLEdBQUwsRUFBVSxPQUFPLElBQVA7O0FBQ1YsTUFBSTtBQUNGLFdBQU8sTUFBTSxDQUFDLElBQVAsQ0FBWSwwQkFBVyxNQUFYLENBQVosRUFBZ0MsT0FBaEMsQ0FBd0MsQ0FBeEMsQ0FBUDtBQUNELEdBRkQsQ0FFRSxXQUFNO0FBQ04sV0FBTyxLQUFQO0FBQ0Q7QUFDRjs7QUFURCxzQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2oxQkE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRWEsY0FBTTtBQUNqQixPQUFLLEVBQUUsZUFBQyxHQUFELEVBQVk7QUFBSyx1Q0FBZSxnQkFBZixHQUFlLENBQWY7QUFBMEIsR0FEakM7QUFFakIsV0FBUyxFQUFFLG1CQUFDLEdBQUQsRUFBWTtBQUFLLDRDQUFZLGdCQUFaLEdBQVksQ0FBWjtBQUF1QixHQUZsQztBQUdqQixXQUFTLHVCQUhRO0FBSWpCLE9BQUs7QUFKWSxDQUFOLEM7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ05iOztBQUNBOztBQUNBOztBQUNBOztBQUVBLFNBQWdCLGFBQWhCLENBQThCLE1BQTlCLEVBQXFEO0FBQ25ELE1BQUksQ0FBQyxhQUFRLE1BQVIsQ0FBTCxFQUFzQjtBQUNwQixVQUFNLG9CQUFOO0FBQ0Q7O0FBQ0QsU0FBTyxNQUFNLENBQUMsTUFBUCxDQUFjLGFBQUM7QUFBSSxZQUFDLElBQUksQ0FBQyxDQUFDLElBQUYsS0FBTDtBQUF5QixHQUE1QyxFQUE4QyxHQUE5QyxDQUFrRCxZQUFsRCxDQUFQO0FBQ0Q7O0FBTEQ7O0FBT0EsU0FBUyxZQUFULENBQXNCLEtBQXRCLEVBQWdDO0FBQ3RCO0FBQUEsTUFBTSxpQkFBTjtBQUFBLE1BQVksZUFBWjs7QUFDUixVQUFRLElBQVI7QUFDRSxTQUFLLFFBQUw7QUFDRSxhQUFPLFVBQVUsQ0FBQyxJQUFELENBQWpCOztBQUNGLFNBQUssS0FBTDtBQUNFLGFBQU8sUUFBUSxDQUFDLElBQUQsQ0FBZjs7QUFDRixTQUFLLFFBQUw7QUFDRSxhQUFPLHNCQUFZLElBQVosQ0FBUDs7QUFDRixTQUFLLE1BQUw7QUFDRSxhQUFPLElBQVA7O0FBQ0YsU0FBSyxTQUFMO0FBQ0UsYUFBTyxnQkFBUSxJQUFSLENBQVA7O0FBQ0YsU0FBSyxRQUFMO0FBQ0UsYUFBTyxlQUFPLElBQVAsQ0FBUDs7QUFDRixTQUFLLFNBQUw7QUFDQSxTQUFLLE1BQUw7QUFDRSxhQUFPLElBQUksS0FBSyxNQUFULElBQW1CLElBQUksS0FBSyxJQUFuQzs7QUFDRixTQUFLLEtBQUw7QUFDRSxhQUFPLFVBQVUsQ0FBQyxHQUFELEVBQU0sSUFBTixDQUFqQjs7QUFDRixTQUFLLE1BQUw7QUFDQSxTQUFLLFFBQUw7QUFDRSxhQUFPLGFBQWEsQ0FBQyxJQUFELENBQXBCOztBQUNGLFNBQUssS0FBTDtBQUNFLGFBQU8sWUFBSSxhQUFhLENBQUMsSUFBRCxDQUFqQixDQUFQOztBQUNGLFNBQUssS0FBTDtBQUNFLGFBQU8sWUFBSSxpQkFBUSxhQUFSLEVBQXVCLElBQXZCLENBQUosQ0FBUDtBQXhCSjs7QUEwQkEsU0FBTyxJQUFQO0FBQ0Q7O0FBRUQsU0FBUyxVQUFULENBQW9CLE9BQXBCLEVBQXFDLElBQXJDLEVBQThDO0FBQzVDLFNBQU8sWUFBSSxPQUFKLEVBQWEsWUFBWSxDQUFDLElBQUQsQ0FBekIsQ0FBUDtBQUNELEM7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzdDRDs7QUFDQTs7QUFDQTs7QUFFQSxTQUFnQixhQUFoQixDQUE4QixNQUE5QixFQUFxRDtBQUNuRCxNQUFJLENBQUMsYUFBUSxNQUFSLENBQUwsRUFBc0I7QUFDcEIsVUFBTSxvQkFBTjtBQUNEOztBQUNELFNBQU8sTUFBTSxDQUFDLE1BQVAsQ0FBYyxhQUFDO0FBQUksWUFBQyxJQUFJLENBQUMsQ0FBQyxJQUFGLEtBQUw7QUFBeUIsR0FBNUMsRUFBOEMsR0FBOUMsQ0FBa0QsWUFBbEQsQ0FBUDtBQUNEOztBQUxEOztBQU9BLFNBQVMsWUFBVCxDQUFzQixLQUF0QixFQUFnQztBQUN0QjtBQUFBLE1BQU0saUJBQU47QUFBQSxNQUFZLGVBQVo7O0FBQ1IsVUFBUSxJQUFSO0FBQ0UsU0FBSyxRQUFMO0FBQ0UsYUFBTyxVQUFVLENBQUMsSUFBRCxDQUFqQjs7QUFDRixTQUFLLEtBQUw7QUFDRSxhQUFPLFFBQVEsQ0FBQyxJQUFELENBQWY7O0FBQ0YsU0FBSyxRQUFMO0FBQ0UsYUFBTyxzQkFBWSxJQUFaLENBQVA7O0FBQ0YsU0FBSyxNQUFMO0FBQ0UsYUFBTyxJQUFQOztBQUNGLFNBQUssU0FBTDtBQUNFLGFBQU8sSUFBUDs7QUFDRixTQUFLLFFBQUw7QUFDRSxhQUFPLElBQVA7O0FBQ0YsU0FBSyxTQUFMO0FBQ0EsU0FBSyxNQUFMO0FBQ0UsYUFBTyxJQUFJLEtBQUssTUFBVCxJQUFtQixJQUFJLEtBQUssSUFBbkM7O0FBQ0YsU0FBSyxLQUFMO0FBQ0UsYUFBTztBQUFFLFdBQUcsS0FBTDtBQUFPLGFBQUssRUFBRSxZQUFZLENBQUMsSUFBRDtBQUExQixPQUFQOztBQUNGLFNBQUssTUFBTDtBQUNBLFNBQUssUUFBTDtBQUNFLGFBQU8sYUFBYSxDQUFDLElBQUQsQ0FBcEI7O0FBQ0YsU0FBSyxLQUFMO0FBQ0UsYUFBTyxtQkFBVSxhQUFJLGFBQUM7QUFBSSxnQkFBQyxDQUFEO0FBQU0sT0FBZixFQUFpQixhQUFhLENBQUMsSUFBRCxDQUE5QixDQUFWLENBQVA7O0FBQ0YsU0FBSyxLQUFMO0FBQ0UsYUFBTyxtQkFBVSxlQUFNLENBQU4sRUFBUyxpQkFBUSxhQUFSLEVBQXVCLElBQXZCLENBQVQsQ0FBVixDQUFQO0FBeEJKOztBQTBCQSxTQUFPLElBQVA7QUFDRCxDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN4Q1kscUJBQWEsVUFBQyxHQUFELEVBQVk7QUFBSyx1QkFBYyxDQUFDLEdBQUQsQ0FBZDtBQUEwQixDQUF4RDs7QUFFYixTQUFTLGNBQVQsQ0FBd0IsR0FBeEIsRUFBbUM7QUFDakMsTUFBSSxNQUFNLEdBQUcsRUFBYjtBQUNBLE1BQUksUUFBUSxHQUFHLEtBQWY7QUFDQSxNQUFJLFNBQVMsR0FBRyxLQUFoQjtBQUNBLE1BQUksSUFBSSxHQUFHLEtBQVg7O0FBQ0EsT0FBZ0IsdUJBQWhCLEVBQWdCLGlCQUFoQixFQUFnQixJQUFoQixFQUFxQjtBQUFoQixRQUFNLENBQUMsWUFBUDs7QUFDSCxRQUFJLElBQUosRUFBVTtBQUNSLFlBQU0sSUFBSSxDQUFWO0FBQ0EsVUFBSSxHQUFHLEtBQVA7QUFDRCxLQUhELE1BR08sSUFBSSxDQUFDLEtBQUssR0FBTixJQUFhLENBQUMsUUFBbEIsRUFBNEI7QUFDakMsZUFBUyxHQUFHLElBQVo7QUFDRCxLQUZNLE1BRUEsSUFBSSxDQUFDLEtBQUssSUFBVixFQUFnQjtBQUNyQixZQUFNLElBQUksSUFBVjtBQUNBLGVBQVMsR0FBRyxLQUFaO0FBQ0QsS0FITSxNQUdBLElBQUksQ0FBQyxTQUFMLEVBQWdCO0FBQ3JCLFlBQU0sSUFBSSxDQUFWO0FBQ0EsVUFBSSxDQUFDLEtBQUssSUFBVixFQUFnQixJQUFJLEdBQUcsSUFBUCxDQUFoQixLQUNLLElBQUksQ0FBQyxLQUFLLEdBQVYsRUFBZSxRQUFRLEdBQUcsQ0FBQyxRQUFaO0FBQ3JCO0FBQ0Y7O0FBQ0QsU0FBTyxNQUFQO0FBQ0QsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdkJEOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUVhLG9CQUFZLFVBQUMsSUFBRCxFQUFVO0FBQ2pDLE1BQU0sTUFBTSxHQUFHLGFBQUssSUFBTCxDQUFmOztBQUNBLFVBQVEsTUFBUjtBQUNFLFNBQUssS0FBTDtBQUNFLGFBQU8sS0FBUDs7QUFDRixTQUFLLFFBQUw7QUFDRSxhQUFPLEtBQUssSUFBWjs7QUFDRixTQUFLLFFBQUw7QUFDRSxhQUFPLElBQUksQ0FBQyxTQUFMLENBQWUsSUFBZixDQUFQOztBQUNGLFNBQUssS0FBTDtBQUNFLGFBQU8sWUFBWSxDQUFDLElBQUQsQ0FBbkI7O0FBQ0YsU0FBSyxLQUFMO0FBQ0UsYUFBTyxZQUFZLENBQUMsSUFBRCxDQUFuQjs7QUFDRixTQUFLLEtBQUw7QUFDRSxhQUFPLFlBQVksQ0FBQyxJQUFELENBQW5COztBQUNGLFNBQUssUUFBTDtBQUNFLGFBQU8sZUFBZSxDQUFDLElBQUQsQ0FBdEI7O0FBQ0YsU0FBSyxTQUFMO0FBQ0UsYUFBTyxnQkFBZ0IsQ0FBQyxJQUFELENBQXZCOztBQUNGLFNBQUssUUFBTDtBQUNFLGFBQU8sZUFBZSxDQUFDLElBQUQsQ0FBdEI7O0FBQ0Y7QUFDRSxhQUFPLEtBQUssSUFBWjtBQXBCSjtBQXNCRCxDQXhCWTs7QUEwQmIsU0FBUyxZQUFULENBQXNCLElBQXRCLEVBQTJDO0FBQ3pDLFNBQ0UsTUFDQSxVQUNFLGtCQUFRLElBQVIsQ0FERixFQUVFLG1CQUZGLEVBR0UsZ0JBQUssaUJBQUwsQ0FIRixFQUlFLDBCQUpGLEVBS0UsY0FBSyxHQUFMLENBTEYsQ0FEQSxHQVFBLEdBVEY7QUFXRDs7QUFFRCxTQUFTLFlBQVQsQ0FBc0IsSUFBdEIsRUFBa0M7QUFDaEMsU0FDRSxPQUNBLFVBQ0UsSUFBSSxDQUFDLE1BQUwsRUFERixFQUVFLGdCQUFLLGlCQUFMLENBRkYsRUFHRSwwQkFIRixFQUlFLGNBQUssR0FBTCxDQUpGLENBREEsR0FPQSxHQVJGO0FBVUQ7O0FBRUQsU0FBUyxZQUFULENBQXNCLElBQXRCLEVBQWtDO0FBQ2hDLFNBQU8sTUFBTSxJQUFJLENBQUMsR0FBTCxDQUFTLE1BQWYsR0FBd0IsR0FBeEIsR0FBOEIsa0JBQVUsSUFBSSxDQUFDLElBQWYsQ0FBckM7QUFDRDs7QUFFRCxTQUFTLGVBQVQsQ0FBeUIsSUFBekIsRUFBd0M7QUFDdEMsU0FBTyxJQUFJLENBQUMsTUFBWjtBQUNEOztBQUVELFNBQVMsZ0JBQVQsQ0FBMEIsSUFBMUIsRUFBMEM7QUFDeEMsU0FBTyxNQUFNLElBQUksQ0FBQyxPQUFsQjtBQUNEOztBQUVELFNBQVMsZUFBVCxDQUF5QixJQUF6QixFQUFvQztBQUNsQyxTQUFPLE1BQU0sYUFBSyxpQkFBTCxFQUFnQixJQUFoQixFQUFzQixJQUF0QixDQUEyQixHQUEzQixDQUFOLEdBQXdDLEdBQS9DO0FBQ0QsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDekVELFNBQWdCLFlBQWhCLENBQTZCLEdBQTdCLEVBQXdDO0FBQ3RDLE1BQUksQ0FBQyxHQUFHLENBQUMsTUFBVCxFQUFpQjtBQUNmLFdBQU8sSUFBUDtBQUNEOztBQUNELE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFELENBQWhCO0FBQ0EsTUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLE1BQUosQ0FBVyxDQUFYLENBQWI7O0FBQ0EsVUFBUSxJQUFJLENBQUMsV0FBTCxFQUFSO0FBQ0UsU0FBSyxHQUFMO0FBQ0UsYUFBTyxPQUFLLElBQVo7O0FBQ0YsU0FBSyxHQUFMO0FBQ0UsYUFBTyxPQUFLLElBQVo7O0FBQ0YsU0FBSyxHQUFMO0FBQ0UsYUFBTyxPQUFLLElBQVo7O0FBQ0YsU0FBSyxJQUFMO0FBQ0UsYUFBTyxPQUFLLElBQVo7O0FBQ0YsU0FBSyxHQUFMO0FBQ0UsYUFBTyxNQUFLLElBQVo7O0FBQ0YsU0FBSyxHQUFMO0FBQ0UsYUFBTyxPQUFJLElBQVg7O0FBQ0YsU0FBSyxHQUFMO0FBQ0UsYUFBTyxPQUFLLElBQVo7O0FBQ0YsU0FBSyxHQUFMO0FBQ0UsYUFBTyxPQUFLLElBQVo7QUFDRjs7QUFDQTtBQUNFLGFBQU8sR0FBUDtBQW5CSjtBQXFCRDs7QUEzQkQ7O0FBNkJBLFNBQWdCLFdBQWhCLENBQTRCLEdBQTVCLEVBQXVDO0FBQ3JDLE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFKLENBQVUsSUFBVixDQUFkO0FBQ0EsU0FBTyxLQUFLLENBQUMsR0FBTixDQUFVLFVBQUMsQ0FBRCxFQUFJLENBQUosRUFBSztBQUFLLFdBQUMsQ0FBQyxHQUFHLFlBQVksQ0FBQyxDQUFELENBQWYsR0FBRjtBQUF5QixHQUE3QyxFQUErQyxJQUEvQyxDQUFvRCxFQUFwRCxDQUFQO0FBQ0Q7O0FBSEQsa0M7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzdCQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTtBQUFBO0FBQUE7QUFFRSxzQkFBWSxPQUFaLEVBQTJCO0FBRG5CLG9CQUFtQixFQUFuQjtBQUVOLFNBQUssT0FBTCxHQUFlLE9BQWY7QUFDRDs7QUFFRCx3QkFBVyxvQkFBWCxFQUFXLFNBQVgsRUFBa0I7U0FBbEI7QUFDRSxhQUFPLEtBQUssUUFBWjtBQUNELEtBRmlCO1NBSWxCLGFBQW1CLE9BQW5CLEVBQWtDO0FBQ2hDLFVBQUksT0FBTyxDQUFDLENBQUQsQ0FBUCxLQUFlLEdBQW5CLEVBQXdCO0FBQ3RCLGVBQU8sR0FBRyxPQUFPLENBQUMsTUFBUixDQUFlLENBQWYsQ0FBVjtBQUNEOztBQUNELFdBQUssUUFBTCxHQUFnQixPQUFoQjtBQUNELEtBVGlCO29CQUFBOztBQUFBLEdBQWxCO0FBVUY7QUFBQyxDQWhCRDs7QUFBYTs7QUFrQmI7QUFBQTtBQUFBO0FBQ0UscUJBQW1CLE1BQW5CLEVBQWlDO0FBQWQ7QUFBa0I7O0FBQ3ZDO0FBQUMsQ0FGRDs7QUFBYTs7QUFJYjtBQUFBO0FBQUE7QUFFRSxrQkFBWSxHQUFaLEVBQTRDLElBQTVDLEVBQXFEO0FBQVQ7QUFDMUMsUUFBSSxjQUFTLEdBQVQsQ0FBSixFQUFtQixLQUFLLEdBQUwsR0FBVyxJQUFJLFNBQUosQ0FBYyxHQUFkLENBQVgsQ0FBbkIsS0FDSyxLQUFLLEdBQUwsR0FBVyxHQUFYO0FBQ047O0FBQ0g7QUFBQyxDQU5EOztBQUFhOztBQVFiO0FBQUE7QUFBQTtBQUdFLHFCQUFZLElBQVosRUFBdUI7QUFGZixnQkFBTyxJQUFJLEdBQUosRUFBUDtBQUdOLFNBQUssSUFBTCxHQUFZLElBQUksR0FBSixDQUNWLFVBQ0UsSUFERixFQUVFLGVBQU0sQ0FBTixDQUZGLEVBR0UsYUFBSyxVQUFDLEVBQUQsRUFBb0I7VUFBbEIsVztVQUFLLGE7QUFBa0IsY0FBQyxLQUFLLENBQUMsR0FBRCxDQUFOLEVBQWE7QUFBRSxXQUFHLEtBQUw7QUFBTyxhQUFLO0FBQVosT0FBYjtBQUE0QixLQUExRCxDQUhGLENBRFUsQ0FBWjtBQU9EOztBQUVELHNDQUFJLEdBQUosRUFBWTtBQUNWLFFBQU0sQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFELENBQWY7O0FBQ0EsUUFBSSxLQUFLLElBQUwsQ0FBVSxHQUFWLENBQWMsQ0FBZCxDQUFKLEVBQXNCO0FBQ3BCLGFBQU8sS0FBSyxJQUFMLENBQVUsR0FBVixDQUFjLENBQWQsRUFBaUIsS0FBeEI7QUFDRCxLQUZELE1BRU87QUFDTCxhQUFPLElBQVA7QUFDRDtBQUNGLEdBUEQ7O0FBU0Esc0NBQUksR0FBSixFQUFZO0FBQ1YsV0FBTyxLQUFLLElBQUwsQ0FBVSxHQUFWLENBQWMsS0FBSyxDQUFDLEdBQUQsQ0FBbkIsQ0FBUDtBQUNELEdBRkQ7O0FBSUEsc0NBQUksR0FBSixFQUFjLEtBQWQsRUFBd0I7QUFDdEIsU0FBSyxJQUFMLENBQVUsR0FBVixDQUFjLEtBQUssQ0FBQyxHQUFELENBQW5CLEVBQTBCO0FBQUUsU0FBRyxLQUFMO0FBQU8sV0FBSztBQUFaLEtBQTFCO0FBQ0QsR0FGRDs7QUFJQTtBQUNFLFdBQU8sZ0JBQUssVUFBQyxFQUFELEVBQVE7VUFBTCxZO0FBQVU7QUFBRyxLQUFyQixFQUF1QixLQUFLLElBQUwsQ0FBVSxNQUFWLEVBQXZCLENBQVA7QUFDRCxHQUZEOztBQUlBO0FBQ0UsV0FBTyxnQkFBSyxVQUFDLEVBQUQsRUFBVTtVQUFQLGdCO0FBQVk7QUFBSyxLQUF6QixFQUEyQixLQUFLLElBQUwsQ0FBVSxNQUFWLEVBQTNCLENBQVA7QUFDRCxHQUZEOztBQUlBLHlDQUFPLEdBQVAsRUFBZTtBQUNiLFdBQU8sS0FBSyxJQUFMLENBQVUsTUFBVixDQUFpQixLQUFLLENBQUMsR0FBRCxDQUF0QixDQUFQO0FBQ0QsR0FGRDs7QUFJQTtBQUNFLFNBQUssSUFBTCxDQUFVLEtBQVY7QUFDRCxHQUZEOztBQUlBLHNCQUFDLE1BQU0sQ0FBQyxRQUFSO0FBQ0UsV0FBTyxLQUFLLE9BQUwsRUFBUDtBQUNELEdBRkQ7O0FBSUE7QUFDRSxXQUFPLGdCQUFLLFVBQUMsRUFBRCxFQUFlO1VBQVosWTtVQUFLLGdCO0FBQVksY0FBQyxHQUFELEVBQU0sS0FBTjtBQUFZLEtBQXJDLEVBQXVDLEtBQUssSUFBTCxDQUFVLE1BQVYsRUFBdkMsQ0FBUDtBQUNELEdBRkQ7O0FBR0Y7QUFBQyxDQXJERDs7QUF1REE7QUFBQTtBQUFBO0FBRUUsa0JBQVksSUFBWixFQUF1QjtBQUF2Qjs7QUFJQSxlQUFNLFVBQUMsR0FBRCxFQUFTO0FBQUssa0JBQUksQ0FBQyxJQUFMLENBQVUsR0FBVjtBQUFrQixLQUF0Qzs7QUFDQSxpQkFBUTtBQUFNLGtCQUFJLENBQUMsSUFBTDtBQUFpQixLQUEvQjs7QUFDQSxrQkFBUyxVQUFDLEdBQUQsRUFBUztBQUFLLGtCQUFJLENBQUMsSUFBTCxDQUFVLE1BQVY7QUFBcUIsS0FBNUM7O0FBQ0EsbUJBQVU7QUFBTSxrQkFBSSxDQUFDLElBQUw7QUFBbUIsS0FBbkM7O0FBQ0EsZUFBTSxVQUFDLEdBQUQsRUFBUztBQUFLLGtCQUFJLENBQUMsSUFBTCxDQUFVLEdBQVY7QUFBa0IsS0FBdEM7O0FBQ0EsZ0JBQU87QUFBTSxrQkFBSSxDQUFDLElBQUw7QUFBZ0IsS0FBN0I7O0FBQ0EsZUFBTSxVQUFDLEdBQUQsRUFBVyxLQUFYLEVBQXFCO0FBQUssa0JBQUksQ0FBQyxJQUFMLENBQVUsR0FBVixDQUFjLEdBQWQ7QUFBeUIsS0FBekQ7O0FBQ0Esa0JBQVM7QUFBTSxrQkFBSSxDQUFDLElBQUw7QUFBa0IsS0FBakM7O0FBQ0EsU0FBQyxNQUFNLENBQUMsUUFBUixJQUFvQjtBQUFNLGtCQUFJLENBQUMsSUFBTCxDQUFVLE1BQU0sQ0FBaEI7QUFBNEIsS0FBdEQ7O0FBWEUsU0FBSyxJQUFMLEdBQVksSUFBSSxTQUFKLENBQWMsSUFBZCxDQUFaO0FBQ0Q7O0FBV0g7QUFBQyxDQWZEOztBQUFhOztBQWlCYjtBQUFBO0FBQUE7QUFFRSxrQkFBWSxJQUFaLEVBQXVCO0FBQXZCOztBQVVBLGVBQU0sVUFBQyxJQUFELEVBQVU7QUFBSyxrQkFBSSxDQUFDLElBQUwsQ0FBVSxHQUFWLENBQWMsSUFBZDtBQUF5QixLQUE5Qzs7QUFDQSxpQkFBUTtBQUFNLGtCQUFJLENBQUMsSUFBTDtBQUFpQixLQUEvQjs7QUFDQSxlQUFNLFVBQUMsSUFBRCxFQUFVO0FBQUssa0JBQUksQ0FBQyxJQUFMLENBQVUsR0FBVjtBQUFtQixLQUF4Qzs7QUFDQSxrQkFBUyxVQUFDLElBQUQsRUFBVTtBQUFLLGtCQUFJLENBQUMsSUFBTCxDQUFVLE1BQVY7QUFBc0IsS0FBOUM7O0FBQ0EsbUJBQVU7QUFBTSxrQkFBSSxDQUFDLElBQUw7QUFBbUIsS0FBbkM7O0FBQ0Esa0JBQVM7QUFBTSxrQkFBSSxDQUFDLElBQUw7QUFBa0IsS0FBakM7O0FBQ0EsU0FBQyxNQUFNLENBQUMsUUFBUixJQUFvQjtBQUFNLGtCQUFJLENBQUMsSUFBTCxDQUFVLE1BQU0sQ0FBaEI7QUFBNEIsS0FBdEQ7O0FBZkUsU0FBSyxJQUFMLEdBQVksSUFBSSxTQUFKLENBQ1YsVUFDRSxJQURGLEVBRUUsYUFBSyxhQUFDO0FBQUksY0FBQyxDQUFEO0FBQU0sS0FBaEIsQ0FGRixFQUdFLGdCQUhGLENBRFUsQ0FBWjtBQU9EOztBQVNIO0FBQUMsQ0FuQkQ7O0FBQWE7O0FBcUJiLFNBQVMsS0FBVCxDQUFlLEtBQWYsRUFBeUI7QUFDdkIsU0FBTyxJQUFJLENBQUMsS0FBRCxDQUFKLEdBQWMsR0FBZCxHQUFvQixRQUFRLENBQUMsS0FBRCxDQUFuQztBQUNEOztBQUVELFNBQVMsUUFBVCxDQUFrQixLQUFsQixFQUE0QjtBQUMxQixNQUFJLFdBQU0sS0FBTixDQUFKLEVBQWtCO0FBQ2hCLFdBQU8sTUFBUDtBQUNEOztBQUNELFNBQU8sSUFBSSxDQUFDLFNBQUwsQ0FBZSxLQUFmLENBQVA7QUFDRDs7QUFFRCxTQUFnQixJQUFoQixDQUFxQixLQUFyQixFQUErQjtBQUM3QixNQUFJLFdBQU0sS0FBTixDQUFKLEVBQWtCO0FBQ2hCLFdBQU8sS0FBUDtBQUNELEdBRkQsTUFFTyxJQUFJLGNBQVMsS0FBVCxDQUFKLEVBQXFCO0FBQzFCLFdBQU8sUUFBUDtBQUNELEdBRk0sTUFFQSxJQUFJLGNBQVMsS0FBVCxDQUFKLEVBQXFCO0FBQzFCLFdBQU8sUUFBUDtBQUNELEdBRk0sTUFFQSxJQUFJLEtBQUssWUFBWSxNQUFyQixFQUE2QjtBQUNsQyxXQUFPLEtBQVA7QUFDRCxHQUZNLE1BRUEsSUFBSSxLQUFLLFlBQVksU0FBckIsRUFBZ0M7QUFDckMsV0FBTyxRQUFQO0FBQ0QsR0FGTSxNQUVBLElBQUksS0FBSyxZQUFZLFVBQXJCLEVBQWlDO0FBQ3RDLFdBQU8sU0FBUDtBQUNELEdBRk0sTUFFQSxJQUFJLEtBQUssWUFBWSxNQUFyQixFQUE2QjtBQUNsQyxXQUFPLEtBQVA7QUFDRCxHQUZNLE1BRUEsSUFBSSxhQUFRLEtBQVIsQ0FBSixFQUFvQjtBQUN6QixXQUFPLFFBQVA7QUFDRCxHQUZNLE1BRUEsSUFBSSxjQUFTLEtBQVQsS0FBbUIsS0FBSyxZQUFZLE1BQXhDLEVBQWdEO0FBQ3JELFdBQU8sS0FBUDtBQUNELEdBRk0sTUFFQTtBQUNMLFdBQU8sT0FBUDtBQUNEO0FBQ0Y7O0FBdEJEOztBQXdCYSxrQkFBVSxVQUFDLEdBQUQsRUFBWTtBQUFLLGFBQUksVUFBSjtBQUFtQixDQUE5Qzs7QUFDQSxpQkFBUyxVQUFDLEdBQUQsRUFBWTtBQUFLLGFBQUksU0FBSjtBQUFrQixDQUE1Qzs7QUFDQSxjQUFNLFVBQUMsSUFBRCxFQUFZO0FBQUssYUFBSSxNQUFKO0FBQWdCLENBQXZDOztBQUNBLGNBQU0sVUFBQyxJQUFELEVBQVk7QUFBSyxhQUFJLE1BQUo7QUFBZ0IsQ0FBdkM7O0FBQ0EsY0FBTSxVQUFDLEdBQUQsRUFBTSxJQUFOLEVBQVU7QUFBSyxhQUFJLE1BQUosQ0FBVyxHQUFYO0FBQXFCLENBQTFDOztBQUNBLG9CQUFZLFVBQUMsSUFBRCxFQUFVO0FBQ2pDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFELENBQW5COztBQUNBLFVBQVEsTUFBUjtBQUNFLFNBQUssS0FBTDtBQUNFLGFBQU8sS0FBUDs7QUFDRixTQUFLLFFBQUw7QUFDRSxhQUFPLEtBQUssSUFBWjs7QUFDRixTQUFLLFFBQUw7QUFDRSxhQUFPLElBQUksQ0FBQyxTQUFMLENBQWUsSUFBZixDQUFQOztBQUNGLFNBQUssS0FBTDtBQUNFLGFBQU8sWUFBWSxDQUFDLElBQUQsQ0FBbkI7O0FBQ0YsU0FBSyxLQUFMO0FBQ0UsYUFBTyxZQUFZLENBQUMsSUFBRCxDQUFuQjs7QUFDRixTQUFLLEtBQUw7QUFDRSxhQUFPLFlBQVksQ0FBQyxJQUFELENBQW5COztBQUNGLFNBQUssUUFBTDtBQUNFLGFBQU8sZUFBZSxDQUFDLElBQUQsQ0FBdEI7O0FBQ0YsU0FBSyxTQUFMO0FBQ0UsYUFBTyxnQkFBZ0IsQ0FBQyxJQUFELENBQXZCOztBQUNGLFNBQUssUUFBTDtBQUNFLGFBQU8sZUFBZSxDQUFDLElBQUQsQ0FBdEI7O0FBQ0Y7QUFDRSxhQUFPLEtBQUssSUFBWjtBQXBCSjtBQXNCRCxDQXhCWTs7QUEwQmIsU0FBUyxZQUFULENBQXNCLElBQXRCLEVBQWtDO0FBQ2hDLFNBQ0UsTUFDQSxVQUNFLElBQUksQ0FBQyxPQUFMLEVBREYsRUFFRSxtQkFGRixFQUdFLGdCQUFLLGlCQUFMLENBSEYsRUFJRSwwQkFKRixFQUtFLGNBQUssR0FBTCxDQUxGLENBREEsR0FRQSxHQVRGO0FBV0Q7O0FBRUQsU0FBUyxZQUFULENBQXNCLElBQXRCLEVBQWtDO0FBQ2hDLFNBQ0UsT0FDQSxVQUNFLElBQUksQ0FBQyxNQUFMLEVBREYsRUFFRSxnQkFBSyxpQkFBTCxDQUZGLEVBR0UsMEJBSEYsRUFJRSxjQUFLLEdBQUwsQ0FKRixDQURBLEdBT0EsR0FSRjtBQVVEOztBQUVELFNBQVMsWUFBVCxDQUFzQixJQUF0QixFQUFrQztBQUNoQyxTQUFPLE1BQU0sSUFBSSxDQUFDLEdBQUwsQ0FBUyxNQUFmLEdBQXdCLEdBQXhCLEdBQThCLGtCQUFVLElBQUksQ0FBQyxJQUFmLENBQXJDO0FBQ0Q7O0FBRUQsU0FBUyxlQUFULENBQXlCLElBQXpCLEVBQXdDO0FBQ3RDLFNBQU8sSUFBSSxDQUFDLE1BQVo7QUFDRDs7QUFFRCxTQUFTLGdCQUFULENBQTBCLElBQTFCLEVBQTBDO0FBQ3hDLFNBQU8sTUFBTSxJQUFJLENBQUMsT0FBbEI7QUFDRDs7QUFFRCxTQUFTLGVBQVQsQ0FBeUIsSUFBekIsRUFBb0M7QUFDbEMsU0FBTyxNQUFNLGFBQUssaUJBQUwsRUFBZ0IsSUFBaEIsRUFBc0IsSUFBdEIsQ0FBMkIsR0FBM0IsQ0FBTixHQUF3QyxHQUEvQztBQUNELEMiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvaW5kZXgudHNcIik7XG4iLCIoZnVuY3Rpb24ocm9vdCwgZmFjdG9yeSkge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByb290Lm5lYXJsZXkgPSBmYWN0b3J5KCk7XG4gICAgfVxufSh0aGlzLCBmdW5jdGlvbigpIHtcblxuICAgIGZ1bmN0aW9uIFJ1bGUobmFtZSwgc3ltYm9scywgcG9zdHByb2Nlc3MpIHtcbiAgICAgICAgdGhpcy5pZCA9ICsrUnVsZS5oaWdoZXN0SWQ7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMuc3ltYm9scyA9IHN5bWJvbHM7ICAgICAgICAvLyBhIGxpc3Qgb2YgbGl0ZXJhbCB8IHJlZ2V4IGNsYXNzIHwgbm9udGVybWluYWxcbiAgICAgICAgdGhpcy5wb3N0cHJvY2VzcyA9IHBvc3Rwcm9jZXNzO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgUnVsZS5oaWdoZXN0SWQgPSAwO1xuXG4gICAgUnVsZS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbih3aXRoQ3Vyc29yQXQpIHtcbiAgICAgICAgZnVuY3Rpb24gc3RyaW5naWZ5U3ltYm9sU2VxdWVuY2UgKGUpIHtcbiAgICAgICAgICAgIHJldHVybiBlLmxpdGVyYWwgPyBKU09OLnN0cmluZ2lmeShlLmxpdGVyYWwpIDpcbiAgICAgICAgICAgICAgICAgICBlLnR5cGUgPyAnJScgKyBlLnR5cGUgOiBlLnRvU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHN5bWJvbFNlcXVlbmNlID0gKHR5cGVvZiB3aXRoQ3Vyc29yQXQgPT09IFwidW5kZWZpbmVkXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gdGhpcy5zeW1ib2xzLm1hcChzdHJpbmdpZnlTeW1ib2xTZXF1ZW5jZSkuam9pbignICcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogKCAgIHRoaXMuc3ltYm9scy5zbGljZSgwLCB3aXRoQ3Vyc29yQXQpLm1hcChzdHJpbmdpZnlTeW1ib2xTZXF1ZW5jZSkuam9pbignICcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArIFwiIOKXjyBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyB0aGlzLnN5bWJvbHMuc2xpY2Uod2l0aEN1cnNvckF0KS5tYXAoc3RyaW5naWZ5U3ltYm9sU2VxdWVuY2UpLmpvaW4oJyAnKSAgICAgKTtcbiAgICAgICAgcmV0dXJuIHRoaXMubmFtZSArIFwiIOKGkiBcIiArIHN5bWJvbFNlcXVlbmNlO1xuICAgIH1cblxuXG4gICAgLy8gYSBTdGF0ZSBpcyBhIHJ1bGUgYXQgYSBwb3NpdGlvbiBmcm9tIGEgZ2l2ZW4gc3RhcnRpbmcgcG9pbnQgaW4gdGhlIGlucHV0IHN0cmVhbSAocmVmZXJlbmNlKVxuICAgIGZ1bmN0aW9uIFN0YXRlKHJ1bGUsIGRvdCwgcmVmZXJlbmNlLCB3YW50ZWRCeSkge1xuICAgICAgICB0aGlzLnJ1bGUgPSBydWxlO1xuICAgICAgICB0aGlzLmRvdCA9IGRvdDtcbiAgICAgICAgdGhpcy5yZWZlcmVuY2UgPSByZWZlcmVuY2U7XG4gICAgICAgIHRoaXMuZGF0YSA9IFtdO1xuICAgICAgICB0aGlzLndhbnRlZEJ5ID0gd2FudGVkQnk7XG4gICAgICAgIHRoaXMuaXNDb21wbGV0ZSA9IHRoaXMuZG90ID09PSBydWxlLnN5bWJvbHMubGVuZ3RoO1xuICAgIH1cblxuICAgIFN0YXRlLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gXCJ7XCIgKyB0aGlzLnJ1bGUudG9TdHJpbmcodGhpcy5kb3QpICsgXCJ9LCBmcm9tOiBcIiArICh0aGlzLnJlZmVyZW5jZSB8fCAwKTtcbiAgICB9O1xuXG4gICAgU3RhdGUucHJvdG90eXBlLm5leHRTdGF0ZSA9IGZ1bmN0aW9uKGNoaWxkKSB7XG4gICAgICAgIHZhciBzdGF0ZSA9IG5ldyBTdGF0ZSh0aGlzLnJ1bGUsIHRoaXMuZG90ICsgMSwgdGhpcy5yZWZlcmVuY2UsIHRoaXMud2FudGVkQnkpO1xuICAgICAgICBzdGF0ZS5sZWZ0ID0gdGhpcztcbiAgICAgICAgc3RhdGUucmlnaHQgPSBjaGlsZDtcbiAgICAgICAgaWYgKHN0YXRlLmlzQ29tcGxldGUpIHtcbiAgICAgICAgICAgIHN0YXRlLmRhdGEgPSBzdGF0ZS5idWlsZCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9O1xuXG4gICAgU3RhdGUucHJvdG90eXBlLmJ1aWxkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBjaGlsZHJlbiA9IFtdO1xuICAgICAgICB2YXIgbm9kZSA9IHRoaXM7XG4gICAgICAgIGRvIHtcbiAgICAgICAgICAgIGNoaWxkcmVuLnB1c2gobm9kZS5yaWdodC5kYXRhKTtcbiAgICAgICAgICAgIG5vZGUgPSBub2RlLmxlZnQ7XG4gICAgICAgIH0gd2hpbGUgKG5vZGUubGVmdCk7XG4gICAgICAgIGNoaWxkcmVuLnJldmVyc2UoKTtcbiAgICAgICAgcmV0dXJuIGNoaWxkcmVuO1xuICAgIH07XG5cbiAgICBTdGF0ZS5wcm90b3R5cGUuZmluaXNoID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh0aGlzLnJ1bGUucG9zdHByb2Nlc3MpIHtcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IHRoaXMucnVsZS5wb3N0cHJvY2Vzcyh0aGlzLmRhdGEsIHRoaXMucmVmZXJlbmNlLCBQYXJzZXIuZmFpbCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG5cbiAgICBmdW5jdGlvbiBDb2x1bW4oZ3JhbW1hciwgaW5kZXgpIHtcbiAgICAgICAgdGhpcy5ncmFtbWFyID0gZ3JhbW1hcjtcbiAgICAgICAgdGhpcy5pbmRleCA9IGluZGV4O1xuICAgICAgICB0aGlzLnN0YXRlcyA9IFtdO1xuICAgICAgICB0aGlzLndhbnRzID0ge307IC8vIHN0YXRlcyBpbmRleGVkIGJ5IHRoZSBub24tdGVybWluYWwgdGhleSBleHBlY3RcbiAgICAgICAgdGhpcy5zY2FubmFibGUgPSBbXTsgLy8gbGlzdCBvZiBzdGF0ZXMgdGhhdCBleHBlY3QgYSB0b2tlblxuICAgICAgICB0aGlzLmNvbXBsZXRlZCA9IHt9OyAvLyBzdGF0ZXMgdGhhdCBhcmUgbnVsbGFibGVcbiAgICB9XG5cblxuICAgIENvbHVtbi5wcm90b3R5cGUucHJvY2VzcyA9IGZ1bmN0aW9uKG5leHRDb2x1bW4pIHtcbiAgICAgICAgdmFyIHN0YXRlcyA9IHRoaXMuc3RhdGVzO1xuICAgICAgICB2YXIgd2FudHMgPSB0aGlzLndhbnRzO1xuICAgICAgICB2YXIgY29tcGxldGVkID0gdGhpcy5jb21wbGV0ZWQ7XG5cbiAgICAgICAgZm9yICh2YXIgdyA9IDA7IHcgPCBzdGF0ZXMubGVuZ3RoOyB3KyspIHsgLy8gbmIuIHdlIHB1c2goKSBkdXJpbmcgaXRlcmF0aW9uXG4gICAgICAgICAgICB2YXIgc3RhdGUgPSBzdGF0ZXNbd107XG5cbiAgICAgICAgICAgIGlmIChzdGF0ZS5pc0NvbXBsZXRlKSB7XG4gICAgICAgICAgICAgICAgc3RhdGUuZmluaXNoKCk7XG4gICAgICAgICAgICAgICAgaWYgKHN0YXRlLmRhdGEgIT09IFBhcnNlci5mYWlsKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbXBsZXRlXG4gICAgICAgICAgICAgICAgICAgIHZhciB3YW50ZWRCeSA9IHN0YXRlLndhbnRlZEJ5O1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gd2FudGVkQnkubGVuZ3RoOyBpLS07ICkgeyAvLyB0aGlzIGxpbmUgaXMgaG90XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGVmdCA9IHdhbnRlZEJ5W2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb21wbGV0ZShsZWZ0LCBzdGF0ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBzcGVjaWFsLWNhc2UgbnVsbGFibGVzXG4gICAgICAgICAgICAgICAgICAgIGlmIChzdGF0ZS5yZWZlcmVuY2UgPT09IHRoaXMuaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG1ha2Ugc3VyZSBmdXR1cmUgcHJlZGljdG9ycyBvZiB0aGlzIHJ1bGUgZ2V0IGNvbXBsZXRlZC5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBleHAgPSBzdGF0ZS5ydWxlLm5hbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAodGhpcy5jb21wbGV0ZWRbZXhwXSA9IHRoaXMuY29tcGxldGVkW2V4cF0gfHwgW10pLnB1c2goc3RhdGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIHF1ZXVlIHNjYW5uYWJsZSBzdGF0ZXNcbiAgICAgICAgICAgICAgICB2YXIgZXhwID0gc3RhdGUucnVsZS5zeW1ib2xzW3N0YXRlLmRvdF07XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBleHAgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2Nhbm5hYmxlLnB1c2goc3RhdGUpO1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBwcmVkaWN0XG4gICAgICAgICAgICAgICAgaWYgKHdhbnRzW2V4cF0pIHtcbiAgICAgICAgICAgICAgICAgICAgd2FudHNbZXhwXS5wdXNoKHN0YXRlKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoY29tcGxldGVkLmhhc093blByb3BlcnR5KGV4cCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBudWxscyA9IGNvbXBsZXRlZFtleHBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBudWxscy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciByaWdodCA9IG51bGxzW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcGxldGUoc3RhdGUsIHJpZ2h0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHdhbnRzW2V4cF0gPSBbc3RhdGVdO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByZWRpY3QoZXhwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBDb2x1bW4ucHJvdG90eXBlLnByZWRpY3QgPSBmdW5jdGlvbihleHApIHtcbiAgICAgICAgdmFyIHJ1bGVzID0gdGhpcy5ncmFtbWFyLmJ5TmFtZVtleHBdIHx8IFtdO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcnVsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciByID0gcnVsZXNbaV07XG4gICAgICAgICAgICB2YXIgd2FudGVkQnkgPSB0aGlzLndhbnRzW2V4cF07XG4gICAgICAgICAgICB2YXIgcyA9IG5ldyBTdGF0ZShyLCAwLCB0aGlzLmluZGV4LCB3YW50ZWRCeSk7XG4gICAgICAgICAgICB0aGlzLnN0YXRlcy5wdXNoKHMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgQ29sdW1uLnByb3RvdHlwZS5jb21wbGV0ZSA9IGZ1bmN0aW9uKGxlZnQsIHJpZ2h0KSB7XG4gICAgICAgIHZhciBjb3B5ID0gbGVmdC5uZXh0U3RhdGUocmlnaHQpO1xuICAgICAgICB0aGlzLnN0YXRlcy5wdXNoKGNvcHkpO1xuICAgIH1cblxuXG4gICAgZnVuY3Rpb24gR3JhbW1hcihydWxlcywgc3RhcnQpIHtcbiAgICAgICAgdGhpcy5ydWxlcyA9IHJ1bGVzO1xuICAgICAgICB0aGlzLnN0YXJ0ID0gc3RhcnQgfHwgdGhpcy5ydWxlc1swXS5uYW1lO1xuICAgICAgICB2YXIgYnlOYW1lID0gdGhpcy5ieU5hbWUgPSB7fTtcbiAgICAgICAgdGhpcy5ydWxlcy5mb3JFYWNoKGZ1bmN0aW9uKHJ1bGUpIHtcbiAgICAgICAgICAgIGlmICghYnlOYW1lLmhhc093blByb3BlcnR5KHJ1bGUubmFtZSkpIHtcbiAgICAgICAgICAgICAgICBieU5hbWVbcnVsZS5uYW1lXSA9IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnlOYW1lW3J1bGUubmFtZV0ucHVzaChydWxlKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gU28gd2UgY2FuIGFsbG93IHBhc3NpbmcgKHJ1bGVzLCBzdGFydCkgZGlyZWN0bHkgdG8gUGFyc2VyIGZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eVxuICAgIEdyYW1tYXIuZnJvbUNvbXBpbGVkID0gZnVuY3Rpb24ocnVsZXMsIHN0YXJ0KSB7XG4gICAgICAgIHZhciBsZXhlciA9IHJ1bGVzLkxleGVyO1xuICAgICAgICBpZiAocnVsZXMuUGFyc2VyU3RhcnQpIHtcbiAgICAgICAgICBzdGFydCA9IHJ1bGVzLlBhcnNlclN0YXJ0O1xuICAgICAgICAgIHJ1bGVzID0gcnVsZXMuUGFyc2VyUnVsZXM7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHJ1bGVzID0gcnVsZXMubWFwKGZ1bmN0aW9uIChyKSB7IHJldHVybiAobmV3IFJ1bGUoci5uYW1lLCByLnN5bWJvbHMsIHIucG9zdHByb2Nlc3MpKTsgfSk7XG4gICAgICAgIHZhciBnID0gbmV3IEdyYW1tYXIocnVsZXMsIHN0YXJ0KTtcbiAgICAgICAgZy5sZXhlciA9IGxleGVyOyAvLyBuYi4gc3RvcmluZyBsZXhlciBvbiBHcmFtbWFyIGlzIGlmZnksIGJ1dCB1bmF2b2lkYWJsZVxuICAgICAgICByZXR1cm4gZztcbiAgICB9XG5cblxuICAgIGZ1bmN0aW9uIFN0cmVhbUxleGVyKCkge1xuICAgICAgdGhpcy5yZXNldChcIlwiKTtcbiAgICB9XG5cbiAgICBTdHJlYW1MZXhlci5wcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbihkYXRhLCBzdGF0ZSkge1xuICAgICAgICB0aGlzLmJ1ZmZlciA9IGRhdGE7XG4gICAgICAgIHRoaXMuaW5kZXggPSAwO1xuICAgICAgICB0aGlzLmxpbmUgPSBzdGF0ZSA/IHN0YXRlLmxpbmUgOiAxO1xuICAgICAgICB0aGlzLmxhc3RMaW5lQnJlYWsgPSBzdGF0ZSA/IC1zdGF0ZS5jb2wgOiAwO1xuICAgIH1cblxuICAgIFN0cmVhbUxleGVyLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh0aGlzLmluZGV4IDwgdGhpcy5idWZmZXIubGVuZ3RoKSB7XG4gICAgICAgICAgICB2YXIgY2ggPSB0aGlzLmJ1ZmZlclt0aGlzLmluZGV4KytdO1xuICAgICAgICAgICAgaWYgKGNoID09PSAnXFxuJykge1xuICAgICAgICAgICAgICB0aGlzLmxpbmUgKz0gMTtcbiAgICAgICAgICAgICAgdGhpcy5sYXN0TGluZUJyZWFrID0gdGhpcy5pbmRleDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB7dmFsdWU6IGNofTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIFN0cmVhbUxleGVyLnByb3RvdHlwZS5zYXZlID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBsaW5lOiB0aGlzLmxpbmUsXG4gICAgICAgIGNvbDogdGhpcy5pbmRleCAtIHRoaXMubGFzdExpbmVCcmVhayxcbiAgICAgIH1cbiAgICB9XG5cbiAgICBTdHJlYW1MZXhlci5wcm90b3R5cGUuZm9ybWF0RXJyb3IgPSBmdW5jdGlvbih0b2tlbiwgbWVzc2FnZSkge1xuICAgICAgICAvLyBuYi4gdGhpcyBnZXRzIGNhbGxlZCBhZnRlciBjb25zdW1pbmcgdGhlIG9mZmVuZGluZyB0b2tlbixcbiAgICAgICAgLy8gc28gdGhlIGN1bHByaXQgaXMgaW5kZXgtMVxuICAgICAgICB2YXIgYnVmZmVyID0gdGhpcy5idWZmZXI7XG4gICAgICAgIGlmICh0eXBlb2YgYnVmZmVyID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdmFyIG5leHRMaW5lQnJlYWsgPSBidWZmZXIuaW5kZXhPZignXFxuJywgdGhpcy5pbmRleCk7XG4gICAgICAgICAgICBpZiAobmV4dExpbmVCcmVhayA9PT0gLTEpIG5leHRMaW5lQnJlYWsgPSBidWZmZXIubGVuZ3RoO1xuICAgICAgICAgICAgdmFyIGxpbmUgPSBidWZmZXIuc3Vic3RyaW5nKHRoaXMubGFzdExpbmVCcmVhaywgbmV4dExpbmVCcmVhaylcbiAgICAgICAgICAgIHZhciBjb2wgPSB0aGlzLmluZGV4IC0gdGhpcy5sYXN0TGluZUJyZWFrO1xuICAgICAgICAgICAgbWVzc2FnZSArPSBcIiBhdCBsaW5lIFwiICsgdGhpcy5saW5lICsgXCIgY29sIFwiICsgY29sICsgXCI6XFxuXFxuXCI7XG4gICAgICAgICAgICBtZXNzYWdlICs9IFwiICBcIiArIGxpbmUgKyBcIlxcblwiXG4gICAgICAgICAgICBtZXNzYWdlICs9IFwiICBcIiArIEFycmF5KGNvbCkuam9pbihcIiBcIikgKyBcIl5cIlxuICAgICAgICAgICAgcmV0dXJuIG1lc3NhZ2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbWVzc2FnZSArIFwiIGF0IGluZGV4IFwiICsgKHRoaXMuaW5kZXggLSAxKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgZnVuY3Rpb24gUGFyc2VyKHJ1bGVzLCBzdGFydCwgb3B0aW9ucykge1xuICAgICAgICBpZiAocnVsZXMgaW5zdGFuY2VvZiBHcmFtbWFyKSB7XG4gICAgICAgICAgICB2YXIgZ3JhbW1hciA9IHJ1bGVzO1xuICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSBzdGFydDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBncmFtbWFyID0gR3JhbW1hci5mcm9tQ29tcGlsZWQocnVsZXMsIHN0YXJ0KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmdyYW1tYXIgPSBncmFtbWFyO1xuXG4gICAgICAgIC8vIFJlYWQgb3B0aW9uc1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSB7XG4gICAgICAgICAgICBrZWVwSGlzdG9yeTogZmFsc2UsXG4gICAgICAgICAgICBsZXhlcjogZ3JhbW1hci5sZXhlciB8fCBuZXcgU3RyZWFtTGV4ZXIsXG4gICAgICAgIH07XG4gICAgICAgIGZvciAodmFyIGtleSBpbiAob3B0aW9ucyB8fCB7fSkpIHtcbiAgICAgICAgICAgIHRoaXMub3B0aW9uc1trZXldID0gb3B0aW9uc1trZXldO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU2V0dXAgbGV4ZXJcbiAgICAgICAgdGhpcy5sZXhlciA9IHRoaXMub3B0aW9ucy5sZXhlcjtcbiAgICAgICAgdGhpcy5sZXhlclN0YXRlID0gdW5kZWZpbmVkO1xuXG4gICAgICAgIC8vIFNldHVwIGEgdGFibGVcbiAgICAgICAgdmFyIGNvbHVtbiA9IG5ldyBDb2x1bW4oZ3JhbW1hciwgMCk7XG4gICAgICAgIHZhciB0YWJsZSA9IHRoaXMudGFibGUgPSBbY29sdW1uXTtcblxuICAgICAgICAvLyBJIGNvdWxkIGJlIGV4cGVjdGluZyBhbnl0aGluZy5cbiAgICAgICAgY29sdW1uLndhbnRzW2dyYW1tYXIuc3RhcnRdID0gW107XG4gICAgICAgIGNvbHVtbi5wcmVkaWN0KGdyYW1tYXIuc3RhcnQpO1xuICAgICAgICAvLyBUT0RPIHdoYXQgaWYgc3RhcnQgcnVsZSBpcyBudWxsYWJsZT9cbiAgICAgICAgY29sdW1uLnByb2Nlc3MoKTtcbiAgICAgICAgdGhpcy5jdXJyZW50ID0gMDsgLy8gdG9rZW4gaW5kZXhcbiAgICB9XG5cbiAgICAvLyBjcmVhdGUgYSByZXNlcnZlZCB0b2tlbiBmb3IgaW5kaWNhdGluZyBhIHBhcnNlIGZhaWxcbiAgICBQYXJzZXIuZmFpbCA9IHt9O1xuXG4gICAgUGFyc2VyLnByb3RvdHlwZS5mZWVkID0gZnVuY3Rpb24oY2h1bmspIHtcbiAgICAgICAgdmFyIGxleGVyID0gdGhpcy5sZXhlcjtcbiAgICAgICAgbGV4ZXIucmVzZXQoY2h1bmssIHRoaXMubGV4ZXJTdGF0ZSk7XG5cbiAgICAgICAgdmFyIHRva2VuO1xuICAgICAgICB3aGlsZSAodG9rZW4gPSBsZXhlci5uZXh0KCkpIHtcbiAgICAgICAgICAgIC8vIFdlIGFkZCBuZXcgc3RhdGVzIHRvIHRhYmxlW2N1cnJlbnQrMV1cbiAgICAgICAgICAgIHZhciBjb2x1bW4gPSB0aGlzLnRhYmxlW3RoaXMuY3VycmVudF07XG5cbiAgICAgICAgICAgIC8vIEdDIHVudXNlZCBzdGF0ZXNcbiAgICAgICAgICAgIGlmICghdGhpcy5vcHRpb25zLmtlZXBIaXN0b3J5KSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMudGFibGVbdGhpcy5jdXJyZW50IC0gMV07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBuID0gdGhpcy5jdXJyZW50ICsgMTtcbiAgICAgICAgICAgIHZhciBuZXh0Q29sdW1uID0gbmV3IENvbHVtbih0aGlzLmdyYW1tYXIsIG4pO1xuICAgICAgICAgICAgdGhpcy50YWJsZS5wdXNoKG5leHRDb2x1bW4pO1xuXG4gICAgICAgICAgICAvLyBBZHZhbmNlIGFsbCB0b2tlbnMgdGhhdCBleHBlY3QgdGhlIHN5bWJvbFxuICAgICAgICAgICAgdmFyIGxpdGVyYWwgPSB0b2tlbi50ZXh0ICE9PSB1bmRlZmluZWQgPyB0b2tlbi50ZXh0IDogdG9rZW4udmFsdWU7XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBsZXhlci5jb25zdHJ1Y3RvciA9PT0gU3RyZWFtTGV4ZXIgPyB0b2tlbi52YWx1ZSA6IHRva2VuO1xuICAgICAgICAgICAgdmFyIHNjYW5uYWJsZSA9IGNvbHVtbi5zY2FubmFibGU7XG4gICAgICAgICAgICBmb3IgKHZhciB3ID0gc2Nhbm5hYmxlLmxlbmd0aDsgdy0tOyApIHtcbiAgICAgICAgICAgICAgICB2YXIgc3RhdGUgPSBzY2FubmFibGVbd107XG4gICAgICAgICAgICAgICAgdmFyIGV4cGVjdCA9IHN0YXRlLnJ1bGUuc3ltYm9sc1tzdGF0ZS5kb3RdO1xuICAgICAgICAgICAgICAgIC8vIFRyeSB0byBjb25zdW1lIHRoZSB0b2tlblxuICAgICAgICAgICAgICAgIC8vIGVpdGhlciByZWdleCBvciBsaXRlcmFsXG4gICAgICAgICAgICAgICAgaWYgKGV4cGVjdC50ZXN0ID8gZXhwZWN0LnRlc3QodmFsdWUpIDpcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0LnR5cGUgPyBleHBlY3QudHlwZSA9PT0gdG9rZW4udHlwZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGV4cGVjdC5saXRlcmFsID09PSBsaXRlcmFsKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEFkZCBpdFxuICAgICAgICAgICAgICAgICAgICB2YXIgbmV4dCA9IHN0YXRlLm5leHRTdGF0ZSh7ZGF0YTogdmFsdWUsIHRva2VuOiB0b2tlbiwgaXNUb2tlbjogdHJ1ZSwgcmVmZXJlbmNlOiBuIC0gMX0pO1xuICAgICAgICAgICAgICAgICAgICBuZXh0Q29sdW1uLnN0YXRlcy5wdXNoKG5leHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gTmV4dCwgZm9yIGVhY2ggb2YgdGhlIHJ1bGVzLCB3ZSBlaXRoZXJcbiAgICAgICAgICAgIC8vIChhKSBjb21wbGV0ZSBpdCwgYW5kIHRyeSB0byBzZWUgaWYgdGhlIHJlZmVyZW5jZSByb3cgZXhwZWN0ZWQgdGhhdFxuICAgICAgICAgICAgLy8gICAgIHJ1bGVcbiAgICAgICAgICAgIC8vIChiKSBwcmVkaWN0IHRoZSBuZXh0IG5vbnRlcm1pbmFsIGl0IGV4cGVjdHMgYnkgYWRkaW5nIHRoYXRcbiAgICAgICAgICAgIC8vICAgICBub250ZXJtaW5hbCdzIHN0YXJ0IHN0YXRlXG4gICAgICAgICAgICAvLyBUbyBwcmV2ZW50IGR1cGxpY2F0aW9uLCB3ZSBhbHNvIGtlZXAgdHJhY2sgb2YgcnVsZXMgd2UgaGF2ZSBhbHJlYWR5XG4gICAgICAgICAgICAvLyBhZGRlZFxuXG4gICAgICAgICAgICBuZXh0Q29sdW1uLnByb2Nlc3MoKTtcblxuICAgICAgICAgICAgLy8gSWYgbmVlZGVkLCB0aHJvdyBhbiBlcnJvcjpcbiAgICAgICAgICAgIGlmIChuZXh0Q29sdW1uLnN0YXRlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAvLyBObyBzdGF0ZXMgYXQgYWxsISBUaGlzIGlzIG5vdCBnb29kLlxuICAgICAgICAgICAgICAgIHZhciBtZXNzYWdlID0gdGhpcy5sZXhlci5mb3JtYXRFcnJvcih0b2tlbiwgXCJpbnZhbGlkIHN5bnRheFwiKSArIFwiXFxuXCI7XG4gICAgICAgICAgICAgICAgbWVzc2FnZSArPSBcIlVuZXhwZWN0ZWQgXCIgKyAodG9rZW4udHlwZSA/IHRva2VuLnR5cGUgKyBcIiB0b2tlbjogXCIgOiBcIlwiKTtcbiAgICAgICAgICAgICAgICBtZXNzYWdlICs9IEpTT04uc3RyaW5naWZ5KHRva2VuLnZhbHVlICE9PSB1bmRlZmluZWQgPyB0b2tlbi52YWx1ZSA6IHRva2VuKSArIFwiXFxuXCI7XG4gICAgICAgICAgICAgICAgdmFyIGVyciA9IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgICAgICAgICAgICAgICBlcnIub2Zmc2V0ID0gdGhpcy5jdXJyZW50O1xuICAgICAgICAgICAgICAgIGVyci50b2tlbiA9IHRva2VuO1xuICAgICAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gbWF5YmUgc2F2ZSBsZXhlciBzdGF0ZVxuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5rZWVwSGlzdG9yeSkge1xuICAgICAgICAgICAgICBjb2x1bW4ubGV4ZXJTdGF0ZSA9IGxleGVyLnNhdmUoKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnQrKztcbiAgICAgICAgfVxuICAgICAgICBpZiAoY29sdW1uKSB7XG4gICAgICAgICAgdGhpcy5sZXhlclN0YXRlID0gbGV4ZXIuc2F2ZSgpXG4gICAgICAgIH1cblxuICAgICAgICAvLyBJbmNyZW1lbnRhbGx5IGtlZXAgdHJhY2sgb2YgcmVzdWx0c1xuICAgICAgICB0aGlzLnJlc3VsdHMgPSB0aGlzLmZpbmlzaCgpO1xuXG4gICAgICAgIC8vIEFsbG93IGNoYWluaW5nLCBmb3Igd2hhdGV2ZXIgaXQncyB3b3J0aFxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgUGFyc2VyLnByb3RvdHlwZS5zYXZlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBjb2x1bW4gPSB0aGlzLnRhYmxlW3RoaXMuY3VycmVudF07XG4gICAgICAgIGNvbHVtbi5sZXhlclN0YXRlID0gdGhpcy5sZXhlclN0YXRlO1xuICAgICAgICByZXR1cm4gY29sdW1uO1xuICAgIH07XG5cbiAgICBQYXJzZXIucHJvdG90eXBlLnJlc3RvcmUgPSBmdW5jdGlvbihjb2x1bW4pIHtcbiAgICAgICAgdmFyIGluZGV4ID0gY29sdW1uLmluZGV4O1xuICAgICAgICB0aGlzLmN1cnJlbnQgPSBpbmRleDtcbiAgICAgICAgdGhpcy50YWJsZVtpbmRleF0gPSBjb2x1bW47XG4gICAgICAgIHRoaXMudGFibGUuc3BsaWNlKGluZGV4ICsgMSk7XG4gICAgICAgIHRoaXMubGV4ZXJTdGF0ZSA9IGNvbHVtbi5sZXhlclN0YXRlO1xuXG4gICAgICAgIC8vIEluY3JlbWVudGFsbHkga2VlcCB0cmFjayBvZiByZXN1bHRzXG4gICAgICAgIHRoaXMucmVzdWx0cyA9IHRoaXMuZmluaXNoKCk7XG4gICAgfTtcblxuICAgIC8vIG5iLiBkZXByZWNhdGVkOiB1c2Ugc2F2ZS9yZXN0b3JlIGluc3RlYWQhXG4gICAgUGFyc2VyLnByb3RvdHlwZS5yZXdpbmQgPSBmdW5jdGlvbihpbmRleCkge1xuICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5rZWVwSGlzdG9yeSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdzZXQgb3B0aW9uIGBrZWVwSGlzdG9yeWAgdG8gZW5hYmxlIHJld2luZGluZycpXG4gICAgICAgIH1cbiAgICAgICAgLy8gbmIuIHJlY2FsbCBjb2x1bW4gKHRhYmxlKSBpbmRpY2llcyBmYWxsIGJldHdlZW4gdG9rZW4gaW5kaWNpZXMuXG4gICAgICAgIC8vICAgICAgICBjb2wgMCAgIC0tICAgdG9rZW4gMCAgIC0tICAgY29sIDFcbiAgICAgICAgdGhpcy5yZXN0b3JlKHRoaXMudGFibGVbaW5kZXhdKTtcbiAgICB9O1xuXG4gICAgUGFyc2VyLnByb3RvdHlwZS5maW5pc2ggPSBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gUmV0dXJuIHRoZSBwb3NzaWJsZSBwYXJzaW5nc1xuICAgICAgICB2YXIgY29uc2lkZXJhdGlvbnMgPSBbXTtcbiAgICAgICAgdmFyIHN0YXJ0ID0gdGhpcy5ncmFtbWFyLnN0YXJ0O1xuICAgICAgICB2YXIgY29sdW1uID0gdGhpcy50YWJsZVt0aGlzLnRhYmxlLmxlbmd0aCAtIDFdXG4gICAgICAgIGNvbHVtbi5zdGF0ZXMuZm9yRWFjaChmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgaWYgKHQucnVsZS5uYW1lID09PSBzdGFydFxuICAgICAgICAgICAgICAgICAgICAmJiB0LmRvdCA9PT0gdC5ydWxlLnN5bWJvbHMubGVuZ3RoXG4gICAgICAgICAgICAgICAgICAgICYmIHQucmVmZXJlbmNlID09PSAwXG4gICAgICAgICAgICAgICAgICAgICYmIHQuZGF0YSAhPT0gUGFyc2VyLmZhaWwpIHtcbiAgICAgICAgICAgICAgICBjb25zaWRlcmF0aW9ucy5wdXNoKHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGNvbnNpZGVyYXRpb25zLm1hcChmdW5jdGlvbihjKSB7cmV0dXJuIGMuZGF0YTsgfSk7XG4gICAgfTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIFBhcnNlcjogUGFyc2VyLFxuICAgICAgICBHcmFtbWFyOiBHcmFtbWFyLFxuICAgICAgICBSdWxlOiBSdWxlLFxuICAgIH07XG5cbn0pKTtcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IGZwXzEgPSByZXF1aXJlKFwiLi4vZnBcIik7XHJcbmNvbnN0IHRvQXJyYXlPckVtcHR5XzEgPSByZXF1aXJlKFwiLi90b0FycmF5T3JFbXB0eVwiKTtcclxuZXhwb3J0cy5jaHVuayA9IGZwXzEuY3VycnkoKHNpemUsIGFycmF5KSA9PiB7XHJcbiAgICBjb25zdCBhcnIgPSB0b0FycmF5T3JFbXB0eV8xLnRvQXJyYXlPckVtcHR5KGFycmF5KTtcclxuICAgIGNvbnN0IG91dHB1dCA9IFtdO1xyXG4gICAgbGV0IGNodW5rID0gW107XHJcbiAgICBmb3IgKGxldCBlbGVtIG9mIGFycikge1xyXG4gICAgICAgIGlmIChjaHVuay5sZW5ndGggPj0gc2l6ZSkge1xyXG4gICAgICAgICAgICBvdXRwdXQucHVzaChjaHVuayk7XHJcbiAgICAgICAgICAgIGNodW5rID0gW107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNodW5rLnB1c2goZWxlbSk7XHJcbiAgICB9XHJcbiAgICBpZiAoY2h1bmsubGVuZ3RoKSB7XHJcbiAgICAgICAgb3V0cHV0LnB1c2goY2h1bmspO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG91dHB1dDtcclxufSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNodW5rLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IGZwXzEgPSByZXF1aXJlKFwiLi4vZnBcIik7XHJcbmNvbnN0IHRvQXJyYXlPckVtcHR5XzEgPSByZXF1aXJlKFwiLi90b0FycmF5T3JFbXB0eVwiKTtcclxuZXhwb3J0cy5maWx0ZXIgPSBmcF8xLmN1cnJ5KChmdW5jLCBhcnJheSkgPT4gdG9BcnJheU9yRW1wdHlfMS50b0FycmF5T3JFbXB0eShhcnJheSkuZmlsdGVyKGZ1bmMpKTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmlsdGVyLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IGZpcnN0T3JOdWxsXzEgPSByZXF1aXJlKFwiLi9maXJzdE9yTnVsbFwiKTtcclxuZXhwb3J0cy5maXJzdCA9IGZpcnN0T3JOdWxsXzEuZmlyc3RPck51bGw7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZpcnN0LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IHRvQXJyYXlPckVtcHR5XzEgPSByZXF1aXJlKFwiLi90b0FycmF5T3JFbXB0eVwiKTtcclxuY29uc3QgZnBfMSA9IHJlcXVpcmUoXCIuLi9mcFwiKTtcclxuZXhwb3J0cy5maXJzdE9yID0gZnBfMS5jdXJyeSgoZGVmYXVsdFZhbHVlLCBhcnJheSkgPT4ge1xyXG4gICAgY29uc3QgYXJyID0gdG9BcnJheU9yRW1wdHlfMS50b0FycmF5T3JFbXB0eShhcnJheSk7XHJcbiAgICByZXR1cm4gYXJyLmxlbmd0aCA/IGFyclswXSA6IGRlZmF1bHRWYWx1ZTtcclxufSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZpcnN0T3IuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgZmlyc3RPcl8xID0gcmVxdWlyZShcIi4vZmlyc3RPclwiKTtcclxuZXhwb3J0cy5maXJzdE9yTnVsbCA9IGZpcnN0T3JfMS5maXJzdE9yKG51bGwpO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1maXJzdE9yTnVsbC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBmcF8xID0gcmVxdWlyZShcIi4uL2ZwXCIpO1xyXG5jb25zdCB0b0FycmF5T3JFbXB0eV8xID0gcmVxdWlyZShcIi4vdG9BcnJheU9yRW1wdHlcIik7XHJcbmNvbnN0IG1hcF8xID0gcmVxdWlyZShcIi4vbWFwXCIpO1xyXG5jb25zdCBmbGF0dGVuXzEgPSByZXF1aXJlKFwiLi9mbGF0dGVuXCIpO1xyXG5leHBvcnRzLmZsYXRNYXAgPSBmcF8xLmN1cnJ5KChmdW5jLCBhcnJheSkgPT4gZnBfMS5waXBlKHRvQXJyYXlPckVtcHR5XzEudG9BcnJheU9yRW1wdHkoYXJyYXkpLCBtYXBfMS5tYXAoZnVuYyksIGZsYXR0ZW5fMS5mbGF0dGVuKSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZsYXRNYXAuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgZnBfMSA9IHJlcXVpcmUoXCIuLi9mcFwiKTtcclxuY29uc3QgdG9BcnJheU9yRW1wdHlfMSA9IHJlcXVpcmUoXCIuL3RvQXJyYXlPckVtcHR5XCIpO1xyXG5leHBvcnRzLmZsYXR0ZW4gPSBmcF8xLmN1cnJ5KGFycmF5ID0+IFtdLmNvbmNhdCguLi50b0FycmF5T3JFbXB0eV8xLnRvQXJyYXlPckVtcHR5KGFycmF5KSkpO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1mbGF0dGVuLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IHRvQXJyYXlPckVtcHR5XzEgPSByZXF1aXJlKFwiLi90b0FycmF5T3JFbXB0eVwiKTtcclxuZXhwb3J0cy5mcm9tUGFpcnMgPSAocGFpcnMpID0+IHtcclxuICAgIHJldHVybiB0b0FycmF5T3JFbXB0eV8xLnRvQXJyYXlPckVtcHR5KHBhaXJzKVxyXG4gICAgICAgIC5tYXAoKFtrZXksIHZhbF0pID0+ICh7IFtrZXldOiB2YWwgfSkpXHJcbiAgICAgICAgLnJlZHVjZSgoYSwgYykgPT4gT2JqZWN0LmFzc2lnbihhLCBjKSwge30pO1xyXG59O1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1mcm9tUGFpcnMuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbmZ1bmN0aW9uIF9fZXhwb3J0KG0pIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKCFleHBvcnRzLmhhc093blByb3BlcnR5KHApKSBleHBvcnRzW3BdID0gbVtwXTtcclxufVxyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL2ZpbHRlclwiKSk7XHJcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL2ZsYXRNYXBcIikpO1xyXG5fX2V4cG9ydChyZXF1aXJlKFwiLi9mbGF0dGVuXCIpKTtcclxuX19leHBvcnQocmVxdWlyZShcIi4vbGltaXRcIikpO1xyXG5fX2V4cG9ydChyZXF1aXJlKFwiLi9tYXBcIikpO1xyXG5fX2V4cG9ydChyZXF1aXJlKFwiLi9zY2FuXCIpKTtcclxuX19leHBvcnQocmVxdWlyZShcIi4vc2tpcFwiKSk7XHJcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL3RhcFwiKSk7XHJcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL3ppcFwiKSk7XHJcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL3Rha2VXaGlsZVwiKSk7XHJcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL3RvQXJyYXlPckVtcHR5XCIpKTtcclxuX19leHBvcnQocmVxdWlyZShcIi4vcmVkdWNlXCIpKTtcclxuX19leHBvcnQocmVxdWlyZShcIi4vY2h1bmtcIikpO1xyXG5fX2V4cG9ydChyZXF1aXJlKFwiLi9mcm9tUGFpcnNcIikpO1xyXG5fX2V4cG9ydChyZXF1aXJlKFwiLi9maXJzdFwiKSk7XHJcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL2ZpcnN0T3JcIikpO1xyXG5fX2V4cG9ydChyZXF1aXJlKFwiLi9maXJzdE9yTnVsbFwiKSk7XHJcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL2pvaW5cIikpO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCB0b0FycmF5T3JFbXB0eV8xID0gcmVxdWlyZShcIi4vdG9BcnJheU9yRW1wdHlcIik7XHJcbmNvbnN0IGZwXzEgPSByZXF1aXJlKFwiLi4vZnBcIik7XHJcbmV4cG9ydHMuam9pbiA9IGZwXzEuY3VycnkoKHNlcGFyYXRvciwgYXJyKSA9PiB0b0FycmF5T3JFbXB0eV8xLnRvQXJyYXlPckVtcHR5KGFycikuam9pbihzZXBhcmF0b3IpKTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9am9pbi5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBmcF8xID0gcmVxdWlyZShcIi4uL2ZwXCIpO1xyXG5jb25zdCB0b0FycmF5T3JFbXB0eV8xID0gcmVxdWlyZShcIi4vdG9BcnJheU9yRW1wdHlcIik7XHJcbmV4cG9ydHMubGltaXQgPSBmcF8xLmN1cnJ5KChtYXgsIGFycmF5KSA9PiB0b0FycmF5T3JFbXB0eV8xLnRvQXJyYXlPckVtcHR5KGFycmF5KS5zcGxpY2UoMCwgbWF4KSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWxpbWl0LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IGZwXzEgPSByZXF1aXJlKFwiLi4vZnBcIik7XHJcbmNvbnN0IHRvQXJyYXlPckVtcHR5XzEgPSByZXF1aXJlKFwiLi90b0FycmF5T3JFbXB0eVwiKTtcclxuZXhwb3J0cy5tYXAgPSBmcF8xLmN1cnJ5KChmdW5jLCBhcnJheSkgPT4gdG9BcnJheU9yRW1wdHlfMS50b0FycmF5T3JFbXB0eShhcnJheSkubWFwKGZ1bmMpKTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWFwLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IGZwXzEgPSByZXF1aXJlKFwiLi4vZnBcIik7XHJcbmNvbnN0IHRvQXJyYXlPckVtcHR5XzEgPSByZXF1aXJlKFwiLi90b0FycmF5T3JFbXB0eVwiKTtcclxuZXhwb3J0cy5yZWR1Y2UgPSBmcF8xLmN1cnJ5KChmdW5jLCBzdGFydCwgYXJyYXkpID0+IHRvQXJyYXlPckVtcHR5XzEudG9BcnJheU9yRW1wdHkoYXJyYXkpLnJlZHVjZShmdW5jLCBzdGFydCkpO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1yZWR1Y2UuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgZnBfMSA9IHJlcXVpcmUoXCIuLi9mcFwiKTtcclxuY29uc3QgdG9BcnJheU9yRW1wdHlfMSA9IHJlcXVpcmUoXCIuL3RvQXJyYXlPckVtcHR5XCIpO1xyXG5leHBvcnRzLnNjYW4gPSBmcF8xLmN1cnJ5KChmdW5jLCBzdGFydCwgYXJyYXkpID0+IHtcclxuICAgIGxldCBhY2N1bXVsYXRlZCA9IHN0YXJ0O1xyXG4gICAgcmV0dXJuIHRvQXJyYXlPckVtcHR5XzEudG9BcnJheU9yRW1wdHkoYXJyYXkpLm1hcCgoZWxlbSkgPT4ge1xyXG4gICAgICAgIGFjY3VtdWxhdGVkID0gZnVuYyhhY2N1bXVsYXRlZCwgZWxlbSk7XHJcbiAgICAgICAgcmV0dXJuIGFjY3VtdWxhdGVkO1xyXG4gICAgfSk7XHJcbn0pO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1zY2FuLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IGZwXzEgPSByZXF1aXJlKFwiLi4vZnBcIik7XHJcbmNvbnN0IHRvQXJyYXlPckVtcHR5XzEgPSByZXF1aXJlKFwiLi90b0FycmF5T3JFbXB0eVwiKTtcclxuZXhwb3J0cy5za2lwID0gZnBfMS5jdXJyeSgoYW10LCBhcnJheSkgPT4gdG9BcnJheU9yRW1wdHlfMS50b0FycmF5T3JFbXB0eShhcnJheSkuc3BsaWNlKGFtdCkpO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1za2lwLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IGZwXzEgPSByZXF1aXJlKFwiLi4vZnBcIik7XHJcbmNvbnN0IHRvQXJyYXlPckVtcHR5XzEgPSByZXF1aXJlKFwiLi90b0FycmF5T3JFbXB0eVwiKTtcclxuZXhwb3J0cy50YWtlV2hpbGUgPSBmcF8xLmN1cnJ5KCh3aGlsZUZ1bmMsIGFycmF5KSA9PiB7XHJcbiAgICBjb25zdCBhcnIgPSB0b0FycmF5T3JFbXB0eV8xLnRvQXJyYXlPckVtcHR5KGFycmF5KTtcclxuICAgIGNvbnN0IHJlcyA9IFtdO1xyXG4gICAgZm9yIChjb25zdCB2YWwgb2YgYXJyKSB7XHJcbiAgICAgICAgaWYgKHdoaWxlRnVuYyh2YWwpKVxyXG4gICAgICAgICAgICByZXMucHVzaCh2YWwpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgcmV0dXJuIHJlcztcclxuICAgIH1cclxuICAgIHJldHVybiByZXM7XHJcbn0pO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD10YWtlV2hpbGUuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgZnBfMSA9IHJlcXVpcmUoXCIuLi9mcFwiKTtcclxuY29uc3QgdG9BcnJheU9yRW1wdHlfMSA9IHJlcXVpcmUoXCIuL3RvQXJyYXlPckVtcHR5XCIpO1xyXG5leHBvcnRzLnRhcCA9IGZwXzEuY3VycnkoKGZ1bmMsIGFycmF5KSA9PiB7XHJcbiAgICB0b0FycmF5T3JFbXB0eV8xLnRvQXJyYXlPckVtcHR5KGFycmF5KS5mb3JFYWNoKGZ1bmMpO1xyXG4gICAgcmV0dXJuIGFycmF5O1xyXG59KTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dGFwLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmZ1bmN0aW9uIHRvQXJyYXlPckVtcHR5KG9iaikge1xyXG4gICAgaWYgKEFycmF5LmlzQXJyYXkob2JqKSlcclxuICAgICAgICByZXR1cm4gb2JqO1xyXG4gICAgcmV0dXJuIFtdO1xyXG59XHJcbmV4cG9ydHMudG9BcnJheU9yRW1wdHkgPSB0b0FycmF5T3JFbXB0eTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dG9BcnJheU9yRW1wdHkuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgZnBfMSA9IHJlcXVpcmUoXCIuLi9mcFwiKTtcclxuZXhwb3J0cy56aXAgPSBmcF8xLmN1cnJ5KChhcnJMZWZ0LCBhcnJSaWdodCwgLi4ubW9yZUFycmF5cykgPT4ge1xyXG4gICAgY29uc3QgYXJyYXlzID0gW2FyckxlZnQsIGFyclJpZ2h0LCAuLi5tb3JlQXJyYXlzXTtcclxuICAgIGNvbnN0IG1heExlbiA9IE1hdGgubWF4KC4uLmFycmF5cy5tYXAoYSA9PiBhLmxlbmd0aCkpO1xyXG4gICAgY29uc3QgcmVzID0gW107XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1heExlbjsgKytpKSB7XHJcbiAgICAgICAgcmVzLnB1c2goYXJyYXlzLm1hcChhID0+IChpIDwgYS5sZW5ndGggPyBhW2ldIDogbnVsbCkpKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXM7XHJcbn0pO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD16aXAuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5jdXJyeSA9IGZ1bmMgPT4ge1xyXG4gICAgY29uc3QgY3VycnlJbXBsID0gKHByb3ZpZGVkQXJncykgPT4gKC4uLmFyZ3MpID0+IHtcclxuICAgICAgICBjb25zdCBjb25jYXRBcmdzID0gcHJvdmlkZWRBcmdzLmNvbmNhdChhcmdzKTtcclxuICAgICAgICBpZiAoY29uY2F0QXJncy5sZW5ndGggPCBmdW5jLmxlbmd0aCkge1xyXG4gICAgICAgICAgICByZXR1cm4gY3VycnlJbXBsKGNvbmNhdEFyZ3MpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZnVuYyguLi5jb25jYXRBcmdzKTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gY3VycnlJbXBsKFtdKTtcclxufTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y3VycnkuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbmZ1bmN0aW9uIF9fZXhwb3J0KG0pIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKCFleHBvcnRzLmhhc093blByb3BlcnR5KHApKSBleHBvcnRzW3BdID0gbVtwXTtcclxufVxyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL2N1cnJ5XCIpKTtcclxuX19leHBvcnQocmVxdWlyZShcIi4vcGlwZVwiKSk7XHJcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL3ByZWRpY2F0ZVwiKSk7XHJcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL3JldmVyc2VBcmdzXCIpKTtcclxuX19leHBvcnQocmVxdWlyZShcIi4vcmV2ZXJzZUN1cnJ5XCIpKTtcclxuX19leHBvcnQocmVxdWlyZShcIi4vc3ByZWFkXCIpKTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgaXNfMSA9IHJlcXVpcmUoXCIuLi9pc1wiKTtcclxuZXhwb3J0cy5waXBlID0gKHBhcmFtT3JGdW5jLCAuLi5mdW5jdGlvbnMpID0+IHtcclxuICAgIGlmIChpc18xLmlzRnVuY3Rpb24ocGFyYW1PckZ1bmMpKSB7XHJcbiAgICAgICAgcmV0dXJuIGNoYWluKHBhcmFtT3JGdW5jLCAuLi5mdW5jdGlvbnMpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGNoYWluKC4uLmZ1bmN0aW9ucykocGFyYW1PckZ1bmMpO1xyXG59O1xyXG5mdW5jdGlvbiBjaGFpbiguLi5mdW5jcykge1xyXG4gICAgcmV0dXJuIChwYXJhbSkgPT4ge1xyXG4gICAgICAgIGxldCBsYXN0VmFsID0gcGFyYW07XHJcbiAgICAgICAgZm9yIChjb25zdCBmdW5jIG9mIGZ1bmNzKSB7XHJcbiAgICAgICAgICAgIGxhc3RWYWwgPSBmdW5jKGxhc3RWYWwpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbGFzdFZhbDtcclxuICAgIH07XHJcbn1cclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGlwZS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmFuZCA9ICguLi5wcmVkaWNhdGVzKSA9PiAocGFyYW0pID0+IFsuLi5wcmVkaWNhdGVzXS5yZWR1Y2UoKGEsIHApID0+IGEgJiYgcChwYXJhbSksIHRydWUpICYmICEhcHJlZGljYXRlcy5sZW5ndGg7XHJcbmV4cG9ydHMub3IgPSAoLi4ucHJlZGljYXRlcykgPT4gKHBhcmFtKSA9PiBbLi4ucHJlZGljYXRlc10ucmVkdWNlKChhLCBwKSA9PiBhIHx8IHAocGFyYW0pLCBmYWxzZSk7XHJcbmV4cG9ydHMueG9yID0gKC4uLnByZWRpY2F0ZXMpID0+IChwYXJhbSkgPT4gWy4uLnByZWRpY2F0ZXNdLm1hcChwID0+ICtwKHBhcmFtKSkucmVkdWNlKChhLCBjKSA9PiBhICsgYywgMCkgPT09IDE7XHJcbmV4cG9ydHMubmVnYXRlID0gKHAxKSA9PiAocGFyYW0pID0+ICFwMShwYXJhbSk7XHJcbmV4cG9ydHMudG9QcmVkaWNhdGUgPSAocCkgPT4gKHBhcmFtKSA9PiAhIXAocGFyYW0pO1xyXG5leHBvcnRzLmJvb2xUb1ByZWRpY2F0ZSA9IChiKSA9PiAoKSA9PiBiO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1wcmVkaWNhdGUuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZnVuY3Rpb24gcmV2ZXJzZUFyZ3MoZnVuYykge1xyXG4gICAgcmV0dXJuICguLi5hcmdzKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmMoLi4uYXJncy5yZXZlcnNlKCkpO1xyXG4gICAgfTtcclxufVxyXG5leHBvcnRzLnJldmVyc2VBcmdzID0gcmV2ZXJzZUFyZ3M7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXJldmVyc2VBcmdzLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IHJldmVyc2VBcmdzXzEgPSByZXF1aXJlKFwiLi9yZXZlcnNlQXJnc1wiKTtcclxuZXhwb3J0cy5yZXZlcnNlQ3VycnkgPSBmdW5jID0+IHtcclxuICAgIGNvbnN0IGN1cnJ5SW1wbCA9IHByb3ZpZGVkQXJncyA9PiAoLi4uYXJncykgPT4ge1xyXG4gICAgICAgIGNvbnN0IGNvbmNhdEFyZ3MgPSBwcm92aWRlZEFyZ3MuY29uY2F0KGFyZ3MpO1xyXG4gICAgICAgIGlmIChjb25jYXRBcmdzLmxlbmd0aCA8IGZ1bmMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBjdXJyeUltcGwoY29uY2F0QXJncyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXZlcnNlQXJnc18xLnJldmVyc2VBcmdzKGZ1bmMpKC4uLmNvbmNhdEFyZ3MpO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBjdXJyeUltcGwoW10pO1xyXG59O1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1yZXZlcnNlQ3VycnkuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgY3VycnlfMSA9IHJlcXVpcmUoXCIuL2N1cnJ5XCIpO1xyXG5leHBvcnRzLnNwcmVhZCA9IGN1cnJ5XzEuY3VycnkoKGZ1bmMsIGFyZ3MpID0+IGZ1bmMoLi4uYXJncykpO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1zcHJlYWQuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbmZ1bmN0aW9uIF9fZXhwb3J0KG0pIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKCFleHBvcnRzLmhhc093blByb3BlcnR5KHApKSBleHBvcnRzW3BdID0gbVtwXTtcclxufVxyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL2lzRnVuY3Rpb25cIikpO1xyXG5fX2V4cG9ydChyZXF1aXJlKFwiLi9pc0luZmluaXRlXCIpKTtcclxuX19leHBvcnQocmVxdWlyZShcIi4vaXNJdGVyYWJsZVwiKSk7XHJcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL2lzTmlsXCIpKTtcclxuX19leHBvcnQocmVxdWlyZShcIi4vaXNOdWxsXCIpKTtcclxuX19leHBvcnQocmVxdWlyZShcIi4vaXNPYmplY3RcIikpO1xyXG5fX2V4cG9ydChyZXF1aXJlKFwiLi9pc1VuZGVmaW5lZFwiKSk7XHJcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL2lzTnVtYmVyXCIpKTtcclxuX19leHBvcnQocmVxdWlyZShcIi4vaXNTdHJpbmdcIikpO1xyXG5fX2V4cG9ydChyZXF1aXJlKFwiLi9pc0ludGVnZXJcIikpO1xyXG5fX2V4cG9ydChyZXF1aXJlKFwiLi9pc0Zsb2F0XCIpKTtcclxuX19leHBvcnQocmVxdWlyZShcIi4vaXNBcnJheVwiKSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuaXNBcnJheSA9IEFycmF5LmlzQXJyYXk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWlzQXJyYXkuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgaXNOdW1iZXJfMSA9IHJlcXVpcmUoXCIuL2lzTnVtYmVyXCIpO1xyXG5leHBvcnRzLmlzRmxvYXQgPSBpc051bWJlcl8xLmlzTnVtYmVyO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1pc0Zsb2F0LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuaXNGdW5jdGlvbiA9IChwYXJhbSkgPT4gdHlwZW9mIHBhcmFtID09PSAnZnVuY3Rpb24nO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1pc0Z1bmN0aW9uLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuaXNJbmZpbml0ZSA9IChwYXJhbSkgPT4gcGFyYW0gPT09IEluZmluaXR5IHx8IHBhcmFtID09PSAtSW5maW5pdHk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWlzSW5maW5pdGUuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5pc0ludGVnZXIgPSAocGFyYW0pID0+IChwYXJhbSB8IDApID09PSBwYXJhbTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aXNJbnRlZ2VyLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IGlzT2JqZWN0XzEgPSByZXF1aXJlKFwiLi9pc09iamVjdFwiKTtcclxuY29uc3QgaXNGdW5jdGlvbl8xID0gcmVxdWlyZShcIi4vaXNGdW5jdGlvblwiKTtcclxuZXhwb3J0cy5pc0l0ZXJhYmxlID0gKHBhcmFtKSA9PiBpc09iamVjdF8xLmlzT2JqZWN0KHBhcmFtKSAmJiBpc0Z1bmN0aW9uXzEuaXNGdW5jdGlvbihwYXJhbVtTeW1ib2wuaXRlcmF0b3JdKTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aXNJdGVyYWJsZS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBpc051bGxfMSA9IHJlcXVpcmUoXCIuL2lzTnVsbFwiKTtcclxuY29uc3QgaXNVbmRlZmluZWRfMSA9IHJlcXVpcmUoXCIuL2lzVW5kZWZpbmVkXCIpO1xyXG5leHBvcnRzLmlzTmlsID0gKHBhcmFtKSA9PiBpc051bGxfMS5pc051bGwocGFyYW0pIHx8IGlzVW5kZWZpbmVkXzEuaXNVbmRlZmluZWQocGFyYW0pO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1pc05pbC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmlzTnVsbCA9IChwYXJhbSkgPT4gcGFyYW0gPT09IG51bGw7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWlzTnVsbC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmlzTnVtYmVyID0gKHBhcmFtKSA9PiB0eXBlb2YgcGFyYW0gPT09ICdudW1iZXInO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1pc051bWJlci5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmlzT2JqZWN0ID0gKHBhcmFtKSA9PiBwYXJhbSA9PT0gT2JqZWN0KHBhcmFtKTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aXNPYmplY3QuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5pc1N0cmluZyA9IChwYXJhbSkgPT4gdHlwZW9mIHBhcmFtID09PSAnc3RyaW5nJztcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aXNTdHJpbmcuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5pc1VuZGVmaW5lZCA9IChwYXJhbSkgPT4gdHlwZW9mIHBhcmFtID09PSAndW5kZWZpbmVkJztcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aXNVbmRlZmluZWQuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgZnBfMSA9IHJlcXVpcmUoXCIuLi9mcFwiKTtcclxuY29uc3QgdG9JdGVyYWJsZU9yRW1wdHlfMSA9IHJlcXVpcmUoXCIuL3RvSXRlcmFibGVPckVtcHR5XCIpO1xyXG5leHBvcnRzLmNodW5rID0gZnBfMS5jdXJyeShmdW5jdGlvbiogKHNpemUsIGl0ZXJhYmxlKSB7XHJcbiAgICBjb25zdCBpdGVyID0gdG9JdGVyYWJsZU9yRW1wdHlfMS50b0l0ZXJhYmxlT3JFbXB0eShpdGVyYWJsZSk7XHJcbiAgICBsZXQgY2h1bmtzID0gW107XHJcbiAgICBmb3IgKGNvbnN0IGVsZW0gb2YgaXRlcikge1xyXG4gICAgICAgIGlmIChjaHVua3MubGVuZ3RoID49IHNpemUpIHtcclxuICAgICAgICAgICAgeWllbGQgY2h1bmtzO1xyXG4gICAgICAgICAgICBjaHVua3MgPSBbXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2h1bmtzLnB1c2goZWxlbSk7XHJcbiAgICB9XHJcbiAgICBpZiAoY2h1bmtzLmxlbmd0aCkge1xyXG4gICAgICAgIHlpZWxkIGNodW5rcztcclxuICAgIH1cclxufSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNodW5rLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IGlzXzEgPSByZXF1aXJlKFwiLi4vaXNcIik7XHJcbmNvbnN0IGxpbWl0XzEgPSByZXF1aXJlKFwiLi9saW1pdFwiKTtcclxuY29uc3QgdG9JdGVyYWJsZU9yRW1wdHlfMSA9IHJlcXVpcmUoXCIuL3RvSXRlcmFibGVPckVtcHR5XCIpO1xyXG5leHBvcnRzLmNvbGxlY3RUb0FycmF5ID0gKGl0ZXJhYmxlLCBtYXggPSBJbmZpbml0eSkgPT4gaXNfMS5pc0luZmluaXRlKG1heClcclxuICAgID8gWy4uLnRvSXRlcmFibGVPckVtcHR5XzEudG9JdGVyYWJsZU9yRW1wdHkoaXRlcmFibGUpXVxyXG4gICAgOiBleHBvcnRzLmNvbGxlY3RUb0FycmF5KGxpbWl0XzEubGltaXQobWF4LCB0b0l0ZXJhYmxlT3JFbXB0eV8xLnRvSXRlcmFibGVPckVtcHR5KGl0ZXJhYmxlKSkpO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb2xsZWN0VG9BcnJheS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBmcF8xID0gcmVxdWlyZShcIi4uL2ZwXCIpO1xyXG5jb25zdCB0b0l0ZXJhYmxlT3JFbXB0eV8xID0gcmVxdWlyZShcIi4vdG9JdGVyYWJsZU9yRW1wdHlcIik7XHJcbmV4cG9ydHMuZmlsdGVyID0gZnBfMS5jdXJyeShmdW5jdGlvbiogKGZ1bmMsIGl0ZXJhYmxlKSB7XHJcbiAgICBjb25zdCBpdGVyID0gdG9JdGVyYWJsZU9yRW1wdHlfMS50b0l0ZXJhYmxlT3JFbXB0eShpdGVyYWJsZSk7XHJcbiAgICBmb3IgKGNvbnN0IHZhbCBvZiBpdGVyKSB7XHJcbiAgICAgICAgaWYgKGZ1bmModmFsKSlcclxuICAgICAgICAgICAgeWllbGQgdmFsO1xyXG4gICAgfVxyXG59KTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmlsdGVyLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IHRha2VfMSA9IHJlcXVpcmUoXCIuL3Rha2VcIik7XHJcbmV4cG9ydHMuZmlyc3QgPSB0YWtlXzEudGFrZSgxKTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Zmlyc3QuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgZnBfMSA9IHJlcXVpcmUoXCIuLi9mcFwiKTtcclxuZXhwb3J0cy5maXJzdE9yID0gZnBfMS5jdXJyeSgoZGVmYXVsdFZhbHVlLCBpdGVyYWJsZSkgPT4ge1xyXG4gICAgZm9yIChjb25zdCB2IG9mIGl0ZXJhYmxlKSB7XHJcbiAgICAgICAgcmV0dXJuIHY7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZGVmYXVsdFZhbHVlO1xyXG59KTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Zmlyc3RPci5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBmaXJzdE9yXzEgPSByZXF1aXJlKFwiLi9maXJzdE9yXCIpO1xyXG5leHBvcnRzLmZpcnN0T3JOdWxsID0gZmlyc3RPcl8xLmZpcnN0T3IobnVsbCk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZpcnN0T3JOdWxsLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IGZwXzEgPSByZXF1aXJlKFwiLi4vZnBcIik7XHJcbmNvbnN0IGlzXzEgPSByZXF1aXJlKFwiLi4vaXNcIik7XHJcbmNvbnN0IHRvSXRlcmFibGVPckVtcHR5XzEgPSByZXF1aXJlKFwiLi90b0l0ZXJhYmxlT3JFbXB0eVwiKTtcclxuZXhwb3J0cy5mbGF0TWFwID0gZnBfMS5jdXJyeShmdW5jdGlvbiogKGZ1bmMsIGl0ZXJhYmxlKSB7XHJcbiAgICBjb25zdCBpdGVyID0gdG9JdGVyYWJsZU9yRW1wdHlfMS50b0l0ZXJhYmxlT3JFbXB0eShpdGVyYWJsZSk7XHJcbiAgICBmb3IgKGNvbnN0IHZhbCBvZiBpdGVyKSB7XHJcbiAgICAgICAgY29uc3QgbmV3SXRlcmFibGUgPSBmdW5jKHZhbCk7XHJcbiAgICAgICAgaWYgKGlzXzEuaXNJdGVyYWJsZShuZXdJdGVyYWJsZSkpIHtcclxuICAgICAgICAgICAgZm9yIChjb25zdCBuZXdWYWwgb2YgbmV3SXRlcmFibGUpXHJcbiAgICAgICAgICAgICAgICB5aWVsZCBuZXdWYWw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB5aWVsZCBuZXdJdGVyYWJsZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1mbGF0TWFwLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IGZwXzEgPSByZXF1aXJlKFwiLi4vZnBcIik7XHJcbmNvbnN0IGlzXzEgPSByZXF1aXJlKFwiLi4vaXNcIik7XHJcbmNvbnN0IHRvSXRlcmFibGVPckVtcHR5XzEgPSByZXF1aXJlKFwiLi90b0l0ZXJhYmxlT3JFbXB0eVwiKTtcclxuZXhwb3J0cy5mbGF0dGVuID0gZnBfMS5jdXJyeShmdW5jdGlvbiogKGl0ZXJhYmxlKSB7XHJcbiAgICBjb25zdCBpdGVyID0gdG9JdGVyYWJsZU9yRW1wdHlfMS50b0l0ZXJhYmxlT3JFbXB0eShpdGVyYWJsZSk7XHJcbiAgICBmb3IgKGNvbnN0IHZhbCBvZiBpdGVyKSB7XHJcbiAgICAgICAgaWYgKGlzXzEuaXNJdGVyYWJsZSh2YWwpKSB7XHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgaW5uZXJWYWwgb2YgdmFsKVxyXG4gICAgICAgICAgICAgICAgeWllbGQgaW5uZXJWYWw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB5aWVsZCB2YWw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmxhdHRlbi5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBmaXJzdF8xID0gcmVxdWlyZShcIi4vZmlyc3RcIik7XHJcbmV4cG9ydHMuaGVhZCA9IGZpcnN0XzEuZmlyc3Q7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWhlYWQuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbmZ1bmN0aW9uIF9fZXhwb3J0KG0pIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKCFleHBvcnRzLmhhc093blByb3BlcnR5KHApKSBleHBvcnRzW3BdID0gbVtwXTtcclxufVxyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL2NvbGxlY3RUb0FycmF5XCIpKTtcclxuX19leHBvcnQocmVxdWlyZShcIi4vZmlsdGVyXCIpKTtcclxuX19leHBvcnQocmVxdWlyZShcIi4vZmxhdE1hcFwiKSk7XHJcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL2ZsYXR0ZW5cIikpO1xyXG5fX2V4cG9ydChyZXF1aXJlKFwiLi9saW1pdFwiKSk7XHJcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL21hcFwiKSk7XHJcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL3NjYW5cIikpO1xyXG5fX2V4cG9ydChyZXF1aXJlKFwiLi9za2lwXCIpKTtcclxuX19leHBvcnQocmVxdWlyZShcIi4vdGFwXCIpKTtcclxuX19leHBvcnQocmVxdWlyZShcIi4vemlwXCIpKTtcclxuX19leHBvcnQocmVxdWlyZShcIi4vdGFrZVdoaWxlXCIpKTtcclxuX19leHBvcnQocmVxdWlyZShcIi4vY2h1bmtcIikpO1xyXG5fX2V4cG9ydChyZXF1aXJlKFwiLi9maXJzdFwiKSk7XHJcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL3Rha2VcIikpO1xyXG5fX2V4cG9ydChyZXF1aXJlKFwiLi9oZWFkXCIpKTtcclxuX19leHBvcnQocmVxdWlyZShcIi4vZmlyc3RPclwiKSk7XHJcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL2ZpcnN0T3JOdWxsXCIpKTtcclxuX19leHBvcnQocmVxdWlyZShcIi4vam9pblwiKSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IHRvSXRlcmFibGVPckVtcHR5XzEgPSByZXF1aXJlKFwiLi90b0l0ZXJhYmxlT3JFbXB0eVwiKTtcclxuY29uc3QgZnBfMSA9IHJlcXVpcmUoXCIuLi9mcFwiKTtcclxuY29uc3QgY29sbGVjdFRvQXJyYXlfMSA9IHJlcXVpcmUoXCIuL2NvbGxlY3RUb0FycmF5XCIpO1xyXG5leHBvcnRzLmpvaW4gPSBmcF8xLmN1cnJ5KGZ1bmN0aW9uKiAoc2VwYXJhdG9yLCBpdGVyYWJsZSkge1xyXG4gICAgeWllbGQgY29sbGVjdFRvQXJyYXlfMS5jb2xsZWN0VG9BcnJheSh0b0l0ZXJhYmxlT3JFbXB0eV8xLnRvSXRlcmFibGVPckVtcHR5KGl0ZXJhYmxlKSkuam9pbihzZXBhcmF0b3IpO1xyXG59KTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9am9pbi5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBmcF8xID0gcmVxdWlyZShcIi4uL2ZwXCIpO1xyXG5jb25zdCB0b0l0ZXJhYmxlT3JFbXB0eV8xID0gcmVxdWlyZShcIi4vdG9JdGVyYWJsZU9yRW1wdHlcIik7XHJcbmV4cG9ydHMubGltaXQgPSBmcF8xLmN1cnJ5KGZ1bmN0aW9uKiAobWF4LCBpdGVyYWJsZSkge1xyXG4gICAgY29uc3QgaXRlciA9IHRvSXRlcmFibGVPckVtcHR5XzEudG9JdGVyYWJsZU9yRW1wdHkoaXRlcmFibGUpO1xyXG4gICAgbGV0IGNvdW50ID0gMDtcclxuICAgIGZvciAoY29uc3QgdmFsIG9mIGl0ZXIpIHtcclxuICAgICAgICBpZiAoY291bnQrKyA8IChtYXggfCAwKSkge1xyXG4gICAgICAgICAgICB5aWVsZCB2YWw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1saW1pdC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBmcF8xID0gcmVxdWlyZShcIi4uL2ZwXCIpO1xyXG5jb25zdCB0b0l0ZXJhYmxlT3JFbXB0eV8xID0gcmVxdWlyZShcIi4vdG9JdGVyYWJsZU9yRW1wdHlcIik7XHJcbmV4cG9ydHMubWFwID0gZnBfMS5jdXJyeShmdW5jdGlvbiogKGZ1bmMsIGl0ZXJhYmxlKSB7XHJcbiAgICBjb25zdCBpdGVyID0gdG9JdGVyYWJsZU9yRW1wdHlfMS50b0l0ZXJhYmxlT3JFbXB0eShpdGVyYWJsZSk7XHJcbiAgICBmb3IgKGNvbnN0IHZhbCBvZiBpdGVyKVxyXG4gICAgICAgIHlpZWxkIGZ1bmModmFsKTtcclxufSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1hcC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBmcF8xID0gcmVxdWlyZShcIi4uL2ZwXCIpO1xyXG5jb25zdCB0b0l0ZXJhYmxlT3JFbXB0eV8xID0gcmVxdWlyZShcIi4vdG9JdGVyYWJsZU9yRW1wdHlcIik7XHJcbmV4cG9ydHMuc2NhbiA9IGZwXzEuY3VycnkoZnVuY3Rpb24qIChmdW5jLCBzdGFydCwgaXRlcmFibGUpIHtcclxuICAgIGNvbnN0IGl0ZXIgPSB0b0l0ZXJhYmxlT3JFbXB0eV8xLnRvSXRlcmFibGVPckVtcHR5KGl0ZXJhYmxlKTtcclxuICAgIGxldCBhY2N1bXVsYXRlZCA9IHN0YXJ0O1xyXG4gICAgZm9yIChjb25zdCB2YWwgb2YgaXRlcikge1xyXG4gICAgICAgIGFjY3VtdWxhdGVkID0gZnVuYyhhY2N1bXVsYXRlZCwgdmFsKTtcclxuICAgICAgICB5aWVsZCBhY2N1bXVsYXRlZDtcclxuICAgIH1cclxufSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXNjYW4uanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgZnBfMSA9IHJlcXVpcmUoXCIuLi9mcFwiKTtcclxuY29uc3QgdG9JdGVyYWJsZU9yRW1wdHlfMSA9IHJlcXVpcmUoXCIuL3RvSXRlcmFibGVPckVtcHR5XCIpO1xyXG5leHBvcnRzLnNraXAgPSBmcF8xLmN1cnJ5KGZ1bmN0aW9uKiAoYW10ID0gMSwgaXRlcmFibGUpIHtcclxuICAgIGNvbnN0IGl0ZXIgPSB0b0l0ZXJhYmxlT3JFbXB0eV8xLnRvSXRlcmFibGVPckVtcHR5KGl0ZXJhYmxlKVtTeW1ib2wuaXRlcmF0b3JdKCk7XHJcbiAgICBsZXQgaXNEb25lID0gZmFsc2U7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFtdCAmJiAhaXNEb25lOyArK2kpIHtcclxuICAgICAgICBpc0RvbmUgPSBpdGVyLm5leHQoKS5kb25lO1xyXG4gICAgfVxyXG4gICAgaWYgKGlzRG9uZSlcclxuICAgICAgICByZXR1cm47XHJcbiAgICB3aGlsZSAodHJ1ZSkge1xyXG4gICAgICAgIGNvbnN0IHsgZG9uZSwgdmFsdWUgfSA9IGl0ZXIubmV4dCgpO1xyXG4gICAgICAgIGlmIChkb25lKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgeWllbGQgdmFsdWU7XHJcbiAgICB9XHJcbn0pO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1za2lwLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IHRvSXRlcmFibGVPckVtcHR5XzEgPSByZXF1aXJlKFwiLi90b0l0ZXJhYmxlT3JFbXB0eVwiKTtcclxuY29uc3QgZnBfMSA9IHJlcXVpcmUoXCIuLi9mcFwiKTtcclxuZXhwb3J0cy50YWtlID0gZnBfMS5jdXJyeShmdW5jdGlvbiogKGxpbWl0LCBpdGVyYWJsZSkge1xyXG4gICAgbGV0IGkgPSAwO1xyXG4gICAgY29uc3QgaXRlciA9IHRvSXRlcmFibGVPckVtcHR5XzEudG9JdGVyYWJsZU9yRW1wdHkoaXRlcmFibGUpO1xyXG4gICAgZm9yIChjb25zdCB2IG9mIGl0ZXIpIHtcclxuICAgICAgICBpZiAoaSsrIDwgbGltaXQpIHtcclxuICAgICAgICAgICAgeWllbGQgdjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD10YWtlLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IGZwXzEgPSByZXF1aXJlKFwiLi4vZnBcIik7XHJcbmNvbnN0IGlzXzEgPSByZXF1aXJlKFwiLi4vaXNcIik7XHJcbmV4cG9ydHMudGFrZVdoaWxlID0gZnBfMS5jdXJyeShmdW5jdGlvbiogKHdoaWxlRnVuYywgaXRlcikge1xyXG4gICAgaWYgKGlzXzEuaXNJdGVyYWJsZSh3aGlsZUZ1bmMpKSB7XHJcbiAgICAgICAgY29uc3Qgd2hpbGVJdGVyID0gd2hpbGVGdW5jW1N5bWJvbC5pdGVyYXRvcl0oKTtcclxuICAgICAgICBmb3IgKGNvbnN0IHZhbCBvZiBpdGVyKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHF1aXRJbmRpY2F0b3IgPSB3aGlsZUl0ZXIubmV4dCgpO1xyXG4gICAgICAgICAgICBpZiAoIXF1aXRJbmRpY2F0b3IudmFsdWUgfHwgcXVpdEluZGljYXRvci5kb25lKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB5aWVsZCB2YWw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgZm9yIChjb25zdCB2YWwgb2YgaXRlcikge1xyXG4gICAgICAgICAgICBpZiAod2hpbGVGdW5jKHZhbCkpXHJcbiAgICAgICAgICAgICAgICB5aWVsZCB2YWw7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pO1xyXG5leHBvcnRzLnRha2VXaGlsZVB1bGxQdXNoID0gZnBfMS5jdXJyeShmdW5jdGlvbiogKHdoaWxlSXRlcmFibGUsIGl0ZXIpIHtcclxuICAgIGNvbnN0IHdoaWxlSXRlciA9IHdoaWxlSXRlcmFibGVbU3ltYm9sLml0ZXJhdG9yXSgpO1xyXG4gICAgZm9yIChjb25zdCB2YWwgb2YgaXRlcikge1xyXG4gICAgICAgIGxldCBxdWl0SW5kaWNhdG9yID0gd2hpbGVJdGVyLm5leHQoKTtcclxuICAgICAgICBpZiAocXVpdEluZGljYXRvci5kb25lIHx8ICFxdWl0SW5kaWNhdG9yLnZhbHVlKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgcXVpdEluZGljYXRvciA9IHdoaWxlSXRlci5uZXh0KHZhbCk7XHJcbiAgICAgICAgaWYgKHF1aXRJbmRpY2F0b3IuZG9uZSB8fCAhcXVpdEluZGljYXRvci52YWx1ZSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHlpZWxkIHZhbDtcclxuICAgIH1cclxufSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRha2VXaGlsZS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBmcF8xID0gcmVxdWlyZShcIi4uL2ZwXCIpO1xyXG5jb25zdCB0b0l0ZXJhYmxlT3JFbXB0eV8xID0gcmVxdWlyZShcIi4vdG9JdGVyYWJsZU9yRW1wdHlcIik7XHJcbmV4cG9ydHMudGFwID0gZnBfMS5jdXJyeShmdW5jdGlvbiogKGZ1bmMsIGl0ZXJhYmxlKSB7XHJcbiAgICBjb25zdCBpdGVyID0gdG9JdGVyYWJsZU9yRW1wdHlfMS50b0l0ZXJhYmxlT3JFbXB0eShpdGVyYWJsZSk7XHJcbiAgICBmb3IgKGNvbnN0IHZhbCBvZiBpdGVyKSB7XHJcbiAgICAgICAgZnVuYyh2YWwpO1xyXG4gICAgICAgIHlpZWxkIHZhbDtcclxuICAgIH1cclxufSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRhcC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBpc18xID0gcmVxdWlyZShcIi4uL2lzXCIpO1xyXG5mdW5jdGlvbiB0b0l0ZXJhYmxlT3JFbXB0eShwYXJhbSkge1xyXG4gICAgaWYgKCFpc18xLmlzSXRlcmFibGUocGFyYW0pKVxyXG4gICAgICAgIHJldHVybiBbXTtcclxuICAgIHJldHVybiBwYXJhbTtcclxufVxyXG5leHBvcnRzLnRvSXRlcmFibGVPckVtcHR5ID0gdG9JdGVyYWJsZU9yRW1wdHk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRvSXRlcmFibGVPckVtcHR5LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IGZwXzEgPSByZXF1aXJlKFwiLi4vZnBcIik7XHJcbmNvbnN0IHRvSXRlcmFibGVPckVtcHR5XzEgPSByZXF1aXJlKFwiLi90b0l0ZXJhYmxlT3JFbXB0eVwiKTtcclxuZXhwb3J0cy56aXAgPSBmcF8xLmN1cnJ5KGZ1bmN0aW9uKiAoaXRlcmFibGVMZWZ0LCBpdGVyYWJsZVJpZ2h0LCAuLi5tb3JlSXRlcmFibGVzKSB7XHJcbiAgICBjb25zdCBpdGVyYXRvcnMgPSBbaXRlcmFibGVMZWZ0LCBpdGVyYWJsZVJpZ2h0XVxyXG4gICAgICAgIC5jb25jYXQobW9yZUl0ZXJhYmxlcylcclxuICAgICAgICAubWFwKHRvSXRlcmFibGVPckVtcHR5XzEudG9JdGVyYWJsZU9yRW1wdHkpXHJcbiAgICAgICAgLm1hcChpdGVyYWJsZSA9PiBpdGVyYWJsZVtTeW1ib2wuaXRlcmF0b3JdKCkpO1xyXG4gICAgd2hpbGUgKHRydWUpIHtcclxuICAgICAgICBjb25zdCBuZXh0ID0gaXRlcmF0b3JzLm1hcChpdGVyYXRvciA9PiBpdGVyYXRvci5uZXh0KCkpO1xyXG4gICAgICAgIGNvbnN0IGl0ZW1zID0gbmV4dC5tYXAoKHsgdmFsdWUsIGRvbmUgfSkgPT4gKGRvbmUgPyBudWxsIDogdmFsdWUpKTtcclxuICAgICAgICBpZiAobmV4dC5yZWR1Y2UoKGFjYywgY3VyKSA9PiBhY2MgJiYgY3VyLmRvbmUsIHRydWUpKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgeWllbGQgaXRlbXM7XHJcbiAgICB9XHJcbn0pO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD16aXAuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgaXNfMSA9IHJlcXVpcmUoXCIuLi9pc1wiKTtcclxuY29uc3QgaXRlcmF0b3JzXzEgPSByZXF1aXJlKFwiLi4vaXRlcmF0b3JzXCIpO1xyXG5leHBvcnRzLmVudHJpZXMgPSAocGFyYW0pID0+IHtcclxuICAgIGlmIChwYXJhbSBpbnN0YW5jZW9mIE1hcCkge1xyXG4gICAgICAgIHJldHVybiBpdGVyYXRvcnNfMS5jb2xsZWN0VG9BcnJheShwYXJhbS5lbnRyaWVzKCkpO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAocGFyYW0gaW5zdGFuY2VvZiBTZXQpIHtcclxuICAgICAgICByZXR1cm4gaXRlcmF0b3JzXzEuY29sbGVjdFRvQXJyYXkocGFyYW0uZW50cmllcygpKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGlzXzEuaXNPYmplY3QocGFyYW0pKSB7XHJcbiAgICAgICAgaWYgKGlzXzEuaXNGdW5jdGlvbihwYXJhbS5lbnRyaWVzKSkge1xyXG4gICAgICAgICAgICBjb25zdCBwYXJhbUVudHJpZXMgPSBwYXJhbS5lbnRyaWVzKCk7XHJcbiAgICAgICAgICAgIGlmIChpc18xLmlzSXRlcmFibGUocGFyYW1FbnRyaWVzKSlcclxuICAgICAgICAgICAgICAgIHJldHVybiBpdGVyYXRvcnNfMS5jb2xsZWN0VG9BcnJheShwYXJhbUVudHJpZXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gT2JqZWN0LmVudHJpZXMocGFyYW0pO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoaXNfMS5pc0FycmF5KHBhcmFtKSkge1xyXG4gICAgICAgIHJldHVybiBwYXJhbS5tYXAoKHYsIGkpID0+IFtpLCB2XSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gW107XHJcbiAgICB9XHJcbn07XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWVudHJpZXMuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbmZ1bmN0aW9uIF9fZXhwb3J0KG0pIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKCFleHBvcnRzLmhhc093blByb3BlcnR5KHApKSBleHBvcnRzW3BdID0gbVtwXTtcclxufVxyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL3RvUGFpcnNcIikpO1xyXG5fX2V4cG9ydChyZXF1aXJlKFwiLi9lbnRyaWVzXCIpKTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgZW50cmllc18xID0gcmVxdWlyZShcIi4vZW50cmllc1wiKTtcclxuZXhwb3J0cy50b1BhaXJzID0gZW50cmllc18xLmVudHJpZXM7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRvUGFpcnMuanMubWFwIiwiLy8gR2VuZXJhdGVkIGF1dG9tYXRpY2FsbHkgYnkgbmVhcmxleSwgdmVyc2lvbiAyLjE1LjFcclxuLy8gaHR0cDovL2dpdGh1Yi5jb20vSGFyZG1hdGgxMjMvbmVhcmxleVxyXG5mdW5jdGlvbiBpZCh4KSB7XHJcbiAgcmV0dXJuIHhbMF07XHJcbn1cclxuY29uc3QgZ3JhbW1hciA9IHtcclxuICBMZXhlcjogdW5kZWZpbmVkLFxyXG4gIFBhcnNlclJ1bGVzOiBbXHJcbiAgICB7IG5hbWU6ICdNYWluJywgc3ltYm9sczogWydFRE4nXSwgcG9zdHByb2Nlc3M6IGRhdGEgPT4gZGF0YVswXSB9LFxyXG4gICAgeyBuYW1lOiAnRUROJywgc3ltYm9sczogWydFeHAnXSwgcG9zdHByb2Nlc3M6IGRhdGEgPT4gZGF0YVswXSB9LFxyXG4gICAgeyBuYW1lOiAnRXhwJHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFsnRWxlbWVudFNwYWNlJ10gfSxcclxuICAgIHsgbmFtZTogJ0V4cCRzdWJleHByZXNzaW9uJDEnLCBzeW1ib2xzOiBbJ0VsZW1lbnROb1NwYWNlJ10gfSxcclxuICAgIHsgbmFtZTogJ0V4cCcsIHN5bWJvbHM6IFsnRXhwJHN1YmV4cHJlc3Npb24kMSddLCBwb3N0cHJvY2VzczogZGF0YSA9PiBbXS5jb25jYXQoLi4uZGF0YVswXSkgfSxcclxuICAgIHsgbmFtZTogJ19FeHAnLCBzeW1ib2xzOiBbJ19fZXhwJ10gfSxcclxuICAgIHsgbmFtZTogJ19FeHAnLCBzeW1ib2xzOiBbJ19fY2hhciddLCBwb3N0cHJvY2VzczogZGF0YSA9PiBkYXRhWzBdIH0sXHJcbiAgICB7IG5hbWU6ICdfX2V4cCcsIHN5bWJvbHM6IFsnXycsICdFeHAnXSwgcG9zdHByb2Nlc3M6IGRhdGEgPT4gZGF0YVsxXSB9LFxyXG4gICAgeyBuYW1lOiAnX19jaGFyJGVibmYkMSRzdWJleHByZXNzaW9uJDEnLCBzeW1ib2xzOiBbJ19FeHAnXSB9LFxyXG4gICAgeyBuYW1lOiAnX19jaGFyJGVibmYkMSRzdWJleHByZXNzaW9uJDEnLCBzeW1ib2xzOiBbJ0VsZW1lbnROb1NwYWNlJ10gfSxcclxuICAgIHsgbmFtZTogJ19fY2hhciRlYm5mJDEnLCBzeW1ib2xzOiBbJ19fY2hhciRlYm5mJDEkc3ViZXhwcmVzc2lvbiQxJ10sIHBvc3Rwcm9jZXNzOiBpZCB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnX19jaGFyJGVibmYkMScsXHJcbiAgICAgIHN5bWJvbHM6IFtdLFxyXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdfX2NoYXInLFxyXG4gICAgICBzeW1ib2xzOiBbJ0NoYXJhY3RlcicsICdfX2NoYXIkZWJuZiQxJ10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBkYXRhID0+IFtdLmNvbmNhdCguLi5bZGF0YVswXV0uY29uY2F0KGRhdGFbMV0gPyBbXS5jb25jYXQoLi4uZGF0YVsxXSkgOiBbXSkpXHJcbiAgICB9LFxyXG4gICAgeyBuYW1lOiAnRWxlbWVudFNwYWNlJHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFsnTnVtYmVyJ10gfSxcclxuICAgIHsgbmFtZTogJ0VsZW1lbnRTcGFjZSRzdWJleHByZXNzaW9uJDEnLCBzeW1ib2xzOiBbJ0NoYXJhY3RlciddIH0sXHJcbiAgICB7IG5hbWU6ICdFbGVtZW50U3BhY2Ukc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogWydSZXNlcnZlZCddIH0sXHJcbiAgICB7IG5hbWU6ICdFbGVtZW50U3BhY2Ukc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogWydTeW1ib2wnXSB9LFxyXG4gICAgeyBuYW1lOiAnRWxlbWVudFNwYWNlJHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFsnS2V5d29yZCddIH0sXHJcbiAgICB7IG5hbWU6ICdFbGVtZW50U3BhY2Ukc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogWydUYWcnXSB9LFxyXG4gICAgeyBuYW1lOiAnRWxlbWVudFNwYWNlJHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFsnRGlzY2FyZCddIH0sXHJcbiAgICB7IG5hbWU6ICdFbGVtZW50U3BhY2UkZWJuZiQxJHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFsnX0V4cCddIH0sXHJcbiAgICB7IG5hbWU6ICdFbGVtZW50U3BhY2UkZWJuZiQxJHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFsnRWxlbWVudE5vU3BhY2UnXSB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnRWxlbWVudFNwYWNlJGVibmYkMScsXHJcbiAgICAgIHN5bWJvbHM6IFsnRWxlbWVudFNwYWNlJGVibmYkMSRzdWJleHByZXNzaW9uJDEnXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGlkXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnRWxlbWVudFNwYWNlJGVibmYkMScsXHJcbiAgICAgIHN5bWJvbHM6IFtdLFxyXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdFbGVtZW50U3BhY2UnLFxyXG4gICAgICBzeW1ib2xzOiBbJ0VsZW1lbnRTcGFjZSRzdWJleHByZXNzaW9uJDEnLCAnRWxlbWVudFNwYWNlJGVibmYkMSddLFxyXG4gICAgICBwb3N0cHJvY2VzczogZGF0YSA9PiBbXS5jb25jYXQoLi4uW2RhdGFbMF1bMF1dLmNvbmNhdChkYXRhWzFdID8gW10uY29uY2F0KC4uLmRhdGFbMV0pIDogW10pKVxyXG4gICAgfSxcclxuICAgIHsgbmFtZTogJ0VsZW1lbnROb1NwYWNlJGVibmYkMSRzdWJleHByZXNzaW9uJDEkZWJuZiQxJywgc3ltYm9sczogWydfJ10sIHBvc3Rwcm9jZXNzOiBpZCB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnRWxlbWVudE5vU3BhY2UkZWJuZiQxJHN1YmV4cHJlc3Npb24kMSRlYm5mJDEnLFxyXG4gICAgICBzeW1ib2xzOiBbXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnRWxlbWVudE5vU3BhY2UkZWJuZiQxJHN1YmV4cHJlc3Npb24kMScsXHJcbiAgICAgIHN5bWJvbHM6IFsnRWxlbWVudE5vU3BhY2UkZWJuZiQxJHN1YmV4cHJlc3Npb24kMSRlYm5mJDEnLCAnRXhwJ11cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdFbGVtZW50Tm9TcGFjZSRlYm5mJDEnLFxyXG4gICAgICBzeW1ib2xzOiBbJ0VsZW1lbnROb1NwYWNlJGVibmYkMSRzdWJleHByZXNzaW9uJDEnXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGlkXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnRWxlbWVudE5vU3BhY2UkZWJuZiQxJyxcclxuICAgICAgc3ltYm9sczogW10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ0VsZW1lbnROb1NwYWNlJyxcclxuICAgICAgc3ltYm9sczogWydtYXBFbGVtZW50Tm9TcGFjZScsICdFbGVtZW50Tm9TcGFjZSRlYm5mJDEnXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGRhdGEgPT4gW2RhdGFbMF1dLmNvbmNhdChkYXRhWzFdID8gZGF0YVsxXVsxXSA6IFtdKVxyXG4gICAgfSxcclxuICAgIHsgbmFtZTogJ0VsZW1lbnQkc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogWydOdW1iZXInXSB9LFxyXG4gICAgeyBuYW1lOiAnRWxlbWVudCRzdWJleHByZXNzaW9uJDEnLCBzeW1ib2xzOiBbJ0NoYXJhY3RlciddIH0sXHJcbiAgICB7IG5hbWU6ICdFbGVtZW50JHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFsnUmVzZXJ2ZWQnXSB9LFxyXG4gICAgeyBuYW1lOiAnRWxlbWVudCRzdWJleHByZXNzaW9uJDEnLCBzeW1ib2xzOiBbJ1N5bWJvbCddIH0sXHJcbiAgICB7IG5hbWU6ICdFbGVtZW50JHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFsnS2V5d29yZCddIH0sXHJcbiAgICB7IG5hbWU6ICdFbGVtZW50JHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFsnVmVjdG9yJ10gfSxcclxuICAgIHsgbmFtZTogJ0VsZW1lbnQkc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogWydMaXN0J10gfSxcclxuICAgIHsgbmFtZTogJ0VsZW1lbnQkc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogWydTdHJpbmcnXSB9LFxyXG4gICAgeyBuYW1lOiAnRWxlbWVudCRzdWJleHByZXNzaW9uJDEnLCBzeW1ib2xzOiBbJ01hcCddIH0sXHJcbiAgICB7IG5hbWU6ICdFbGVtZW50JHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFsnU2V0J10gfSxcclxuICAgIHsgbmFtZTogJ0VsZW1lbnQnLCBzeW1ib2xzOiBbJ0VsZW1lbnQkc3ViZXhwcmVzc2lvbiQxJ10sIHBvc3Rwcm9jZXNzOiBkYXRhID0+IGRhdGFbMF1bMF0gfSxcclxuICAgIHsgbmFtZTogJ1ZlY3RvciRlYm5mJDEnLCBzeW1ib2xzOiBbJ18nXSwgcG9zdHByb2Nlc3M6IGlkIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdWZWN0b3IkZWJuZiQxJyxcclxuICAgICAgc3ltYm9sczogW10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHsgbmFtZTogJ1ZlY3RvciRlYm5mJDIkc3ViZXhwcmVzc2lvbiQxJGVibmYkMScsIHN5bWJvbHM6IFsnXyddLCBwb3N0cHJvY2VzczogaWQgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ1ZlY3RvciRlYm5mJDIkc3ViZXhwcmVzc2lvbiQxJGVibmYkMScsXHJcbiAgICAgIHN5bWJvbHM6IFtdLFxyXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdWZWN0b3IkZWJuZiQyJHN1YmV4cHJlc3Npb24kMScsXHJcbiAgICAgIHN5bWJvbHM6IFsnRXhwJywgJ1ZlY3RvciRlYm5mJDIkc3ViZXhwcmVzc2lvbiQxJGVibmYkMSddXHJcbiAgICB9LFxyXG4gICAgeyBuYW1lOiAnVmVjdG9yJGVibmYkMicsIHN5bWJvbHM6IFsnVmVjdG9yJGVibmYkMiRzdWJleHByZXNzaW9uJDEnXSwgcG9zdHByb2Nlc3M6IGlkIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdWZWN0b3IkZWJuZiQyJyxcclxuICAgICAgc3ltYm9sczogW10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ1ZlY3RvcicsXHJcbiAgICAgIHN5bWJvbHM6IFt7IGxpdGVyYWw6ICdbJyB9LCAnVmVjdG9yJGVibmYkMScsICdWZWN0b3IkZWJuZiQyJywgeyBsaXRlcmFsOiAnXScgfV0sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBkYXRhID0+ICh7IHR5cGU6ICd2ZWN0b3InLCBkYXRhOiBkYXRhWzJdID8gZGF0YVsyXVswXSA6IFtdIH0pXHJcbiAgICB9LFxyXG4gICAgeyBuYW1lOiAnTGlzdCRlYm5mJDEnLCBzeW1ib2xzOiBbJ18nXSwgcG9zdHByb2Nlc3M6IGlkIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdMaXN0JGVibmYkMScsXHJcbiAgICAgIHN5bWJvbHM6IFtdLFxyXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7IG5hbWU6ICdMaXN0JGVibmYkMiRzdWJleHByZXNzaW9uJDEkZWJuZiQxJywgc3ltYm9sczogWydfJ10sIHBvc3Rwcm9jZXNzOiBpZCB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnTGlzdCRlYm5mJDIkc3ViZXhwcmVzc2lvbiQxJGVibmYkMScsXHJcbiAgICAgIHN5bWJvbHM6IFtdLFxyXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7IG5hbWU6ICdMaXN0JGVibmYkMiRzdWJleHByZXNzaW9uJDEnLCBzeW1ib2xzOiBbJ0V4cCcsICdMaXN0JGVibmYkMiRzdWJleHByZXNzaW9uJDEkZWJuZiQxJ10gfSxcclxuICAgIHsgbmFtZTogJ0xpc3QkZWJuZiQyJywgc3ltYm9sczogWydMaXN0JGVibmYkMiRzdWJleHByZXNzaW9uJDEnXSwgcG9zdHByb2Nlc3M6IGlkIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdMaXN0JGVibmYkMicsXHJcbiAgICAgIHN5bWJvbHM6IFtdLFxyXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdMaXN0JyxcclxuICAgICAgc3ltYm9sczogW3sgbGl0ZXJhbDogJygnIH0sICdMaXN0JGVibmYkMScsICdMaXN0JGVibmYkMicsIHsgbGl0ZXJhbDogJyknIH1dLFxyXG4gICAgICBwb3N0cHJvY2VzczogZGF0YSA9PiAoeyB0eXBlOiAnbGlzdCcsIGRhdGE6IGRhdGFbMl0gPyBkYXRhWzJdWzBdIDogW10gfSlcclxuICAgIH0sXHJcbiAgICB7IG5hbWU6ICdNYXAkZWJuZiQxJywgc3ltYm9sczogWydfJ10sIHBvc3Rwcm9jZXNzOiBpZCB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnTWFwJGVibmYkMScsXHJcbiAgICAgIHN5bWJvbHM6IFtdLFxyXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7IG5hbWU6ICdNYXAkZWJuZiQyJHN1YmV4cHJlc3Npb24kMSRlYm5mJDEnLCBzeW1ib2xzOiBbJ18nXSwgcG9zdHByb2Nlc3M6IGlkIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdNYXAkZWJuZiQyJHN1YmV4cHJlc3Npb24kMSRlYm5mJDEnLFxyXG4gICAgICBzeW1ib2xzOiBbXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnTWFwJGVibmYkMiRzdWJleHByZXNzaW9uJDEnLFxyXG4gICAgICBzeW1ib2xzOiBbJ01hcEVsZW0nLCAnTWFwJGVibmYkMiRzdWJleHByZXNzaW9uJDEkZWJuZiQxJ11cclxuICAgIH0sXHJcbiAgICB7IG5hbWU6ICdNYXAkZWJuZiQyJywgc3ltYm9sczogWydNYXAkZWJuZiQyJHN1YmV4cHJlc3Npb24kMSddLCBwb3N0cHJvY2VzczogaWQgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ01hcCRlYm5mJDInLFxyXG4gICAgICBzeW1ib2xzOiBbXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnTWFwJyxcclxuICAgICAgc3ltYm9sczogW3sgbGl0ZXJhbDogJ3snIH0sICdNYXAkZWJuZiQxJywgJ01hcCRlYm5mJDInLCB7IGxpdGVyYWw6ICd9JyB9XSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGRhdGEgPT4gKHsgdHlwZTogJ21hcCcsIGRhdGE6IGRhdGFbMl0gPyBkYXRhWzJdWzBdIDogW10gfSlcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdTZXQkc3RyaW5nJDEnLFxyXG4gICAgICBzeW1ib2xzOiBbeyBsaXRlcmFsOiAnIycgfSwgeyBsaXRlcmFsOiAneycgfV0sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBmdW5jdGlvbiBqb2luZXIoZCkge1xyXG4gICAgICAgIHJldHVybiBkLmpvaW4oJycpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgeyBuYW1lOiAnU2V0JGVibmYkMScsIHN5bWJvbHM6IFsnXyddLCBwb3N0cHJvY2VzczogaWQgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ1NldCRlYm5mJDEnLFxyXG4gICAgICBzeW1ib2xzOiBbXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgeyBuYW1lOiAnU2V0JGVibmYkMiRzdWJleHByZXNzaW9uJDEkZWJuZiQxJywgc3ltYm9sczogWydfJ10sIHBvc3Rwcm9jZXNzOiBpZCB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnU2V0JGVibmYkMiRzdWJleHByZXNzaW9uJDEkZWJuZiQxJyxcclxuICAgICAgc3ltYm9sczogW10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHsgbmFtZTogJ1NldCRlYm5mJDIkc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogWydFeHAnLCAnU2V0JGVibmYkMiRzdWJleHByZXNzaW9uJDEkZWJuZiQxJ10gfSxcclxuICAgIHsgbmFtZTogJ1NldCRlYm5mJDInLCBzeW1ib2xzOiBbJ1NldCRlYm5mJDIkc3ViZXhwcmVzc2lvbiQxJ10sIHBvc3Rwcm9jZXNzOiBpZCB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnU2V0JGVibmYkMicsXHJcbiAgICAgIHN5bWJvbHM6IFtdLFxyXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdTZXQnLFxyXG4gICAgICBzeW1ib2xzOiBbJ1NldCRzdHJpbmckMScsICdTZXQkZWJuZiQxJywgJ1NldCRlYm5mJDInLCB7IGxpdGVyYWw6ICd9JyB9XSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGRhdGEgPT4gKHsgdHlwZTogJ3NldCcsIGRhdGE6IGRhdGFbMl0gPyBkYXRhWzJdWzBdIDogW10gfSlcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdUYWcnLFxyXG4gICAgICBzeW1ib2xzOiBbeyBsaXRlcmFsOiAnIycgfSwgJ1N5bWJvbCcsICdfJywgJ0VsZW1lbnQnXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IChkYXRhLCBfbCwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgaWYgKGRhdGFbMV0uZGF0YVswXSA9PT0gJ18nKSByZXR1cm4gcmVqZWN0O1xyXG4gICAgICAgIHJldHVybiB7IHR5cGU6ICd0YWcnLCB0YWc6IGRhdGFbMV0uZGF0YSwgZGF0YTogZGF0YVszXSB9O1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnRGlzY2FyZCRzdHJpbmckMScsXHJcbiAgICAgIHN5bWJvbHM6IFt7IGxpdGVyYWw6ICcjJyB9LCB7IGxpdGVyYWw6ICdfJyB9XSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uIGpvaW5lcihkKSB7XHJcbiAgICAgICAgcmV0dXJuIGQuam9pbignJyk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7IG5hbWU6ICdEaXNjYXJkJGVibmYkMScsIHN5bWJvbHM6IFsnXyddLCBwb3N0cHJvY2VzczogaWQgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ0Rpc2NhcmQkZWJuZiQxJyxcclxuICAgICAgc3ltYm9sczogW10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ0Rpc2NhcmQnLFxyXG4gICAgICBzeW1ib2xzOiBbJ0Rpc2NhcmQkc3RyaW5nJDEnLCAnRGlzY2FyZCRlYm5mJDEnLCAnRWxlbWVudCddLFxyXG4gICAgICBwb3N0cHJvY2VzczogKCkgPT4gKHsgdHlwZTogJ2Rpc2NhcmQnIH0pXHJcbiAgICB9LFxyXG4gICAgeyBuYW1lOiAnU3RyaW5nJGVibmYkMScsIHN5bWJvbHM6IFtdIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdTdHJpbmckZWJuZiQxJyxcclxuICAgICAgc3ltYm9sczogWydTdHJpbmckZWJuZiQxJywgJ3N0cmluZ19jaGFyJ10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBmdW5jdGlvbiBhcnJwdXNoKGQpIHtcclxuICAgICAgICByZXR1cm4gZFswXS5jb25jYXQoW2RbMV1dKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ1N0cmluZycsXHJcbiAgICAgIHN5bWJvbHM6IFt7IGxpdGVyYWw6ICdcIicgfSwgJ1N0cmluZyRlYm5mJDEnLCB7IGxpdGVyYWw6ICdcIicgfV0sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBkYXRhID0+ICh7IHR5cGU6ICdzdHJpbmcnLCBkYXRhOiBkYXRhWzFdLmpvaW4oJycpIH0pXHJcbiAgICB9LFxyXG4gICAgeyBuYW1lOiAnc3RyaW5nX2NoYXInLCBzeW1ib2xzOiBbL1teXFxcXFwiXS9dIH0sXHJcbiAgICB7IG5hbWU6ICdzdHJpbmdfY2hhcicsIHN5bWJvbHM6IFsnYmFja3NsYXNoJ10gfSxcclxuICAgIHsgbmFtZTogJ3N0cmluZ19jaGFyJywgc3ltYm9sczogWydiYWNrc2xhc2hfdW5pY29kZSddLCBwb3N0cHJvY2VzczogaWQgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ2JhY2tzbGFzaCcsXHJcbiAgICAgIHN5bWJvbHM6IFt7IGxpdGVyYWw6ICdcXFxcJyB9LCAvW1widHJuXFxcXF0vXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGRhdGEgPT4gZGF0YS5qb2luKCcnKVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ2JhY2tzbGFzaF91bmljb2RlJyxcclxuICAgICAgc3ltYm9sczogW3sgbGl0ZXJhbDogJ1xcXFwnIH0sICd1bmljb2RlJ10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBkYXRhID0+IGRhdGFbMV1cclxuICAgIH0sXHJcbiAgICB7IG5hbWU6ICdSZXNlcnZlZCRzdWJleHByZXNzaW9uJDEnLCBzeW1ib2xzOiBbJ2Jvb2xlYW4nXSB9LFxyXG4gICAgeyBuYW1lOiAnUmVzZXJ2ZWQkc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogWyduaWwnXSB9LFxyXG4gICAgeyBuYW1lOiAnUmVzZXJ2ZWQnLCBzeW1ib2xzOiBbJ1Jlc2VydmVkJHN1YmV4cHJlc3Npb24kMSddLCBwb3N0cHJvY2VzczogZGF0YSA9PiBkYXRhWzBdWzBdIH0sXHJcbiAgICB7IG5hbWU6ICdib29sZWFuJHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFsndHJ1ZSddIH0sXHJcbiAgICB7IG5hbWU6ICdib29sZWFuJHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFsnZmFsc2UnXSB9LFxyXG4gICAgeyBuYW1lOiAnYm9vbGVhbicsIHN5bWJvbHM6IFsnYm9vbGVhbiRzdWJleHByZXNzaW9uJDEnXSwgcG9zdHByb2Nlc3M6IGRhdGEgPT4gZGF0YVswXVswXSB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAndHJ1ZSRzdHJpbmckMScsXHJcbiAgICAgIHN5bWJvbHM6IFt7IGxpdGVyYWw6ICd0JyB9LCB7IGxpdGVyYWw6ICdyJyB9LCB7IGxpdGVyYWw6ICd1JyB9LCB7IGxpdGVyYWw6ICdlJyB9XSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uIGpvaW5lcihkKSB7XHJcbiAgICAgICAgcmV0dXJuIGQuam9pbignJyk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7IG5hbWU6ICd0cnVlJywgc3ltYm9sczogWyd0cnVlJHN0cmluZyQxJ10sIHBvc3Rwcm9jZXNzOiAoKSA9PiAoeyB0eXBlOiAnYm9vbCcsIGRhdGE6IHRydWUgfSkgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ2ZhbHNlJHN0cmluZyQxJyxcclxuICAgICAgc3ltYm9sczogW1xyXG4gICAgICAgIHsgbGl0ZXJhbDogJ2YnIH0sXHJcbiAgICAgICAgeyBsaXRlcmFsOiAnYScgfSxcclxuICAgICAgICB7IGxpdGVyYWw6ICdsJyB9LFxyXG4gICAgICAgIHsgbGl0ZXJhbDogJ3MnIH0sXHJcbiAgICAgICAgeyBsaXRlcmFsOiAnZScgfVxyXG4gICAgICBdLFxyXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24gam9pbmVyKGQpIHtcclxuICAgICAgICByZXR1cm4gZC5qb2luKCcnKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ2ZhbHNlJyxcclxuICAgICAgc3ltYm9sczogWydmYWxzZSRzdHJpbmckMSddLFxyXG4gICAgICBwb3N0cHJvY2VzczogKCkgPT4gKHsgdHlwZTogJ2Jvb2wnLCBkYXRhOiBmYWxzZSB9KVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ25pbCRzdHJpbmckMScsXHJcbiAgICAgIHN5bWJvbHM6IFt7IGxpdGVyYWw6ICduJyB9LCB7IGxpdGVyYWw6ICdpJyB9LCB7IGxpdGVyYWw6ICdsJyB9XSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uIGpvaW5lcihkKSB7XHJcbiAgICAgICAgcmV0dXJuIGQuam9pbignJyk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7IG5hbWU6ICduaWwnLCBzeW1ib2xzOiBbJ25pbCRzdHJpbmckMSddLCBwb3N0cHJvY2VzczogKCkgPT4gKHsgdHlwZTogJ25pbCcsIGRhdGE6IG51bGwgfSkgfSxcclxuICAgIHsgbmFtZTogJ1N5bWJvbCRzdWJleHByZXNzaW9uJDEnLCBzeW1ib2xzOiBbJ3N5bWJvbCddIH0sXHJcbiAgICB7IG5hbWU6ICdTeW1ib2wkc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogW3sgbGl0ZXJhbDogJy8nIH1dIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdTeW1ib2wnLFxyXG4gICAgICBzeW1ib2xzOiBbJ1N5bWJvbCRzdWJleHByZXNzaW9uJDEnXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IChkYXRhLCBfLCByZWplY3QpID0+IHtcclxuICAgICAgICBpZiAoZGF0YVswXVswXSA9PT0gJ3RydWUnIHx8IGRhdGFbMF1bMF0gPT09ICdmYWxzZScgfHwgZGF0YVswXVswXSA9PT0gJ25pbCcpIHJldHVybiByZWplY3Q7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogJ3N5bWJvbCcsIGRhdGE6IGRhdGFbMF1bMF0gfTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHsgbmFtZTogJ3N5bWJvbCRlYm5mJDEkc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogW3sgbGl0ZXJhbDogJy8nIH0sICdzeW1ib2xfcGllY2UnXSB9LFxyXG4gICAgeyBuYW1lOiAnc3ltYm9sJGVibmYkMScsIHN5bWJvbHM6IFsnc3ltYm9sJGVibmYkMSRzdWJleHByZXNzaW9uJDEnXSwgcG9zdHByb2Nlc3M6IGlkIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdzeW1ib2wkZWJuZiQxJyxcclxuICAgICAgc3ltYm9sczogW10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ3N5bWJvbCcsXHJcbiAgICAgIHN5bWJvbHM6IFsnc3ltYm9sX3BpZWNlJywgJ3N5bWJvbCRlYm5mJDEnXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGRhdGEgPT4gZGF0YVswXSArIChkYXRhWzFdID8gZGF0YVsxXS5qb2luKCcnKSA6ICcnKVxyXG4gICAgfSxcclxuICAgIHsgbmFtZTogJ3N5bWJvbF9waWVjZScsIHN5bWJvbHM6IFsnc3ltYm9sX3BpZWNlX2Jhc2ljJ10gfSxcclxuICAgIHsgbmFtZTogJ3N5bWJvbF9waWVjZScsIHN5bWJvbHM6IFsnc3ltYm9sX3BpZWNlX251bSddLCBwb3N0cHJvY2VzczogaWQgfSxcclxuICAgIHsgbmFtZTogJ3N5bWJvbF9waWVjZV9iYXNpYyRlYm5mJDEnLCBzeW1ib2xzOiBbXSB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnc3ltYm9sX3BpZWNlX2Jhc2ljJGVibmYkMScsXHJcbiAgICAgIHN5bWJvbHM6IFsnc3ltYm9sX3BpZWNlX2Jhc2ljJGVibmYkMScsICdzeW1ib2xfbWlkJ10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBmdW5jdGlvbiBhcnJwdXNoKGQpIHtcclxuICAgICAgICByZXR1cm4gZFswXS5jb25jYXQoW2RbMV1dKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ3N5bWJvbF9waWVjZV9iYXNpYycsXHJcbiAgICAgIHN5bWJvbHM6IFsnc3ltYm9sX3N0YXJ0JywgJ3N5bWJvbF9waWVjZV9iYXNpYyRlYm5mJDEnXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGRhdGEgPT4gZGF0YVswXSArIGRhdGFbMV0uam9pbignJylcclxuICAgIH0sXHJcbiAgICB7IG5hbWU6ICdzeW1ib2xfcGllY2VfbnVtJGVibmYkMSRzdWJleHByZXNzaW9uJDEkZWJuZiQxJywgc3ltYm9sczogW10gfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ3N5bWJvbF9waWVjZV9udW0kZWJuZiQxJHN1YmV4cHJlc3Npb24kMSRlYm5mJDEnLFxyXG4gICAgICBzeW1ib2xzOiBbJ3N5bWJvbF9waWVjZV9udW0kZWJuZiQxJHN1YmV4cHJlc3Npb24kMSRlYm5mJDEnLCAnc3ltYm9sX21pZCddLFxyXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24gYXJycHVzaChkKSB7XHJcbiAgICAgICAgcmV0dXJuIGRbMF0uY29uY2F0KFtkWzFdXSk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdzeW1ib2xfcGllY2VfbnVtJGVibmYkMSRzdWJleHByZXNzaW9uJDEnLFxyXG4gICAgICBzeW1ib2xzOiBbJ3N5bWJvbF9zZWNvbmRfc3BlY2lhbCcsICdzeW1ib2xfcGllY2VfbnVtJGVibmYkMSRzdWJleHByZXNzaW9uJDEkZWJuZiQxJ11cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdzeW1ib2xfcGllY2VfbnVtJGVibmYkMScsXHJcbiAgICAgIHN5bWJvbHM6IFsnc3ltYm9sX3BpZWNlX251bSRlYm5mJDEkc3ViZXhwcmVzc2lvbiQxJ10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBpZFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ3N5bWJvbF9waWVjZV9udW0kZWJuZiQxJyxcclxuICAgICAgc3ltYm9sczogW10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ3N5bWJvbF9waWVjZV9udW0nLFxyXG4gICAgICBzeW1ib2xzOiBbL1tcXC0rLl0vLCAnc3ltYm9sX3BpZWNlX251bSRlYm5mJDEnXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGRhdGEgPT4gZGF0YVswXSArIChkYXRhWzFdID8gZGF0YVsxXVswXSArIGRhdGFbMV1bMV0uam9pbignJykgOiAnJylcclxuICAgIH0sXHJcbiAgICB7IG5hbWU6ICdzeW1ib2xfYmFzaWMkZWJuZiQxJywgc3ltYm9sczogW10gfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ3N5bWJvbF9iYXNpYyRlYm5mJDEnLFxyXG4gICAgICBzeW1ib2xzOiBbJ3N5bWJvbF9iYXNpYyRlYm5mJDEnLCAnc3ltYm9sX21pZCddLFxyXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24gYXJycHVzaChkKSB7XHJcbiAgICAgICAgcmV0dXJuIGRbMF0uY29uY2F0KFtkWzFdXSk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7IG5hbWU6ICdzeW1ib2xfYmFzaWMkZWJuZiQyJHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFt7IGxpdGVyYWw6ICcvJyB9LCAnc3ltYm9sX3BpZWNlJ10gfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ3N5bWJvbF9iYXNpYyRlYm5mJDInLFxyXG4gICAgICBzeW1ib2xzOiBbJ3N5bWJvbF9iYXNpYyRlYm5mJDIkc3ViZXhwcmVzc2lvbiQxJ10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBpZFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ3N5bWJvbF9iYXNpYyRlYm5mJDInLFxyXG4gICAgICBzeW1ib2xzOiBbXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnc3ltYm9sX2Jhc2ljJyxcclxuICAgICAgc3ltYm9sczogWydzeW1ib2xfc3RhcnQnLCAnc3ltYm9sX2Jhc2ljJGVibmYkMScsICdzeW1ib2xfYmFzaWMkZWJuZiQyJ10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBkYXRhID0+IGRhdGFbMF0gKyBkYXRhWzFdLmpvaW4oJycpICsgKGRhdGFbMl0gPyBkYXRhWzJdLmpvaW4oJycpIDogJycpXHJcbiAgICB9LFxyXG4gICAgeyBuYW1lOiAnc3ltYm9sX3N0YXJ0Jywgc3ltYm9sczogWydsZXR0ZXInXSB9LFxyXG4gICAgeyBuYW1lOiAnc3ltYm9sX3N0YXJ0Jywgc3ltYm9sczogWy9bKn5fIT8kJSY9PD5dL10sIHBvc3Rwcm9jZXNzOiBkYXRhID0+IGRhdGFbMF0gfSxcclxuICAgIHsgbmFtZTogJ3N5bWJvbF9taWQnLCBzeW1ib2xzOiBbJ2xldHRlciddIH0sXHJcbiAgICB7IG5hbWU6ICdzeW1ib2xfbWlkJywgc3ltYm9sczogWydkaWdpdCddIH0sXHJcbiAgICB7IG5hbWU6ICdzeW1ib2xfbWlkJywgc3ltYm9sczogWy9bLipcXCFcXC0rXz8kJSY9PD46I10vXSwgcG9zdHByb2Nlc3M6IGRhdGEgPT4gZGF0YVswXSB9LFxyXG4gICAgeyBuYW1lOiAnc3ltYm9sX2xpa2VfYV9udW0kZWJuZiQxJHN1YmV4cHJlc3Npb24kMSRlYm5mJDEnLCBzeW1ib2xzOiBbXSB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnc3ltYm9sX2xpa2VfYV9udW0kZWJuZiQxJHN1YmV4cHJlc3Npb24kMSRlYm5mJDEnLFxyXG4gICAgICBzeW1ib2xzOiBbJ3N5bWJvbF9saWtlX2FfbnVtJGVibmYkMSRzdWJleHByZXNzaW9uJDEkZWJuZiQxJywgJ3N5bWJvbF9taWQnXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uIGFycnB1c2goZCkge1xyXG4gICAgICAgIHJldHVybiBkWzBdLmNvbmNhdChbZFsxXV0pO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnc3ltYm9sX2xpa2VfYV9udW0kZWJuZiQxJHN1YmV4cHJlc3Npb24kMScsXHJcbiAgICAgIHN5bWJvbHM6IFsnc3ltYm9sX3NlY29uZF9zcGVjaWFsJywgJ3N5bWJvbF9saWtlX2FfbnVtJGVibmYkMSRzdWJleHByZXNzaW9uJDEkZWJuZiQxJ11cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdzeW1ib2xfbGlrZV9hX251bSRlYm5mJDEnLFxyXG4gICAgICBzeW1ib2xzOiBbJ3N5bWJvbF9saWtlX2FfbnVtJGVibmYkMSRzdWJleHByZXNzaW9uJDEnXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGlkXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnc3ltYm9sX2xpa2VfYV9udW0kZWJuZiQxJyxcclxuICAgICAgc3ltYm9sczogW10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ3N5bWJvbF9saWtlX2FfbnVtJGVibmYkMiRzdWJleHByZXNzaW9uJDEnLFxyXG4gICAgICBzeW1ib2xzOiBbeyBsaXRlcmFsOiAnLycgfSwgJ3N5bWJvbF9waWVjZSddXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnc3ltYm9sX2xpa2VfYV9udW0kZWJuZiQyJyxcclxuICAgICAgc3ltYm9sczogWydzeW1ib2xfbGlrZV9hX251bSRlYm5mJDIkc3ViZXhwcmVzc2lvbiQxJ10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBpZFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ3N5bWJvbF9saWtlX2FfbnVtJGVibmYkMicsXHJcbiAgICAgIHN5bWJvbHM6IFtdLFxyXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdzeW1ib2xfbGlrZV9hX251bScsXHJcbiAgICAgIHN5bWJvbHM6IFsvW1xcLSsuXS8sICdzeW1ib2xfbGlrZV9hX251bSRlYm5mJDEnLCAnc3ltYm9sX2xpa2VfYV9udW0kZWJuZiQyJ10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBkYXRhID0+XHJcbiAgICAgICAgZGF0YVswXSArXHJcbiAgICAgICAgKGRhdGFbMV0gPyBkYXRhWzFdWzBdICsgZGF0YVsxXVsxXS5qb2luKCcnKSA6ICcnKSArXHJcbiAgICAgICAgKGRhdGFbMl0gPyBkYXRhWzJdLmpvaW4oJycpIDogJycpXHJcbiAgICB9LFxyXG4gICAgeyBuYW1lOiAnc3ltYm9sX3NlY29uZF9zcGVjaWFsJywgc3ltYm9sczogWydzeW1ib2xfc3RhcnQnXSB9LFxyXG4gICAgeyBuYW1lOiAnc3ltYm9sX3NlY29uZF9zcGVjaWFsJywgc3ltYm9sczogWy9bXFwtKy46I10vXSwgcG9zdHByb2Nlc3M6IGRhdGEgPT4gZGF0YVswXSB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnS2V5d29yZCcsXHJcbiAgICAgIHN5bWJvbHM6IFt7IGxpdGVyYWw6ICc6JyB9LCAnU3ltYm9sJ10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBkYXRhID0+ICh7IHR5cGU6ICdrZXl3b3JkJywgZGF0YTogJzonICsgZGF0YVsxXS5kYXRhIH0pXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnQ2hhcmFjdGVyJyxcclxuICAgICAgc3ltYm9sczogW3sgbGl0ZXJhbDogJ1xcXFwnIH0sICdjaGFyJ10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBkYXRhID0+ICh7IHR5cGU6ICdjaGFyJywgZGF0YTogZGF0YVsxXVswXSB9KVxyXG4gICAgfSxcclxuICAgIHsgbmFtZTogJ2NoYXInLCBzeW1ib2xzOiBbL1teIFxcdFxcclxcbl0vXSB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnY2hhciRzdHJpbmckMScsXHJcbiAgICAgIHN5bWJvbHM6IFtcclxuICAgICAgICB7IGxpdGVyYWw6ICduJyB9LFxyXG4gICAgICAgIHsgbGl0ZXJhbDogJ2UnIH0sXHJcbiAgICAgICAgeyBsaXRlcmFsOiAndycgfSxcclxuICAgICAgICB7IGxpdGVyYWw6ICdsJyB9LFxyXG4gICAgICAgIHsgbGl0ZXJhbDogJ2knIH0sXHJcbiAgICAgICAgeyBsaXRlcmFsOiAnbicgfSxcclxuICAgICAgICB7IGxpdGVyYWw6ICdlJyB9XHJcbiAgICAgIF0sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBmdW5jdGlvbiBqb2luZXIoZCkge1xyXG4gICAgICAgIHJldHVybiBkLmpvaW4oJycpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgeyBuYW1lOiAnY2hhcicsIHN5bWJvbHM6IFsnY2hhciRzdHJpbmckMSddIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdjaGFyJHN0cmluZyQyJyxcclxuICAgICAgc3ltYm9sczogW1xyXG4gICAgICAgIHsgbGl0ZXJhbDogJ3InIH0sXHJcbiAgICAgICAgeyBsaXRlcmFsOiAnZScgfSxcclxuICAgICAgICB7IGxpdGVyYWw6ICd0JyB9LFxyXG4gICAgICAgIHsgbGl0ZXJhbDogJ3UnIH0sXHJcbiAgICAgICAgeyBsaXRlcmFsOiAncicgfSxcclxuICAgICAgICB7IGxpdGVyYWw6ICduJyB9XHJcbiAgICAgIF0sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBmdW5jdGlvbiBqb2luZXIoZCkge1xyXG4gICAgICAgIHJldHVybiBkLmpvaW4oJycpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgeyBuYW1lOiAnY2hhcicsIHN5bWJvbHM6IFsnY2hhciRzdHJpbmckMiddIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdjaGFyJHN0cmluZyQzJyxcclxuICAgICAgc3ltYm9sczogW1xyXG4gICAgICAgIHsgbGl0ZXJhbDogJ3MnIH0sXHJcbiAgICAgICAgeyBsaXRlcmFsOiAncCcgfSxcclxuICAgICAgICB7IGxpdGVyYWw6ICdhJyB9LFxyXG4gICAgICAgIHsgbGl0ZXJhbDogJ2MnIH0sXHJcbiAgICAgICAgeyBsaXRlcmFsOiAnZScgfVxyXG4gICAgICBdLFxyXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24gam9pbmVyKGQpIHtcclxuICAgICAgICByZXR1cm4gZC5qb2luKCcnKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHsgbmFtZTogJ2NoYXInLCBzeW1ib2xzOiBbJ2NoYXIkc3RyaW5nJDMnXSB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnY2hhciRzdHJpbmckNCcsXHJcbiAgICAgIHN5bWJvbHM6IFt7IGxpdGVyYWw6ICd0JyB9LCB7IGxpdGVyYWw6ICdhJyB9LCB7IGxpdGVyYWw6ICdiJyB9XSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uIGpvaW5lcihkKSB7XHJcbiAgICAgICAgcmV0dXJuIGQuam9pbignJyk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7IG5hbWU6ICdjaGFyJywgc3ltYm9sczogWydjaGFyJHN0cmluZyQ0J10gfSxcclxuICAgIHsgbmFtZTogJ2NoYXInLCBzeW1ib2xzOiBbJ3VuaWNvZGUnXSwgcG9zdHByb2Nlc3M6IGRhdGEgPT4gZGF0YVswXSB9LFxyXG4gICAgeyBuYW1lOiAnTnVtYmVyJywgc3ltYm9sczogWydJbnRlZ2VyJ10gfSxcclxuICAgIHsgbmFtZTogJ051bWJlcicsIHN5bWJvbHM6IFsnRmxvYXQnXSwgcG9zdHByb2Nlc3M6IGRhdGEgPT4gZGF0YVswXSB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnRmxvYXQnLFxyXG4gICAgICBzeW1ib2xzOiBbJ2Zsb2F0J10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBkYXRhID0+ICh7IHR5cGU6ICdkb3VibGUnLCBkYXRhOiBkYXRhWzBdWzBdLCBhcmJpdHJhcnk6ICEhZGF0YVswXVsxXSB9KVxyXG4gICAgfSxcclxuICAgIHsgbmFtZTogJ0ludGVnZXIkZWJuZiQxJywgc3ltYm9sczogW3sgbGl0ZXJhbDogJ04nIH1dLCBwb3N0cHJvY2VzczogaWQgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ0ludGVnZXIkZWJuZiQxJyxcclxuICAgICAgc3ltYm9sczogW10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ0ludGVnZXInLFxyXG4gICAgICBzeW1ib2xzOiBbJ2ludCcsICdJbnRlZ2VyJGVibmYkMSddLFxyXG4gICAgICBwb3N0cHJvY2VzczogZGF0YSA9PiAoeyB0eXBlOiAnaW50JywgZGF0YTogZGF0YVswXVswXSwgYXJiaXRyYXJ5OiAhIWRhdGFbMV0gfSlcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdmbG9hdCcsXHJcbiAgICAgIHN5bWJvbHM6IFsnaW50JywgeyBsaXRlcmFsOiAnTScgfV0sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBkYXRhID0+IFtkYXRhLnNsaWNlKDAsIDEpLmpvaW4oJycpLCBkYXRhWzFdXVxyXG4gICAgfSxcclxuICAgIHsgbmFtZTogJ2Zsb2F0JGVibmYkMScsIHN5bWJvbHM6IFt7IGxpdGVyYWw6ICdNJyB9XSwgcG9zdHByb2Nlc3M6IGlkIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdmbG9hdCRlYm5mJDEnLFxyXG4gICAgICBzeW1ib2xzOiBbXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnZmxvYXQnLFxyXG4gICAgICBzeW1ib2xzOiBbJ2ludCcsICdmcmFjJywgJ2Zsb2F0JGVibmYkMSddLFxyXG4gICAgICBwb3N0cHJvY2VzczogZGF0YSA9PiBbZGF0YS5zbGljZSgwLCAyKS5qb2luKCcnKSwgZGF0YVsyXV1cclxuICAgIH0sXHJcbiAgICB7IG5hbWU6ICdmbG9hdCRlYm5mJDInLCBzeW1ib2xzOiBbeyBsaXRlcmFsOiAnTScgfV0sIHBvc3Rwcm9jZXNzOiBpZCB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnZmxvYXQkZWJuZiQyJyxcclxuICAgICAgc3ltYm9sczogW10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ2Zsb2F0JyxcclxuICAgICAgc3ltYm9sczogWydpbnQnLCAnZXhwJywgJ2Zsb2F0JGVibmYkMiddLFxyXG4gICAgICBwb3N0cHJvY2VzczogZGF0YSA9PiBbZGF0YS5zbGljZSgwLCAyKS5qb2luKCcnKSwgZGF0YVsyXV1cclxuICAgIH0sXHJcbiAgICB7IG5hbWU6ICdmbG9hdCRlYm5mJDMnLCBzeW1ib2xzOiBbeyBsaXRlcmFsOiAnTScgfV0sIHBvc3Rwcm9jZXNzOiBpZCB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnZmxvYXQkZWJuZiQzJyxcclxuICAgICAgc3ltYm9sczogW10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ2Zsb2F0JyxcclxuICAgICAgc3ltYm9sczogWydpbnQnLCAnZnJhYycsICdleHAnLCAnZmxvYXQkZWJuZiQzJ10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBkYXRhID0+IFtkYXRhLnNsaWNlKDAsIDMpLmpvaW4oJycpLCBkYXRhWzJdXVxyXG4gICAgfSxcclxuICAgIHsgbmFtZTogJ2ZyYWMkZWJuZiQxJywgc3ltYm9sczogW10gfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ2ZyYWMkZWJuZiQxJyxcclxuICAgICAgc3ltYm9sczogWydmcmFjJGVibmYkMScsICdkaWdpdCddLFxyXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24gYXJycHVzaChkKSB7XHJcbiAgICAgICAgcmV0dXJuIGRbMF0uY29uY2F0KFtkWzFdXSk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdmcmFjJyxcclxuICAgICAgc3ltYm9sczogW3sgbGl0ZXJhbDogJy4nIH0sICdmcmFjJGVibmYkMSddLFxyXG4gICAgICBwb3N0cHJvY2VzczogZGF0YSA9PiBkYXRhWzBdICsgZGF0YVsxXS5qb2luKCcnKVxyXG4gICAgfSxcclxuICAgIHsgbmFtZTogJ2V4cCcsIHN5bWJvbHM6IFsnZXgnLCAnZGlnaXRzJ10sIHBvc3Rwcm9jZXNzOiBkYXRhID0+IGRhdGEuam9pbignJykgfSxcclxuICAgIHsgbmFtZTogJ2V4JHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFt7IGxpdGVyYWw6ICdlJyB9XSB9LFxyXG4gICAgeyBuYW1lOiAnZXgkc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogW3sgbGl0ZXJhbDogJ0UnIH1dIH0sXHJcbiAgICB7IG5hbWU6ICdleCRlYm5mJDEkc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogW3sgbGl0ZXJhbDogJysnIH1dIH0sXHJcbiAgICB7IG5hbWU6ICdleCRlYm5mJDEkc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogW3sgbGl0ZXJhbDogJy0nIH1dIH0sXHJcbiAgICB7IG5hbWU6ICdleCRlYm5mJDEnLCBzeW1ib2xzOiBbJ2V4JGVibmYkMSRzdWJleHByZXNzaW9uJDEnXSwgcG9zdHByb2Nlc3M6IGlkIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdleCRlYm5mJDEnLFxyXG4gICAgICBzeW1ib2xzOiBbXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnZXgnLFxyXG4gICAgICBzeW1ib2xzOiBbJ2V4JHN1YmV4cHJlc3Npb24kMScsICdleCRlYm5mJDEnXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGRhdGEgPT4gJ2UnICsgKGRhdGFbMV0gfHwgJysnKVxyXG4gICAgfSxcclxuICAgIHsgbmFtZTogJ2ludCcsIHN5bWJvbHM6IFsnaW50X25vX3ByZWZpeCddIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdpbnQnLFxyXG4gICAgICBzeW1ib2xzOiBbeyBsaXRlcmFsOiAnKycgfSwgJ2ludF9ub19wcmVmaXgnXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGRhdGEgPT4gZGF0YS5qb2luKCcnKVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ2ludCcsXHJcbiAgICAgIHN5bWJvbHM6IFt7IGxpdGVyYWw6ICctJyB9LCAnaW50X25vX3ByZWZpeCddLFxyXG4gICAgICBwb3N0cHJvY2VzczogZGF0YSA9PiBkYXRhLmpvaW4oJycpXHJcbiAgICB9LFxyXG4gICAgeyBuYW1lOiAnaW50X25vX3ByZWZpeCcsIHN5bWJvbHM6IFt7IGxpdGVyYWw6ICcwJyB9XSwgcG9zdHByb2Nlc3M6IGRhdGEgPT4gZGF0YS5qb2luKCcnKSB9LFxyXG4gICAgeyBuYW1lOiAnaW50X25vX3ByZWZpeCRlYm5mJDEnLCBzeW1ib2xzOiBbXSB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnaW50X25vX3ByZWZpeCRlYm5mJDEnLFxyXG4gICAgICBzeW1ib2xzOiBbJ2ludF9ub19wcmVmaXgkZWJuZiQxJywgJ2RpZ2l0J10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBmdW5jdGlvbiBhcnJwdXNoKGQpIHtcclxuICAgICAgICByZXR1cm4gZFswXS5jb25jYXQoW2RbMV1dKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ2ludF9ub19wcmVmaXgnLFxyXG4gICAgICBzeW1ib2xzOiBbJ29uZVRvTmluZScsICdpbnRfbm9fcHJlZml4JGVibmYkMSddLFxyXG4gICAgICBwb3N0cHJvY2VzczogZGF0YSA9PiBkYXRhWzBdICsgZGF0YVsxXS5qb2luKCcnKVxyXG4gICAgfSxcclxuICAgIHsgbmFtZTogJ29uZVRvTmluZScsIHN5bWJvbHM6IFsvWzEtOV0vXSwgcG9zdHByb2Nlc3M6IGRhdGEgPT4gZGF0YS5qb2luKCcnKSB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnTWFwRWxlbScsXHJcbiAgICAgIHN5bWJvbHM6IFsnbWFwS2V5JywgJ21hcFZhbHVlJ10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBkYXRhID0+IFtbZGF0YVswXVswXSwgZGF0YVsxXVswXV1dLmNvbmNhdChkYXRhWzFdLnNsaWNlKDEpKVxyXG4gICAgfSxcclxuICAgIHsgbmFtZTogJ21hcEtleSRzdWJleHByZXNzaW9uJDEnLCBzeW1ib2xzOiBbJ21hcEtleVNwYWNlJ10gfSxcclxuICAgIHsgbmFtZTogJ21hcEtleSRzdWJleHByZXNzaW9uJDEnLCBzeW1ib2xzOiBbJ21hcEtleU5vU3BhY2UnXSB9LFxyXG4gICAgeyBuYW1lOiAnbWFwS2V5Jywgc3ltYm9sczogWydtYXBLZXkkc3ViZXhwcmVzc2lvbiQxJ10sIHBvc3Rwcm9jZXNzOiBkYXRhID0+IGRhdGFbMF0gfSxcclxuICAgIHsgbmFtZTogJ21hcFZhbHVlJHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFsnbWFwVmFsdWVTcGFjZSddIH0sXHJcbiAgICB7IG5hbWU6ICdtYXBWYWx1ZSRzdWJleHByZXNzaW9uJDEnLCBzeW1ib2xzOiBbJ21hcFZhbHVlTm9TcGFjZSddIH0sXHJcbiAgICB7IG5hbWU6ICdtYXBWYWx1ZScsIHN5bWJvbHM6IFsnbWFwVmFsdWUkc3ViZXhwcmVzc2lvbiQxJ10sIHBvc3Rwcm9jZXNzOiBkYXRhID0+IGRhdGFbMF1bMF0gfSxcclxuICAgIHsgbmFtZTogJ21hcEtleVNwYWNlJGVibmYkMScsIHN5bWJvbHM6IFtdIH0sXHJcbiAgICB7IG5hbWU6ICdtYXBLZXlTcGFjZSRlYm5mJDEkc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogWydEaXNjYXJkJywgJ18nXSB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnbWFwS2V5U3BhY2UkZWJuZiQxJyxcclxuICAgICAgc3ltYm9sczogWydtYXBLZXlTcGFjZSRlYm5mJDEnLCAnbWFwS2V5U3BhY2UkZWJuZiQxJHN1YmV4cHJlc3Npb24kMSddLFxyXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24gYXJycHVzaChkKSB7XHJcbiAgICAgICAgcmV0dXJuIGRbMF0uY29uY2F0KFtkWzFdXSk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdtYXBLZXlTcGFjZScsXHJcbiAgICAgIHN5bWJvbHM6IFsnbWFwS2V5U3BhY2UkZWJuZiQxJywgJ21hcEVsZW1lbnRTcGFjZScsICdfJ10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBkYXRhID0+IGRhdGFbMV1cclxuICAgIH0sXHJcbiAgICB7IG5hbWU6ICdtYXBLZXlOb1NwYWNlJGVibmYkMScsIHN5bWJvbHM6IFtdIH0sXHJcbiAgICB7IG5hbWU6ICdtYXBLZXlOb1NwYWNlJGVibmYkMSRzdWJleHByZXNzaW9uJDEkZWJuZiQxJywgc3ltYm9sczogWydfJ10sIHBvc3Rwcm9jZXNzOiBpZCB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnbWFwS2V5Tm9TcGFjZSRlYm5mJDEkc3ViZXhwcmVzc2lvbiQxJGVibmYkMScsXHJcbiAgICAgIHN5bWJvbHM6IFtdLFxyXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdtYXBLZXlOb1NwYWNlJGVibmYkMSRzdWJleHByZXNzaW9uJDEnLFxyXG4gICAgICBzeW1ib2xzOiBbJ0Rpc2NhcmQnLCAnbWFwS2V5Tm9TcGFjZSRlYm5mJDEkc3ViZXhwcmVzc2lvbiQxJGVibmYkMSddXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnbWFwS2V5Tm9TcGFjZSRlYm5mJDEnLFxyXG4gICAgICBzeW1ib2xzOiBbJ21hcEtleU5vU3BhY2UkZWJuZiQxJywgJ21hcEtleU5vU3BhY2UkZWJuZiQxJHN1YmV4cHJlc3Npb24kMSddLFxyXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24gYXJycHVzaChkKSB7XHJcbiAgICAgICAgcmV0dXJuIGRbMF0uY29uY2F0KFtkWzFdXSk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7IG5hbWU6ICdtYXBLZXlOb1NwYWNlJGVibmYkMicsIHN5bWJvbHM6IFsnXyddLCBwb3N0cHJvY2VzczogaWQgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ21hcEtleU5vU3BhY2UkZWJuZiQyJyxcclxuICAgICAgc3ltYm9sczogW10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ21hcEtleU5vU3BhY2UnLFxyXG4gICAgICBzeW1ib2xzOiBbJ21hcEtleU5vU3BhY2UkZWJuZiQxJywgJ21hcEVsZW1lbnROb1NwYWNlJywgJ21hcEtleU5vU3BhY2UkZWJuZiQyJ10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBkYXRhID0+IGRhdGFbMV1cclxuICAgIH0sXHJcbiAgICB7IG5hbWU6ICdtYXBWYWx1ZVNwYWNlJGVibmYkMScsIHN5bWJvbHM6IFtdIH0sXHJcbiAgICB7IG5hbWU6ICdtYXBWYWx1ZVNwYWNlJGVibmYkMSRzdWJleHByZXNzaW9uJDEnLCBzeW1ib2xzOiBbJ0Rpc2NhcmQnLCAnXyddIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdtYXBWYWx1ZVNwYWNlJGVibmYkMScsXHJcbiAgICAgIHN5bWJvbHM6IFsnbWFwVmFsdWVTcGFjZSRlYm5mJDEnLCAnbWFwVmFsdWVTcGFjZSRlYm5mJDEkc3ViZXhwcmVzc2lvbiQxJ10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBmdW5jdGlvbiBhcnJwdXNoKGQpIHtcclxuICAgICAgICByZXR1cm4gZFswXS5jb25jYXQoW2RbMV1dKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHsgbmFtZTogJ21hcFZhbHVlU3BhY2UkZWJuZiQyJHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFsnXycsICdNYXBFbGVtJ10gfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ21hcFZhbHVlU3BhY2UkZWJuZiQyJyxcclxuICAgICAgc3ltYm9sczogWydtYXBWYWx1ZVNwYWNlJGVibmYkMiRzdWJleHByZXNzaW9uJDEnXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGlkXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnbWFwVmFsdWVTcGFjZSRlYm5mJDInLFxyXG4gICAgICBzeW1ib2xzOiBbXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnbWFwVmFsdWVTcGFjZScsXHJcbiAgICAgIHN5bWJvbHM6IFsnbWFwVmFsdWVTcGFjZSRlYm5mJDEnLCAnbWFwRWxlbWVudFNwYWNlJywgJ21hcFZhbHVlU3BhY2UkZWJuZiQyJ10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBkYXRhID0+IFtkYXRhWzFdXS5jb25jYXQoZGF0YVsyXSA/IGRhdGFbMl1bMV0gOiBbXSlcclxuICAgIH0sXHJcbiAgICB7IG5hbWU6ICdtYXBWYWx1ZU5vU3BhY2UkZWJuZiQxJywgc3ltYm9sczogW10gfSxcclxuICAgIHsgbmFtZTogJ21hcFZhbHVlTm9TcGFjZSRlYm5mJDEkc3ViZXhwcmVzc2lvbiQxJGVibmYkMScsIHN5bWJvbHM6IFsnXyddLCBwb3N0cHJvY2VzczogaWQgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ21hcFZhbHVlTm9TcGFjZSRlYm5mJDEkc3ViZXhwcmVzc2lvbiQxJGVibmYkMScsXHJcbiAgICAgIHN5bWJvbHM6IFtdLFxyXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdtYXBWYWx1ZU5vU3BhY2UkZWJuZiQxJHN1YmV4cHJlc3Npb24kMScsXHJcbiAgICAgIHN5bWJvbHM6IFsnRGlzY2FyZCcsICdtYXBWYWx1ZU5vU3BhY2UkZWJuZiQxJHN1YmV4cHJlc3Npb24kMSRlYm5mJDEnXVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ21hcFZhbHVlTm9TcGFjZSRlYm5mJDEnLFxyXG4gICAgICBzeW1ib2xzOiBbJ21hcFZhbHVlTm9TcGFjZSRlYm5mJDEnLCAnbWFwVmFsdWVOb1NwYWNlJGVibmYkMSRzdWJleHByZXNzaW9uJDEnXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uIGFycnB1c2goZCkge1xyXG4gICAgICAgIHJldHVybiBkWzBdLmNvbmNhdChbZFsxXV0pO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgeyBuYW1lOiAnbWFwVmFsdWVOb1NwYWNlJGVibmYkMiRzdWJleHByZXNzaW9uJDEkZWJuZiQxJywgc3ltYm9sczogWydfJ10sIHBvc3Rwcm9jZXNzOiBpZCB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnbWFwVmFsdWVOb1NwYWNlJGVibmYkMiRzdWJleHByZXNzaW9uJDEkZWJuZiQxJyxcclxuICAgICAgc3ltYm9sczogW10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ21hcFZhbHVlTm9TcGFjZSRlYm5mJDIkc3ViZXhwcmVzc2lvbiQxJyxcclxuICAgICAgc3ltYm9sczogWydtYXBWYWx1ZU5vU3BhY2UkZWJuZiQyJHN1YmV4cHJlc3Npb24kMSRlYm5mJDEnLCAnTWFwRWxlbSddXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnbWFwVmFsdWVOb1NwYWNlJGVibmYkMicsXHJcbiAgICAgIHN5bWJvbHM6IFsnbWFwVmFsdWVOb1NwYWNlJGVibmYkMiRzdWJleHByZXNzaW9uJDEnXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGlkXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnbWFwVmFsdWVOb1NwYWNlJGVibmYkMicsXHJcbiAgICAgIHN5bWJvbHM6IFtdLFxyXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdtYXBWYWx1ZU5vU3BhY2UnLFxyXG4gICAgICBzeW1ib2xzOiBbJ21hcFZhbHVlTm9TcGFjZSRlYm5mJDEnLCAnbWFwRWxlbWVudE5vU3BhY2UnLCAnbWFwVmFsdWVOb1NwYWNlJGVibmYkMiddLFxyXG4gICAgICBwb3N0cHJvY2VzczogZGF0YSA9PiBbZGF0YVsxXV0uY29uY2F0KGRhdGFbMl0gPyBkYXRhWzJdWzFdIDogW10pXHJcbiAgICB9LFxyXG4gICAgeyBuYW1lOiAnbWFwRWxlbWVudE5vU3BhY2Ukc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogWydWZWN0b3InXSB9LFxyXG4gICAgeyBuYW1lOiAnbWFwRWxlbWVudE5vU3BhY2Ukc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogWydMaXN0J10gfSxcclxuICAgIHsgbmFtZTogJ21hcEVsZW1lbnROb1NwYWNlJHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFsnU3RyaW5nJ10gfSxcclxuICAgIHsgbmFtZTogJ21hcEVsZW1lbnROb1NwYWNlJHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFsnTWFwJ10gfSxcclxuICAgIHsgbmFtZTogJ21hcEVsZW1lbnROb1NwYWNlJHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFsnU2V0J10gfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ21hcEVsZW1lbnROb1NwYWNlJyxcclxuICAgICAgc3ltYm9sczogWydtYXBFbGVtZW50Tm9TcGFjZSRzdWJleHByZXNzaW9uJDEnXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGRhdGEgPT4gZGF0YVswXVswXVxyXG4gICAgfSxcclxuICAgIHsgbmFtZTogJ21hcEVsZW1lbnRTcGFjZSRzdWJleHByZXNzaW9uJDEnLCBzeW1ib2xzOiBbJ051bWJlciddIH0sXHJcbiAgICB7IG5hbWU6ICdtYXBFbGVtZW50U3BhY2Ukc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogWydDaGFyYWN0ZXInXSB9LFxyXG4gICAgeyBuYW1lOiAnbWFwRWxlbWVudFNwYWNlJHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFsnUmVzZXJ2ZWQnXSB9LFxyXG4gICAgeyBuYW1lOiAnbWFwRWxlbWVudFNwYWNlJHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFsnU3ltYm9sJ10gfSxcclxuICAgIHsgbmFtZTogJ21hcEVsZW1lbnRTcGFjZSRzdWJleHByZXNzaW9uJDEnLCBzeW1ib2xzOiBbJ0tleXdvcmQnXSB9LFxyXG4gICAgeyBuYW1lOiAnbWFwRWxlbWVudFNwYWNlJHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFsnVGFnJ10gfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ21hcEVsZW1lbnRTcGFjZScsXHJcbiAgICAgIHN5bWJvbHM6IFsnbWFwRWxlbWVudFNwYWNlJHN1YmV4cHJlc3Npb24kMSddLFxyXG4gICAgICBwb3N0cHJvY2VzczogZGF0YSA9PiBbXS5jb25jYXQoLi4uW2RhdGFbMF1bMF1dKVswXVxyXG4gICAgfSxcclxuICAgIHsgbmFtZTogJ2hleERpZ2l0Jywgc3ltYm9sczogWy9bYS1mQS1GMC05XS9dLCBwb3N0cHJvY2VzczogZGF0YSA9PiBkYXRhWzBdIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICd1bmljb2RlJyxcclxuICAgICAgc3ltYm9sczogW3sgbGl0ZXJhbDogJ3UnIH0sICdoZXhEaWdpdCcsICdoZXhEaWdpdCcsICdoZXhEaWdpdCcsICdoZXhEaWdpdCddLFxyXG4gICAgICBwb3N0cHJvY2VzczogZGF0YSA9PiBTdHJpbmcuZnJvbUNoYXJDb2RlKHBhcnNlSW50KGRhdGEuc2xpY2UoMSkuam9pbignJyksIDE2KSlcclxuICAgIH0sXHJcbiAgICB7IG5hbWU6ICdfJywgc3ltYm9sczogWydzcGFjZSddLCBwb3N0cHJvY2VzczogZGF0YSA9PiBkYXRhWzBdIH0sXHJcbiAgICB7IG5hbWU6ICdzcGFjZSRlYm5mJDEnLCBzeW1ib2xzOiBbL1tcXHMsXFxuXS9dIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdzcGFjZSRlYm5mJDEnLFxyXG4gICAgICBzeW1ib2xzOiBbJ3NwYWNlJGVibmYkMScsIC9bXFxzLFxcbl0vXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uIGFycnB1c2goZCkge1xyXG4gICAgICAgIHJldHVybiBkWzBdLmNvbmNhdChbZFsxXV0pO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgeyBuYW1lOiAnc3BhY2UnLCBzeW1ib2xzOiBbJ3NwYWNlJGVibmYkMSddLCBwb3N0cHJvY2VzczogZGF0YSA9PiBkYXRhWzBdLmpvaW4oJycpIH0sXHJcbiAgICB7IG5hbWU6ICdkaWdpdHMkZWJuZiQxJywgc3ltYm9sczogWydkaWdpdCddIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdkaWdpdHMkZWJuZiQxJyxcclxuICAgICAgc3ltYm9sczogWydkaWdpdHMkZWJuZiQxJywgJ2RpZ2l0J10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBmdW5jdGlvbiBhcnJwdXNoKGQpIHtcclxuICAgICAgICByZXR1cm4gZFswXS5jb25jYXQoW2RbMV1dKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHsgbmFtZTogJ2RpZ2l0cycsIHN5bWJvbHM6IFsnZGlnaXRzJGVibmYkMSddLCBwb3N0cHJvY2VzczogZGF0YSA9PiBkYXRhWzBdLmpvaW4oJycpIH0sXHJcbiAgICB7IG5hbWU6ICdkaWdpdCcsIHN5bWJvbHM6IFsvWzAtOV0vXSwgcG9zdHByb2Nlc3M6IGRhdGEgPT4gZGF0YVswXSB9LFxyXG4gICAgeyBuYW1lOiAnbGV0dGVyJywgc3ltYm9sczogWy9bYS16QS1aXS9dLCBwb3N0cHJvY2VzczogZGF0YSA9PiBkYXRhWzBdIH1cclxuICBdLFxyXG4gIFBhcnNlclN0YXJ0OiAnTWFpbidcclxufTtcclxuXHJcbi8vIERvIHRoZSBwYXJzaW5nXHJcbmltcG9ydCB7IFBhcnNlciwgR3JhbW1hciB9IGZyb20gJ25lYXJsZXknO1xyXG5pbXBvcnQgeyBwcmVwcm9jZXNzIH0gZnJvbSAnLi9wcmVwcm9jZXNzb3InO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlKHN0cmluZzogc3RyaW5nKSB7XHJcbiAgY29uc3QgcGFyc2VyID0gbmV3IFBhcnNlcihHcmFtbWFyLmZyb21Db21waWxlZChncmFtbWFyKSk7XHJcbiAgY29uc3Qgc3RyID0gcHJlcHJvY2VzcyhzdHJpbmcpO1xyXG4gIGlmICghc3RyKSByZXR1cm4gbnVsbDtcclxuICB0cnkge1xyXG4gICAgcmV0dXJuIHBhcnNlci5mZWVkKHByZXByb2Nlc3Moc3RyaW5nKSkucmVzdWx0c1swXTtcclxuICB9IGNhdGNoIHtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgcGFyc2UgfSBmcm9tICcuL2dyYW1tYXInO1xyXG5pbXBvcnQgeyBwcm9jZXNzVG9rZW5zIGFzIGNvcnJlY3RQcm9jZXNzIH0gZnJvbSAnLi9pbnRlcnByZXRlcic7XHJcbmltcG9ydCB7IHN0cmluZ2lmeSB9IGZyb20gJy4vc3RyaW5naWZ5JztcclxuaW1wb3J0IHsgcHJvY2Vzc1Rva2VucyBhcyBqc29uUHJvY2VzcyB9IGZyb20gJy4vanNvbl9pbnRlcnByZXRlcic7XHJcbmltcG9ydCAqIGFzIHR5cGVzIGZyb20gJy4vdHlwZXMnO1xyXG5cclxuZXhwb3J0IGNvbnN0IEVkbiA9IHtcclxuICBwYXJzZTogKHN0cjogc3RyaW5nKSA9PiBjb3JyZWN0UHJvY2VzcyhwYXJzZShzdHIpKSxcclxuICBwYXJzZUpzb246IChzdHI6IHN0cmluZykgPT4ganNvblByb2Nlc3MocGFyc2Uoc3RyKSksXHJcbiAgc3RyaW5naWZ5LFxyXG4gIHR5cGVzXHJcbn07XHJcbiIsImltcG9ydCB7IGtleXdvcmQsIG1hcCwgc2V0LCBzeW1ib2wsIHRhZyB9IGZyb20gJy4vdHlwZXMnO1xyXG5pbXBvcnQgeyBmbGF0TWFwIH0gZnJvbSAndG9mdS1qcy9kaXN0L2FycmF5cyc7XHJcbmltcG9ydCB7IGlzQXJyYXkgfSBmcm9tICd0b2Z1LWpzL2Rpc3QvaXMnO1xyXG5pbXBvcnQgeyB1bmVzY2FwZVN0ciB9IGZyb20gJy4vc3RyaW5ncyc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcHJvY2Vzc1Rva2Vucyh0b2tlbnM6IGFueVtdIHwgYm9vbGVhbikge1xyXG4gIGlmICghaXNBcnJheSh0b2tlbnMpKSB7XHJcbiAgICB0aHJvdyAnSW52YWxpZCBFRE4gc3RyaW5nJztcclxuICB9XHJcbiAgcmV0dXJuIHRva2Vucy5maWx0ZXIodCA9PiB0ICYmIHQudHlwZSAhPT0gJ2Rpc2NhcmQnKS5tYXAocHJvY2Vzc1Rva2VuKTtcclxufVxyXG5cclxuZnVuY3Rpb24gcHJvY2Vzc1Rva2VuKHRva2VuOiBhbnkpOiBhbnkge1xyXG4gIGNvbnN0IHsgZGF0YSwgdHlwZSwgdGFnIH0gPSB0b2tlbjtcclxuICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgIGNhc2UgJ2RvdWJsZSc6XHJcbiAgICAgIHJldHVybiBwYXJzZUZsb2F0KGRhdGEpO1xyXG4gICAgY2FzZSAnaW50JzpcclxuICAgICAgcmV0dXJuIHBhcnNlSW50KGRhdGEpO1xyXG4gICAgY2FzZSAnc3RyaW5nJzpcclxuICAgICAgcmV0dXJuIHVuZXNjYXBlU3RyKGRhdGEpO1xyXG4gICAgY2FzZSAnY2hhcic6XHJcbiAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgY2FzZSAna2V5d29yZCc6XHJcbiAgICAgIHJldHVybiBrZXl3b3JkKGRhdGEpO1xyXG4gICAgY2FzZSAnc3ltYm9sJzpcclxuICAgICAgcmV0dXJuIHN5bWJvbChkYXRhKTtcclxuICAgIGNhc2UgJ2Jvb2xlYW4nOlxyXG4gICAgY2FzZSAnYm9vbCc6XHJcbiAgICAgIHJldHVybiBkYXRhID09PSAndHJ1ZScgfHwgZGF0YSA9PT0gdHJ1ZTtcclxuICAgIGNhc2UgJ3RhZyc6XHJcbiAgICAgIHJldHVybiBwcm9jZXNzVGFnKHRhZywgZGF0YSk7XHJcbiAgICBjYXNlICdsaXN0JzpcclxuICAgIGNhc2UgJ3ZlY3Rvcic6XHJcbiAgICAgIHJldHVybiBwcm9jZXNzVG9rZW5zKGRhdGEpO1xyXG4gICAgY2FzZSAnc2V0JzpcclxuICAgICAgcmV0dXJuIHNldChwcm9jZXNzVG9rZW5zKGRhdGEpKTtcclxuICAgIGNhc2UgJ21hcCc6XHJcbiAgICAgIHJldHVybiBtYXAoZmxhdE1hcChwcm9jZXNzVG9rZW5zLCBkYXRhKSk7XHJcbiAgfVxyXG4gIHJldHVybiBudWxsO1xyXG59XHJcblxyXG5mdW5jdGlvbiBwcm9jZXNzVGFnKHRhZ05hbWU6IHN0cmluZywgZGF0YTogYW55KSB7XHJcbiAgcmV0dXJuIHRhZyh0YWdOYW1lLCBwcm9jZXNzVG9rZW4oZGF0YSkpO1xyXG59XHJcbiIsImltcG9ydCB7IGNodW5rLCBmbGF0TWFwLCBmcm9tUGFpcnMsIG1hcCB9IGZyb20gJ3RvZnUtanMvZGlzdC9hcnJheXMnO1xyXG5pbXBvcnQgeyBpc0FycmF5IH0gZnJvbSAndG9mdS1qcy9kaXN0L2lzJztcclxuaW1wb3J0IHsgdW5lc2NhcGVTdHIgfSBmcm9tICcuL3N0cmluZ3MnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHByb2Nlc3NUb2tlbnModG9rZW5zOiBhbnlbXSB8IGJvb2xlYW4pIHtcclxuICBpZiAoIWlzQXJyYXkodG9rZW5zKSkge1xyXG4gICAgdGhyb3cgJ0ludmFsaWQgRUROIHN0cmluZyc7XHJcbiAgfVxyXG4gIHJldHVybiB0b2tlbnMuZmlsdGVyKHQgPT4gdCAmJiB0LnR5cGUgIT09ICdkaXNjYXJkJykubWFwKHByb2Nlc3NUb2tlbik7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHByb2Nlc3NUb2tlbih0b2tlbjogYW55KTogYW55IHtcclxuICBjb25zdCB7IGRhdGEsIHR5cGUsIHRhZyB9ID0gdG9rZW47XHJcbiAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICBjYXNlICdkb3VibGUnOlxyXG4gICAgICByZXR1cm4gcGFyc2VGbG9hdChkYXRhKTtcclxuICAgIGNhc2UgJ2ludCc6XHJcbiAgICAgIHJldHVybiBwYXJzZUludChkYXRhKTtcclxuICAgIGNhc2UgJ3N0cmluZyc6XHJcbiAgICAgIHJldHVybiB1bmVzY2FwZVN0cihkYXRhKTtcclxuICAgIGNhc2UgJ2NoYXInOlxyXG4gICAgICByZXR1cm4gZGF0YTtcclxuICAgIGNhc2UgJ2tleXdvcmQnOlxyXG4gICAgICByZXR1cm4gZGF0YTtcclxuICAgIGNhc2UgJ3N5bWJvbCc6XHJcbiAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgY2FzZSAnYm9vbGVhbic6XHJcbiAgICBjYXNlICdib29sJzpcclxuICAgICAgcmV0dXJuIGRhdGEgPT09ICd0cnVlJyB8fCBkYXRhID09PSB0cnVlO1xyXG4gICAgY2FzZSAndGFnJzpcclxuICAgICAgcmV0dXJuIHsgdGFnLCB2YWx1ZTogcHJvY2Vzc1Rva2VuKGRhdGEpIH07XHJcbiAgICBjYXNlICdsaXN0JzpcclxuICAgIGNhc2UgJ3ZlY3Rvcic6XHJcbiAgICAgIHJldHVybiBwcm9jZXNzVG9rZW5zKGRhdGEpO1xyXG4gICAgY2FzZSAnc2V0JzpcclxuICAgICAgcmV0dXJuIGZyb21QYWlycyhtYXAodCA9PiBbdCwgdF0sIHByb2Nlc3NUb2tlbnMoZGF0YSkpKTtcclxuICAgIGNhc2UgJ21hcCc6XHJcbiAgICAgIHJldHVybiBmcm9tUGFpcnMoY2h1bmsoMiwgZmxhdE1hcChwcm9jZXNzVG9rZW5zLCBkYXRhKSkgYXMgYW55KTtcclxuICB9XHJcbiAgcmV0dXJuIG51bGw7XHJcbn1cclxuIiwiZXhwb3J0IGNvbnN0IHByZXByb2Nlc3MgPSAoc3RyOiBzdHJpbmcpID0+IHJlbW92ZUNvbW1lbnRzKHN0cikudHJpbSgpO1xyXG5cclxuZnVuY3Rpb24gcmVtb3ZlQ29tbWVudHMoc3RyOiBzdHJpbmcpIHtcclxuICBsZXQgbmV3U3RyID0gJyc7XHJcbiAgbGV0IGluUXVvdGVzID0gZmFsc2U7XHJcbiAgbGV0IGluQ29tbWVudCA9IGZhbHNlO1xyXG4gIGxldCBza2lwID0gZmFsc2U7XHJcbiAgZm9yIChjb25zdCBjIG9mIHN0cikge1xyXG4gICAgaWYgKHNraXApIHtcclxuICAgICAgbmV3U3RyICs9IGM7XHJcbiAgICAgIHNraXAgPSBmYWxzZTtcclxuICAgIH0gZWxzZSBpZiAoYyA9PT0gJzsnICYmICFpblF1b3Rlcykge1xyXG4gICAgICBpbkNvbW1lbnQgPSB0cnVlO1xyXG4gICAgfSBlbHNlIGlmIChjID09PSAnXFxuJykge1xyXG4gICAgICBuZXdTdHIgKz0gJ1xcbic7XHJcbiAgICAgIGluQ29tbWVudCA9IGZhbHNlO1xyXG4gICAgfSBlbHNlIGlmICghaW5Db21tZW50KSB7XHJcbiAgICAgIG5ld1N0ciArPSBjO1xyXG4gICAgICBpZiAoYyA9PT0gJ1xcXFwnKSBza2lwID0gdHJ1ZTtcclxuICAgICAgZWxzZSBpZiAoYyA9PT0gJ1wiJykgaW5RdW90ZXMgPSAhaW5RdW90ZXM7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBuZXdTdHI7XHJcbn1cclxuIiwiaW1wb3J0IHsgcGlwZSB9IGZyb20gJ3RvZnUtanMvZGlzdC9mcCc7XHJcbmltcG9ydCB7IGNvbGxlY3RUb0FycmF5LCBmbGF0dGVuIGFzIGlmbGF0dGVuLCBtYXAgYXMgaW1hcCB9IGZyb20gJ3RvZnUtanMvZGlzdC9pdGVyYXRvcnMnO1xyXG5pbXBvcnQgeyBqb2luLCBtYXAgYXMgYW1hcCB9IGZyb20gJ3RvZnUtanMvZGlzdC9hcnJheXMnO1xyXG5pbXBvcnQgeyBFZG5LZXl3b3JkLCBFZG5NYXAsIEVkblNldCwgRWRuU3ltYm9sLCBFZG5UYWcsIHR5cGUgfSBmcm9tICcuL3R5cGVzJztcclxuaW1wb3J0IHsgZW50cmllcyB9IGZyb20gJ3RvZnUtanMvZGlzdC9vYmplY3RzJztcclxuXHJcbmV4cG9ydCBjb25zdCBzdHJpbmdpZnkgPSAoZGF0YTogYW55KSA9PiB7XHJcbiAgY29uc3QgdHlwZU9mID0gdHlwZShkYXRhKTtcclxuICBzd2l0Y2ggKHR5cGVPZikge1xyXG4gICAgY2FzZSAnTmlsJzpcclxuICAgICAgcmV0dXJuICduaWwnO1xyXG4gICAgY2FzZSAnTnVtYmVyJzpcclxuICAgICAgcmV0dXJuICcnICsgZGF0YTtcclxuICAgIGNhc2UgJ1N0cmluZyc6XHJcbiAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShkYXRhKTtcclxuICAgIGNhc2UgJ01hcCc6XHJcbiAgICAgIHJldHVybiBzdHJpbmdpZnlNYXAoZGF0YSk7XHJcbiAgICBjYXNlICdTZXQnOlxyXG4gICAgICByZXR1cm4gc3RyaW5naWZ5U2V0KGRhdGEpO1xyXG4gICAgY2FzZSAnVGFnJzpcclxuICAgICAgcmV0dXJuIHN0cmluZ2lmeVRhZyhkYXRhKTtcclxuICAgIGNhc2UgJ1N5bWJvbCc6XHJcbiAgICAgIHJldHVybiBzdHJpbmdpZnlTeW1ib2woZGF0YSk7XHJcbiAgICBjYXNlICdLZXl3b3JkJzpcclxuICAgICAgcmV0dXJuIHN0cmluZ2lmeUtleXdvcmQoZGF0YSk7XHJcbiAgICBjYXNlICdWZWN0b3InOlxyXG4gICAgICByZXR1cm4gc3RyaW5naWZ5VmVjdG9yKGRhdGEpO1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgcmV0dXJuICcnICsgZGF0YTtcclxuICB9XHJcbn07XHJcblxyXG5mdW5jdGlvbiBzdHJpbmdpZnlNYXAoZGF0YTogRWRuTWFwIHwgb2JqZWN0KSB7XHJcbiAgcmV0dXJuIChcclxuICAgICd7JyArXHJcbiAgICBwaXBlKFxyXG4gICAgICBlbnRyaWVzKGRhdGEpLFxyXG4gICAgICBpZmxhdHRlbixcclxuICAgICAgaW1hcChzdHJpbmdpZnkpLFxyXG4gICAgICBjb2xsZWN0VG9BcnJheSxcclxuICAgICAgam9pbignICcpXHJcbiAgICApICtcclxuICAgICd9J1xyXG4gICk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHN0cmluZ2lmeVNldChkYXRhOiBFZG5TZXQpIHtcclxuICByZXR1cm4gKFxyXG4gICAgJyN7JyArXHJcbiAgICBwaXBlKFxyXG4gICAgICBkYXRhLnZhbHVlcygpLFxyXG4gICAgICBpbWFwKHN0cmluZ2lmeSksXHJcbiAgICAgIGNvbGxlY3RUb0FycmF5LFxyXG4gICAgICBqb2luKCcgJylcclxuICAgICkgK1xyXG4gICAgJ30nXHJcbiAgKTtcclxufVxyXG5cclxuZnVuY3Rpb24gc3RyaW5naWZ5VGFnKGRhdGE6IEVkblRhZykge1xyXG4gIHJldHVybiAnIycgKyBkYXRhLnRhZy5zeW1ib2wgKyAnICcgKyBzdHJpbmdpZnkoZGF0YS5kYXRhKTtcclxufVxyXG5cclxuZnVuY3Rpb24gc3RyaW5naWZ5U3ltYm9sKGRhdGE6IEVkblN5bWJvbCkge1xyXG4gIHJldHVybiBkYXRhLnN5bWJvbDtcclxufVxyXG5cclxuZnVuY3Rpb24gc3RyaW5naWZ5S2V5d29yZChkYXRhOiBFZG5LZXl3b3JkKSB7XHJcbiAgcmV0dXJuICc6JyArIGRhdGEua2V5d29yZDtcclxufVxyXG5cclxuZnVuY3Rpb24gc3RyaW5naWZ5VmVjdG9yKGRhdGE6IGFueVtdKSB7XHJcbiAgcmV0dXJuICdbJyArIGFtYXAoc3RyaW5naWZ5LCBkYXRhKS5qb2luKCcgJykgKyAnXSc7XHJcbn1cclxuIiwiZXhwb3J0IGZ1bmN0aW9uIHVuZXNjYXBlQ2hhcihzdHI6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgaWYgKCFzdHIubGVuZ3RoKSB7XHJcbiAgICByZXR1cm4gJ1xcXFwnO1xyXG4gIH1cclxuICBjb25zdCBjaGFyID0gc3RyWzBdO1xyXG4gIGNvbnN0IHJlc3QgPSBzdHIuc3Vic3RyKDEpO1xyXG4gIHN3aXRjaCAoY2hhci50b0xvd2VyQ2FzZSgpKSB7XHJcbiAgICBjYXNlICduJzpcclxuICAgICAgcmV0dXJuIGBcXG4ke3Jlc3R9YDtcclxuICAgIGNhc2UgJ3InOlxyXG4gICAgICByZXR1cm4gYFxcciR7cmVzdH1gO1xyXG4gICAgY2FzZSAndCc6XHJcbiAgICAgIHJldHVybiBgXFx0JHtyZXN0fWA7XHJcbiAgICBjYXNlICdcXFxcJzpcclxuICAgICAgcmV0dXJuIGBcXFxcJHtyZXN0fWA7XHJcbiAgICBjYXNlIFwiJ1wiOlxyXG4gICAgICByZXR1cm4gYFxcJyR7cmVzdH1gO1xyXG4gICAgY2FzZSAnXCInOlxyXG4gICAgICByZXR1cm4gYFwiJHtyZXN0fWA7XHJcbiAgICBjYXNlICdiJzpcclxuICAgICAgcmV0dXJuIGBcXGIke3Jlc3R9YDtcclxuICAgIGNhc2UgJ2YnOlxyXG4gICAgICByZXR1cm4gYFxcZiR7cmVzdH1gO1xyXG4gICAgLy8vIFRPRE86IFVuZXNjYXBlIHVuaWNvZGUgY2hhcmFjdGVyc1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgcmV0dXJuIHN0cjtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1bmVzY2FwZVN0cihzdHI6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgY29uc3QgcGFydHMgPSBzdHIuc3BsaXQoJ1xcXFwnKTtcclxuICByZXR1cm4gcGFydHMubWFwKChwLCBpKSA9PiAoaSA/IHVuZXNjYXBlQ2hhcihwKSA6IHApKS5qb2luKCcnKTtcclxufVxyXG4iLCJpbXBvcnQgeyBpc05pbCwgaXNPYmplY3QsIGlzTnVtYmVyLCBpc1N0cmluZywgaXNBcnJheSB9IGZyb20gJ3RvZnUtanMvZGlzdC9pcyc7XHJcbmltcG9ydCB7IGNodW5rLCBmbGF0dGVuLCBtYXAgYXMgYW1hcCwgam9pbiB9IGZyb20gJ3RvZnUtanMvZGlzdC9hcnJheXMnO1xyXG5pbXBvcnQgeyBjb2xsZWN0VG9BcnJheSwgbWFwIGFzIGltYXAsIGZsYXR0ZW4gYXMgaWZsYXR0ZW4gfSBmcm9tICd0b2Z1LWpzL2Rpc3QvaXRlcmF0b3JzJztcclxuaW1wb3J0IHsgcGlwZSB9IGZyb20gJ3RvZnUtanMvZGlzdC9mcCc7XHJcblxyXG5leHBvcnQgY2xhc3MgRWRuS2V5d29yZCB7XHJcbiAgcHJpdmF0ZSBfa2V5d29yZDogc3RyaW5nID0gJyc7XHJcbiAgY29uc3RydWN0b3Ioa2V5d29yZDogc3RyaW5nKSB7XHJcbiAgICB0aGlzLmtleXdvcmQgPSBrZXl3b3JkO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGdldCBrZXl3b3JkKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX2tleXdvcmQ7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc2V0IGtleXdvcmQoa2V5d29yZDogc3RyaW5nKSB7XHJcbiAgICBpZiAoa2V5d29yZFswXSA9PT0gJzonKSB7XHJcbiAgICAgIGtleXdvcmQgPSBrZXl3b3JkLnN1YnN0cigxKTtcclxuICAgIH1cclxuICAgIHRoaXMuX2tleXdvcmQgPSBrZXl3b3JkO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEVkblN5bWJvbCB7XHJcbiAgY29uc3RydWN0b3IocHVibGljIHN5bWJvbDogc3RyaW5nKSB7fVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgRWRuVGFnIHtcclxuICBwdWJsaWMgdGFnOiBFZG5TeW1ib2w7XHJcbiAgY29uc3RydWN0b3IodGFnOiBzdHJpbmcgfCBFZG5TeW1ib2wsIHB1YmxpYyBkYXRhOiBhbnkpIHtcclxuICAgIGlmIChpc1N0cmluZyh0YWcpKSB0aGlzLnRhZyA9IG5ldyBFZG5TeW1ib2wodGFnKTtcclxuICAgIGVsc2UgdGhpcy50YWcgPSB0YWc7XHJcbiAgfVxyXG59XHJcblxyXG5jbGFzcyBBbnlLZXlNYXAge1xyXG4gIHByaXZhdGUgZGF0YSA9IG5ldyBNYXAoKTtcclxuXHJcbiAgY29uc3RydWN0b3IoZGF0YTogYW55W10pIHtcclxuICAgIHRoaXMuZGF0YSA9IG5ldyBNYXAoXHJcbiAgICAgIHBpcGUoXHJcbiAgICAgICAgZGF0YSxcclxuICAgICAgICBjaHVuaygyKSxcclxuICAgICAgICBhbWFwKChba2V5LCB2YWx1ZV06IGFueVtdKSA9PiBbdG9LZXkoa2V5KSwgeyBrZXksIHZhbHVlIH1dKVxyXG4gICAgICApXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgZ2V0KGtleTogYW55KSB7XHJcbiAgICBjb25zdCBrID0gdG9LZXkoa2V5KTtcclxuICAgIGlmICh0aGlzLmRhdGEuaGFzKGspKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmRhdGEuZ2V0KGspLnZhbHVlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBoYXMoa2V5OiBhbnkpIHtcclxuICAgIHJldHVybiB0aGlzLmRhdGEuaGFzKHRvS2V5KGtleSkpO1xyXG4gIH1cclxuXHJcbiAgc2V0KGtleTogYW55LCB2YWx1ZTogYW55KSB7XHJcbiAgICB0aGlzLmRhdGEuc2V0KHRvS2V5KGtleSksIHsga2V5LCB2YWx1ZSB9KTtcclxuICB9XHJcblxyXG4gIGtleXMoKSB7XHJcbiAgICByZXR1cm4gaW1hcCgoeyBrZXkgfSkgPT4ga2V5LCB0aGlzLmRhdGEudmFsdWVzKCkpO1xyXG4gIH1cclxuXHJcbiAgdmFsdWVzKCkge1xyXG4gICAgcmV0dXJuIGltYXAoKHsgdmFsdWUgfSkgPT4gdmFsdWUsIHRoaXMuZGF0YS52YWx1ZXMoKSk7XHJcbiAgfVxyXG5cclxuICBkZWxldGUoa2V5OiBhbnkpIHtcclxuICAgIHJldHVybiB0aGlzLmRhdGEuZGVsZXRlKHRvS2V5KGtleSkpO1xyXG4gIH1cclxuXHJcbiAgY2xlYXIoKSB7XHJcbiAgICB0aGlzLmRhdGEuY2xlYXIoKTtcclxuICB9XHJcblxyXG4gIFtTeW1ib2wuaXRlcmF0b3JdKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZW50cmllcygpO1xyXG4gIH1cclxuXHJcbiAgZW50cmllcygpIHtcclxuICAgIHJldHVybiBpbWFwKCh7IGtleSwgdmFsdWUgfSkgPT4gW2tleSwgdmFsdWVdLCB0aGlzLmRhdGEudmFsdWVzKCkpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEVkbk1hcCB7XHJcbiAgcHJpdmF0ZSBkYXRhOiBBbnlLZXlNYXA7XHJcbiAgY29uc3RydWN0b3IoZGF0YTogYW55W10pIHtcclxuICAgIHRoaXMuZGF0YSA9IG5ldyBBbnlLZXlNYXAoZGF0YSk7XHJcbiAgfVxyXG5cclxuICBoYXMgPSAoa2V5OiBhbnkpID0+IHRoaXMuZGF0YS5oYXMoa2V5KTtcclxuICBjbGVhciA9ICgpID0+IHRoaXMuZGF0YS5jbGVhcigpO1xyXG4gIGRlbGV0ZSA9IChrZXk6IGFueSkgPT4gdGhpcy5kYXRhLmRlbGV0ZShrZXkpO1xyXG4gIGVudHJpZXMgPSAoKSA9PiB0aGlzLmRhdGEuZW50cmllcygpO1xyXG4gIGdldCA9IChrZXk6IGFueSkgPT4gdGhpcy5kYXRhLmdldChrZXkpO1xyXG4gIGtleXMgPSAoKSA9PiB0aGlzLmRhdGEua2V5cygpO1xyXG4gIHNldCA9IChrZXk6IGFueSwgdmFsdWU6IGFueSkgPT4gdGhpcy5kYXRhLnNldChrZXksIHZhbHVlKTtcclxuICB2YWx1ZXMgPSAoKSA9PiB0aGlzLmRhdGEudmFsdWVzKCk7XHJcbiAgW1N5bWJvbC5pdGVyYXRvcl0gPSAoKSA9PiB0aGlzLmRhdGFbU3ltYm9sLml0ZXJhdG9yXSgpO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgRWRuU2V0IHtcclxuICBwcml2YXRlIGRhdGE6IEFueUtleU1hcDtcclxuICBjb25zdHJ1Y3RvcihkYXRhOiBhbnlbXSkge1xyXG4gICAgdGhpcy5kYXRhID0gbmV3IEFueUtleU1hcChcclxuICAgICAgcGlwZShcclxuICAgICAgICBkYXRhLFxyXG4gICAgICAgIGFtYXAoZCA9PiBbZCwgZF0pLFxyXG4gICAgICAgIGZsYXR0ZW5cclxuICAgICAgKVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIGFkZCA9IChlbGVtOiBhbnkpID0+IHRoaXMuZGF0YS5zZXQoZWxlbSwgZWxlbSk7XHJcbiAgY2xlYXIgPSAoKSA9PiB0aGlzLmRhdGEuY2xlYXIoKTtcclxuICBoYXMgPSAoZWxlbTogYW55KSA9PiB0aGlzLmRhdGEuaGFzKGVsZW0pO1xyXG4gIGRlbGV0ZSA9IChlbGVtOiBhbnkpID0+IHRoaXMuZGF0YS5kZWxldGUoZWxlbSk7XHJcbiAgZW50cmllcyA9ICgpID0+IHRoaXMuZGF0YS5lbnRyaWVzKCk7XHJcbiAgdmFsdWVzID0gKCkgPT4gdGhpcy5kYXRhLnZhbHVlcygpO1xyXG4gIFtTeW1ib2wuaXRlcmF0b3JdID0gKCkgPT4gdGhpcy5kYXRhW1N5bWJvbC5pdGVyYXRvcl0oKTtcclxufVxyXG5cclxuZnVuY3Rpb24gdG9LZXkoaW5wdXQ6IGFueSkge1xyXG4gIHJldHVybiB0eXBlKGlucHV0KSArICcjJyArIHRvU3RyaW5nKGlucHV0KTtcclxufVxyXG5cclxuZnVuY3Rpb24gdG9TdHJpbmcoaW5wdXQ6IGFueSkge1xyXG4gIGlmIChpc05pbChpbnB1dCkpIHtcclxuICAgIHJldHVybiAnbnVsbCc7XHJcbiAgfVxyXG4gIHJldHVybiBKU09OLnN0cmluZ2lmeShpbnB1dCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB0eXBlKGlucHV0OiBhbnkpIHtcclxuICBpZiAoaXNOaWwoaW5wdXQpKSB7XHJcbiAgICByZXR1cm4gJ05pbCc7XHJcbiAgfSBlbHNlIGlmIChpc051bWJlcihpbnB1dCkpIHtcclxuICAgIHJldHVybiAnTnVtYmVyJztcclxuICB9IGVsc2UgaWYgKGlzU3RyaW5nKGlucHV0KSkge1xyXG4gICAgcmV0dXJuICdTdHJpbmcnO1xyXG4gIH0gZWxzZSBpZiAoaW5wdXQgaW5zdGFuY2VvZiBFZG5UYWcpIHtcclxuICAgIHJldHVybiAnVGFnJztcclxuICB9IGVsc2UgaWYgKGlucHV0IGluc3RhbmNlb2YgRWRuU3ltYm9sKSB7XHJcbiAgICByZXR1cm4gJ1N5bWJvbCc7XHJcbiAgfSBlbHNlIGlmIChpbnB1dCBpbnN0YW5jZW9mIEVkbktleXdvcmQpIHtcclxuICAgIHJldHVybiAnS2V5d29yZCc7XHJcbiAgfSBlbHNlIGlmIChpbnB1dCBpbnN0YW5jZW9mIEVkblNldCkge1xyXG4gICAgcmV0dXJuICdTZXQnO1xyXG4gIH0gZWxzZSBpZiAoaXNBcnJheShpbnB1dCkpIHtcclxuICAgIHJldHVybiAnVmVjdG9yJztcclxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGlucHV0KSB8fCBpbnB1dCBpbnN0YW5jZW9mIEVkbk1hcCkge1xyXG4gICAgcmV0dXJuICdNYXAnO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gJ090aGVyJztcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBrZXl3b3JkID0gKHN0cjogc3RyaW5nKSA9PiBuZXcgRWRuS2V5d29yZChzdHIpO1xyXG5leHBvcnQgY29uc3Qgc3ltYm9sID0gKHN0cjogc3RyaW5nKSA9PiBuZXcgRWRuU3ltYm9sKHN0cik7XHJcbmV4cG9ydCBjb25zdCBzZXQgPSAoZGF0YTogYW55W10pID0+IG5ldyBFZG5TZXQoZGF0YSk7XHJcbmV4cG9ydCBjb25zdCBtYXAgPSAoZGF0YTogYW55W10pID0+IG5ldyBFZG5NYXAoZGF0YSk7XHJcbmV4cG9ydCBjb25zdCB0YWcgPSAodGFnLCBkYXRhKSA9PiBuZXcgRWRuVGFnKHRhZywgZGF0YSk7XHJcbmV4cG9ydCBjb25zdCBzdHJpbmdpZnkgPSAoZGF0YTogYW55KSA9PiB7XHJcbiAgY29uc3QgdHlwZU9mID0gdHlwZShkYXRhKTtcclxuICBzd2l0Y2ggKHR5cGVPZikge1xyXG4gICAgY2FzZSAnTmlsJzpcclxuICAgICAgcmV0dXJuICduaWwnO1xyXG4gICAgY2FzZSAnTnVtYmVyJzpcclxuICAgICAgcmV0dXJuICcnICsgZGF0YTtcclxuICAgIGNhc2UgJ1N0cmluZyc6XHJcbiAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShkYXRhKTtcclxuICAgIGNhc2UgJ01hcCc6XHJcbiAgICAgIHJldHVybiBzdHJpbmdpZnlNYXAoZGF0YSk7XHJcbiAgICBjYXNlICdTZXQnOlxyXG4gICAgICByZXR1cm4gc3RyaW5naWZ5U2V0KGRhdGEpO1xyXG4gICAgY2FzZSAnVGFnJzpcclxuICAgICAgcmV0dXJuIHN0cmluZ2lmeVRhZyhkYXRhKTtcclxuICAgIGNhc2UgJ1N5bWJvbCc6XHJcbiAgICAgIHJldHVybiBzdHJpbmdpZnlTeW1ib2woZGF0YSk7XHJcbiAgICBjYXNlICdLZXl3b3JkJzpcclxuICAgICAgcmV0dXJuIHN0cmluZ2lmeUtleXdvcmQoZGF0YSk7XHJcbiAgICBjYXNlICdWZWN0b3InOlxyXG4gICAgICByZXR1cm4gc3RyaW5naWZ5VmVjdG9yKGRhdGEpO1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgcmV0dXJuICcnICsgZGF0YTtcclxuICB9XHJcbn07XHJcblxyXG5mdW5jdGlvbiBzdHJpbmdpZnlNYXAoZGF0YTogRWRuTWFwKSB7XHJcbiAgcmV0dXJuIChcclxuICAgICd7JyArXHJcbiAgICBwaXBlKFxyXG4gICAgICBkYXRhLmVudHJpZXMoKSxcclxuICAgICAgaWZsYXR0ZW4sXHJcbiAgICAgIGltYXAoc3RyaW5naWZ5KSxcclxuICAgICAgY29sbGVjdFRvQXJyYXksXHJcbiAgICAgIGpvaW4oJyAnKVxyXG4gICAgKSArXHJcbiAgICAnfSdcclxuICApO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzdHJpbmdpZnlTZXQoZGF0YTogRWRuU2V0KSB7XHJcbiAgcmV0dXJuIChcclxuICAgICcjeycgK1xyXG4gICAgcGlwZShcclxuICAgICAgZGF0YS52YWx1ZXMoKSxcclxuICAgICAgaW1hcChzdHJpbmdpZnkpLFxyXG4gICAgICBjb2xsZWN0VG9BcnJheSxcclxuICAgICAgam9pbignICcpXHJcbiAgICApICtcclxuICAgICd9J1xyXG4gICk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHN0cmluZ2lmeVRhZyhkYXRhOiBFZG5UYWcpIHtcclxuICByZXR1cm4gJyMnICsgZGF0YS50YWcuc3ltYm9sICsgJyAnICsgc3RyaW5naWZ5KGRhdGEuZGF0YSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHN0cmluZ2lmeVN5bWJvbChkYXRhOiBFZG5TeW1ib2wpIHtcclxuICByZXR1cm4gZGF0YS5zeW1ib2w7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHN0cmluZ2lmeUtleXdvcmQoZGF0YTogRWRuS2V5d29yZCkge1xyXG4gIHJldHVybiAnOicgKyBkYXRhLmtleXdvcmQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHN0cmluZ2lmeVZlY3RvcihkYXRhOiBhbnlbXSkge1xyXG4gIHJldHVybiAnWycgKyBhbWFwKHN0cmluZ2lmeSwgZGF0YSkuam9pbignICcpICsgJ10nO1xyXG59XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=