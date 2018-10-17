export const preprocess = (str: string) => removeComments(str).trim();

function removeComments(str: string) {
  let newStr = '';
  let inQuotes = false;
  let inComment = false;
  let skip = false;
  for (const c of str) {
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
      if (c === '\\') skip = true;
      else if (c === '"') inQuotes = !inQuotes;
    }
  }
  return newStr;
}
