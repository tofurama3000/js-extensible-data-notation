export function unescapeChar(str: string): string {
  if (!str.length) {
    return '\\';
  }
  const char = str[0];
  const rest = str.substr(1);
  switch (char.toLowerCase()) {
    case 'n':
      return `\n${rest}`;
    case 'r':
      return `\r${rest}`;
    case 't':
      return `\t${rest}`;
    case '\\':
      return `\\${rest}`;
    case "'":
      return `\'${rest}`;
    case '"':
      return `"${rest}`;
    case 'b':
      return `\b${rest}`;
    case 'f':
      return `\f${rest}`;
    default:
      return str;
  }
}

export function unescapeStr(str: string): string {
  const parts = str.split('\\');
  return parts.map((p, i) => (i ? unescapeChar(p) : p)).join('');
}
