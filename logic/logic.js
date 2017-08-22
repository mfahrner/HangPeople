
// sets initial underscored word
function wordUnderScorer(word) {
  let underScoredWord = '';
  for (let i = 0; i < word.length; i++) {
    underScoredWord += '_';
  }
  return underScoredWord;
}

// updates word following guess
function guessChecker(guess, word, display, guessesRemain) {
  let displayBuilder = '';
  let guessNumber = guessesRemain;
  for (let i = 0; i < word.length; i++) {
    if (word[i] === guess) {
      displayBuilder += guess.toUpperCase();
    } else {
      displayBuilder += display[i];
    }
  }
  if (displayBuilder === display) {
    guessNumber = updateGuessNumber(guessesRemain);
  }
  return { display: displayBuilder, remainingGuesses: guessNumber,};
}

// removes guess from possible guess array
function guessRemove(guess, unused) {
  for(let i = 0; i < unused.length; i++) {
    if (guess === unused[i]) {
      unused.splice(i, 1);
    }
  }
  return unused;
}

// checks for a duplicate guess
function duplicateGuess(guess, alreadyGuessed) {
  for (let i = 0; i < alreadyGuessed.length; i++) {
    if (guess === alreadyGuessed[i]) {
      return true;
    }
  }
  return false;
}

function updateGuessNumber(number) {
  return number - 1;
}

module.exports = {
  duplicate: duplicateGuess,
  remove: guessRemove,
  check: guessChecker,
  underScore: wordUnderScorer,
}
