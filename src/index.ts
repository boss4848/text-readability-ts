import pluralize from 'pluralize';
import syllable from 'syllable';

// const syllable = require('syllable');
// const plural = require('pluralize');

import easyWords from '../data/easy_words';

const punctuationRE: RegExp = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-./:;<=>?@[\]^_`{|}~]/g;
const easyWordSet: Set<string> = new Set(easyWords);

declare global {
    interface Math {
        copySign(x: number, y: number): number;
        legacyRound(number: number, points?: number): number;
    }
}

Math.copySign = (x: number, y: number): number => {
    return x * (y / Math.abs(y));
};

Math.legacyRound = (number: number, points: number = 0): number => {
    const p: number = 10 ** points;
    // return float(math.floor((number * p) + math.copysign(0.5, number))) / p
    return Math.floor((number * p) + Math.copySign(0.5, number)) / p;
};

class Readability {
    static getGradeSuffix(grade: number): string {
        grade = Math.floor(grade);
        // poor function fix this, gives { 22th and 23th grade }
        const gradeMap: Record<number, string> = {
            1: 'st',
            2: 'nd',
            3: 'rd',
        };
        return gradeMap[grade] ? gradeMap[grade] : 'th';
    }
    charCount(text: string, ignoreSpaces: boolean = true): number {
        if (ignoreSpaces) text = text.replace(/ /g, '');
        return text.length;
    }
    letterCount(text: string, ignoreSpaces: boolean = true): number {
        if (ignoreSpaces) text = text.replace(/ /g, '');
        return this.removePunctuation(text).length;
    }
    removePunctuation(text: string): string {
        text = text.replace(punctuationRE, '');
        return text;
    }
    static split(text: string): string[] {
        // text = text.split(/,| |\n|\r/g);
        // text = text.filter(n => n);
        return text.split(/,| |\n|\r/g).filter(n => n);
    }
    lexiconCount(text: string, removePunctuation: boolean = true): number {
        if (removePunctuation) text = this.removePunctuation(text);
        // text = text.split(/,| |\n|\r/g);
        // text = text.filter(n => n);
        return text.split(/,| |\n|\r/g).filter(n => n).length;
    }
    syllableCount(text: string, lang: string = 'en-US'): number {
        text = text.toLocaleLowerCase(lang);
        text = this.removePunctuation(text);
        if (!text) return 0;
        // eventually replace syllable
        const count = syllable(text);
        return count;
    }
    sentenceCount(text: string): number {
        let ignoreCount: number = 0;
        let sentences: string[] = text.split(/ *[.?!]['")\]]*[ |\n](?=[A-Z])/g);
        for (let sentence of sentences) {
            if (this.lexiconCount(sentence) <= 2) ignoreCount += 1;
        }
        const validSentences: number = sentences.length - ignoreCount;
        return validSentences > 1 ? validSentences : 1;
    }
    averageSentenceLength(text: string): number {
        const asl: number = this.lexiconCount(text) / this.sentenceCount(text);
        const returnVal: number = Math.legacyRound(asl, 1);
        return !isNaN(returnVal) ? returnVal : 0.0;
    }
    averageSyllablePerWord(text: string): number {
        const syllables: number = this.syllableCount(text);
        const words: number = this.lexiconCount(text);
        const syllablePerWord: number = syllables / words;
        const returnVal: number = Math.legacyRound(syllablePerWord, 1);
        return !isNaN(returnVal) ? returnVal : 0.0;
    }
    averageCharacterPerWord(text: string): number {
        const charactersPerWord: number = this.charCount(text) / this.lexiconCount(text);
        const returnVal: number = Math.legacyRound(charactersPerWord, 2);
        return !isNaN(returnVal) ? returnVal : 0.0;
    }
    averageLetterPerWord(text: string): number {
        const lettersPerWord: number = this.letterCount(text) / this.lexiconCount(text);
        const returnVal: number = Math.legacyRound(lettersPerWord, 2);
        return !isNaN(returnVal) ? returnVal : 0.0;
    }
    averageSentencePerWord(text: string): number {
        const sentencesPerWord: number = this.sentenceCount(text) / this.lexiconCount(text);
        const returnVal: number = Math.legacyRound(sentencesPerWord, 2);
        return !isNaN(returnVal) ? returnVal : 0.0;
    }
    fleschReadingEase(text: string): number {
        const sentenceLength: number = this.averageSentenceLength(text);
        const syllablesPerWord: number = this.averageSyllablePerWord(text);
        const flesch: number = 206.835 - (1.015 * sentenceLength) - (84.6 * syllablesPerWord);
        const returnVal: number = Math.legacyRound(flesch, 2);
        return returnVal;
    }
    fleschReadingEaseToGrade(score: number): number {
        if (score < 100 && score >= 90) return 5;
        else if (score < 90 && score >= 80) return 6;
        else if (score < 80 && score >= 70) return 7;
        else if (score < 70 && score >= 60) return 8.5;
        else if (score < 60 && score >= 50) return 11;
        else if (score < 50 && score >= 40) return 13; // college
        else if (score < 40 && score >= 30) return 15;
        else return 16;
    }
    fleschKincaidGrade(text: string): number {
        const sentenceLength: number = this.averageSentenceLength(text);
        const syllablePerWord: number = this.averageSyllablePerWord(text);
        const flesch: number = 0.39 * sentenceLength + 11.8 * syllablePerWord - 15.59;
        const returnVal: number = Math.legacyRound(flesch, 1);
        return returnVal;
    }
    polySyllableCount(text: string): number {
        let count: number = 0;
        let wrds: number = 0;
        for (let word of Readability.split(text)) {
            wrds = this.syllableCount(word);
            if (wrds >= 3) count += 1;
        }
        return count;
    }
    smogIndex(text: string): number {
        const sentences: number = this.sentenceCount(text);
        if (sentences >= 3) {
            const polySyllab: number = this.polySyllableCount(text);
            const smog: number = 1.043 * (30 * (polySyllab / sentences)) ** 0.5 + 3.1291;
            const returnVal: number = Math.legacyRound(smog, 1);
            return !isNaN(returnVal) ? returnVal : 0.0;
        }
        return 0.0;
    }
    colemanLiauIndex(text: string): number {
        const letters: number = Math.legacyRound(this.averageLetterPerWord(text) * 100, 2);
        const sentences: number = Math.legacyRound(this.averageSentencePerWord(text) * 100, 2);
        const coleman: number = 0.058 * letters - 0.296 * sentences - 15.8;
        return Math.legacyRound(coleman, 2);
    }
    automatedReadabilityIndex(text: string): number {
        const characters: number = this.charCount(text);
        const words: number = this.lexiconCount(text);
        const sentences: number = this.sentenceCount(text);

        const averageCharacterPerWord: number = characters / words;
        const averageWordPerSentence: number = words / sentences;
        const readability: number = (
            (4.71 * Math.legacyRound(averageCharacterPerWord, 2)) +
            (0.5 * Math.legacyRound(averageWordPerSentence, 2)) -
            21.43
        );
        const returnVal: number = Math.legacyRound(readability, 1);
        return !isNaN(returnVal) ? returnVal : 0.0;
    }
    linsearWriteFormula(text: string): number {
        let easyWord: number = 0;
        let difficultWord: number = 0;
        let textList: string[] = Readability.split(text).slice(0, 100);

        for (let word of textList) {
            if (this.syllableCount(word) < 3) {
                easyWord += 1;
            } else {
                difficultWord += 1;
            }
        }
        text = textList.join(' ');
        let number: number = (easyWord * 1 + difficultWord * 3) / this.sentenceCount(text);
        let returnVal: number = number <= 20 ? (number - 2) / 2 : number / 2;
        returnVal = Math.legacyRound(returnVal, 1);
        return !isNaN(returnVal) ? returnVal : 0.0;
    }
    presentTense(word: string): string {
        // good enough for most long words -- we only care about "difficult" words
        // of two or more syllables anyway.
        // Doesn't work for words ending in "e" that aren't "easy"
        if (word.length < 6)
            return word;
        if (word.endsWith('ed')) {
            if (easyWordSet.has(word.slice(0, -1)))
                return word.slice(0, -1); // "easy" word ending in e
            else
                return word.slice(0, -2); // assume we remove "ed"
        }
        if (word.endsWith('ing')) {
            const suffixIngToE: string = word.slice(0, -3) + "e"; // e.g. forcing -> force
            if (easyWordSet.has(suffixIngToE))
                return suffixIngToE;
            else
                return word.slice(0, -3);
        }
        return word;
    }
    difficultWords(text: string, syllableThreshold: number = 2): number {
        const textList: string[] | null = text.match(/[\w=‘’]+/g);
        const diffWordsSet: Set<string> = new Set();
        if (textList === null)
            return diffWordsSet.size;
        for (let word of textList) {
            const normalized: string = this.presentTense(pluralize(word.toLocaleLowerCase()));
            // console.log(`difficultWords(${word}): norm=${normalized}, `
            //             `${this.syllableCount(word)} syllables, easy? ${easyWordSet.has(normalized)}`)
            if (!easyWordSet.has(normalized) && this.syllableCount(word) >= syllableThreshold) {
                diffWordsSet.add(word);
            }
        }
        return diffWordsSet.size;
    }
    daleChallReadabilityScore(text: string): number {
        const wordCount: number = this.lexiconCount(text);
        const count: number = wordCount - this.difficultWords(text);
        const per: number = (count / wordCount * 100);
        if (isNaN(per)) return 0.0;
        const difficultWords: number = 100 - per;
        // console.log('difficult words : ', difficultWords)
        let score: number = (0.1579 * difficultWords) + (0.0496 * this.averageSentenceLength(text));
        if (difficultWords > 5) score += 3.6365;
        return Math.legacyRound(score, 2);
    }
    daleChallToGrade(score: number): number {
        if (score <= 4.9) return 4;
        if (score < 5.9) return 5;
        if (score < 6.9) return 7;
        if (score < 7.9) return 9;
        if (score < 8.9) return 11;
        if (score < 9.9) return 13;
        else return 16;
    }
    gunningFog(text: string): number {
        const perDiffWords: number = (this.difficultWords(text, 3) / this.lexiconCount(text) * 100);
        const grade: number = 0.4 * (this.averageSentenceLength(text) + perDiffWords);
        const returnVal: number = Math.legacyRound(grade, 2);
        return !isNaN(returnVal) ? returnVal : 0.0;
    }
    lix(text: string): number {
        const words: string[] = Readability.split(text);
        const wordsLen: number = words.length;
        const longWords: number = words.filter(wrd => wrd.length > 6).length;
        const perLongWords: number = longWords * 100 / wordsLen;
        const asl: number = this.averageSentenceLength(text);
        const lix: number = asl + perLongWords;
        return Math.legacyRound(lix, 2);
    }
    rix(text: string): number {
        const words: string[] = Readability.split(text);
        const longWordsCount: number = words.filter(wrd => wrd.length > 6).length;
        const sentencesCount: number = this.sentenceCount(text);
        const rix: number = longWordsCount / sentencesCount;
        return !isNaN(rix) ? Math.legacyRound(rix, 2) : 0.0;
    }
    textStandard(text: string, floatOutput: boolean | null = null): string | number {
        const grade: number[] = [];
        // Appending Flesch Kincaid Grade
        let lower: number = Math.legacyRound(this.fleschKincaidGrade(text));
        let upper: number = Math.ceil(this.fleschKincaidGrade(text));
        grade.push(Math.floor(lower));
        grade.push(Math.floor(upper));

        let score: number = this.fleschReadingEase(text);
        let freGrade: number = this.fleschReadingEaseToGrade(score);
        grade.push(freGrade);

        // console.log('grade till now: \n', grade)

        lower = Math.legacyRound(this.smogIndex(text));
        upper = Math.ceil(this.smogIndex(text));
        grade.push(Math.floor(lower));
        grade.push(Math.floor(upper));

        // Appending Coleman_Liau_Index
        lower = Math.legacyRound(this.colemanLiauIndex(text));
        upper = Math.ceil(this.colemanLiauIndex(text));
        grade.push(Math.floor(lower));
        grade.push(Math.floor(upper));

        // Appending Automated_Readability_Index
        lower = Math.legacyRound(this.automatedReadabilityIndex(text));
        upper = Math.ceil(this.automatedReadabilityIndex(text));
        grade.push(Math.floor(lower));
        grade.push(Math.floor(upper));

        // console.log('grade till now : 2 : \n', grade)

        // Appending  Dale_Chall_Readability_Score
        lower = Math.legacyRound(this.daleChallToGrade(this.daleChallReadabilityScore(text)));
        upper = Math.ceil(this.daleChallToGrade(this.daleChallReadabilityScore(text)));
        grade.push(Math.floor(lower));
        grade.push(Math.floor(upper));

        // Appending linsearWriteFormula
        lower = Math.legacyRound(this.linsearWriteFormula(text));
        upper = Math.ceil(this.linsearWriteFormula(text));
        grade.push(Math.floor(lower));
        grade.push(Math.floor(upper));

        // Appending Gunning Fog Index
        lower = Math.legacyRound(this.gunningFog(text));
        upper = Math.ceil(this.gunningFog(text));
        grade.push(Math.floor(lower));
        grade.push(Math.floor(upper));

        // d = Counter(grade)
        // final_grade = d.most_common(1)
        // score = final_grade[0][0]

        // if float_output:
        //     return float(score)
        // else:
        //     lower_score = int(score) - 1
        //     upper_score = lower_score + 1
        //     return "{}{} and {}{} grade".format(
        //         lower_score, get_grade_suffix(lower_score),
        //         upper_score, get_grade_suffix(upper_score)
        //     )
        // Finding the Readability Consensus based upon all the above tests
        // console.log('grade List: ', grade)
        const counterMap: [number, number][] = [...new Set(grade)].map(x => [x, grade.filter(y => y === x).length]);
        const finalGrade: [number, number] = counterMap.reduce((x, y) => y[1] >= x[1] ? y : x);
        score = finalGrade[0];
        if (floatOutput) return score;
        const lowerScore: number = Math.floor(score) - 1;
        const upperScore: number = lowerScore + 1;
        return `${lowerScore}${Readability.getGradeSuffix(lowerScore)} and ${upperScore}${Readability.getGradeSuffix(upperScore)} grade`;
    }
    textMedian(text: string): number {
        const grade: number[] = [];
        // Appending Flesch Kincaid Grade
        grade.push(this.fleschKincaidGrade(text));

        const score: number = this.fleschReadingEase(text);
        const freGrade: number = this.fleschReadingEaseToGrade(score);
        grade.push(freGrade);

        grade.push(this.smogIndex(text));

        // Appending Coleman_Liau_Index
        grade.push(this.colemanLiauIndex(text));

        // Appending Automated_Readability_Index
        grade.push(this.automatedReadabilityIndex(text));

        // Appending  Dale_Chall_Readability_Score
        grade.push(this.daleChallToGrade(this.daleChallReadabilityScore(text)));

        // Appending linsearWriteFormula
        grade.push(this.linsearWriteFormula(text));

        // Appending Gunning Fog Index
        grade.push(this.gunningFog(text));

        // compute median
        grade.sort(function (a, b) { return a - b });
        let half: number = Math.floor(grade.length / 2);
        if (half & 0x1)
            return (grade[half - 1] + grade[half]) / 2;
        else
            return grade[half];
    }
}
const readability: Readability = new Readability();
export = readability;
