// Generated automatically by nearley, version 2.15.1
// http://github.com/Hardmath123/nearley
function id(x) {
  return x[0];
}
const grammar = {
  Lexer: undefined,
  ParserRules: [
    { name: 'Main', symbols: ['EDN'], postprocess: data => data[0] },
    { name: 'EDN', symbols: ['Exp'], postprocess: data => data[0] },
    { name: 'Exp$subexpression$1', symbols: ['ElementSpace'] },
    { name: 'Exp$subexpression$1', symbols: ['ElementNoSpace'] },
    { name: 'Exp', symbols: ['Exp$subexpression$1'], postprocess: data => [].concat(...data[0]) },
    { name: '_Exp', symbols: ['__exp'] },
    { name: '_Exp', symbols: ['__char'], postprocess: data => data[0] },
    { name: '__exp', symbols: ['_', 'Exp'], postprocess: data => data[1] },
    { name: '__char$ebnf$1$subexpression$1', symbols: ['_Exp'] },
    { name: '__char$ebnf$1$subexpression$1', symbols: ['ElementNoSpace'] },
    { name: '__char$ebnf$1', symbols: ['__char$ebnf$1$subexpression$1'], postprocess: id },
    {
      name: '__char$ebnf$1',
      symbols: [],
      postprocess: function() {
        return null;
      }
    },
    {
      name: '__char',
      symbols: ['Character', '__char$ebnf$1'],
      postprocess: data => [].concat(...[data[0]].concat(data[1] ? [].concat(...data[1]) : []))
    },
    { name: 'ElementSpace$subexpression$1', symbols: ['Number'] },
    { name: 'ElementSpace$subexpression$1', symbols: ['Character'] },
    { name: 'ElementSpace$subexpression$1', symbols: ['Reserved'] },
    { name: 'ElementSpace$subexpression$1', symbols: ['Symbol'] },
    { name: 'ElementSpace$subexpression$1', symbols: ['Keyword'] },
    { name: 'ElementSpace$subexpression$1', symbols: ['Tag'] },
    { name: 'ElementSpace$subexpression$1', symbols: ['Discard'] },
    { name: 'ElementSpace$ebnf$1$subexpression$1', symbols: ['_Exp'] },
    { name: 'ElementSpace$ebnf$1$subexpression$1', symbols: ['ElementNoSpace'] },
    {
      name: 'ElementSpace$ebnf$1',
      symbols: ['ElementSpace$ebnf$1$subexpression$1'],
      postprocess: id
    },
    {
      name: 'ElementSpace$ebnf$1',
      symbols: [],
      postprocess: function() {
        return null;
      }
    },
    {
      name: 'ElementSpace',
      symbols: ['ElementSpace$subexpression$1', 'ElementSpace$ebnf$1'],
      postprocess: data => [].concat(...[data[0][0]].concat(data[1] ? [].concat(...data[1]) : []))
    },
    { name: 'ElementNoSpace$ebnf$1$subexpression$1$ebnf$1', symbols: ['_'], postprocess: id },
    {
      name: 'ElementNoSpace$ebnf$1$subexpression$1$ebnf$1',
      symbols: [],
      postprocess: function() {
        return null;
      }
    },
    {
      name: 'ElementNoSpace$ebnf$1$subexpression$1',
      symbols: ['ElementNoSpace$ebnf$1$subexpression$1$ebnf$1', 'Exp']
    },
    {
      name: 'ElementNoSpace$ebnf$1',
      symbols: ['ElementNoSpace$ebnf$1$subexpression$1'],
      postprocess: id
    },
    {
      name: 'ElementNoSpace$ebnf$1',
      symbols: [],
      postprocess: function() {
        return null;
      }
    },
    {
      name: 'ElementNoSpace',
      symbols: ['mapElementNoSpace', 'ElementNoSpace$ebnf$1'],
      postprocess: data => [data[0]].concat(data[1] ? data[1][1] : [])
    },
    { name: 'Element$subexpression$1', symbols: ['Number'] },
    { name: 'Element$subexpression$1', symbols: ['Character'] },
    { name: 'Element$subexpression$1', symbols: ['Reserved'] },
    { name: 'Element$subexpression$1', symbols: ['Symbol'] },
    { name: 'Element$subexpression$1', symbols: ['Keyword'] },
    { name: 'Element$subexpression$1', symbols: ['Vector'] },
    { name: 'Element$subexpression$1', symbols: ['List'] },
    { name: 'Element$subexpression$1', symbols: ['String'] },
    { name: 'Element$subexpression$1', symbols: ['Map'] },
    { name: 'Element$subexpression$1', symbols: ['Set'] },
    { name: 'Element', symbols: ['Element$subexpression$1'], postprocess: data => data[0][0] },
    { name: 'Vector$ebnf$1', symbols: ['_'], postprocess: id },
    {
      name: 'Vector$ebnf$1',
      symbols: [],
      postprocess: function() {
        return null;
      }
    },
    { name: 'Vector$ebnf$2$subexpression$1$ebnf$1', symbols: ['_'], postprocess: id },
    {
      name: 'Vector$ebnf$2$subexpression$1$ebnf$1',
      symbols: [],
      postprocess: function() {
        return null;
      }
    },
    {
      name: 'Vector$ebnf$2$subexpression$1',
      symbols: ['Exp', 'Vector$ebnf$2$subexpression$1$ebnf$1']
    },
    { name: 'Vector$ebnf$2', symbols: ['Vector$ebnf$2$subexpression$1'], postprocess: id },
    {
      name: 'Vector$ebnf$2',
      symbols: [],
      postprocess: function() {
        return null;
      }
    },
    {
      name: 'Vector',
      symbols: [{ literal: '[' }, 'Vector$ebnf$1', 'Vector$ebnf$2', { literal: ']' }],
      postprocess: data => ({ type: 'vector', data: data[2] ? data[2][0] : [] })
    },
    { name: 'List$ebnf$1', symbols: ['_'], postprocess: id },
    {
      name: 'List$ebnf$1',
      symbols: [],
      postprocess: function() {
        return null;
      }
    },
    { name: 'List$ebnf$2$subexpression$1$ebnf$1', symbols: ['_'], postprocess: id },
    {
      name: 'List$ebnf$2$subexpression$1$ebnf$1',
      symbols: [],
      postprocess: function() {
        return null;
      }
    },
    { name: 'List$ebnf$2$subexpression$1', symbols: ['Exp', 'List$ebnf$2$subexpression$1$ebnf$1'] },
    { name: 'List$ebnf$2', symbols: ['List$ebnf$2$subexpression$1'], postprocess: id },
    {
      name: 'List$ebnf$2',
      symbols: [],
      postprocess: function() {
        return null;
      }
    },
    {
      name: 'List',
      symbols: [{ literal: '(' }, 'List$ebnf$1', 'List$ebnf$2', { literal: ')' }],
      postprocess: data => ({ type: 'list', data: data[2] ? data[2][0] : [] })
    },
    { name: 'Map$ebnf$1', symbols: ['_'], postprocess: id },
    {
      name: 'Map$ebnf$1',
      symbols: [],
      postprocess: function() {
        return null;
      }
    },
    { name: 'Map$ebnf$2$subexpression$1$ebnf$1', symbols: ['_'], postprocess: id },
    {
      name: 'Map$ebnf$2$subexpression$1$ebnf$1',
      symbols: [],
      postprocess: function() {
        return null;
      }
    },
    {
      name: 'Map$ebnf$2$subexpression$1',
      symbols: ['MapElem', 'Map$ebnf$2$subexpression$1$ebnf$1']
    },
    { name: 'Map$ebnf$2', symbols: ['Map$ebnf$2$subexpression$1'], postprocess: id },
    {
      name: 'Map$ebnf$2',
      symbols: [],
      postprocess: function() {
        return null;
      }
    },
    {
      name: 'Map',
      symbols: [{ literal: '{' }, 'Map$ebnf$1', 'Map$ebnf$2', { literal: '}' }],
      postprocess: data => ({ type: 'map', data: data[2] ? data[2][0] : [] })
    },
    {
      name: 'Set$string$1',
      symbols: [{ literal: '#' }, { literal: '{' }],
      postprocess: function joiner(d) {
        return d.join('');
      }
    },
    { name: 'Set$ebnf$1', symbols: ['_'], postprocess: id },
    {
      name: 'Set$ebnf$1',
      symbols: [],
      postprocess: function() {
        return null;
      }
    },
    { name: 'Set$ebnf$2$subexpression$1$ebnf$1', symbols: ['_'], postprocess: id },
    {
      name: 'Set$ebnf$2$subexpression$1$ebnf$1',
      symbols: [],
      postprocess: function() {
        return null;
      }
    },
    { name: 'Set$ebnf$2$subexpression$1', symbols: ['Exp', 'Set$ebnf$2$subexpression$1$ebnf$1'] },
    { name: 'Set$ebnf$2', symbols: ['Set$ebnf$2$subexpression$1'], postprocess: id },
    {
      name: 'Set$ebnf$2',
      symbols: [],
      postprocess: function() {
        return null;
      }
    },
    {
      name: 'Set',
      symbols: ['Set$string$1', 'Set$ebnf$1', 'Set$ebnf$2', { literal: '}' }],
      postprocess: data => ({ type: 'set', data: data[2] ? data[2][0] : [] })
    },
    {
      name: 'Tag',
      symbols: [{ literal: '#' }, 'Symbol', '_', 'Element'],
      postprocess: (data, _l, reject) => {
        if (data[1].data[0] === '_') return reject;
        return { type: 'tag', tag: data[1].data, data: data[3] };
      }
    },
    {
      name: 'Discard$string$1',
      symbols: [{ literal: '#' }, { literal: '_' }],
      postprocess: function joiner(d) {
        return d.join('');
      }
    },
    { name: 'Discard$ebnf$1', symbols: ['_'], postprocess: id },
    {
      name: 'Discard$ebnf$1',
      symbols: [],
      postprocess: function() {
        return null;
      }
    },
    {
      name: 'Discard',
      symbols: ['Discard$string$1', 'Discard$ebnf$1', 'Element'],
      postprocess: () => ({ type: 'discard' })
    },
    { name: 'String$ebnf$1', symbols: [] },
    {
      name: 'String$ebnf$1',
      symbols: ['String$ebnf$1', 'string_char'],
      postprocess: function arrpush(d) {
        return d[0].concat([d[1]]);
      }
    },
    {
      name: 'String',
      symbols: [{ literal: '"' }, 'String$ebnf$1', { literal: '"' }],
      postprocess: data => ({ type: 'string', data: data[1].join('') })
    },
    { name: 'string_char', symbols: [/[^\\"]/] },
    { name: 'string_char', symbols: ['backslash'] },
    { name: 'string_char', symbols: ['backslash_unicode'], postprocess: id },
    {
      name: 'backslash',
      symbols: [{ literal: '\\' }, /["trn\\]/],
      postprocess: data => data.join('')
    },
    {
      name: 'backslash_unicode',
      symbols: [{ literal: '\\' }, 'unicode'],
      postprocess: data => data[1]
    },
    { name: 'Reserved$subexpression$1', symbols: ['boolean'] },
    { name: 'Reserved$subexpression$1', symbols: ['nil'] },
    { name: 'Reserved', symbols: ['Reserved$subexpression$1'], postprocess: data => data[0][0] },
    { name: 'boolean$subexpression$1', symbols: ['true'] },
    { name: 'boolean$subexpression$1', symbols: ['false'] },
    { name: 'boolean', symbols: ['boolean$subexpression$1'], postprocess: data => data[0][0] },
    {
      name: 'true$string$1',
      symbols: [{ literal: 't' }, { literal: 'r' }, { literal: 'u' }, { literal: 'e' }],
      postprocess: function joiner(d) {
        return d.join('');
      }
    },
    { name: 'true', symbols: ['true$string$1'], postprocess: () => ({ type: 'bool', data: true }) },
    {
      name: 'false$string$1',
      symbols: [
        { literal: 'f' },
        { literal: 'a' },
        { literal: 'l' },
        { literal: 's' },
        { literal: 'e' }
      ],
      postprocess: function joiner(d) {
        return d.join('');
      }
    },
    {
      name: 'false',
      symbols: ['false$string$1'],
      postprocess: () => ({ type: 'bool', data: false })
    },
    {
      name: 'nil$string$1',
      symbols: [{ literal: 'n' }, { literal: 'i' }, { literal: 'l' }],
      postprocess: function joiner(d) {
        return d.join('');
      }
    },
    { name: 'nil', symbols: ['nil$string$1'], postprocess: () => ({ type: 'nil', data: null }) },
    { name: 'Symbol$subexpression$1', symbols: ['symbol'] },
    { name: 'Symbol$subexpression$1', symbols: [{ literal: '/' }] },
    {
      name: 'Symbol',
      symbols: ['Symbol$subexpression$1'],
      postprocess: (data, _, reject) => {
        if (data[0][0] === 'true' || data[0][0] === 'false' || data[0][0] === 'nil') return reject;
        return { type: 'symbol', data: data[0][0] };
      }
    },
    { name: 'symbol$ebnf$1$subexpression$1', symbols: [{ literal: '/' }, 'symbol_piece'] },
    { name: 'symbol$ebnf$1', symbols: ['symbol$ebnf$1$subexpression$1'], postprocess: id },
    {
      name: 'symbol$ebnf$1',
      symbols: [],
      postprocess: function() {
        return null;
      }
    },
    {
      name: 'symbol',
      symbols: ['symbol_piece', 'symbol$ebnf$1'],
      postprocess: data => data[0] + (data[1] ? data[1].join('') : '')
    },
    { name: 'symbol_piece', symbols: ['symbol_piece_basic'] },
    { name: 'symbol_piece', symbols: ['symbol_piece_num'], postprocess: id },
    { name: 'symbol_piece_basic$ebnf$1', symbols: [] },
    {
      name: 'symbol_piece_basic$ebnf$1',
      symbols: ['symbol_piece_basic$ebnf$1', 'symbol_mid'],
      postprocess: function arrpush(d) {
        return d[0].concat([d[1]]);
      }
    },
    {
      name: 'symbol_piece_basic',
      symbols: ['symbol_start', 'symbol_piece_basic$ebnf$1'],
      postprocess: data => data[0] + data[1].join('')
    },
    { name: 'symbol_piece_num$ebnf$1$subexpression$1$ebnf$1', symbols: [] },
    {
      name: 'symbol_piece_num$ebnf$1$subexpression$1$ebnf$1',
      symbols: ['symbol_piece_num$ebnf$1$subexpression$1$ebnf$1', 'symbol_mid'],
      postprocess: function arrpush(d) {
        return d[0].concat([d[1]]);
      }
    },
    {
      name: 'symbol_piece_num$ebnf$1$subexpression$1',
      symbols: ['symbol_second_special', 'symbol_piece_num$ebnf$1$subexpression$1$ebnf$1']
    },
    {
      name: 'symbol_piece_num$ebnf$1',
      symbols: ['symbol_piece_num$ebnf$1$subexpression$1'],
      postprocess: id
    },
    {
      name: 'symbol_piece_num$ebnf$1',
      symbols: [],
      postprocess: function() {
        return null;
      }
    },
    {
      name: 'symbol_piece_num',
      symbols: [/[\-+.]/, 'symbol_piece_num$ebnf$1'],
      postprocess: data => data[0] + (data[1] ? data[1][0] + data[1][1].join('') : '')
    },
    { name: 'symbol_basic$ebnf$1', symbols: [] },
    {
      name: 'symbol_basic$ebnf$1',
      symbols: ['symbol_basic$ebnf$1', 'symbol_mid'],
      postprocess: function arrpush(d) {
        return d[0].concat([d[1]]);
      }
    },
    { name: 'symbol_basic$ebnf$2$subexpression$1', symbols: [{ literal: '/' }, 'symbol_piece'] },
    {
      name: 'symbol_basic$ebnf$2',
      symbols: ['symbol_basic$ebnf$2$subexpression$1'],
      postprocess: id
    },
    {
      name: 'symbol_basic$ebnf$2',
      symbols: [],
      postprocess: function() {
        return null;
      }
    },
    {
      name: 'symbol_basic',
      symbols: ['symbol_start', 'symbol_basic$ebnf$1', 'symbol_basic$ebnf$2'],
      postprocess: data => data[0] + data[1].join('') + (data[2] ? data[2].join('') : '')
    },
    { name: 'symbol_start', symbols: ['letter'] },
    { name: 'symbol_start', symbols: [/[*~_!?$%&=<>]/], postprocess: data => data[0] },
    { name: 'symbol_mid', symbols: ['letter'] },
    { name: 'symbol_mid', symbols: ['digit'] },
    { name: 'symbol_mid', symbols: [/[.*\!\-+_?$%&=<>:#]/], postprocess: data => data[0] },
    { name: 'symbol_like_a_num$ebnf$1$subexpression$1$ebnf$1', symbols: [] },
    {
      name: 'symbol_like_a_num$ebnf$1$subexpression$1$ebnf$1',
      symbols: ['symbol_like_a_num$ebnf$1$subexpression$1$ebnf$1', 'symbol_mid'],
      postprocess: function arrpush(d) {
        return d[0].concat([d[1]]);
      }
    },
    {
      name: 'symbol_like_a_num$ebnf$1$subexpression$1',
      symbols: ['symbol_second_special', 'symbol_like_a_num$ebnf$1$subexpression$1$ebnf$1']
    },
    {
      name: 'symbol_like_a_num$ebnf$1',
      symbols: ['symbol_like_a_num$ebnf$1$subexpression$1'],
      postprocess: id
    },
    {
      name: 'symbol_like_a_num$ebnf$1',
      symbols: [],
      postprocess: function() {
        return null;
      }
    },
    {
      name: 'symbol_like_a_num$ebnf$2$subexpression$1',
      symbols: [{ literal: '/' }, 'symbol_piece']
    },
    {
      name: 'symbol_like_a_num$ebnf$2',
      symbols: ['symbol_like_a_num$ebnf$2$subexpression$1'],
      postprocess: id
    },
    {
      name: 'symbol_like_a_num$ebnf$2',
      symbols: [],
      postprocess: function() {
        return null;
      }
    },
    {
      name: 'symbol_like_a_num',
      symbols: [/[\-+.]/, 'symbol_like_a_num$ebnf$1', 'symbol_like_a_num$ebnf$2'],
      postprocess: data =>
        data[0] +
        (data[1] ? data[1][0] + data[1][1].join('') : '') +
        (data[2] ? data[2].join('') : '')
    },
    { name: 'symbol_second_special', symbols: ['symbol_start'] },
    { name: 'symbol_second_special', symbols: [/[\-+.:#]/], postprocess: data => data[0] },
    {
      name: 'Keyword',
      symbols: [{ literal: ':' }, 'Symbol'],
      postprocess: data => ({ type: 'keyword', data: ':' + data[1].data })
    },
    {
      name: 'Character',
      symbols: [{ literal: '\\' }, 'char'],
      postprocess: data => ({ type: 'char', data: data[1][0] })
    },
    { name: 'char', symbols: [/[^ \t\r\n]/] },
    {
      name: 'char$string$1',
      symbols: [
        { literal: 'n' },
        { literal: 'e' },
        { literal: 'w' },
        { literal: 'l' },
        { literal: 'i' },
        { literal: 'n' },
        { literal: 'e' }
      ],
      postprocess: function joiner(d) {
        return d.join('');
      }
    },
    { name: 'char', symbols: ['char$string$1'] },
    {
      name: 'char$string$2',
      symbols: [
        { literal: 'r' },
        { literal: 'e' },
        { literal: 't' },
        { literal: 'u' },
        { literal: 'r' },
        { literal: 'n' }
      ],
      postprocess: function joiner(d) {
        return d.join('');
      }
    },
    { name: 'char', symbols: ['char$string$2'] },
    {
      name: 'char$string$3',
      symbols: [
        { literal: 's' },
        { literal: 'p' },
        { literal: 'a' },
        { literal: 'c' },
        { literal: 'e' }
      ],
      postprocess: function joiner(d) {
        return d.join('');
      }
    },
    { name: 'char', symbols: ['char$string$3'] },
    {
      name: 'char$string$4',
      symbols: [{ literal: 't' }, { literal: 'a' }, { literal: 'b' }],
      postprocess: function joiner(d) {
        return d.join('');
      }
    },
    { name: 'char', symbols: ['char$string$4'] },
    { name: 'char', symbols: ['unicode'], postprocess: data => data[0] },
    { name: 'Number', symbols: ['Integer'] },
    { name: 'Number', symbols: ['Float'], postprocess: data => data[0] },
    {
      name: 'Float',
      symbols: ['float'],
      postprocess: data => ({ type: 'double', data: data[0][0], arbitrary: !!data[0][1] })
    },
    { name: 'Integer$ebnf$1', symbols: [{ literal: 'N' }], postprocess: id },
    {
      name: 'Integer$ebnf$1',
      symbols: [],
      postprocess: function() {
        return null;
      }
    },
    {
      name: 'Integer',
      symbols: ['int', 'Integer$ebnf$1'],
      postprocess: data => ({ type: 'int', data: data[0][0], arbitrary: !!data[1] })
    },
    {
      name: 'float',
      symbols: ['int', { literal: 'M' }],
      postprocess: data => [data.slice(0, 1).join(''), data[1]]
    },
    { name: 'float$ebnf$1', symbols: [{ literal: 'M' }], postprocess: id },
    {
      name: 'float$ebnf$1',
      symbols: [],
      postprocess: function() {
        return null;
      }
    },
    {
      name: 'float',
      symbols: ['int', 'frac', 'float$ebnf$1'],
      postprocess: data => [data.slice(0, 2).join(''), data[2]]
    },
    { name: 'float$ebnf$2', symbols: [{ literal: 'M' }], postprocess: id },
    {
      name: 'float$ebnf$2',
      symbols: [],
      postprocess: function() {
        return null;
      }
    },
    {
      name: 'float',
      symbols: ['int', 'exp', 'float$ebnf$2'],
      postprocess: data => [data.slice(0, 2).join(''), data[2]]
    },
    { name: 'float$ebnf$3', symbols: [{ literal: 'M' }], postprocess: id },
    {
      name: 'float$ebnf$3',
      symbols: [],
      postprocess: function() {
        return null;
      }
    },
    {
      name: 'float',
      symbols: ['int', 'frac', 'exp', 'float$ebnf$3'],
      postprocess: data => [data.slice(0, 3).join(''), data[2]]
    },
    { name: 'frac$ebnf$1', symbols: [] },
    {
      name: 'frac$ebnf$1',
      symbols: ['frac$ebnf$1', 'digit'],
      postprocess: function arrpush(d) {
        return d[0].concat([d[1]]);
      }
    },
    {
      name: 'frac',
      symbols: [{ literal: '.' }, 'frac$ebnf$1'],
      postprocess: data => data[0] + data[1].join('')
    },
    { name: 'exp', symbols: ['ex', 'digits'], postprocess: data => data.join('') },
    { name: 'ex$subexpression$1', symbols: [{ literal: 'e' }] },
    { name: 'ex$subexpression$1', symbols: [{ literal: 'E' }] },
    { name: 'ex$ebnf$1$subexpression$1', symbols: [{ literal: '+' }] },
    { name: 'ex$ebnf$1$subexpression$1', symbols: [{ literal: '-' }] },
    { name: 'ex$ebnf$1', symbols: ['ex$ebnf$1$subexpression$1'], postprocess: id },
    {
      name: 'ex$ebnf$1',
      symbols: [],
      postprocess: function() {
        return null;
      }
    },
    {
      name: 'ex',
      symbols: ['ex$subexpression$1', 'ex$ebnf$1'],
      postprocess: data => 'e' + (data[1] || '+')
    },
    { name: 'int', symbols: ['int_no_prefix'] },
    {
      name: 'int',
      symbols: [{ literal: '+' }, 'int_no_prefix'],
      postprocess: data => data.join('')
    },
    {
      name: 'int',
      symbols: [{ literal: '-' }, 'int_no_prefix'],
      postprocess: data => data.join('')
    },
    { name: 'int_no_prefix', symbols: [{ literal: '0' }], postprocess: data => data.join('') },
    { name: 'int_no_prefix$ebnf$1', symbols: [] },
    {
      name: 'int_no_prefix$ebnf$1',
      symbols: ['int_no_prefix$ebnf$1', 'digit'],
      postprocess: function arrpush(d) {
        return d[0].concat([d[1]]);
      }
    },
    {
      name: 'int_no_prefix',
      symbols: ['oneToNine', 'int_no_prefix$ebnf$1'],
      postprocess: data => data[0] + data[1].join('')
    },
    { name: 'oneToNine', symbols: [/[1-9]/], postprocess: data => data.join('') },
    {
      name: 'MapElem',
      symbols: ['mapKey', 'mapValue'],
      postprocess: data => [[data[0][0], data[1][0]]].concat(data[1].slice(1))
    },
    { name: 'mapKey$subexpression$1', symbols: ['mapKeySpace'] },
    { name: 'mapKey$subexpression$1', symbols: ['mapKeyNoSpace'] },
    { name: 'mapKey', symbols: ['mapKey$subexpression$1'], postprocess: data => data[0] },
    { name: 'mapValue$subexpression$1', symbols: ['mapValueSpace'] },
    { name: 'mapValue$subexpression$1', symbols: ['mapValueNoSpace'] },
    { name: 'mapValue', symbols: ['mapValue$subexpression$1'], postprocess: data => data[0][0] },
    { name: 'mapKeySpace$ebnf$1', symbols: [] },
    { name: 'mapKeySpace$ebnf$1$subexpression$1', symbols: ['Discard', '_'] },
    {
      name: 'mapKeySpace$ebnf$1',
      symbols: ['mapKeySpace$ebnf$1', 'mapKeySpace$ebnf$1$subexpression$1'],
      postprocess: function arrpush(d) {
        return d[0].concat([d[1]]);
      }
    },
    {
      name: 'mapKeySpace',
      symbols: ['mapKeySpace$ebnf$1', 'mapElementSpace', '_'],
      postprocess: data => data[1]
    },
    { name: 'mapKeyNoSpace$ebnf$1', symbols: [] },
    { name: 'mapKeyNoSpace$ebnf$1$subexpression$1$ebnf$1', symbols: ['_'], postprocess: id },
    {
      name: 'mapKeyNoSpace$ebnf$1$subexpression$1$ebnf$1',
      symbols: [],
      postprocess: function() {
        return null;
      }
    },
    {
      name: 'mapKeyNoSpace$ebnf$1$subexpression$1',
      symbols: ['Discard', 'mapKeyNoSpace$ebnf$1$subexpression$1$ebnf$1']
    },
    {
      name: 'mapKeyNoSpace$ebnf$1',
      symbols: ['mapKeyNoSpace$ebnf$1', 'mapKeyNoSpace$ebnf$1$subexpression$1'],
      postprocess: function arrpush(d) {
        return d[0].concat([d[1]]);
      }
    },
    { name: 'mapKeyNoSpace$ebnf$2', symbols: ['_'], postprocess: id },
    {
      name: 'mapKeyNoSpace$ebnf$2',
      symbols: [],
      postprocess: function() {
        return null;
      }
    },
    {
      name: 'mapKeyNoSpace',
      symbols: ['mapKeyNoSpace$ebnf$1', 'mapElementNoSpace', 'mapKeyNoSpace$ebnf$2'],
      postprocess: data => data[1]
    },
    { name: 'mapValueSpace$ebnf$1', symbols: [] },
    { name: 'mapValueSpace$ebnf$1$subexpression$1', symbols: ['Discard', '_'] },
    {
      name: 'mapValueSpace$ebnf$1',
      symbols: ['mapValueSpace$ebnf$1', 'mapValueSpace$ebnf$1$subexpression$1'],
      postprocess: function arrpush(d) {
        return d[0].concat([d[1]]);
      }
    },
    { name: 'mapValueSpace$ebnf$2$subexpression$1', symbols: ['_', 'MapElem'] },
    {
      name: 'mapValueSpace$ebnf$2',
      symbols: ['mapValueSpace$ebnf$2$subexpression$1'],
      postprocess: id
    },
    {
      name: 'mapValueSpace$ebnf$2',
      symbols: [],
      postprocess: function() {
        return null;
      }
    },
    {
      name: 'mapValueSpace',
      symbols: ['mapValueSpace$ebnf$1', 'mapElementSpace', 'mapValueSpace$ebnf$2'],
      postprocess: data => [data[1]].concat(data[2] ? data[2][1] : [])
    },
    { name: 'mapValueNoSpace$ebnf$1', symbols: [] },
    { name: 'mapValueNoSpace$ebnf$1$subexpression$1$ebnf$1', symbols: ['_'], postprocess: id },
    {
      name: 'mapValueNoSpace$ebnf$1$subexpression$1$ebnf$1',
      symbols: [],
      postprocess: function() {
        return null;
      }
    },
    {
      name: 'mapValueNoSpace$ebnf$1$subexpression$1',
      symbols: ['Discard', 'mapValueNoSpace$ebnf$1$subexpression$1$ebnf$1']
    },
    {
      name: 'mapValueNoSpace$ebnf$1',
      symbols: ['mapValueNoSpace$ebnf$1', 'mapValueNoSpace$ebnf$1$subexpression$1'],
      postprocess: function arrpush(d) {
        return d[0].concat([d[1]]);
      }
    },
    { name: 'mapValueNoSpace$ebnf$2$subexpression$1$ebnf$1', symbols: ['_'], postprocess: id },
    {
      name: 'mapValueNoSpace$ebnf$2$subexpression$1$ebnf$1',
      symbols: [],
      postprocess: function() {
        return null;
      }
    },
    {
      name: 'mapValueNoSpace$ebnf$2$subexpression$1',
      symbols: ['mapValueNoSpace$ebnf$2$subexpression$1$ebnf$1', 'MapElem']
    },
    {
      name: 'mapValueNoSpace$ebnf$2',
      symbols: ['mapValueNoSpace$ebnf$2$subexpression$1'],
      postprocess: id
    },
    {
      name: 'mapValueNoSpace$ebnf$2',
      symbols: [],
      postprocess: function() {
        return null;
      }
    },
    {
      name: 'mapValueNoSpace',
      symbols: ['mapValueNoSpace$ebnf$1', 'mapElementNoSpace', 'mapValueNoSpace$ebnf$2'],
      postprocess: data => [data[1]].concat(data[2] ? data[2][1] : [])
    },
    { name: 'mapElementNoSpace$subexpression$1', symbols: ['Vector'] },
    { name: 'mapElementNoSpace$subexpression$1', symbols: ['List'] },
    { name: 'mapElementNoSpace$subexpression$1', symbols: ['String'] },
    { name: 'mapElementNoSpace$subexpression$1', symbols: ['Map'] },
    { name: 'mapElementNoSpace$subexpression$1', symbols: ['Set'] },
    {
      name: 'mapElementNoSpace',
      symbols: ['mapElementNoSpace$subexpression$1'],
      postprocess: data => data[0][0]
    },
    { name: 'mapElementSpace$subexpression$1', symbols: ['Number'] },
    { name: 'mapElementSpace$subexpression$1', symbols: ['Character'] },
    { name: 'mapElementSpace$subexpression$1', symbols: ['Reserved'] },
    { name: 'mapElementSpace$subexpression$1', symbols: ['Symbol'] },
    { name: 'mapElementSpace$subexpression$1', symbols: ['Keyword'] },
    { name: 'mapElementSpace$subexpression$1', symbols: ['Tag'] },
    {
      name: 'mapElementSpace',
      symbols: ['mapElementSpace$subexpression$1'],
      postprocess: data => [].concat(...[data[0][0]])[0]
    },
    { name: 'hexDigit', symbols: [/[a-fA-F0-9]/], postprocess: data => data[0] },
    {
      name: 'unicode',
      symbols: [{ literal: 'u' }, 'hexDigit', 'hexDigit', 'hexDigit', 'hexDigit'],
      postprocess: data => String.fromCharCode(parseInt(data.slice(1).join(''), 16))
    },
    { name: '_', symbols: ['space'], postprocess: data => data[0] },
    { name: 'space$ebnf$1', symbols: [/[\s,\n]/] },
    {
      name: 'space$ebnf$1',
      symbols: ['space$ebnf$1', /[\s,\n]/],
      postprocess: function arrpush(d) {
        return d[0].concat([d[1]]);
      }
    },
    { name: 'space', symbols: ['space$ebnf$1'], postprocess: data => data[0].join('') },
    { name: 'digits$ebnf$1', symbols: ['digit'] },
    {
      name: 'digits$ebnf$1',
      symbols: ['digits$ebnf$1', 'digit'],
      postprocess: function arrpush(d) {
        return d[0].concat([d[1]]);
      }
    },
    { name: 'digits', symbols: ['digits$ebnf$1'], postprocess: data => data[0].join('') },
    { name: 'digit', symbols: [/[0-9]/], postprocess: data => data[0] },
    { name: 'letter', symbols: [/[a-zA-Z]/], postprocess: data => data[0] }
  ],
  ParserStart: 'Main'
};

// Do the parsing
import { Parser, Grammar } from 'nearley';
import { preprocess } from './preprocessor';

export function parse(string: string) {
  const parser = new Parser(Grammar.fromCompiled(grammar));
  const str = preprocess(string);
  if (!str) return null;
  try {
    return parser.feed(preprocess(string)).results[0];
  } catch {
    return false;
  }
}
