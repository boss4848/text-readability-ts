declare global {
  interface Math {
    copySign(x: number, y: number): number;
    legacyRound(number: number, points?: number): number;
  }
}

declare class Readability {
  static getGradeSuffix(grade: number): string;
  /**
   * Returns the character count of the given text.
   * @param {string} text - The text to count the characters of.
   * @param {boolean} [ignoreSpaces=true] - Whether to ignore spaces.
   * @returns {number} The character count.
   * @example
   * charCount('Hello, world!'); // 12
   * charCount('Hello, world!', false); // 13
   * charCount('Hello, world!', true); // 12
  */
  charCount(text: string, ignoreSpaces?: boolean): number;

  /**
   * Returns the letter count of the given text.
   * @param {string} text - The text to count the letters of.
   * @param {boolean} [ignoreSpaces=true] - Whether to ignore spaces.
   * @returns {number} The letter count.
   */
  letterCount(text: string, ignoreSpaces?: boolean): number;

  /**
  * Removes punctuation from the given text.
  * @param {string} text - The text to remove punctuation from.
  * @returns {string} The text without punctuation.
  * @example
  */
  removePunctuation(text: string): string;
  /**
  * Calculates the number of words present in the text. Optional removePunctuation specifies whether we need to take punctuation symbols into account while counting lexicons. Default value is true, which removes the punctuation before counting lexicon items.
  * @param {string} text - The text to count the words of.
  * @param {boolean} [removePunctuation=true] - Whether to ignore punctuation.
  * @returns {number} The word count.
  */

  static split(text: string): string[];

  lexiconCount(text: string, removePunctuation?: boolean): number;

  /**
   * Returns the number of syllables present in the given text.
   * @param {string} text - The text to count the syllables of.
   * @param {string} [lang='en-US'] - The language of the text.
   * @returns {number} The syllable count.
   */
  syllableCount(text: string, lang?: string): number;

  /**
   * Returns the number of sentences present in the given text.
   * @param {string} text - The text to count the sentences of.
   * @returns {number} The sentence count.
   */
  sentenceCount(text: string): number;

  /**
   * Returns the average sentence length of the given text.
   * @param {string} text - The text to calculate the average sentence length of.
   * @returns {number} The average sentence length.
   */
  averageSentenceLength(text: string): number;

  /**
   * Returns the average syllable per word of the given text.
   * @param {string} text - The text to calculate the average syllable per word of.
   * @returns {number} The average syllable per word.
   */
  averageSyllablePerWord(text: string): number;

  /**
  * Returns the average character per word of the given text.
  * @param {string} text - The text to calculate the average character per word of.
  * @returns {number} The average character per word.
  */
  averageCharacterPerWord(text: string): number;

  /**
  * Returns the average letter per word of the given text.
  * @param {string} text - The text to calculate the average letter per word of.
  * @returns {number} The average letter per word.
  */
  averageLetterPerWord(text: string): number;

  /**
   * Returns the average sentence per word of the given text.
   * @param {string} text - The text to calculate the average sentence per word of.
   * @returns {number} The average sentence per word.
   */
  averageSentencePerWord(text: string): number;

  /**
   * Returns the Flesch Reading Ease Score.
   * @param {string} text - The text to calculate the score of.
   * @returns {number} The Flesch Reading Ease Score.
   */
  fleschReadingEase(text: string): number;

  fleschReadingEaseToGrade(score: number): number;

  /**
   * Returns the Flesch-Kincaid Grade of the given text.
   * @param {string} text - The text to calculate the grade of.
   * @returns {number} The Flesch-Kincaid Grade.
   */
  fleschKincaidGrade(text: string): number;

  /**
   * Returns the polysyllable count of the given text.
   * @param {string} text - The text to calculate the polysyllable count of.
   * @returns {number} The polysyllable count.
   */
  polySyllableCount(text: string): number;

  /**
   * Returns the SMOG index of the given text.
   * @param {string} text - The text to calculate the SMOG index of.
   * @returns {number} The SMOG index.
   */
  smogIndex(text: string): number;

  /**
   * Returns the grade level of the text using the Coleman-Liau Formula.
   * @param {string} text - The text to calculate the grade level of.
   * @returns {number} The grade level.
   */
  colemanLiauIndex(text: string): number;

  /**
   * Returns the ARI (Automated Readability Index) of the given text.
   * @param {string} text - The text to calculate the ARI of.
   * @returns {number} The ARI.
   */
  automatedReadabilityIndex(text: string): number;

  /**
   * Returns the grade level using the Linsear Write Formula.
   * @param {string} text - The text to calculate the grade level of.
   * @returns {number} The grade level.
   */
  linsearWriteFormula(text: string): number;

  /**
   * Returns the present tense of the given word.
   * @param {string} word - The word to get the present tense of.
   * @returns {string} The present tense.
   * @example
   * presentTense('running'); // 'run'
   * presentTense('swimming'); // 'swim'
   * presentTense('eating'); // 'eat'
   */
  presentTense(word: string): string;

  /**
   * Returns the number of difficult words in the given text.
   * @param {string} text - The text to count the difficult words of.
   * @param {number} [syllableThreshold=2] - The syllable threshold.
   * @returns {number} The number of difficult words.
   */
  difficultWords(text: string, syllableThreshold?: number): number;

  /**
   * Returns the New Dale-Chall Formula score of the given text.
   * @param {string} text - The text to calculate the score of.
   * @returns {number} The score.
   */
  daleChallReadabilityScore(text: string): number;


  /**
   * Returns the grade level using the New Dale-Chall Formula.
   * @param {string} text - The text to calculate the grade level of.
   * @returns {number} The grade level.
   */
  daleChallToGrade(score: number): number;

  /**
   * Returns the FOG index of the given text.
   * @param {string} text - The text to calculate the FOG index of.
   * @returns {number} The FOG index.
   */
  gunningFog(text: string): number;

  /**
   * Returns the LIX of the given text.
   * @param {string} text - The text to calculate the LIX of.
   * @returns {number} The LIX.
   */
  lix(text: string): number;

  /**
   * Returns the RIX of the given text.
   * @param {string} text - The text to calculate the RIX of.
   * @returns {number} The RIX.
   */
  rix(text: string): number;

  /**
   * Based upon all the above tests, returns the estimated school grade level required to understand the text.
   * @param {string} text - The text to calculate the grade level of.
   * @param {boolean} [float_output=false] - Whether to return the score as a float.
   * @returns {number|string} The grade level.
   */
  textStandard(text: string, floatOutput?: boolean): string | number;

  /**
   * Returns the median grade level of the given text.
   * @param {string} text - The text to calculate the median grade level of.
   * @returns {number} The median grade level.
   */
  textMedian(text: string): number;
}

declare const readability: Readability;

export { readability as default };
