# text-readability-ts
This module provides a set of functions to calculate various readability scores for a given text. These scores can be used to estimate the reading difficulty level of the text include TypeScript.

The rewrite of the original [text-readability](https://github.com/clearnote01/readability) module in JavaScript.

## Installation
```bash
npm install text-readability-ts
```
or
```bash
yarn add text-readability-ts
```

## Usage
```typescript
import readability from 'text-readability-ts';

const text = 'This is a sample text.';
const score = readability.fleschKincaidReadingEase(text);
console.log(score);

const grade = readability.textStandard(text);
console.log(grade);
```

## Available Functions
- `getGradeSuffix(grade: number):` Returns the grade suffix of the given grade.
- `charCount(text: string, ignoreSpaces: boolean = true):` Returns the character count of the given text.
- `letterCount(text: string, ignoreSpaces: boolean = true):` Returns the letter count of the given text.
- `removePunctuation(text: string):` Removes punctuation from the given text.
- `split(text: string):` Splits the given text into an array of strings.
- `lexiconCount(text: string, removePunctuation: boolean = true):` Calculates the number of words present in the text.
- `syllableCount(text: string, lang: string = 'en-US'):` Returns the number of syllables present in the given text.
- `sentenceCount(text: string):` Returns the number of sentences present in the given text.
- `averageSentenceLength(text: string):` Returns the average sentence length of the given text.
- `averageSyllablePerWord(text: string):` Returns the average syllable per word of the given text.
- `averageCharacterPerWord(text: string):` Returns the average character per word of the given text.
- `averageLetterPerWord(text: string):` Returns the average letter per word of the given text.
- `averageSentencePerWord(text: string):` Returns the average sentence per word of the given text.
- `fleschReadingEase(text: string):` Returns the Flesch Reading Ease Score.
- `fleschReadingEaseToGrade(score: number):` Returns the grade level of the text using the Flesch Reading Ease Score.
- `fleschKincaidGrade(text: string):` Returns the Flesch-Kincaid Grade of the given text.
- `polySyllableCount(text: string):` Returns the polysyllable count of the given text.
- `smogIndex(text: string):` Returns the SMOG index of the given text.
- `colemanLiauIndex(text: string):` Returns the grade level of the text using the Coleman-Liau Formula.
- `automatedReadabilityIndex(text: string):` Returns the ARI (Automated Readability Index) of the given text.
- `linsearWriteFormula(text: string):` Returns the grade level using the Linsear Write Formula.
- `presentTense(word: string):` Returns the present tense of the given word.
- `difficultWords(text: string, syllableThreshold: number = 2):` Returns the number of difficult words in the given text.
- `daleChallReadabilityScore(text: string):` Returns the New Dale-Chall Formula score of the given text.
- `daleChallToGrade(score: number):` Returns the grade level using the New Dale-Chall Formula.
- `gunningFog(text: string):` Returns the FOG index of the given text.
- `lix(text: string):` Returns the LIX of the given text.
- `rix(text: string):` Returns the RIX of the given text.
- `textStandard(text: string, floatOutput: boolean | null = null):` Based upon all the above tests, returns the estimated school grade level required to understand the text.
- `textMedian(text: string):` Returns the median grade level of the given text.
