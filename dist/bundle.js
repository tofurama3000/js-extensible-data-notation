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
    symbols: ['_', 'Exp'],
    postprocess: function postprocess(data) {
      return data[1];
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
    postprocess: function postprocess(_d) {
      return null;
    }
  }, {
    name: 'ElementSpace',
    symbols: ['ElementSpace$subexpression$1', 'ElementSpace$ebnf$1'],
    postprocess: function postprocess(data) {
      return [].concat.apply([], [data[0][0]].concat(data[1] ? [].concat.apply([], data[1]) : []));
    }
  }, {
    name: 'ElementNoSpace$subexpression$1',
    symbols: ['Vector']
  }, {
    name: 'ElementNoSpace$subexpression$1',
    symbols: ['List']
  }, {
    name: 'ElementNoSpace$subexpression$1',
    symbols: ['String']
  }, {
    name: 'ElementNoSpace$subexpression$1',
    symbols: ['Map']
  }, {
    name: 'ElementNoSpace$subexpression$1',
    symbols: ['Set']
  }, {
    name: 'ElementNoSpace$ebnf$1$subexpression$1$ebnf$1',
    symbols: ['_'],
    postprocess: id
  }, {
    name: 'ElementNoSpace$ebnf$1$subexpression$1$ebnf$1',
    symbols: [],
    postprocess: function postprocess(_d) {
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
    postprocess: function postprocess(_d) {
      return null;
    }
  }, {
    name: 'ElementNoSpace',
    symbols: ['ElementNoSpace$subexpression$1', 'ElementNoSpace$ebnf$1'],
    postprocess: function postprocess(data) {
      return [data[0][0]].concat(data[1] ? data[1][1] : []);
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
    postprocess: function postprocess(_d) {
      return null;
    }
  }, {
    name: 'Vector$ebnf$2$subexpression$1$ebnf$1',
    symbols: ['_'],
    postprocess: id
  }, {
    name: 'Vector$ebnf$2$subexpression$1$ebnf$1',
    symbols: [],
    postprocess: function postprocess(_d) {
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
    postprocess: function postprocess(_d) {
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
    postprocess: function postprocess(_d) {
      return null;
    }
  }, {
    name: 'List$ebnf$2$subexpression$1$ebnf$1',
    symbols: ['_'],
    postprocess: id
  }, {
    name: 'List$ebnf$2$subexpression$1$ebnf$1',
    symbols: [],
    postprocess: function postprocess(_d) {
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
    postprocess: function postprocess(_d) {
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
    postprocess: function postprocess(_d) {
      return null;
    }
  }, {
    name: 'Map$ebnf$2$subexpression$1$ebnf$1',
    symbols: ['_'],
    postprocess: id
  }, {
    name: 'Map$ebnf$2$subexpression$1$ebnf$1',
    symbols: [],
    postprocess: function postprocess(_d) {
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
    postprocess: function postprocess(_d) {
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
    postprocess: function postprocess(_d) {
      return null;
    }
  }, {
    name: 'Set$ebnf$2$subexpression$1$ebnf$1',
    symbols: ['_'],
    postprocess: id
  }, {
    name: 'Set$ebnf$2$subexpression$1$ebnf$1',
    symbols: [],
    postprocess: function postprocess(_d) {
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
    postprocess: function postprocess(_d) {
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
      if (data[1].data === '_') return reject;
      return {
        type: 'tag',
        tag: data[1].data,
        data: data[3][0]
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
    postprocess: function postprocess(_d) {
      return null;
    }
  }, {
    name: 'Discard',
    symbols: ['Discard$string$1', 'Discard$ebnf$1', 'Element'],
    postprocess: function postprocess(_data) {
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
    symbols: ['symbol_basic']
  }, {
    name: 'Symbol$subexpression$1',
    symbols: ['symbol_like_a_num']
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
    name: 'symbol_not_slash',
    symbols: ['symbol_basic']
  }, {
    name: 'symbol_not_slash',
    symbols: ['symbol_like_a_num'],
    postprocess: function postprocess(data) {
      return data[0];
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
    }, 'symbol_not_slash']
  }, {
    name: 'symbol_basic$ebnf$2',
    symbols: ['symbol_basic$ebnf$2$subexpression$1'],
    postprocess: id
  }, {
    name: 'symbol_basic$ebnf$2',
    symbols: [],
    postprocess: function postprocess(_d) {
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
    postprocess: function postprocess(_d) {
      return null;
    }
  }, {
    name: 'symbol_like_a_num$ebnf$2$subexpression$1',
    symbols: [{
      literal: '/'
    }, 'symbol_not_slash']
  }, {
    name: 'symbol_like_a_num$ebnf$2',
    symbols: ['symbol_like_a_num$ebnf$2$subexpression$1'],
    postprocess: id
  }, {
    name: 'symbol_like_a_num$ebnf$2',
    symbols: [],
    postprocess: function postprocess(_d) {
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
    postprocess: function postprocess(_d) {
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
    postprocess: function postprocess(_d) {
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
    postprocess: function postprocess(_d) {
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
    postprocess: function postprocess(_d) {
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
    postprocess: function postprocess(_d) {
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
    name: 'mapKeySpace',
    symbols: ['mapElementSpace', '_'],
    postprocess: function postprocess(data) {
      return data[0];
    }
  }, {
    name: 'mapKeyNoSpace$ebnf$1',
    symbols: ['_'],
    postprocess: id
  }, {
    name: 'mapKeyNoSpace$ebnf$1',
    symbols: [],
    postprocess: function postprocess(_d) {
      return null;
    }
  }, {
    name: 'mapKeyNoSpace',
    symbols: ['mapElementNoSpace', 'mapKeyNoSpace$ebnf$1'],
    postprocess: function postprocess(data) {
      return data[0];
    }
  }, {
    name: 'mapValueSpace$ebnf$1$subexpression$1',
    symbols: ['_', 'MapElem']
  }, {
    name: 'mapValueSpace$ebnf$1',
    symbols: ['mapValueSpace$ebnf$1$subexpression$1'],
    postprocess: id
  }, {
    name: 'mapValueSpace$ebnf$1',
    symbols: [],
    postprocess: function postprocess(_d) {
      return null;
    }
  }, {
    name: 'mapValueSpace',
    symbols: ['mapElementSpace', 'mapValueSpace$ebnf$1'],
    postprocess: function postprocess(data) {
      return [data[0]].concat(data[1] ? data[1][1] : []);
    }
  }, {
    name: 'mapValueNoSpace$ebnf$1$subexpression$1$ebnf$1',
    symbols: ['_'],
    postprocess: id
  }, {
    name: 'mapValueNoSpace$ebnf$1$subexpression$1$ebnf$1',
    symbols: [],
    postprocess: function postprocess(_d) {
      return null;
    }
  }, {
    name: 'mapValueNoSpace$ebnf$1$subexpression$1',
    symbols: ['mapValueNoSpace$ebnf$1$subexpression$1$ebnf$1', 'MapElem']
  }, {
    name: 'mapValueNoSpace$ebnf$1',
    symbols: ['mapValueNoSpace$ebnf$1$subexpression$1'],
    postprocess: id
  }, {
    name: 'mapValueNoSpace$ebnf$1',
    symbols: [],
    postprocess: function postprocess(_d) {
      return null;
    }
  }, {
    name: 'mapValueNoSpace',
    symbols: ['mapElementNoSpace', 'mapValueNoSpace$ebnf$1'],
    postprocess: function postprocess(data) {
      return [data[0]].concat(data[1] ? data[1][1] : []);
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


function __export(m) {
  for (var p in m) {
    if (!exports.hasOwnProperty(p)) exports[p] = m[p];
  }
}

Object.defineProperty(exports, "__esModule", {
  value: true
});

__export(__webpack_require__(/*! ./interpreter */ "./src/interpreter.ts"));

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

var grammar_1 = __webpack_require__(/*! ./grammar */ "./src/grammar.ts");

exports.Edn = {
  parse: function parse(str) {
    var res = grammar_1.parse(str);
    return res;
  }
};
console.log(JSON.stringify(exports.Edn.parse('[hello world]')));

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

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL25lYXJsZXkvbGliL25lYXJsZXkuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2dyYW1tYXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9pbnRlcnByZXRlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcHJlcHJvY2Vzc29yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7OztBQUdBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ2xGQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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LENBQWhCLEtBQ0ssSUFBSSxDQUFDLEtBQUssR0FBVixFQUFlLFFBQVEsR0FBRyxDQUFDLFFBQVo7QUFDckI7QUFDRjs7QUFDRCxTQUFPLE1BQVA7QUFDRCxDIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2luZGV4LnRzXCIpO1xuIiwiKGZ1bmN0aW9uKHJvb3QsIGZhY3RvcnkpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcm9vdC5uZWFybGV5ID0gZmFjdG9yeSgpO1xuICAgIH1cbn0odGhpcywgZnVuY3Rpb24oKSB7XG5cbiAgICBmdW5jdGlvbiBSdWxlKG5hbWUsIHN5bWJvbHMsIHBvc3Rwcm9jZXNzKSB7XG4gICAgICAgIHRoaXMuaWQgPSArK1J1bGUuaGlnaGVzdElkO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLnN5bWJvbHMgPSBzeW1ib2xzOyAgICAgICAgLy8gYSBsaXN0IG9mIGxpdGVyYWwgfCByZWdleCBjbGFzcyB8IG5vbnRlcm1pbmFsXG4gICAgICAgIHRoaXMucG9zdHByb2Nlc3MgPSBwb3N0cHJvY2VzcztcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIFJ1bGUuaGlnaGVzdElkID0gMDtcblxuICAgIFJ1bGUucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24od2l0aEN1cnNvckF0KSB7XG4gICAgICAgIGZ1bmN0aW9uIHN0cmluZ2lmeVN5bWJvbFNlcXVlbmNlIChlKSB7XG4gICAgICAgICAgICByZXR1cm4gZS5saXRlcmFsID8gSlNPTi5zdHJpbmdpZnkoZS5saXRlcmFsKSA6XG4gICAgICAgICAgICAgICAgICAgZS50eXBlID8gJyUnICsgZS50eXBlIDogZS50b1N0cmluZygpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBzeW1ib2xTZXF1ZW5jZSA9ICh0eXBlb2Ygd2l0aEN1cnNvckF0ID09PSBcInVuZGVmaW5lZFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IHRoaXMuc3ltYm9scy5tYXAoc3RyaW5naWZ5U3ltYm9sU2VxdWVuY2UpLmpvaW4oJyAnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICggICB0aGlzLnN5bWJvbHMuc2xpY2UoMCwgd2l0aEN1cnNvckF0KS5tYXAoc3RyaW5naWZ5U3ltYm9sU2VxdWVuY2UpLmpvaW4oJyAnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBcIiDil48gXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgdGhpcy5zeW1ib2xzLnNsaWNlKHdpdGhDdXJzb3JBdCkubWFwKHN0cmluZ2lmeVN5bWJvbFNlcXVlbmNlKS5qb2luKCcgJykgICAgICk7XG4gICAgICAgIHJldHVybiB0aGlzLm5hbWUgKyBcIiDihpIgXCIgKyBzeW1ib2xTZXF1ZW5jZTtcbiAgICB9XG5cblxuICAgIC8vIGEgU3RhdGUgaXMgYSBydWxlIGF0IGEgcG9zaXRpb24gZnJvbSBhIGdpdmVuIHN0YXJ0aW5nIHBvaW50IGluIHRoZSBpbnB1dCBzdHJlYW0gKHJlZmVyZW5jZSlcbiAgICBmdW5jdGlvbiBTdGF0ZShydWxlLCBkb3QsIHJlZmVyZW5jZSwgd2FudGVkQnkpIHtcbiAgICAgICAgdGhpcy5ydWxlID0gcnVsZTtcbiAgICAgICAgdGhpcy5kb3QgPSBkb3Q7XG4gICAgICAgIHRoaXMucmVmZXJlbmNlID0gcmVmZXJlbmNlO1xuICAgICAgICB0aGlzLmRhdGEgPSBbXTtcbiAgICAgICAgdGhpcy53YW50ZWRCeSA9IHdhbnRlZEJ5O1xuICAgICAgICB0aGlzLmlzQ29tcGxldGUgPSB0aGlzLmRvdCA9PT0gcnVsZS5zeW1ib2xzLmxlbmd0aDtcbiAgICB9XG5cbiAgICBTdGF0ZS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIFwie1wiICsgdGhpcy5ydWxlLnRvU3RyaW5nKHRoaXMuZG90KSArIFwifSwgZnJvbTogXCIgKyAodGhpcy5yZWZlcmVuY2UgfHwgMCk7XG4gICAgfTtcblxuICAgIFN0YXRlLnByb3RvdHlwZS5uZXh0U3RhdGUgPSBmdW5jdGlvbihjaGlsZCkge1xuICAgICAgICB2YXIgc3RhdGUgPSBuZXcgU3RhdGUodGhpcy5ydWxlLCB0aGlzLmRvdCArIDEsIHRoaXMucmVmZXJlbmNlLCB0aGlzLndhbnRlZEJ5KTtcbiAgICAgICAgc3RhdGUubGVmdCA9IHRoaXM7XG4gICAgICAgIHN0YXRlLnJpZ2h0ID0gY2hpbGQ7XG4gICAgICAgIGlmIChzdGF0ZS5pc0NvbXBsZXRlKSB7XG4gICAgICAgICAgICBzdGF0ZS5kYXRhID0gc3RhdGUuYnVpbGQoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgfTtcblxuICAgIFN0YXRlLnByb3RvdHlwZS5idWlsZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgY2hpbGRyZW4gPSBbXTtcbiAgICAgICAgdmFyIG5vZGUgPSB0aGlzO1xuICAgICAgICBkbyB7XG4gICAgICAgICAgICBjaGlsZHJlbi5wdXNoKG5vZGUucmlnaHQuZGF0YSk7XG4gICAgICAgICAgICBub2RlID0gbm9kZS5sZWZ0O1xuICAgICAgICB9IHdoaWxlIChub2RlLmxlZnQpO1xuICAgICAgICBjaGlsZHJlbi5yZXZlcnNlKCk7XG4gICAgICAgIHJldHVybiBjaGlsZHJlbjtcbiAgICB9O1xuXG4gICAgU3RhdGUucHJvdG90eXBlLmZpbmlzaCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5ydWxlLnBvc3Rwcm9jZXNzKSB7XG4gICAgICAgICAgICB0aGlzLmRhdGEgPSB0aGlzLnJ1bGUucG9zdHByb2Nlc3ModGhpcy5kYXRhLCB0aGlzLnJlZmVyZW5jZSwgUGFyc2VyLmZhaWwpO1xuICAgICAgICB9XG4gICAgfTtcblxuXG4gICAgZnVuY3Rpb24gQ29sdW1uKGdyYW1tYXIsIGluZGV4KSB7XG4gICAgICAgIHRoaXMuZ3JhbW1hciA9IGdyYW1tYXI7XG4gICAgICAgIHRoaXMuaW5kZXggPSBpbmRleDtcbiAgICAgICAgdGhpcy5zdGF0ZXMgPSBbXTtcbiAgICAgICAgdGhpcy53YW50cyA9IHt9OyAvLyBzdGF0ZXMgaW5kZXhlZCBieSB0aGUgbm9uLXRlcm1pbmFsIHRoZXkgZXhwZWN0XG4gICAgICAgIHRoaXMuc2Nhbm5hYmxlID0gW107IC8vIGxpc3Qgb2Ygc3RhdGVzIHRoYXQgZXhwZWN0IGEgdG9rZW5cbiAgICAgICAgdGhpcy5jb21wbGV0ZWQgPSB7fTsgLy8gc3RhdGVzIHRoYXQgYXJlIG51bGxhYmxlXG4gICAgfVxuXG5cbiAgICBDb2x1bW4ucHJvdG90eXBlLnByb2Nlc3MgPSBmdW5jdGlvbihuZXh0Q29sdW1uKSB7XG4gICAgICAgIHZhciBzdGF0ZXMgPSB0aGlzLnN0YXRlcztcbiAgICAgICAgdmFyIHdhbnRzID0gdGhpcy53YW50cztcbiAgICAgICAgdmFyIGNvbXBsZXRlZCA9IHRoaXMuY29tcGxldGVkO1xuXG4gICAgICAgIGZvciAodmFyIHcgPSAwOyB3IDwgc3RhdGVzLmxlbmd0aDsgdysrKSB7IC8vIG5iLiB3ZSBwdXNoKCkgZHVyaW5nIGl0ZXJhdGlvblxuICAgICAgICAgICAgdmFyIHN0YXRlID0gc3RhdGVzW3ddO1xuXG4gICAgICAgICAgICBpZiAoc3RhdGUuaXNDb21wbGV0ZSkge1xuICAgICAgICAgICAgICAgIHN0YXRlLmZpbmlzaCgpO1xuICAgICAgICAgICAgICAgIGlmIChzdGF0ZS5kYXRhICE9PSBQYXJzZXIuZmFpbCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBjb21wbGV0ZVxuICAgICAgICAgICAgICAgICAgICB2YXIgd2FudGVkQnkgPSBzdGF0ZS53YW50ZWRCeTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IHdhbnRlZEJ5Lmxlbmd0aDsgaS0tOyApIHsgLy8gdGhpcyBsaW5lIGlzIGhvdFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxlZnQgPSB3YW50ZWRCeVtpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcGxldGUobGVmdCwgc3RhdGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gc3BlY2lhbC1jYXNlIG51bGxhYmxlc1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdGUucmVmZXJlbmNlID09PSB0aGlzLmluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBtYWtlIHN1cmUgZnV0dXJlIHByZWRpY3RvcnMgb2YgdGhpcyBydWxlIGdldCBjb21wbGV0ZWQuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZXhwID0gc3RhdGUucnVsZS5uYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgKHRoaXMuY29tcGxldGVkW2V4cF0gPSB0aGlzLmNvbXBsZXRlZFtleHBdIHx8IFtdKS5wdXNoKHN0YXRlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBxdWV1ZSBzY2FubmFibGUgc3RhdGVzXG4gICAgICAgICAgICAgICAgdmFyIGV4cCA9IHN0YXRlLnJ1bGUuc3ltYm9sc1tzdGF0ZS5kb3RdO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZXhwICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNjYW5uYWJsZS5wdXNoKHN0YXRlKTtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gcHJlZGljdFxuICAgICAgICAgICAgICAgIGlmICh3YW50c1tleHBdKSB7XG4gICAgICAgICAgICAgICAgICAgIHdhbnRzW2V4cF0ucHVzaChzdGF0ZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBsZXRlZC5oYXNPd25Qcm9wZXJ0eShleHApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbnVsbHMgPSBjb21wbGV0ZWRbZXhwXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbnVsbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmlnaHQgPSBudWxsc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbXBsZXRlKHN0YXRlLCByaWdodCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB3YW50c1tleHBdID0gW3N0YXRlXTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmVkaWN0KGV4cCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgQ29sdW1uLnByb3RvdHlwZS5wcmVkaWN0ID0gZnVuY3Rpb24oZXhwKSB7XG4gICAgICAgIHZhciBydWxlcyA9IHRoaXMuZ3JhbW1hci5ieU5hbWVbZXhwXSB8fCBbXTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJ1bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgciA9IHJ1bGVzW2ldO1xuICAgICAgICAgICAgdmFyIHdhbnRlZEJ5ID0gdGhpcy53YW50c1tleHBdO1xuICAgICAgICAgICAgdmFyIHMgPSBuZXcgU3RhdGUociwgMCwgdGhpcy5pbmRleCwgd2FudGVkQnkpO1xuICAgICAgICAgICAgdGhpcy5zdGF0ZXMucHVzaChzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIENvbHVtbi5wcm90b3R5cGUuY29tcGxldGUgPSBmdW5jdGlvbihsZWZ0LCByaWdodCkge1xuICAgICAgICB2YXIgY29weSA9IGxlZnQubmV4dFN0YXRlKHJpZ2h0KTtcbiAgICAgICAgdGhpcy5zdGF0ZXMucHVzaChjb3B5KTtcbiAgICB9XG5cblxuICAgIGZ1bmN0aW9uIEdyYW1tYXIocnVsZXMsIHN0YXJ0KSB7XG4gICAgICAgIHRoaXMucnVsZXMgPSBydWxlcztcbiAgICAgICAgdGhpcy5zdGFydCA9IHN0YXJ0IHx8IHRoaXMucnVsZXNbMF0ubmFtZTtcbiAgICAgICAgdmFyIGJ5TmFtZSA9IHRoaXMuYnlOYW1lID0ge307XG4gICAgICAgIHRoaXMucnVsZXMuZm9yRWFjaChmdW5jdGlvbihydWxlKSB7XG4gICAgICAgICAgICBpZiAoIWJ5TmFtZS5oYXNPd25Qcm9wZXJ0eShydWxlLm5hbWUpKSB7XG4gICAgICAgICAgICAgICAgYnlOYW1lW3J1bGUubmFtZV0gPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJ5TmFtZVtydWxlLm5hbWVdLnB1c2gocnVsZSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIFNvIHdlIGNhbiBhbGxvdyBwYXNzaW5nIChydWxlcywgc3RhcnQpIGRpcmVjdGx5IHRvIFBhcnNlciBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHlcbiAgICBHcmFtbWFyLmZyb21Db21waWxlZCA9IGZ1bmN0aW9uKHJ1bGVzLCBzdGFydCkge1xuICAgICAgICB2YXIgbGV4ZXIgPSBydWxlcy5MZXhlcjtcbiAgICAgICAgaWYgKHJ1bGVzLlBhcnNlclN0YXJ0KSB7XG4gICAgICAgICAgc3RhcnQgPSBydWxlcy5QYXJzZXJTdGFydDtcbiAgICAgICAgICBydWxlcyA9IHJ1bGVzLlBhcnNlclJ1bGVzO1xuICAgICAgICB9XG4gICAgICAgIHZhciBydWxlcyA9IHJ1bGVzLm1hcChmdW5jdGlvbiAocikgeyByZXR1cm4gKG5ldyBSdWxlKHIubmFtZSwgci5zeW1ib2xzLCByLnBvc3Rwcm9jZXNzKSk7IH0pO1xuICAgICAgICB2YXIgZyA9IG5ldyBHcmFtbWFyKHJ1bGVzLCBzdGFydCk7XG4gICAgICAgIGcubGV4ZXIgPSBsZXhlcjsgLy8gbmIuIHN0b3JpbmcgbGV4ZXIgb24gR3JhbW1hciBpcyBpZmZ5LCBidXQgdW5hdm9pZGFibGVcbiAgICAgICAgcmV0dXJuIGc7XG4gICAgfVxuXG5cbiAgICBmdW5jdGlvbiBTdHJlYW1MZXhlcigpIHtcbiAgICAgIHRoaXMucmVzZXQoXCJcIik7XG4gICAgfVxuXG4gICAgU3RyZWFtTGV4ZXIucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24oZGF0YSwgc3RhdGUpIHtcbiAgICAgICAgdGhpcy5idWZmZXIgPSBkYXRhO1xuICAgICAgICB0aGlzLmluZGV4ID0gMDtcbiAgICAgICAgdGhpcy5saW5lID0gc3RhdGUgPyBzdGF0ZS5saW5lIDogMTtcbiAgICAgICAgdGhpcy5sYXN0TGluZUJyZWFrID0gc3RhdGUgPyAtc3RhdGUuY29sIDogMDtcbiAgICB9XG5cbiAgICBTdHJlYW1MZXhlci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5pbmRleCA8IHRoaXMuYnVmZmVyLmxlbmd0aCkge1xuICAgICAgICAgICAgdmFyIGNoID0gdGhpcy5idWZmZXJbdGhpcy5pbmRleCsrXTtcbiAgICAgICAgICAgIGlmIChjaCA9PT0gJ1xcbicpIHtcbiAgICAgICAgICAgICAgdGhpcy5saW5lICs9IDE7XG4gICAgICAgICAgICAgIHRoaXMubGFzdExpbmVCcmVhayA9IHRoaXMuaW5kZXg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4ge3ZhbHVlOiBjaH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBTdHJlYW1MZXhlci5wcm90b3R5cGUuc2F2ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbGluZTogdGhpcy5saW5lLFxuICAgICAgICBjb2w6IHRoaXMuaW5kZXggLSB0aGlzLmxhc3RMaW5lQnJlYWssXG4gICAgICB9XG4gICAgfVxuXG4gICAgU3RyZWFtTGV4ZXIucHJvdG90eXBlLmZvcm1hdEVycm9yID0gZnVuY3Rpb24odG9rZW4sIG1lc3NhZ2UpIHtcbiAgICAgICAgLy8gbmIuIHRoaXMgZ2V0cyBjYWxsZWQgYWZ0ZXIgY29uc3VtaW5nIHRoZSBvZmZlbmRpbmcgdG9rZW4sXG4gICAgICAgIC8vIHNvIHRoZSBjdWxwcml0IGlzIGluZGV4LTFcbiAgICAgICAgdmFyIGJ1ZmZlciA9IHRoaXMuYnVmZmVyO1xuICAgICAgICBpZiAodHlwZW9mIGJ1ZmZlciA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHZhciBuZXh0TGluZUJyZWFrID0gYnVmZmVyLmluZGV4T2YoJ1xcbicsIHRoaXMuaW5kZXgpO1xuICAgICAgICAgICAgaWYgKG5leHRMaW5lQnJlYWsgPT09IC0xKSBuZXh0TGluZUJyZWFrID0gYnVmZmVyLmxlbmd0aDtcbiAgICAgICAgICAgIHZhciBsaW5lID0gYnVmZmVyLnN1YnN0cmluZyh0aGlzLmxhc3RMaW5lQnJlYWssIG5leHRMaW5lQnJlYWspXG4gICAgICAgICAgICB2YXIgY29sID0gdGhpcy5pbmRleCAtIHRoaXMubGFzdExpbmVCcmVhaztcbiAgICAgICAgICAgIG1lc3NhZ2UgKz0gXCIgYXQgbGluZSBcIiArIHRoaXMubGluZSArIFwiIGNvbCBcIiArIGNvbCArIFwiOlxcblxcblwiO1xuICAgICAgICAgICAgbWVzc2FnZSArPSBcIiAgXCIgKyBsaW5lICsgXCJcXG5cIlxuICAgICAgICAgICAgbWVzc2FnZSArPSBcIiAgXCIgKyBBcnJheShjb2wpLmpvaW4oXCIgXCIpICsgXCJeXCJcbiAgICAgICAgICAgIHJldHVybiBtZXNzYWdlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG1lc3NhZ2UgKyBcIiBhdCBpbmRleCBcIiArICh0aGlzLmluZGV4IC0gMSk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIGZ1bmN0aW9uIFBhcnNlcihydWxlcywgc3RhcnQsIG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKHJ1bGVzIGluc3RhbmNlb2YgR3JhbW1hcikge1xuICAgICAgICAgICAgdmFyIGdyYW1tYXIgPSBydWxlcztcbiAgICAgICAgICAgIHZhciBvcHRpb25zID0gc3RhcnQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgZ3JhbW1hciA9IEdyYW1tYXIuZnJvbUNvbXBpbGVkKHJ1bGVzLCBzdGFydCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5ncmFtbWFyID0gZ3JhbW1hcjtcblxuICAgICAgICAvLyBSZWFkIG9wdGlvbnNcbiAgICAgICAgdGhpcy5vcHRpb25zID0ge1xuICAgICAgICAgICAga2VlcEhpc3Rvcnk6IGZhbHNlLFxuICAgICAgICAgICAgbGV4ZXI6IGdyYW1tYXIubGV4ZXIgfHwgbmV3IFN0cmVhbUxleGVyLFxuICAgICAgICB9O1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gKG9wdGlvbnMgfHwge30pKSB7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnNba2V5XSA9IG9wdGlvbnNba2V5XTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFNldHVwIGxleGVyXG4gICAgICAgIHRoaXMubGV4ZXIgPSB0aGlzLm9wdGlvbnMubGV4ZXI7XG4gICAgICAgIHRoaXMubGV4ZXJTdGF0ZSA9IHVuZGVmaW5lZDtcblxuICAgICAgICAvLyBTZXR1cCBhIHRhYmxlXG4gICAgICAgIHZhciBjb2x1bW4gPSBuZXcgQ29sdW1uKGdyYW1tYXIsIDApO1xuICAgICAgICB2YXIgdGFibGUgPSB0aGlzLnRhYmxlID0gW2NvbHVtbl07XG5cbiAgICAgICAgLy8gSSBjb3VsZCBiZSBleHBlY3RpbmcgYW55dGhpbmcuXG4gICAgICAgIGNvbHVtbi53YW50c1tncmFtbWFyLnN0YXJ0XSA9IFtdO1xuICAgICAgICBjb2x1bW4ucHJlZGljdChncmFtbWFyLnN0YXJ0KTtcbiAgICAgICAgLy8gVE9ETyB3aGF0IGlmIHN0YXJ0IHJ1bGUgaXMgbnVsbGFibGU/XG4gICAgICAgIGNvbHVtbi5wcm9jZXNzKCk7XG4gICAgICAgIHRoaXMuY3VycmVudCA9IDA7IC8vIHRva2VuIGluZGV4XG4gICAgfVxuXG4gICAgLy8gY3JlYXRlIGEgcmVzZXJ2ZWQgdG9rZW4gZm9yIGluZGljYXRpbmcgYSBwYXJzZSBmYWlsXG4gICAgUGFyc2VyLmZhaWwgPSB7fTtcblxuICAgIFBhcnNlci5wcm90b3R5cGUuZmVlZCA9IGZ1bmN0aW9uKGNodW5rKSB7XG4gICAgICAgIHZhciBsZXhlciA9IHRoaXMubGV4ZXI7XG4gICAgICAgIGxleGVyLnJlc2V0KGNodW5rLCB0aGlzLmxleGVyU3RhdGUpO1xuXG4gICAgICAgIHZhciB0b2tlbjtcbiAgICAgICAgd2hpbGUgKHRva2VuID0gbGV4ZXIubmV4dCgpKSB7XG4gICAgICAgICAgICAvLyBXZSBhZGQgbmV3IHN0YXRlcyB0byB0YWJsZVtjdXJyZW50KzFdXG4gICAgICAgICAgICB2YXIgY29sdW1uID0gdGhpcy50YWJsZVt0aGlzLmN1cnJlbnRdO1xuXG4gICAgICAgICAgICAvLyBHQyB1bnVzZWQgc3RhdGVzXG4gICAgICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5rZWVwSGlzdG9yeSkge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnRhYmxlW3RoaXMuY3VycmVudCAtIDFdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgbiA9IHRoaXMuY3VycmVudCArIDE7XG4gICAgICAgICAgICB2YXIgbmV4dENvbHVtbiA9IG5ldyBDb2x1bW4odGhpcy5ncmFtbWFyLCBuKTtcbiAgICAgICAgICAgIHRoaXMudGFibGUucHVzaChuZXh0Q29sdW1uKTtcblxuICAgICAgICAgICAgLy8gQWR2YW5jZSBhbGwgdG9rZW5zIHRoYXQgZXhwZWN0IHRoZSBzeW1ib2xcbiAgICAgICAgICAgIHZhciBsaXRlcmFsID0gdG9rZW4udGV4dCAhPT0gdW5kZWZpbmVkID8gdG9rZW4udGV4dCA6IHRva2VuLnZhbHVlO1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gbGV4ZXIuY29uc3RydWN0b3IgPT09IFN0cmVhbUxleGVyID8gdG9rZW4udmFsdWUgOiB0b2tlbjtcbiAgICAgICAgICAgIHZhciBzY2FubmFibGUgPSBjb2x1bW4uc2Nhbm5hYmxlO1xuICAgICAgICAgICAgZm9yICh2YXIgdyA9IHNjYW5uYWJsZS5sZW5ndGg7IHctLTsgKSB7XG4gICAgICAgICAgICAgICAgdmFyIHN0YXRlID0gc2Nhbm5hYmxlW3ddO1xuICAgICAgICAgICAgICAgIHZhciBleHBlY3QgPSBzdGF0ZS5ydWxlLnN5bWJvbHNbc3RhdGUuZG90XTtcbiAgICAgICAgICAgICAgICAvLyBUcnkgdG8gY29uc3VtZSB0aGUgdG9rZW5cbiAgICAgICAgICAgICAgICAvLyBlaXRoZXIgcmVnZXggb3IgbGl0ZXJhbFxuICAgICAgICAgICAgICAgIGlmIChleHBlY3QudGVzdCA/IGV4cGVjdC50ZXN0KHZhbHVlKSA6XG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdC50eXBlID8gZXhwZWN0LnR5cGUgPT09IHRva2VuLnR5cGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBleHBlY3QubGl0ZXJhbCA9PT0gbGl0ZXJhbCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBBZGQgaXRcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5leHQgPSBzdGF0ZS5uZXh0U3RhdGUoe2RhdGE6IHZhbHVlLCB0b2tlbjogdG9rZW4sIGlzVG9rZW46IHRydWUsIHJlZmVyZW5jZTogbiAtIDF9KTtcbiAgICAgICAgICAgICAgICAgICAgbmV4dENvbHVtbi5zdGF0ZXMucHVzaChuZXh0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIE5leHQsIGZvciBlYWNoIG9mIHRoZSBydWxlcywgd2UgZWl0aGVyXG4gICAgICAgICAgICAvLyAoYSkgY29tcGxldGUgaXQsIGFuZCB0cnkgdG8gc2VlIGlmIHRoZSByZWZlcmVuY2Ugcm93IGV4cGVjdGVkIHRoYXRcbiAgICAgICAgICAgIC8vICAgICBydWxlXG4gICAgICAgICAgICAvLyAoYikgcHJlZGljdCB0aGUgbmV4dCBub250ZXJtaW5hbCBpdCBleHBlY3RzIGJ5IGFkZGluZyB0aGF0XG4gICAgICAgICAgICAvLyAgICAgbm9udGVybWluYWwncyBzdGFydCBzdGF0ZVxuICAgICAgICAgICAgLy8gVG8gcHJldmVudCBkdXBsaWNhdGlvbiwgd2UgYWxzbyBrZWVwIHRyYWNrIG9mIHJ1bGVzIHdlIGhhdmUgYWxyZWFkeVxuICAgICAgICAgICAgLy8gYWRkZWRcblxuICAgICAgICAgICAgbmV4dENvbHVtbi5wcm9jZXNzKCk7XG5cbiAgICAgICAgICAgIC8vIElmIG5lZWRlZCwgdGhyb3cgYW4gZXJyb3I6XG4gICAgICAgICAgICBpZiAobmV4dENvbHVtbi5zdGF0ZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgLy8gTm8gc3RhdGVzIGF0IGFsbCEgVGhpcyBpcyBub3QgZ29vZC5cbiAgICAgICAgICAgICAgICB2YXIgbWVzc2FnZSA9IHRoaXMubGV4ZXIuZm9ybWF0RXJyb3IodG9rZW4sIFwiaW52YWxpZCBzeW50YXhcIikgKyBcIlxcblwiO1xuICAgICAgICAgICAgICAgIG1lc3NhZ2UgKz0gXCJVbmV4cGVjdGVkIFwiICsgKHRva2VuLnR5cGUgPyB0b2tlbi50eXBlICsgXCIgdG9rZW46IFwiIDogXCJcIik7XG4gICAgICAgICAgICAgICAgbWVzc2FnZSArPSBKU09OLnN0cmluZ2lmeSh0b2tlbi52YWx1ZSAhPT0gdW5kZWZpbmVkID8gdG9rZW4udmFsdWUgOiB0b2tlbikgKyBcIlxcblwiO1xuICAgICAgICAgICAgICAgIHZhciBlcnIgPSBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgZXJyLm9mZnNldCA9IHRoaXMuY3VycmVudDtcbiAgICAgICAgICAgICAgICBlcnIudG9rZW4gPSB0b2tlbjtcbiAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIG1heWJlIHNhdmUgbGV4ZXIgc3RhdGVcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMua2VlcEhpc3RvcnkpIHtcbiAgICAgICAgICAgICAgY29sdW1uLmxleGVyU3RhdGUgPSBsZXhlci5zYXZlKClcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5jdXJyZW50Kys7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbHVtbikge1xuICAgICAgICAgIHRoaXMubGV4ZXJTdGF0ZSA9IGxleGVyLnNhdmUoKVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gSW5jcmVtZW50YWxseSBrZWVwIHRyYWNrIG9mIHJlc3VsdHNcbiAgICAgICAgdGhpcy5yZXN1bHRzID0gdGhpcy5maW5pc2goKTtcblxuICAgICAgICAvLyBBbGxvdyBjaGFpbmluZywgZm9yIHdoYXRldmVyIGl0J3Mgd29ydGhcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIFBhcnNlci5wcm90b3R5cGUuc2F2ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgY29sdW1uID0gdGhpcy50YWJsZVt0aGlzLmN1cnJlbnRdO1xuICAgICAgICBjb2x1bW4ubGV4ZXJTdGF0ZSA9IHRoaXMubGV4ZXJTdGF0ZTtcbiAgICAgICAgcmV0dXJuIGNvbHVtbjtcbiAgICB9O1xuXG4gICAgUGFyc2VyLnByb3RvdHlwZS5yZXN0b3JlID0gZnVuY3Rpb24oY29sdW1uKSB7XG4gICAgICAgIHZhciBpbmRleCA9IGNvbHVtbi5pbmRleDtcbiAgICAgICAgdGhpcy5jdXJyZW50ID0gaW5kZXg7XG4gICAgICAgIHRoaXMudGFibGVbaW5kZXhdID0gY29sdW1uO1xuICAgICAgICB0aGlzLnRhYmxlLnNwbGljZShpbmRleCArIDEpO1xuICAgICAgICB0aGlzLmxleGVyU3RhdGUgPSBjb2x1bW4ubGV4ZXJTdGF0ZTtcblxuICAgICAgICAvLyBJbmNyZW1lbnRhbGx5IGtlZXAgdHJhY2sgb2YgcmVzdWx0c1xuICAgICAgICB0aGlzLnJlc3VsdHMgPSB0aGlzLmZpbmlzaCgpO1xuICAgIH07XG5cbiAgICAvLyBuYi4gZGVwcmVjYXRlZDogdXNlIHNhdmUvcmVzdG9yZSBpbnN0ZWFkIVxuICAgIFBhcnNlci5wcm90b3R5cGUucmV3aW5kID0gZnVuY3Rpb24oaW5kZXgpIHtcbiAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMua2VlcEhpc3RvcnkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignc2V0IG9wdGlvbiBga2VlcEhpc3RvcnlgIHRvIGVuYWJsZSByZXdpbmRpbmcnKVxuICAgICAgICB9XG4gICAgICAgIC8vIG5iLiByZWNhbGwgY29sdW1uICh0YWJsZSkgaW5kaWNpZXMgZmFsbCBiZXR3ZWVuIHRva2VuIGluZGljaWVzLlxuICAgICAgICAvLyAgICAgICAgY29sIDAgICAtLSAgIHRva2VuIDAgICAtLSAgIGNvbCAxXG4gICAgICAgIHRoaXMucmVzdG9yZSh0aGlzLnRhYmxlW2luZGV4XSk7XG4gICAgfTtcblxuICAgIFBhcnNlci5wcm90b3R5cGUuZmluaXNoID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIFJldHVybiB0aGUgcG9zc2libGUgcGFyc2luZ3NcbiAgICAgICAgdmFyIGNvbnNpZGVyYXRpb25zID0gW107XG4gICAgICAgIHZhciBzdGFydCA9IHRoaXMuZ3JhbW1hci5zdGFydDtcbiAgICAgICAgdmFyIGNvbHVtbiA9IHRoaXMudGFibGVbdGhpcy50YWJsZS5sZW5ndGggLSAxXVxuICAgICAgICBjb2x1bW4uc3RhdGVzLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgIGlmICh0LnJ1bGUubmFtZSA9PT0gc3RhcnRcbiAgICAgICAgICAgICAgICAgICAgJiYgdC5kb3QgPT09IHQucnVsZS5zeW1ib2xzLmxlbmd0aFxuICAgICAgICAgICAgICAgICAgICAmJiB0LnJlZmVyZW5jZSA9PT0gMFxuICAgICAgICAgICAgICAgICAgICAmJiB0LmRhdGEgIT09IFBhcnNlci5mYWlsKSB7XG4gICAgICAgICAgICAgICAgY29uc2lkZXJhdGlvbnMucHVzaCh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBjb25zaWRlcmF0aW9ucy5tYXAoZnVuY3Rpb24oYykge3JldHVybiBjLmRhdGE7IH0pO1xuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBQYXJzZXI6IFBhcnNlcixcbiAgICAgICAgR3JhbW1hcjogR3JhbW1hcixcbiAgICAgICAgUnVsZTogUnVsZSxcbiAgICB9O1xuXG59KSk7XG4iLCIvLyBHZW5lcmF0ZWQgYXV0b21hdGljYWxseSBieSBuZWFybGV5LCB2ZXJzaW9uIDIuMTUuMVxyXG4vLyBodHRwOi8vZ2l0aHViLmNvbS9IYXJkbWF0aDEyMy9uZWFybGV5XHJcbmZ1bmN0aW9uIGlkKHgpIHtcclxuICByZXR1cm4geFswXTtcclxufVxyXG5jb25zdCBncmFtbWFyID0ge1xyXG4gIExleGVyOiB1bmRlZmluZWQsXHJcbiAgUGFyc2VyUnVsZXM6IFtcclxuICAgIHsgbmFtZTogJ01haW4nLCBzeW1ib2xzOiBbJ0VETiddLCBwb3N0cHJvY2VzczogZGF0YSA9PiBkYXRhWzBdIH0sXHJcbiAgICB7IG5hbWU6ICdFRE4nLCBzeW1ib2xzOiBbJ0V4cCddLCBwb3N0cHJvY2VzczogZGF0YSA9PiBkYXRhWzBdIH0sXHJcbiAgICB7IG5hbWU6ICdFeHAkc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogWydFbGVtZW50U3BhY2UnXSB9LFxyXG4gICAgeyBuYW1lOiAnRXhwJHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFsnRWxlbWVudE5vU3BhY2UnXSB9LFxyXG4gICAgeyBuYW1lOiAnRXhwJywgc3ltYm9sczogWydFeHAkc3ViZXhwcmVzc2lvbiQxJ10sIHBvc3Rwcm9jZXNzOiBkYXRhID0+IFtdLmNvbmNhdCguLi5kYXRhWzBdKSB9LFxyXG4gICAgeyBuYW1lOiAnX0V4cCcsIHN5bWJvbHM6IFsnXycsICdFeHAnXSwgcG9zdHByb2Nlc3M6IGRhdGEgPT4gZGF0YVsxXSB9LFxyXG4gICAgeyBuYW1lOiAnRWxlbWVudFNwYWNlJHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFsnTnVtYmVyJ10gfSxcclxuICAgIHsgbmFtZTogJ0VsZW1lbnRTcGFjZSRzdWJleHByZXNzaW9uJDEnLCBzeW1ib2xzOiBbJ0NoYXJhY3RlciddIH0sXHJcbiAgICB7IG5hbWU6ICdFbGVtZW50U3BhY2Ukc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogWydSZXNlcnZlZCddIH0sXHJcbiAgICB7IG5hbWU6ICdFbGVtZW50U3BhY2Ukc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogWydTeW1ib2wnXSB9LFxyXG4gICAgeyBuYW1lOiAnRWxlbWVudFNwYWNlJHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFsnS2V5d29yZCddIH0sXHJcbiAgICB7IG5hbWU6ICdFbGVtZW50U3BhY2Ukc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogWydUYWcnXSB9LFxyXG4gICAgeyBuYW1lOiAnRWxlbWVudFNwYWNlJHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFsnRGlzY2FyZCddIH0sXHJcbiAgICB7IG5hbWU6ICdFbGVtZW50U3BhY2UkZWJuZiQxJHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFsnX0V4cCddIH0sXHJcbiAgICB7IG5hbWU6ICdFbGVtZW50U3BhY2UkZWJuZiQxJHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFsnRWxlbWVudE5vU3BhY2UnXSB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnRWxlbWVudFNwYWNlJGVibmYkMScsXHJcbiAgICAgIHN5bWJvbHM6IFsnRWxlbWVudFNwYWNlJGVibmYkMSRzdWJleHByZXNzaW9uJDEnXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGlkXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnRWxlbWVudFNwYWNlJGVibmYkMScsXHJcbiAgICAgIHN5bWJvbHM6IFtdLFxyXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24oX2QpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ0VsZW1lbnRTcGFjZScsXHJcbiAgICAgIHN5bWJvbHM6IFsnRWxlbWVudFNwYWNlJHN1YmV4cHJlc3Npb24kMScsICdFbGVtZW50U3BhY2UkZWJuZiQxJ10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBkYXRhID0+IFtdLmNvbmNhdCguLi5bZGF0YVswXVswXV0uY29uY2F0KGRhdGFbMV0gPyBbXS5jb25jYXQoLi4uZGF0YVsxXSkgOiBbXSkpXHJcbiAgICB9LFxyXG4gICAgeyBuYW1lOiAnRWxlbWVudE5vU3BhY2Ukc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogWydWZWN0b3InXSB9LFxyXG4gICAgeyBuYW1lOiAnRWxlbWVudE5vU3BhY2Ukc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogWydMaXN0J10gfSxcclxuICAgIHsgbmFtZTogJ0VsZW1lbnROb1NwYWNlJHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFsnU3RyaW5nJ10gfSxcclxuICAgIHsgbmFtZTogJ0VsZW1lbnROb1NwYWNlJHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFsnTWFwJ10gfSxcclxuICAgIHsgbmFtZTogJ0VsZW1lbnROb1NwYWNlJHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFsnU2V0J10gfSxcclxuICAgIHsgbmFtZTogJ0VsZW1lbnROb1NwYWNlJGVibmYkMSRzdWJleHByZXNzaW9uJDEkZWJuZiQxJywgc3ltYm9sczogWydfJ10sIHBvc3Rwcm9jZXNzOiBpZCB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnRWxlbWVudE5vU3BhY2UkZWJuZiQxJHN1YmV4cHJlc3Npb24kMSRlYm5mJDEnLFxyXG4gICAgICBzeW1ib2xzOiBbXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uKF9kKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdFbGVtZW50Tm9TcGFjZSRlYm5mJDEkc3ViZXhwcmVzc2lvbiQxJyxcclxuICAgICAgc3ltYm9sczogWydFbGVtZW50Tm9TcGFjZSRlYm5mJDEkc3ViZXhwcmVzc2lvbiQxJGVibmYkMScsICdFeHAnXVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ0VsZW1lbnROb1NwYWNlJGVibmYkMScsXHJcbiAgICAgIHN5bWJvbHM6IFsnRWxlbWVudE5vU3BhY2UkZWJuZiQxJHN1YmV4cHJlc3Npb24kMSddLFxyXG4gICAgICBwb3N0cHJvY2VzczogaWRcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdFbGVtZW50Tm9TcGFjZSRlYm5mJDEnLFxyXG4gICAgICBzeW1ib2xzOiBbXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uKF9kKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdFbGVtZW50Tm9TcGFjZScsXHJcbiAgICAgIHN5bWJvbHM6IFsnRWxlbWVudE5vU3BhY2Ukc3ViZXhwcmVzc2lvbiQxJywgJ0VsZW1lbnROb1NwYWNlJGVibmYkMSddLFxyXG4gICAgICBwb3N0cHJvY2VzczogZGF0YSA9PiBbZGF0YVswXVswXV0uY29uY2F0KGRhdGFbMV0gPyBkYXRhWzFdWzFdIDogW10pXHJcbiAgICB9LFxyXG4gICAgeyBuYW1lOiAnRWxlbWVudCRzdWJleHByZXNzaW9uJDEnLCBzeW1ib2xzOiBbJ051bWJlciddIH0sXHJcbiAgICB7IG5hbWU6ICdFbGVtZW50JHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFsnQ2hhcmFjdGVyJ10gfSxcclxuICAgIHsgbmFtZTogJ0VsZW1lbnQkc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogWydSZXNlcnZlZCddIH0sXHJcbiAgICB7IG5hbWU6ICdFbGVtZW50JHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFsnU3ltYm9sJ10gfSxcclxuICAgIHsgbmFtZTogJ0VsZW1lbnQkc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogWydLZXl3b3JkJ10gfSxcclxuICAgIHsgbmFtZTogJ0VsZW1lbnQkc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogWydWZWN0b3InXSB9LFxyXG4gICAgeyBuYW1lOiAnRWxlbWVudCRzdWJleHByZXNzaW9uJDEnLCBzeW1ib2xzOiBbJ0xpc3QnXSB9LFxyXG4gICAgeyBuYW1lOiAnRWxlbWVudCRzdWJleHByZXNzaW9uJDEnLCBzeW1ib2xzOiBbJ1N0cmluZyddIH0sXHJcbiAgICB7IG5hbWU6ICdFbGVtZW50JHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFsnTWFwJ10gfSxcclxuICAgIHsgbmFtZTogJ0VsZW1lbnQkc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogWydTZXQnXSB9LFxyXG4gICAgeyBuYW1lOiAnRWxlbWVudCcsIHN5bWJvbHM6IFsnRWxlbWVudCRzdWJleHByZXNzaW9uJDEnXSwgcG9zdHByb2Nlc3M6IGRhdGEgPT4gZGF0YVswXVswXSB9LFxyXG4gICAgeyBuYW1lOiAnVmVjdG9yJGVibmYkMScsIHN5bWJvbHM6IFsnXyddLCBwb3N0cHJvY2VzczogaWQgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ1ZlY3RvciRlYm5mJDEnLFxyXG4gICAgICBzeW1ib2xzOiBbXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uKF9kKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7IG5hbWU6ICdWZWN0b3IkZWJuZiQyJHN1YmV4cHJlc3Npb24kMSRlYm5mJDEnLCBzeW1ib2xzOiBbJ18nXSwgcG9zdHByb2Nlc3M6IGlkIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdWZWN0b3IkZWJuZiQyJHN1YmV4cHJlc3Npb24kMSRlYm5mJDEnLFxyXG4gICAgICBzeW1ib2xzOiBbXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uKF9kKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdWZWN0b3IkZWJuZiQyJHN1YmV4cHJlc3Npb24kMScsXHJcbiAgICAgIHN5bWJvbHM6IFsnRXhwJywgJ1ZlY3RvciRlYm5mJDIkc3ViZXhwcmVzc2lvbiQxJGVibmYkMSddXHJcbiAgICB9LFxyXG4gICAgeyBuYW1lOiAnVmVjdG9yJGVibmYkMicsIHN5bWJvbHM6IFsnVmVjdG9yJGVibmYkMiRzdWJleHByZXNzaW9uJDEnXSwgcG9zdHByb2Nlc3M6IGlkIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdWZWN0b3IkZWJuZiQyJyxcclxuICAgICAgc3ltYm9sczogW10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBmdW5jdGlvbihfZCkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnVmVjdG9yJyxcclxuICAgICAgc3ltYm9sczogW3sgbGl0ZXJhbDogJ1snIH0sICdWZWN0b3IkZWJuZiQxJywgJ1ZlY3RvciRlYm5mJDInLCB7IGxpdGVyYWw6ICddJyB9XSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGRhdGEgPT4gKHsgdHlwZTogJ3ZlY3RvcicsIGRhdGE6IGRhdGFbMl0gPyBkYXRhWzJdWzBdIDogW10gfSlcclxuICAgIH0sXHJcbiAgICB7IG5hbWU6ICdMaXN0JGVibmYkMScsIHN5bWJvbHM6IFsnXyddLCBwb3N0cHJvY2VzczogaWQgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ0xpc3QkZWJuZiQxJyxcclxuICAgICAgc3ltYm9sczogW10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBmdW5jdGlvbihfZCkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgeyBuYW1lOiAnTGlzdCRlYm5mJDIkc3ViZXhwcmVzc2lvbiQxJGVibmYkMScsIHN5bWJvbHM6IFsnXyddLCBwb3N0cHJvY2VzczogaWQgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ0xpc3QkZWJuZiQyJHN1YmV4cHJlc3Npb24kMSRlYm5mJDEnLFxyXG4gICAgICBzeW1ib2xzOiBbXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uKF9kKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7IG5hbWU6ICdMaXN0JGVibmYkMiRzdWJleHByZXNzaW9uJDEnLCBzeW1ib2xzOiBbJ0V4cCcsICdMaXN0JGVibmYkMiRzdWJleHByZXNzaW9uJDEkZWJuZiQxJ10gfSxcclxuICAgIHsgbmFtZTogJ0xpc3QkZWJuZiQyJywgc3ltYm9sczogWydMaXN0JGVibmYkMiRzdWJleHByZXNzaW9uJDEnXSwgcG9zdHByb2Nlc3M6IGlkIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdMaXN0JGVibmYkMicsXHJcbiAgICAgIHN5bWJvbHM6IFtdLFxyXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24oX2QpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ0xpc3QnLFxyXG4gICAgICBzeW1ib2xzOiBbeyBsaXRlcmFsOiAnKCcgfSwgJ0xpc3QkZWJuZiQxJywgJ0xpc3QkZWJuZiQyJywgeyBsaXRlcmFsOiAnKScgfV0sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBkYXRhID0+ICh7IHR5cGU6ICdsaXN0JywgZGF0YTogZGF0YVsyXSA/IGRhdGFbMl1bMF0gOiBbXSB9KVxyXG4gICAgfSxcclxuICAgIHsgbmFtZTogJ01hcCRlYm5mJDEnLCBzeW1ib2xzOiBbJ18nXSwgcG9zdHByb2Nlc3M6IGlkIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdNYXAkZWJuZiQxJyxcclxuICAgICAgc3ltYm9sczogW10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBmdW5jdGlvbihfZCkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgeyBuYW1lOiAnTWFwJGVibmYkMiRzdWJleHByZXNzaW9uJDEkZWJuZiQxJywgc3ltYm9sczogWydfJ10sIHBvc3Rwcm9jZXNzOiBpZCB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnTWFwJGVibmYkMiRzdWJleHByZXNzaW9uJDEkZWJuZiQxJyxcclxuICAgICAgc3ltYm9sczogW10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBmdW5jdGlvbihfZCkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnTWFwJGVibmYkMiRzdWJleHByZXNzaW9uJDEnLFxyXG4gICAgICBzeW1ib2xzOiBbJ01hcEVsZW0nLCAnTWFwJGVibmYkMiRzdWJleHByZXNzaW9uJDEkZWJuZiQxJ11cclxuICAgIH0sXHJcbiAgICB7IG5hbWU6ICdNYXAkZWJuZiQyJywgc3ltYm9sczogWydNYXAkZWJuZiQyJHN1YmV4cHJlc3Npb24kMSddLCBwb3N0cHJvY2VzczogaWQgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ01hcCRlYm5mJDInLFxyXG4gICAgICBzeW1ib2xzOiBbXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uKF9kKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdNYXAnLFxyXG4gICAgICBzeW1ib2xzOiBbeyBsaXRlcmFsOiAneycgfSwgJ01hcCRlYm5mJDEnLCAnTWFwJGVibmYkMicsIHsgbGl0ZXJhbDogJ30nIH1dLFxyXG4gICAgICBwb3N0cHJvY2VzczogZGF0YSA9PiAoeyB0eXBlOiAnbWFwJywgZGF0YTogZGF0YVsyXSA/IGRhdGFbMl1bMF0gOiBbXSB9KVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ1NldCRzdHJpbmckMScsXHJcbiAgICAgIHN5bWJvbHM6IFt7IGxpdGVyYWw6ICcjJyB9LCB7IGxpdGVyYWw6ICd7JyB9XSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uIGpvaW5lcihkKSB7XHJcbiAgICAgICAgcmV0dXJuIGQuam9pbignJyk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7IG5hbWU6ICdTZXQkZWJuZiQxJywgc3ltYm9sczogWydfJ10sIHBvc3Rwcm9jZXNzOiBpZCB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnU2V0JGVibmYkMScsXHJcbiAgICAgIHN5bWJvbHM6IFtdLFxyXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24oX2QpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHsgbmFtZTogJ1NldCRlYm5mJDIkc3ViZXhwcmVzc2lvbiQxJGVibmYkMScsIHN5bWJvbHM6IFsnXyddLCBwb3N0cHJvY2VzczogaWQgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ1NldCRlYm5mJDIkc3ViZXhwcmVzc2lvbiQxJGVibmYkMScsXHJcbiAgICAgIHN5bWJvbHM6IFtdLFxyXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24oX2QpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHsgbmFtZTogJ1NldCRlYm5mJDIkc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogWydFeHAnLCAnU2V0JGVibmYkMiRzdWJleHByZXNzaW9uJDEkZWJuZiQxJ10gfSxcclxuICAgIHsgbmFtZTogJ1NldCRlYm5mJDInLCBzeW1ib2xzOiBbJ1NldCRlYm5mJDIkc3ViZXhwcmVzc2lvbiQxJ10sIHBvc3Rwcm9jZXNzOiBpZCB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnU2V0JGVibmYkMicsXHJcbiAgICAgIHN5bWJvbHM6IFtdLFxyXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24oX2QpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ1NldCcsXHJcbiAgICAgIHN5bWJvbHM6IFsnU2V0JHN0cmluZyQxJywgJ1NldCRlYm5mJDEnLCAnU2V0JGVibmYkMicsIHsgbGl0ZXJhbDogJ30nIH1dLFxyXG4gICAgICBwb3N0cHJvY2VzczogZGF0YSA9PiAoeyB0eXBlOiAnc2V0JywgZGF0YTogZGF0YVsyXSA/IGRhdGFbMl1bMF0gOiBbXSB9KVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ1RhZycsXHJcbiAgICAgIHN5bWJvbHM6IFt7IGxpdGVyYWw6ICcjJyB9LCAnU3ltYm9sJywgJ18nLCAnRWxlbWVudCddLFxyXG4gICAgICBwb3N0cHJvY2VzczogKGRhdGEsIF9sLCByZWplY3QpID0+IHtcclxuICAgICAgICBpZiAoZGF0YVsxXS5kYXRhID09PSAnXycpIHJldHVybiByZWplY3Q7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogJ3RhZycsIHRhZzogZGF0YVsxXS5kYXRhLCBkYXRhOiBkYXRhWzNdWzBdIH07XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdEaXNjYXJkJHN0cmluZyQxJyxcclxuICAgICAgc3ltYm9sczogW3sgbGl0ZXJhbDogJyMnIH0sIHsgbGl0ZXJhbDogJ18nIH1dLFxyXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24gam9pbmVyKGQpIHtcclxuICAgICAgICByZXR1cm4gZC5qb2luKCcnKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHsgbmFtZTogJ0Rpc2NhcmQkZWJuZiQxJywgc3ltYm9sczogWydfJ10sIHBvc3Rwcm9jZXNzOiBpZCB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnRGlzY2FyZCRlYm5mJDEnLFxyXG4gICAgICBzeW1ib2xzOiBbXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uKF9kKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdEaXNjYXJkJyxcclxuICAgICAgc3ltYm9sczogWydEaXNjYXJkJHN0cmluZyQxJywgJ0Rpc2NhcmQkZWJuZiQxJywgJ0VsZW1lbnQnXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IF9kYXRhID0+ICh7IHR5cGU6ICdkaXNjYXJkJyB9KVxyXG4gICAgfSxcclxuICAgIHsgbmFtZTogJ1N0cmluZyRlYm5mJDEnLCBzeW1ib2xzOiBbXSB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnU3RyaW5nJGVibmYkMScsXHJcbiAgICAgIHN5bWJvbHM6IFsnU3RyaW5nJGVibmYkMScsICdzdHJpbmdfY2hhciddLFxyXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24gYXJycHVzaChkKSB7XHJcbiAgICAgICAgcmV0dXJuIGRbMF0uY29uY2F0KFtkWzFdXSk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdTdHJpbmcnLFxyXG4gICAgICBzeW1ib2xzOiBbeyBsaXRlcmFsOiAnXCInIH0sICdTdHJpbmckZWJuZiQxJywgeyBsaXRlcmFsOiAnXCInIH1dLFxyXG4gICAgICBwb3N0cHJvY2VzczogZGF0YSA9PiAoeyB0eXBlOiAnc3RyaW5nJywgZGF0YTogZGF0YVsxXS5qb2luKCcnKSB9KVxyXG4gICAgfSxcclxuICAgIHsgbmFtZTogJ3N0cmluZ19jaGFyJywgc3ltYm9sczogWy9bXlxcXFxcIl0vXSB9LFxyXG4gICAgeyBuYW1lOiAnc3RyaW5nX2NoYXInLCBzeW1ib2xzOiBbJ2JhY2tzbGFzaCddIH0sXHJcbiAgICB7IG5hbWU6ICdzdHJpbmdfY2hhcicsIHN5bWJvbHM6IFsnYmFja3NsYXNoX3VuaWNvZGUnXSwgcG9zdHByb2Nlc3M6IGlkIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdiYWNrc2xhc2gnLFxyXG4gICAgICBzeW1ib2xzOiBbeyBsaXRlcmFsOiAnXFxcXCcgfSwgL1tcInRyblxcXFxdL10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBkYXRhID0+IGRhdGEuam9pbignJylcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdiYWNrc2xhc2hfdW5pY29kZScsXHJcbiAgICAgIHN5bWJvbHM6IFt7IGxpdGVyYWw6ICdcXFxcJyB9LCAndW5pY29kZSddLFxyXG4gICAgICBwb3N0cHJvY2VzczogZGF0YSA9PiBkYXRhWzFdXHJcbiAgICB9LFxyXG4gICAgeyBuYW1lOiAnUmVzZXJ2ZWQkc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogWydib29sZWFuJ10gfSxcclxuICAgIHsgbmFtZTogJ1Jlc2VydmVkJHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFsnbmlsJ10gfSxcclxuICAgIHsgbmFtZTogJ1Jlc2VydmVkJywgc3ltYm9sczogWydSZXNlcnZlZCRzdWJleHByZXNzaW9uJDEnXSwgcG9zdHByb2Nlc3M6IGRhdGEgPT4gZGF0YVswXVswXSB9LFxyXG4gICAgeyBuYW1lOiAnYm9vbGVhbiRzdWJleHByZXNzaW9uJDEnLCBzeW1ib2xzOiBbJ3RydWUnXSB9LFxyXG4gICAgeyBuYW1lOiAnYm9vbGVhbiRzdWJleHByZXNzaW9uJDEnLCBzeW1ib2xzOiBbJ2ZhbHNlJ10gfSxcclxuICAgIHsgbmFtZTogJ2Jvb2xlYW4nLCBzeW1ib2xzOiBbJ2Jvb2xlYW4kc3ViZXhwcmVzc2lvbiQxJ10sIHBvc3Rwcm9jZXNzOiBkYXRhID0+IGRhdGFbMF1bMF0gfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ3RydWUkc3RyaW5nJDEnLFxyXG4gICAgICBzeW1ib2xzOiBbeyBsaXRlcmFsOiAndCcgfSwgeyBsaXRlcmFsOiAncicgfSwgeyBsaXRlcmFsOiAndScgfSwgeyBsaXRlcmFsOiAnZScgfV0sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBmdW5jdGlvbiBqb2luZXIoZCkge1xyXG4gICAgICAgIHJldHVybiBkLmpvaW4oJycpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgeyBuYW1lOiAndHJ1ZScsIHN5bWJvbHM6IFsndHJ1ZSRzdHJpbmckMSddLCBwb3N0cHJvY2VzczogKCkgPT4gKHsgdHlwZTogJ2Jvb2wnLCBkYXRhOiB0cnVlIH0pIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdmYWxzZSRzdHJpbmckMScsXHJcbiAgICAgIHN5bWJvbHM6IFtcclxuICAgICAgICB7IGxpdGVyYWw6ICdmJyB9LFxyXG4gICAgICAgIHsgbGl0ZXJhbDogJ2EnIH0sXHJcbiAgICAgICAgeyBsaXRlcmFsOiAnbCcgfSxcclxuICAgICAgICB7IGxpdGVyYWw6ICdzJyB9LFxyXG4gICAgICAgIHsgbGl0ZXJhbDogJ2UnIH1cclxuICAgICAgXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uIGpvaW5lcihkKSB7XHJcbiAgICAgICAgcmV0dXJuIGQuam9pbignJyk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdmYWxzZScsXHJcbiAgICAgIHN5bWJvbHM6IFsnZmFsc2Ukc3RyaW5nJDEnXSxcclxuICAgICAgcG9zdHByb2Nlc3M6ICgpID0+ICh7IHR5cGU6ICdib29sJywgZGF0YTogZmFsc2UgfSlcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICduaWwkc3RyaW5nJDEnLFxyXG4gICAgICBzeW1ib2xzOiBbeyBsaXRlcmFsOiAnbicgfSwgeyBsaXRlcmFsOiAnaScgfSwgeyBsaXRlcmFsOiAnbCcgfV0sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBmdW5jdGlvbiBqb2luZXIoZCkge1xyXG4gICAgICAgIHJldHVybiBkLmpvaW4oJycpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgeyBuYW1lOiAnbmlsJywgc3ltYm9sczogWyduaWwkc3RyaW5nJDEnXSwgcG9zdHByb2Nlc3M6ICgpID0+ICh7IHR5cGU6ICduaWwnLCBkYXRhOiBudWxsIH0pIH0sXHJcbiAgICB7IG5hbWU6ICdTeW1ib2wkc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogWydzeW1ib2xfYmFzaWMnXSB9LFxyXG4gICAgeyBuYW1lOiAnU3ltYm9sJHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFsnc3ltYm9sX2xpa2VfYV9udW0nXSB9LFxyXG4gICAgeyBuYW1lOiAnU3ltYm9sJHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFt7IGxpdGVyYWw6ICcvJyB9XSB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnU3ltYm9sJyxcclxuICAgICAgc3ltYm9sczogWydTeW1ib2wkc3ViZXhwcmVzc2lvbiQxJ10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiAoZGF0YSwgXywgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgaWYgKGRhdGFbMF1bMF0gPT09ICd0cnVlJyB8fCBkYXRhWzBdWzBdID09PSAnZmFsc2UnIHx8IGRhdGFbMF1bMF0gPT09ICduaWwnKSByZXR1cm4gcmVqZWN0O1xyXG4gICAgICAgIHJldHVybiB7IHR5cGU6ICdzeW1ib2wnLCBkYXRhOiBkYXRhWzBdWzBdIH07XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7IG5hbWU6ICdzeW1ib2xfbm90X3NsYXNoJywgc3ltYm9sczogWydzeW1ib2xfYmFzaWMnXSB9LFxyXG4gICAgeyBuYW1lOiAnc3ltYm9sX25vdF9zbGFzaCcsIHN5bWJvbHM6IFsnc3ltYm9sX2xpa2VfYV9udW0nXSwgcG9zdHByb2Nlc3M6IGRhdGEgPT4gZGF0YVswXSB9LFxyXG4gICAgeyBuYW1lOiAnc3ltYm9sX2Jhc2ljJGVibmYkMScsIHN5bWJvbHM6IFtdIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdzeW1ib2xfYmFzaWMkZWJuZiQxJyxcclxuICAgICAgc3ltYm9sczogWydzeW1ib2xfYmFzaWMkZWJuZiQxJywgJ3N5bWJvbF9taWQnXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uIGFycnB1c2goZCkge1xyXG4gICAgICAgIHJldHVybiBkWzBdLmNvbmNhdChbZFsxXV0pO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnc3ltYm9sX2Jhc2ljJGVibmYkMiRzdWJleHByZXNzaW9uJDEnLFxyXG4gICAgICBzeW1ib2xzOiBbeyBsaXRlcmFsOiAnLycgfSwgJ3N5bWJvbF9ub3Rfc2xhc2gnXVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ3N5bWJvbF9iYXNpYyRlYm5mJDInLFxyXG4gICAgICBzeW1ib2xzOiBbJ3N5bWJvbF9iYXNpYyRlYm5mJDIkc3ViZXhwcmVzc2lvbiQxJ10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBpZFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ3N5bWJvbF9iYXNpYyRlYm5mJDInLFxyXG4gICAgICBzeW1ib2xzOiBbXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uKF9kKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdzeW1ib2xfYmFzaWMnLFxyXG4gICAgICBzeW1ib2xzOiBbJ3N5bWJvbF9zdGFydCcsICdzeW1ib2xfYmFzaWMkZWJuZiQxJywgJ3N5bWJvbF9iYXNpYyRlYm5mJDInXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGRhdGEgPT4gZGF0YVswXSArIGRhdGFbMV0uam9pbignJykgKyAoZGF0YVsyXSA/IGRhdGFbMl0uam9pbignJykgOiAnJylcclxuICAgIH0sXHJcbiAgICB7IG5hbWU6ICdzeW1ib2xfc3RhcnQnLCBzeW1ib2xzOiBbJ2xldHRlciddIH0sXHJcbiAgICB7IG5hbWU6ICdzeW1ib2xfc3RhcnQnLCBzeW1ib2xzOiBbL1sqfl8hPyQlJj08Pl0vXSwgcG9zdHByb2Nlc3M6IGRhdGEgPT4gZGF0YVswXSB9LFxyXG4gICAgeyBuYW1lOiAnc3ltYm9sX21pZCcsIHN5bWJvbHM6IFsnbGV0dGVyJ10gfSxcclxuICAgIHsgbmFtZTogJ3N5bWJvbF9taWQnLCBzeW1ib2xzOiBbJ2RpZ2l0J10gfSxcclxuICAgIHsgbmFtZTogJ3N5bWJvbF9taWQnLCBzeW1ib2xzOiBbL1suKlxcIVxcLStfPyQlJj08PjojXS9dLCBwb3N0cHJvY2VzczogZGF0YSA9PiBkYXRhWzBdIH0sXHJcbiAgICB7IG5hbWU6ICdzeW1ib2xfbGlrZV9hX251bSRlYm5mJDEkc3ViZXhwcmVzc2lvbiQxJGVibmYkMScsIHN5bWJvbHM6IFtdIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdzeW1ib2xfbGlrZV9hX251bSRlYm5mJDEkc3ViZXhwcmVzc2lvbiQxJGVibmYkMScsXHJcbiAgICAgIHN5bWJvbHM6IFsnc3ltYm9sX2xpa2VfYV9udW0kZWJuZiQxJHN1YmV4cHJlc3Npb24kMSRlYm5mJDEnLCAnc3ltYm9sX21pZCddLFxyXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24gYXJycHVzaChkKSB7XHJcbiAgICAgICAgcmV0dXJuIGRbMF0uY29uY2F0KFtkWzFdXSk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdzeW1ib2xfbGlrZV9hX251bSRlYm5mJDEkc3ViZXhwcmVzc2lvbiQxJyxcclxuICAgICAgc3ltYm9sczogWydzeW1ib2xfc2Vjb25kX3NwZWNpYWwnLCAnc3ltYm9sX2xpa2VfYV9udW0kZWJuZiQxJHN1YmV4cHJlc3Npb24kMSRlYm5mJDEnXVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ3N5bWJvbF9saWtlX2FfbnVtJGVibmYkMScsXHJcbiAgICAgIHN5bWJvbHM6IFsnc3ltYm9sX2xpa2VfYV9udW0kZWJuZiQxJHN1YmV4cHJlc3Npb24kMSddLFxyXG4gICAgICBwb3N0cHJvY2VzczogaWRcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdzeW1ib2xfbGlrZV9hX251bSRlYm5mJDEnLFxyXG4gICAgICBzeW1ib2xzOiBbXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uKF9kKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdzeW1ib2xfbGlrZV9hX251bSRlYm5mJDIkc3ViZXhwcmVzc2lvbiQxJyxcclxuICAgICAgc3ltYm9sczogW3sgbGl0ZXJhbDogJy8nIH0sICdzeW1ib2xfbm90X3NsYXNoJ11cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdzeW1ib2xfbGlrZV9hX251bSRlYm5mJDInLFxyXG4gICAgICBzeW1ib2xzOiBbJ3N5bWJvbF9saWtlX2FfbnVtJGVibmYkMiRzdWJleHByZXNzaW9uJDEnXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGlkXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnc3ltYm9sX2xpa2VfYV9udW0kZWJuZiQyJyxcclxuICAgICAgc3ltYm9sczogW10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBmdW5jdGlvbihfZCkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnc3ltYm9sX2xpa2VfYV9udW0nLFxyXG4gICAgICBzeW1ib2xzOiBbL1tcXC0rLl0vLCAnc3ltYm9sX2xpa2VfYV9udW0kZWJuZiQxJywgJ3N5bWJvbF9saWtlX2FfbnVtJGVibmYkMiddLFxyXG4gICAgICBwb3N0cHJvY2VzczogZGF0YSA9PlxyXG4gICAgICAgIGRhdGFbMF0gK1xyXG4gICAgICAgIChkYXRhWzFdID8gZGF0YVsxXVswXSArIGRhdGFbMV1bMV0uam9pbignJykgOiAnJykgK1xyXG4gICAgICAgIChkYXRhWzJdID8gZGF0YVsyXS5qb2luKCcnKSA6ICcnKVxyXG4gICAgfSxcclxuICAgIHsgbmFtZTogJ3N5bWJvbF9zZWNvbmRfc3BlY2lhbCcsIHN5bWJvbHM6IFsnc3ltYm9sX3N0YXJ0J10gfSxcclxuICAgIHsgbmFtZTogJ3N5bWJvbF9zZWNvbmRfc3BlY2lhbCcsIHN5bWJvbHM6IFsvW1xcLSsuOiNdL10sIHBvc3Rwcm9jZXNzOiBkYXRhID0+IGRhdGFbMF0gfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ0tleXdvcmQnLFxyXG4gICAgICBzeW1ib2xzOiBbeyBsaXRlcmFsOiAnOicgfSwgJ1N5bWJvbCddLFxyXG4gICAgICBwb3N0cHJvY2VzczogZGF0YSA9PiAoeyB0eXBlOiAna2V5d29yZCcsIGRhdGE6ICc6JyArIGRhdGFbMV0uZGF0YSB9KVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ0NoYXJhY3RlcicsXHJcbiAgICAgIHN5bWJvbHM6IFt7IGxpdGVyYWw6ICdcXFxcJyB9LCAnY2hhciddLFxyXG4gICAgICBwb3N0cHJvY2VzczogZGF0YSA9PiAoeyB0eXBlOiAnY2hhcicsIGRhdGE6IGRhdGFbMV1bMF0gfSlcclxuICAgIH0sXHJcbiAgICB7IG5hbWU6ICdjaGFyJywgc3ltYm9sczogWy9bXiBcXHRcXHJcXG5dL10gfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ2NoYXIkc3RyaW5nJDEnLFxyXG4gICAgICBzeW1ib2xzOiBbXHJcbiAgICAgICAgeyBsaXRlcmFsOiAnbicgfSxcclxuICAgICAgICB7IGxpdGVyYWw6ICdlJyB9LFxyXG4gICAgICAgIHsgbGl0ZXJhbDogJ3cnIH0sXHJcbiAgICAgICAgeyBsaXRlcmFsOiAnbCcgfSxcclxuICAgICAgICB7IGxpdGVyYWw6ICdpJyB9LFxyXG4gICAgICAgIHsgbGl0ZXJhbDogJ24nIH0sXHJcbiAgICAgICAgeyBsaXRlcmFsOiAnZScgfVxyXG4gICAgICBdLFxyXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24gam9pbmVyKGQpIHtcclxuICAgICAgICByZXR1cm4gZC5qb2luKCcnKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHsgbmFtZTogJ2NoYXInLCBzeW1ib2xzOiBbJ2NoYXIkc3RyaW5nJDEnXSB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnY2hhciRzdHJpbmckMicsXHJcbiAgICAgIHN5bWJvbHM6IFtcclxuICAgICAgICB7IGxpdGVyYWw6ICdyJyB9LFxyXG4gICAgICAgIHsgbGl0ZXJhbDogJ2UnIH0sXHJcbiAgICAgICAgeyBsaXRlcmFsOiAndCcgfSxcclxuICAgICAgICB7IGxpdGVyYWw6ICd1JyB9LFxyXG4gICAgICAgIHsgbGl0ZXJhbDogJ3InIH0sXHJcbiAgICAgICAgeyBsaXRlcmFsOiAnbicgfVxyXG4gICAgICBdLFxyXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24gam9pbmVyKGQpIHtcclxuICAgICAgICByZXR1cm4gZC5qb2luKCcnKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHsgbmFtZTogJ2NoYXInLCBzeW1ib2xzOiBbJ2NoYXIkc3RyaW5nJDInXSB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnY2hhciRzdHJpbmckMycsXHJcbiAgICAgIHN5bWJvbHM6IFtcclxuICAgICAgICB7IGxpdGVyYWw6ICdzJyB9LFxyXG4gICAgICAgIHsgbGl0ZXJhbDogJ3AnIH0sXHJcbiAgICAgICAgeyBsaXRlcmFsOiAnYScgfSxcclxuICAgICAgICB7IGxpdGVyYWw6ICdjJyB9LFxyXG4gICAgICAgIHsgbGl0ZXJhbDogJ2UnIH1cclxuICAgICAgXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uIGpvaW5lcihkKSB7XHJcbiAgICAgICAgcmV0dXJuIGQuam9pbignJyk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7IG5hbWU6ICdjaGFyJywgc3ltYm9sczogWydjaGFyJHN0cmluZyQzJ10gfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ2NoYXIkc3RyaW5nJDQnLFxyXG4gICAgICBzeW1ib2xzOiBbeyBsaXRlcmFsOiAndCcgfSwgeyBsaXRlcmFsOiAnYScgfSwgeyBsaXRlcmFsOiAnYicgfV0sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBmdW5jdGlvbiBqb2luZXIoZCkge1xyXG4gICAgICAgIHJldHVybiBkLmpvaW4oJycpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgeyBuYW1lOiAnY2hhcicsIHN5bWJvbHM6IFsnY2hhciRzdHJpbmckNCddIH0sXHJcbiAgICB7IG5hbWU6ICdjaGFyJywgc3ltYm9sczogWyd1bmljb2RlJ10sIHBvc3Rwcm9jZXNzOiBkYXRhID0+IGRhdGFbMF0gfSxcclxuICAgIHsgbmFtZTogJ051bWJlcicsIHN5bWJvbHM6IFsnSW50ZWdlciddIH0sXHJcbiAgICB7IG5hbWU6ICdOdW1iZXInLCBzeW1ib2xzOiBbJ0Zsb2F0J10sIHBvc3Rwcm9jZXNzOiBkYXRhID0+IGRhdGFbMF0gfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ0Zsb2F0JyxcclxuICAgICAgc3ltYm9sczogWydmbG9hdCddLFxyXG4gICAgICBwb3N0cHJvY2VzczogZGF0YSA9PiAoeyB0eXBlOiAnZG91YmxlJywgZGF0YTogZGF0YVswXVswXSwgYXJiaXRyYXJ5OiAhIWRhdGFbMF1bMV0gfSlcclxuICAgIH0sXHJcbiAgICB7IG5hbWU6ICdJbnRlZ2VyJGVibmYkMScsIHN5bWJvbHM6IFt7IGxpdGVyYWw6ICdOJyB9XSwgcG9zdHByb2Nlc3M6IGlkIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdJbnRlZ2VyJGVibmYkMScsXHJcbiAgICAgIHN5bWJvbHM6IFtdLFxyXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24oX2QpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ0ludGVnZXInLFxyXG4gICAgICBzeW1ib2xzOiBbJ2ludCcsICdJbnRlZ2VyJGVibmYkMSddLFxyXG4gICAgICBwb3N0cHJvY2VzczogZGF0YSA9PiAoeyB0eXBlOiAnaW50JywgZGF0YTogZGF0YVswXVswXSwgYXJiaXRyYXJ5OiAhIWRhdGFbMV0gfSlcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdmbG9hdCcsXHJcbiAgICAgIHN5bWJvbHM6IFsnaW50JywgeyBsaXRlcmFsOiAnTScgfV0sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBkYXRhID0+IFtkYXRhLnNsaWNlKDAsIDEpLmpvaW4oJycpLCBkYXRhWzFdXVxyXG4gICAgfSxcclxuICAgIHsgbmFtZTogJ2Zsb2F0JGVibmYkMScsIHN5bWJvbHM6IFt7IGxpdGVyYWw6ICdNJyB9XSwgcG9zdHByb2Nlc3M6IGlkIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdmbG9hdCRlYm5mJDEnLFxyXG4gICAgICBzeW1ib2xzOiBbXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uKF9kKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdmbG9hdCcsXHJcbiAgICAgIHN5bWJvbHM6IFsnaW50JywgJ2ZyYWMnLCAnZmxvYXQkZWJuZiQxJ10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBkYXRhID0+IFtkYXRhLnNsaWNlKDAsIDIpLmpvaW4oJycpLCBkYXRhWzJdXVxyXG4gICAgfSxcclxuICAgIHsgbmFtZTogJ2Zsb2F0JGVibmYkMicsIHN5bWJvbHM6IFt7IGxpdGVyYWw6ICdNJyB9XSwgcG9zdHByb2Nlc3M6IGlkIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdmbG9hdCRlYm5mJDInLFxyXG4gICAgICBzeW1ib2xzOiBbXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uKF9kKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdmbG9hdCcsXHJcbiAgICAgIHN5bWJvbHM6IFsnaW50JywgJ2V4cCcsICdmbG9hdCRlYm5mJDInXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGRhdGEgPT4gW2RhdGEuc2xpY2UoMCwgMikuam9pbignJyksIGRhdGFbMl1dXHJcbiAgICB9LFxyXG4gICAgeyBuYW1lOiAnZmxvYXQkZWJuZiQzJywgc3ltYm9sczogW3sgbGl0ZXJhbDogJ00nIH1dLCBwb3N0cHJvY2VzczogaWQgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ2Zsb2F0JGVibmYkMycsXHJcbiAgICAgIHN5bWJvbHM6IFtdLFxyXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24oX2QpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ2Zsb2F0JyxcclxuICAgICAgc3ltYm9sczogWydpbnQnLCAnZnJhYycsICdleHAnLCAnZmxvYXQkZWJuZiQzJ10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBkYXRhID0+IFtkYXRhLnNsaWNlKDAsIDMpLmpvaW4oJycpLCBkYXRhWzJdXVxyXG4gICAgfSxcclxuICAgIHsgbmFtZTogJ2ZyYWMkZWJuZiQxJywgc3ltYm9sczogW10gfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ2ZyYWMkZWJuZiQxJyxcclxuICAgICAgc3ltYm9sczogWydmcmFjJGVibmYkMScsICdkaWdpdCddLFxyXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24gYXJycHVzaChkKSB7XHJcbiAgICAgICAgcmV0dXJuIGRbMF0uY29uY2F0KFtkWzFdXSk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdmcmFjJyxcclxuICAgICAgc3ltYm9sczogW3sgbGl0ZXJhbDogJy4nIH0sICdmcmFjJGVibmYkMSddLFxyXG4gICAgICBwb3N0cHJvY2VzczogZGF0YSA9PiBkYXRhWzBdICsgZGF0YVsxXS5qb2luKCcnKVxyXG4gICAgfSxcclxuICAgIHsgbmFtZTogJ2V4cCcsIHN5bWJvbHM6IFsnZXgnLCAnZGlnaXRzJ10sIHBvc3Rwcm9jZXNzOiBkYXRhID0+IGRhdGEuam9pbignJykgfSxcclxuICAgIHsgbmFtZTogJ2V4JHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFt7IGxpdGVyYWw6ICdlJyB9XSB9LFxyXG4gICAgeyBuYW1lOiAnZXgkc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogW3sgbGl0ZXJhbDogJ0UnIH1dIH0sXHJcbiAgICB7IG5hbWU6ICdleCRlYm5mJDEkc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogW3sgbGl0ZXJhbDogJysnIH1dIH0sXHJcbiAgICB7IG5hbWU6ICdleCRlYm5mJDEkc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogW3sgbGl0ZXJhbDogJy0nIH1dIH0sXHJcbiAgICB7IG5hbWU6ICdleCRlYm5mJDEnLCBzeW1ib2xzOiBbJ2V4JGVibmYkMSRzdWJleHByZXNzaW9uJDEnXSwgcG9zdHByb2Nlc3M6IGlkIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdleCRlYm5mJDEnLFxyXG4gICAgICBzeW1ib2xzOiBbXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uKF9kKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdleCcsXHJcbiAgICAgIHN5bWJvbHM6IFsnZXgkc3ViZXhwcmVzc2lvbiQxJywgJ2V4JGVibmYkMSddLFxyXG4gICAgICBwb3N0cHJvY2VzczogZGF0YSA9PiAnZScgKyAoZGF0YVsxXSB8fCAnKycpXHJcbiAgICB9LFxyXG4gICAgeyBuYW1lOiAnaW50Jywgc3ltYm9sczogWydpbnRfbm9fcHJlZml4J10gfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ2ludCcsXHJcbiAgICAgIHN5bWJvbHM6IFt7IGxpdGVyYWw6ICcrJyB9LCAnaW50X25vX3ByZWZpeCddLFxyXG4gICAgICBwb3N0cHJvY2VzczogZGF0YSA9PiBkYXRhLmpvaW4oJycpXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnaW50JyxcclxuICAgICAgc3ltYm9sczogW3sgbGl0ZXJhbDogJy0nIH0sICdpbnRfbm9fcHJlZml4J10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBkYXRhID0+IGRhdGEuam9pbignJylcclxuICAgIH0sXHJcbiAgICB7IG5hbWU6ICdpbnRfbm9fcHJlZml4Jywgc3ltYm9sczogW3sgbGl0ZXJhbDogJzAnIH1dLCBwb3N0cHJvY2VzczogZGF0YSA9PiBkYXRhLmpvaW4oJycpIH0sXHJcbiAgICB7IG5hbWU6ICdpbnRfbm9fcHJlZml4JGVibmYkMScsIHN5bWJvbHM6IFtdIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdpbnRfbm9fcHJlZml4JGVibmYkMScsXHJcbiAgICAgIHN5bWJvbHM6IFsnaW50X25vX3ByZWZpeCRlYm5mJDEnLCAnZGlnaXQnXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uIGFycnB1c2goZCkge1xyXG4gICAgICAgIHJldHVybiBkWzBdLmNvbmNhdChbZFsxXV0pO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnaW50X25vX3ByZWZpeCcsXHJcbiAgICAgIHN5bWJvbHM6IFsnb25lVG9OaW5lJywgJ2ludF9ub19wcmVmaXgkZWJuZiQxJ10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBkYXRhID0+IGRhdGFbMF0gKyBkYXRhWzFdLmpvaW4oJycpXHJcbiAgICB9LFxyXG4gICAgeyBuYW1lOiAnb25lVG9OaW5lJywgc3ltYm9sczogWy9bMS05XS9dLCBwb3N0cHJvY2VzczogZGF0YSA9PiBkYXRhLmpvaW4oJycpIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdNYXBFbGVtJyxcclxuICAgICAgc3ltYm9sczogWydtYXBLZXknLCAnbWFwVmFsdWUnXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGRhdGEgPT4gW1tkYXRhWzBdWzBdLCBkYXRhWzFdWzBdXV0uY29uY2F0KGRhdGFbMV0uc2xpY2UoMSkpXHJcbiAgICB9LFxyXG4gICAgeyBuYW1lOiAnbWFwS2V5JHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFsnbWFwS2V5U3BhY2UnXSB9LFxyXG4gICAgeyBuYW1lOiAnbWFwS2V5JHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFsnbWFwS2V5Tm9TcGFjZSddIH0sXHJcbiAgICB7IG5hbWU6ICdtYXBLZXknLCBzeW1ib2xzOiBbJ21hcEtleSRzdWJleHByZXNzaW9uJDEnXSwgcG9zdHByb2Nlc3M6IGRhdGEgPT4gZGF0YVswXSB9LFxyXG4gICAgeyBuYW1lOiAnbWFwVmFsdWUkc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogWydtYXBWYWx1ZVNwYWNlJ10gfSxcclxuICAgIHsgbmFtZTogJ21hcFZhbHVlJHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFsnbWFwVmFsdWVOb1NwYWNlJ10gfSxcclxuICAgIHsgbmFtZTogJ21hcFZhbHVlJywgc3ltYm9sczogWydtYXBWYWx1ZSRzdWJleHByZXNzaW9uJDEnXSwgcG9zdHByb2Nlc3M6IGRhdGEgPT4gZGF0YVswXVswXSB9LFxyXG4gICAgeyBuYW1lOiAnbWFwS2V5U3BhY2UnLCBzeW1ib2xzOiBbJ21hcEVsZW1lbnRTcGFjZScsICdfJ10sIHBvc3Rwcm9jZXNzOiBkYXRhID0+IGRhdGFbMF0gfSxcclxuICAgIHsgbmFtZTogJ21hcEtleU5vU3BhY2UkZWJuZiQxJywgc3ltYm9sczogWydfJ10sIHBvc3Rwcm9jZXNzOiBpZCB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnbWFwS2V5Tm9TcGFjZSRlYm5mJDEnLFxyXG4gICAgICBzeW1ib2xzOiBbXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uKF9kKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdtYXBLZXlOb1NwYWNlJyxcclxuICAgICAgc3ltYm9sczogWydtYXBFbGVtZW50Tm9TcGFjZScsICdtYXBLZXlOb1NwYWNlJGVibmYkMSddLFxyXG4gICAgICBwb3N0cHJvY2VzczogZGF0YSA9PiBkYXRhWzBdXHJcbiAgICB9LFxyXG4gICAgeyBuYW1lOiAnbWFwVmFsdWVTcGFjZSRlYm5mJDEkc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogWydfJywgJ01hcEVsZW0nXSB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnbWFwVmFsdWVTcGFjZSRlYm5mJDEnLFxyXG4gICAgICBzeW1ib2xzOiBbJ21hcFZhbHVlU3BhY2UkZWJuZiQxJHN1YmV4cHJlc3Npb24kMSddLFxyXG4gICAgICBwb3N0cHJvY2VzczogaWRcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdtYXBWYWx1ZVNwYWNlJGVibmYkMScsXHJcbiAgICAgIHN5bWJvbHM6IFtdLFxyXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24oX2QpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ21hcFZhbHVlU3BhY2UnLFxyXG4gICAgICBzeW1ib2xzOiBbJ21hcEVsZW1lbnRTcGFjZScsICdtYXBWYWx1ZVNwYWNlJGVibmYkMSddLFxyXG4gICAgICBwb3N0cHJvY2VzczogZGF0YSA9PiBbZGF0YVswXV0uY29uY2F0KGRhdGFbMV0gPyBkYXRhWzFdWzFdIDogW10pXHJcbiAgICB9LFxyXG4gICAgeyBuYW1lOiAnbWFwVmFsdWVOb1NwYWNlJGVibmYkMSRzdWJleHByZXNzaW9uJDEkZWJuZiQxJywgc3ltYm9sczogWydfJ10sIHBvc3Rwcm9jZXNzOiBpZCB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnbWFwVmFsdWVOb1NwYWNlJGVibmYkMSRzdWJleHByZXNzaW9uJDEkZWJuZiQxJyxcclxuICAgICAgc3ltYm9sczogW10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBmdW5jdGlvbihfZCkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnbWFwVmFsdWVOb1NwYWNlJGVibmYkMSRzdWJleHByZXNzaW9uJDEnLFxyXG4gICAgICBzeW1ib2xzOiBbJ21hcFZhbHVlTm9TcGFjZSRlYm5mJDEkc3ViZXhwcmVzc2lvbiQxJGVibmYkMScsICdNYXBFbGVtJ11cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdtYXBWYWx1ZU5vU3BhY2UkZWJuZiQxJyxcclxuICAgICAgc3ltYm9sczogWydtYXBWYWx1ZU5vU3BhY2UkZWJuZiQxJHN1YmV4cHJlc3Npb24kMSddLFxyXG4gICAgICBwb3N0cHJvY2VzczogaWRcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdtYXBWYWx1ZU5vU3BhY2UkZWJuZiQxJyxcclxuICAgICAgc3ltYm9sczogW10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBmdW5jdGlvbihfZCkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnbWFwVmFsdWVOb1NwYWNlJyxcclxuICAgICAgc3ltYm9sczogWydtYXBFbGVtZW50Tm9TcGFjZScsICdtYXBWYWx1ZU5vU3BhY2UkZWJuZiQxJ10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBkYXRhID0+IFtkYXRhWzBdXS5jb25jYXQoZGF0YVsxXSA/IGRhdGFbMV1bMV0gOiBbXSlcclxuICAgIH0sXHJcbiAgICB7IG5hbWU6ICdtYXBFbGVtZW50Tm9TcGFjZSRzdWJleHByZXNzaW9uJDEnLCBzeW1ib2xzOiBbJ1ZlY3RvciddIH0sXHJcbiAgICB7IG5hbWU6ICdtYXBFbGVtZW50Tm9TcGFjZSRzdWJleHByZXNzaW9uJDEnLCBzeW1ib2xzOiBbJ0xpc3QnXSB9LFxyXG4gICAgeyBuYW1lOiAnbWFwRWxlbWVudE5vU3BhY2Ukc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogWydTdHJpbmcnXSB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnbWFwRWxlbWVudE5vU3BhY2UnLFxyXG4gICAgICBzeW1ib2xzOiBbJ21hcEVsZW1lbnROb1NwYWNlJHN1YmV4cHJlc3Npb24kMSddLFxyXG4gICAgICBwb3N0cHJvY2VzczogZGF0YSA9PiBkYXRhWzBdWzBdXHJcbiAgICB9LFxyXG4gICAgeyBuYW1lOiAnbWFwRWxlbWVudFNwYWNlJHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFsnTnVtYmVyJ10gfSxcclxuICAgIHsgbmFtZTogJ21hcEVsZW1lbnRTcGFjZSRzdWJleHByZXNzaW9uJDEnLCBzeW1ib2xzOiBbJ0NoYXJhY3RlciddIH0sXHJcbiAgICB7IG5hbWU6ICdtYXBFbGVtZW50U3BhY2Ukc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogWydSZXNlcnZlZCddIH0sXHJcbiAgICB7IG5hbWU6ICdtYXBFbGVtZW50U3BhY2Ukc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogWydTeW1ib2wnXSB9LFxyXG4gICAgeyBuYW1lOiAnbWFwRWxlbWVudFNwYWNlJHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFsnS2V5d29yZCddIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdtYXBFbGVtZW50U3BhY2UnLFxyXG4gICAgICBzeW1ib2xzOiBbJ21hcEVsZW1lbnRTcGFjZSRzdWJleHByZXNzaW9uJDEnXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGRhdGEgPT4gW10uY29uY2F0KC4uLltkYXRhWzBdWzBdXSlbMF1cclxuICAgIH0sXHJcbiAgICB7IG5hbWU6ICdoZXhEaWdpdCcsIHN5bWJvbHM6IFsvW2EtZkEtRjAtOV0vXSwgcG9zdHByb2Nlc3M6IGRhdGEgPT4gZGF0YVswXSB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAndW5pY29kZScsXHJcbiAgICAgIHN5bWJvbHM6IFt7IGxpdGVyYWw6ICd1JyB9LCAnaGV4RGlnaXQnLCAnaGV4RGlnaXQnLCAnaGV4RGlnaXQnLCAnaGV4RGlnaXQnXSxcclxuICAgICAgcG9zdHByb2Nlc3M6IGRhdGEgPT4gU3RyaW5nLmZyb21DaGFyQ29kZShwYXJzZUludChkYXRhLnNsaWNlKDEpLmpvaW4oJycpLCAxNikpXHJcbiAgICB9LFxyXG4gICAgeyBuYW1lOiAnXycsIHN5bWJvbHM6IFsnc3BhY2UnXSwgcG9zdHByb2Nlc3M6IGRhdGEgPT4gZGF0YVswXSB9LFxyXG4gICAgeyBuYW1lOiAnc3BhY2UkZWJuZiQxJywgc3ltYm9sczogWy9bXFxzLFxcbl0vXSB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnc3BhY2UkZWJuZiQxJyxcclxuICAgICAgc3ltYm9sczogWydzcGFjZSRlYm5mJDEnLCAvW1xccyxcXG5dL10sXHJcbiAgICAgIHBvc3Rwcm9jZXNzOiBmdW5jdGlvbiBhcnJwdXNoKGQpIHtcclxuICAgICAgICByZXR1cm4gZFswXS5jb25jYXQoW2RbMV1dKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHsgbmFtZTogJ3NwYWNlJywgc3ltYm9sczogWydzcGFjZSRlYm5mJDEnXSwgcG9zdHByb2Nlc3M6IGRhdGEgPT4gZGF0YVswXS5qb2luKCcnKSB9LFxyXG4gICAgeyBuYW1lOiAnZGlnaXRzJGVibmYkMScsIHN5bWJvbHM6IFsnZGlnaXQnXSB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnZGlnaXRzJGVibmYkMScsXHJcbiAgICAgIHN5bWJvbHM6IFsnZGlnaXRzJGVibmYkMScsICdkaWdpdCddLFxyXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24gYXJycHVzaChkKSB7XHJcbiAgICAgICAgcmV0dXJuIGRbMF0uY29uY2F0KFtkWzFdXSk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7IG5hbWU6ICdkaWdpdHMnLCBzeW1ib2xzOiBbJ2RpZ2l0cyRlYm5mJDEnXSwgcG9zdHByb2Nlc3M6IGRhdGEgPT4gZGF0YVswXS5qb2luKCcnKSB9LFxyXG4gICAgeyBuYW1lOiAnZGlnaXQnLCBzeW1ib2xzOiBbL1swLTldL10sIHBvc3Rwcm9jZXNzOiBkYXRhID0+IGRhdGFbMF0gfSxcclxuICAgIHsgbmFtZTogJ2xldHRlcicsIHN5bWJvbHM6IFsvW2EtekEtWl0vXSwgcG9zdHByb2Nlc3M6IGRhdGEgPT4gZGF0YVswXSB9XHJcbiAgXSxcclxuICBQYXJzZXJTdGFydDogJ01haW4nXHJcbn07XHJcblxyXG4vLyBEbyB0aGUgcGFyc2luZ1xyXG5pbXBvcnQgeyBQYXJzZXIsIEdyYW1tYXIgfSBmcm9tICduZWFybGV5JztcclxuaW1wb3J0IHsgcHJlcHJvY2VzcyB9IGZyb20gJy4vcHJlcHJvY2Vzc29yJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBwYXJzZShzdHJpbmc6IHN0cmluZykge1xyXG4gIGNvbnN0IHBhcnNlciA9IG5ldyBQYXJzZXIoR3JhbW1hci5mcm9tQ29tcGlsZWQoZ3JhbW1hcikpO1xyXG4gIGNvbnN0IHN0ciA9IHByZXByb2Nlc3Moc3RyaW5nKTtcclxuICBpZiAoIXN0cikgcmV0dXJuIG51bGw7XHJcbiAgdHJ5IHtcclxuICAgIHJldHVybiBwYXJzZXIuZmVlZChwcmVwcm9jZXNzKHN0cmluZykpLnJlc3VsdHNbMF07XHJcbiAgfSBjYXRjaCB7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG59XHJcbiIsImV4cG9ydCAqIGZyb20gJy4vaW50ZXJwcmV0ZXInO1xyXG4iLCJpbXBvcnQgeyBwYXJzZSB9IGZyb20gJy4vZ3JhbW1hcic7XHJcblxyXG5leHBvcnQgY29uc3QgRWRuID0ge1xyXG4gIHBhcnNlOiAoc3RyOiBzdHJpbmcpID0+IHtcclxuICAgIGNvbnN0IHJlcyA9IHBhcnNlKHN0cik7XHJcbiAgICByZXR1cm4gcmVzO1xyXG4gIH1cclxufTtcclxuXHJcbmNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KEVkbi5wYXJzZSgnW2hlbGxvIHdvcmxkXScpKSk7XHJcbiIsImV4cG9ydCBjb25zdCBwcmVwcm9jZXNzID0gKHN0cjogc3RyaW5nKSA9PiByZW1vdmVDb21tZW50cyhzdHIpLnRyaW0oKTtcclxuXHJcbmZ1bmN0aW9uIHJlbW92ZUNvbW1lbnRzKHN0cjogc3RyaW5nKSB7XHJcbiAgbGV0IG5ld1N0ciA9ICcnO1xyXG4gIGxldCBpblF1b3RlcyA9IGZhbHNlO1xyXG4gIGxldCBpbkNvbW1lbnQgPSBmYWxzZTtcclxuICBsZXQgc2tpcCA9IGZhbHNlO1xyXG4gIGZvciAoY29uc3QgYyBvZiBzdHIpIHtcclxuICAgIGlmIChza2lwKSB7XHJcbiAgICAgIG5ld1N0ciArPSBjO1xyXG4gICAgICBza2lwID0gZmFsc2U7XHJcbiAgICB9IGVsc2UgaWYgKGMgPT09ICc7JyAmJiAhaW5RdW90ZXMpIHtcclxuICAgICAgaW5Db21tZW50ID0gdHJ1ZTtcclxuICAgIH0gZWxzZSBpZiAoYyA9PT0gJ1xcbicpIHtcclxuICAgICAgbmV3U3RyICs9ICdcXG4nO1xyXG4gICAgICBpbkNvbW1lbnQgPSBmYWxzZTtcclxuICAgIH0gZWxzZSBpZiAoIWluQ29tbWVudCkge1xyXG4gICAgICBuZXdTdHIgKz0gYztcclxuICAgICAgaWYgKGMgPT09ICdcXFxcJykgc2tpcCA9IHRydWU7XHJcbiAgICAgIGVsc2UgaWYgKGMgPT09ICdcIicpIGluUXVvdGVzID0gIWluUXVvdGVzO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gbmV3U3RyO1xyXG59XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=