Main -> EDN null {% data => data[0] %}
EDN -> Exp {% data => data[0] %}
Exp -> (ElementSpace | ElementNoSpace) {% data => [].concat(...data[0]) %}
_Exp -> __exp | __char {% (data) => data[0] %}
__exp -> _ Exp {% data => data[1] %}
__char -> Character (_Exp | ElementNoSpace):? {% data => [].concat(...[data[0]].concat(data[1] ? [].concat(...data[1]) : [])) %}
ElementSpace -> (Number | Character | Reserved | Symbol | Keyword | Tag | Discard) (_Exp | ElementNoSpace):? {% data => [].concat(...[data[0][0]].concat(data[1] ? [].concat(...data[1]) : [])) %}
ElementNoSpace -> mapElementNoSpace (_:? Exp):? {% data => [data[0]].concat(data[1] ? data[1][1] : []) %}
Element -> (Number | Character | Reserved | Symbol | Keyword | Vector | List | String | Map | Set) {% data => data[0][0] %}

# Collections
Vector -> "[" _:? (Exp _:?):? "]" {% data => ({type: 'vector', data: (data[2] ? data[2][0] : [])}) %}
List -> "(" _:? (Exp _:?):? ")" {% data => ({type: 'list', data: (data[2] ? data[2][0] : [])}) %}
Map -> "{" _:? (MapElem _:?):? "}" {% data => ({type: 'map', data: (data[2] ? data[2][0] : [])}) %}
Set -> "#{" _:? (Exp _:?):? "}" {% data => ({type: 'set', data: (data[2] ? data[2][0] : [])}) %}

# Tag
Tag -> "#" Symbol _ Element {% (data, _l, reject) => {
	if (data[1].data[0] === "_") return reject;
	return {type: 'tag', tag: data[1].data, data: data[3]};
}%}

# Discard
Discard -> "#_" _:? Element {% () => ({type: 'discard'}) %}

# Strings
String -> "\"" string_char:* "\"" {% data => ({type: 'string', data: data[1].join('')}) %}
string_char -> [^\\"] | backslash | backslash_unicode {% id %}
backslash -> "\\" ["trn\\] {% data => data.join('') %}
backslash_unicode -> "\\" unicode {% data => data[1] %}

# Reserved (bools, nil)
Reserved -> (boolean | nil) {% data => data[0][0] %}
boolean -> (true | false) {% data => data[0][0] %}
true -> "true" {% () => ({type: "bool", data: true}) %}
false -> "false" {% () => ({type: "bool", data: false}) %}
nil -> "nil" {% () => ({type: "nil", data: null}) %}

# Symbol
Symbol -> (symbol | "/") {% (data, _, reject) => {
	if (data[0][0] === "true" || data[0][0] === "false" || data[0][0] === "nil")
		return reject
	return {type: 'symbol', data: data[0][0]}
}%}
symbol -> symbol_piece ("/" symbol_piece):? {% data => data[0] + (data[1] ? data[1].join('') : '') %}
symbol_piece -> symbol_piece_basic | symbol_piece_num {% id %}
symbol_piece_basic -> symbol_start symbol_mid:* {% data => data[0] + data[1].join('') %}
symbol_piece_num -> [\-+.] (symbol_second_special symbol_mid:*):? {% data => data[0] + (data[1] ? (data[1][0] + data[1][1].join('')) : '') %}

symbol_basic -> symbol_start symbol_mid:* ("/" symbol_piece):? {% data => data[0] + data[1].join('') + (data[2] ? data[2].join('') : '') %}
symbol_start -> letter | [*~_!?$%&=<>] {% data => data[0] %}
symbol_mid -> letter | digit | [.*\!\-+_?$%&=<>:#] {% data => data[0] %}
symbol_like_a_num -> [\-+.] (symbol_second_special symbol_mid:*):? ("/" symbol_piece):? {%
	data => data[0] + (data[1] ? (data[1][0] + data[1][1].join('')) : '') + (data[2] ? data[2].join('') : '')
%}
symbol_second_special -> symbol_start | [\-+.:#] {% data => data[0] %}

# Keyword
Keyword -> ":" Symbol {% data => ({type: 'keyword', data: ":" + data[1].data}) %}

# Characters
Character -> "\\" char {% data => ({type: 'char', data: data[1][0]}) %}
char -> [^ \t\r\n] | "newline" | "return" | "space" | "tab" | unicode {% data => data[0] %}

# Numbers
Number -> Integer | Float {% data => data[0] %}
Float -> float {% (data) => ({type: 'double', data: data[0][0], arbitrary: !!data[0][1]}) %}
Integer -> int "N":? {% (data) => ({type: 'int', data: data[0][0], arbitrary: !!data[1]}) %}
float ->
	  int "M" {% (data) => [data.slice(0,1).join(''), data[1]] %}
	| int frac "M":? {% (data) => [data.slice(0,2).join(''), data[2]] %}
	| int exp "M":? {% (data) => [data.slice(0,2).join(''), data[2]] %}
	| int frac exp "M":? {% (data) => [data.slice(0,3).join(''), data[2]] %}
frac -> "." digit:* {% (data) => data[0] + data[1].join('') %}
exp -> ex digits {% (data) => data.join('') %}
ex -> ("e" | "E") ("+" | "-"):? {% data => "e" + (data[1] || "+") %}
int -> int_no_prefix
	| "+" int_no_prefix {% (data) => data.join('') %}
	| "-" int_no_prefix {% (data) => data.join('') %}
int_no_prefix ->
	"0"  {% (data) => data.join('') %}
	| oneToNine digit:* {% (data) => data[0] + data[1].join('') %}
oneToNine -> [1-9] {% (data) => data.join('') %}

# Map

MapElem -> mapKey mapValue  {% data => [[data[0][0], data[1][0]]].concat(data[1].slice(1)) %}

mapKey -> (mapKeySpace | mapKeyNoSpace) {% data => data[0] %}
mapValue -> (mapValueSpace | mapValueNoSpace) {% data => data[0][0] %}

mapKeySpace -> (Discard _):* mapElementSpace _ {% data => data[1] %}
mapKeyNoSpace -> (Discard _:?):* mapElementNoSpace _:? {% data => data[1] %}

mapValueSpace -> (Discard _):* mapElementSpace (_ MapElem):? {% data => [data[1]].concat(data[2] ? data[2][1] : []) %}
mapValueNoSpace -> (Discard _:?):* mapElementNoSpace (_:? MapElem):? {% data => [data[1]].concat(data[2] ? data[2][1] : []) %}
mapElementNoSpace -> (Vector | List | String | Map | Set) {% data => data[0][0] %}
mapElementSpace -> (Number | Character | Reserved | Symbol | Keyword | Tag) {% data => [].concat(...[data[0][0]])[0] %}

# Shared
hexDigit -> [a-fA-F0-9] {% (data) => data[0] %}
unicode -> "u" hexDigit hexDigit hexDigit hexDigit {% data => String.fromCharCode(parseInt(data.slice(1).join(''),16)) %}
_ -> space {% (data) => data[0] %}
space -> [\s,\n]:+ {% (data) => data[0].join('') %}
digits -> digit:+ {% (data) => data[0].join('') %}
digit -> [0-9] {% (data) => data[0] %}
letter -> [a-zA-Z] {% data => data[0] %}