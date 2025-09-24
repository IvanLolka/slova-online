const forbiddenEndings = ['ь', 'ъ', 'ы', 'й'];

function isValidWord(word, lastWord) {
  if (!lastWord) return true;
  const lastChar = lastWord[lastWord.length - 1]?.toLowerCase();
  let startChar = word[0].toLowerCase();
  if (forbiddenEndings.includes(lastChar)) {
    const secondLastChar = lastWord[lastWord.length - 2]?.toLowerCase();
    return startChar === secondLastChar;
  }
  return startChar === lastChar;
}
function isUnique(word, history) {
  return !history.includes(word.toLowerCase());
}