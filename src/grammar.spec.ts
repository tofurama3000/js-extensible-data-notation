import { parse } from './grammar';

describe('grammar', () => {
  it('can parse integers', () => {
    expect(parse('1')).toBeTruthy();
    expect(parse('0')).toBeTruthy();
    expect(parse('10')).toBeTruthy();
    expect(parse('01')).toBeFalsy();
    expect(parse('+1')).toBeTruthy();
    expect(parse('+0')).toBeTruthy();
    expect(parse('+13')).toBeTruthy();
    expect(parse('+03')).toBeFalsy();
    expect(parse('-1')).toBeTruthy();
    expect(parse('-0')).toBeTruthy();
    expect(parse('-13')).toBeTruthy();
    expect(parse('-03')).toBeFalsy();
    expect(parse('1 e')).toBeTruthy();

    expect(parse('1N')).toBeTruthy();
    expect(parse('0N')).toBeTruthy();
    expect(parse('10N')).toBeTruthy();
    expect(parse('01N')).toBeFalsy();
    expect(parse('+1N')).toBeTruthy();
    expect(parse('+0N')).toBeTruthy();
    expect(parse('+13N')).toBeTruthy();
    expect(parse('+03N')).toBeFalsy();
    expect(parse('-1N')).toBeTruthy();
    expect(parse('-0N')).toBeTruthy();
    expect(parse('-13N')).toBeTruthy();
    expect(parse('-03N')).toBeFalsy();
  });

  it('can parse reserved keywords', () => {
    expect(parse('true')).toBeTruthy();
    expect(parse('false')).toBeTruthy();
    expect(parse('nil')).toBeTruthy();
  });

  it('can parse symbols', () => {
    expect(parse('hello')).toBeTruthy();
    expect(parse('hello/world')).toBeTruthy();
    expect(parse('hello/my/world')).toBeFalsy();
    expect(parse('/')).toBeTruthy();
    expect(parse('<')).toBeTruthy();
    expect(parse('!')).toBeTruthy();
    expect(parse('.<!$/$%h:ello')).toBeTruthy();
    expect(parse('.<!$/$%/h:ello')).toBeFalsy();
  });

  it('can parse keywords', () => {
    expect(parse(':hello')).toBeTruthy();
    expect(parse(':hello/world')).toBeTruthy();
    expect(parse(':hello/my/world')).toBeFalsy();
    expect(parse(':/')).toBeTruthy();
    expect(parse(':<')).toBeTruthy();
    expect(parse(':!')).toBeTruthy();
    expect(parse(':.<!$$%/hello')).toBeTruthy();
    expect(parse(':.<!$/$%/hello')).toBeFalsy();
  });

  it('can parse characters', () => {
    expect(parse('\\c')).toBeTruthy();
    expect(parse('\\2')).toBeTruthy();
    expect(parse('\\+')).toBeTruthy();
    expect(parse('\\u')).toBeTruthy();
    expect(parse('\\newline')).toBeTruthy();
    expect(parse('\\space')).toBeTruthy();
    expect(parse('\\return')).toBeTruthy();
    expect(parse('\\tab')).toBeTruthy();
    expect(parse('\\tab \\tab')).toBeTruthy();
    expect(parse('\\u10A4')).toBeTruthy();
    expect(parse('\\u10a4')).toBeTruthy();
    expect(parse('\\ret')).toBeFalsy();
    expect(parse('\\returns')).toBeFalsy();
    expect(parse('\\return0')).toBeFalsy();
    expect(parse('\\u10')).toBeFalsy();
    expect(parse('\\u10A42')).toBeFalsy();
    expect(parse('\\u10A4b')).toBeFalsy();
    expect(parse('\\u10X4')).toBeFalsy();
  });

  it('can parse strings', () => {
    expect(parse('""')).toBeTruthy();
    expect(parse('"abc"')).toBeTruthy();
    expect(parse('"abc1 23"')).toBeTruthy();
    expect(parse('"ab\\"c 123"')).toBeTruthy();
    expect(parse('"ab\\tc 123"')).toBeTruthy();
    expect(parse('"ab\n\\tc\n 123"')).toBeTruthy();
    expect(parse('"ab\n\\rc\n 123"')).toBeTruthy();
    expect(parse('"ab\n\\nc\n 123"')).toBeTruthy();
    expect(parse('"ab\n\\\\c\n 123"')).toBeTruthy();
    expect(parse('"ab\n\\u013Ac\n 123"')).toBeTruthy();
    expect(parse('"ab\n\\uZ13Ac\n 123"')).toBeFalsy();
    expect(parse('"ab\n\\zZ13Ac\n 123"')).toBeFalsy();
  });

  it('can parse floating-points', () => {
    expect(parse('1M')).toBeTruthy();
    expect(parse('0M')).toBeTruthy();
    expect(parse('1.')).toBeTruthy();
    expect(parse('0.')).toBeTruthy();
    expect(parse('1.3')).toBeTruthy();
    expect(parse('0.4')).toBeTruthy();
    expect(parse('0.0')).toBeTruthy();
    expect(parse('0e0')).toBeTruthy();
    expect(parse('0e')).toBeFalsy();
    expect(parse('10e+2')).toBeTruthy();
    expect(parse('01e+2')).toBeFalsy();
    expect(parse('+1e+2')).toBeTruthy();
    expect(parse('+0e+2')).toBeTruthy();
    expect(parse('+13E-3')).toBeTruthy();
    expect(parse('+03E+2')).toBeFalsy();
    expect(parse('-1E2')).toBeTruthy();
    expect(parse('-0e+2')).toBeTruthy();
    expect(parse('-13e-2')).toBeTruthy();
    expect(parse('-03E+2')).toBeFalsy();
  });

  it('can parse lists', () => {
    expect(parse('()')).toBeTruthy();
    expect(parse('(1,2)')).toBeTruthy();
    expect(parse('(1 2)')).toBeTruthy();
    expect(parse('(1 2 3)')).toBeTruthy();
    expect(parse('(1, 2,3)')).toBeTruthy();
    expect(parse('(1 abc 3)')).toBeTruthy();
    expect(parse('(1 (4 5 6) 3)')).toBeTruthy();
  });

  it('can parse tags', () => {
    expect(parse('#inst "1985-04-12T23:20:50.52Z"')).toBeTruthy();
    expect(parse('#uuid "f81d4fae-7dec-11d0-a765-00a0c91e6bf6"')).toBeTruthy();
  });

  it('passes nearley tests', () => {
    expect(parse('#{23 232 2333 [2] [3]}')).toBeTruthy();
    expect(parse('[,,]#{ { ,, 0, ,\\_,[] true 0, 0N }}')).toBeTruthy();
    expect(parse('(,,)#{ { ,, 0, ,\\_,[] true 0, 0N }}')).toBeTruthy();
    expect(parse('\\E "\'"{  "":V}')).toBeTruthy();
    expect(parse('"\\"XNS\\t"')).toBeTruthy();
    expect(parse('+.WP/.Ir_B."\\t"')).toBeTruthy();
    expect(parse('"~2"{,+0 [,,,],,  .+/W7E,,\\tab,/,[]\\tab,[ ],}')).toBeTruthy();
    expect(parse('{,+0 [,,,],,  .+/W7E,,\\tab,/,[]\\tab,[ ],}')).toBeTruthy();
    expect(parse('()')).toBeTruthy();
    expect(parse('\\u46a1')).toBeTruthy();
    expect(parse('-3025N,( -,) , ,18')).toBeTruthy();
    expect(parse('2.96E73')).toBeTruthy();
    expect(parse('"T"')).toBeTruthy();
    expect(parse('!9')).toBeTruthy();
    expect(parse('""')).toBeTruthy();
    expect(parse('[#{ #{},}    "" ,,]')).toBeTruthy();
    expect(parse('()\\F')).toBeTruthy();
    expect(parse('\\u9311')).toBeTruthy();
    expect(parse('nil,\\space()')).toBeTruthy();
    expect(parse('{:/,  ,nil,\\e \\a, }')).toBeTruthy();
    expect(parse('\\newline')).toBeTruthy();
    expect(parse('[], :. \\udF4E#{   ,}')).toBeTruthy();
    expect(parse(':m>=8')).toBeTruthy();
    expect(parse('\\return')).toBeTruthy();
    expect(parse('#{,}""(vM#{   ""} { []\\newline,0, /  0 ,   ()}  , )   ,/')).toBeTruthy();
    expect(parse(':/')).toBeTruthy();
    expect(parse('.+/~')).toBeTruthy();
    expect(parse('+8037{}{[,  0[]],"\\\\a!W"[0, ]()";",/}')).toBeTruthy();
    expect(parse('{,, ,}')).toBeTruthy();
    expect(parse(':-{,  ,}')).toBeTruthy();
    expect(parse('*{,,}()')).toBeTruthy();
    expect(parse('nil#{,(:/)}[]')).toBeTruthy();
    expect(parse('#{,,, }#{"" },:-?5')).toBeTruthy();
    expect(parse('""#{}\\return,,, \\a[{}:wF/+.({}) \\tab,  (  [],,), ,]')).toBeTruthy();
    expect(
      parse(
        'true((,"",)+7.M,  ( ),"y9",(#{} 0N  ,)(-/Y, ,,\\T#{},,)(  true ,) (\\space  :--/.O)[() , ,]) , :-'
      )
    ).toBeTruthy();
    expect(parse('+35')).toBeTruthy();
    expect(parse('#hello/worlds 233')).toBeTruthy();
    expect(
      parse(`1
    2[
    hello
    ]`)
    ).toBeTruthy();
    expect(
      parse(`; hello
    ; k
    ; k
    1`)
    ).toBeTruthy();
    expect(
      parse(`[]; hello
    there`)
    ).toBeTruthy();
    expect(parse('#_ 12')).toBeTruthy();
    expect(parse('"ab\\n\\\\tc\\n 123"')).toBeTruthy();
    expect(parse('"ab\\n\\\\tc\\n 123"')).toBeTruthy();
    expect(parse('')).toBeNull();
    expect(parse(';')).toBeNull();
  });
});
