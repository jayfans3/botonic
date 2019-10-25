import { SimilarWordFinder, SimilarWordResult } from './similar-words';
import { NormalizedUtterance, Normalizer } from './normalizer';
import { Locale } from './locales';

/**
 * May contain multiple words
 */
export class Keyword {
  constructor(
    readonly raw: string,
    readonly stemmed: string,
    readonly hasOnlyStopWords: boolean
  ) {}
}

export class CandidateWithKeywords<M> {
  constructor(readonly owner: M, readonly keywords: Keyword[]) {}
}

export enum MatchType {
  /** After removing stop words, spaces and word endings, the input text must only contain the keywords*/
  ONLY_KEYWORDS_FOUND,
  /** The keyword may be preceded and followed by other words */
  KEYWORDS_AND_OTHERS_FOUND,
  /** All the words in the keyword must appear on input text, even if mixed up with other words*/
  ALL_WORDS_IN_KEYWORDS_MIXED_UP
}

export const MATCH_TYPES = Object.values(MatchType).map(m => m as MatchType);

export enum SortType {
  NONE,
  LENGTH
}

export class KeywordsOptions {
  constructor(
    readonly maxDistance = 1,
    readonly similarWordsMinLength = 3,
    readonly resultsSortType = SortType.LENGTH
  ) {}
}

export class KeywordsParser<M> {
  private readonly candidates = [] as CandidateWithKeywords<M>[];
  private readonly similar: SimilarWordFinder<M>;

  constructor(
    readonly locale: Locale,
    readonly matchType: MatchType,
    readonly normalizer: Normalizer,
    readonly options: KeywordsOptions
  ) {
    this.similar = new SimilarWordFinder<M>(
      true,
      options.similarWordsMinLength
    );
  }

  /**
   *
   * @param candidate
   * @param rawKeywords a candidate may be associated to multiple keywords, and each one of them may contain multiple
   * words (which must appear together in the same order). The keywords will be stemmed.
   */
  addCandidate(candidate: M, rawKeywords: string[]): void {
    const stemmedKeywords = rawKeywords.map(kw => {
      const normalized = this.normalizer.normalize(this.locale, kw);
      return new Keyword(
        kw,
        normalized.joinedStems,
        normalized.hasOnlyStopWords()
      );
    });
    const candidateWithK = new CandidateWithKeywords(
      candidate,
      stemmedKeywords
    );
    this.candidates.push(candidateWithK);
    this.similar.addCandidate(candidateWithK);
  }

  findCandidatesWithKeywordsAt(
    utterance: NormalizedUtterance
  ): SimilarWordResult<M>[] {
    let results: SimilarWordResult<M>[] = [];
    switch (this.matchType) {
      case MatchType.ONLY_KEYWORDS_FOUND:
        results = this.similar.findIfOnlyWordsFromKeyword(
          utterance,
          this.options.maxDistance
        );
        break;
      case MatchType.KEYWORDS_AND_OTHERS_FOUND:
        results = this.similar.findSubstring(
          utterance,
          this.options.maxDistance
        );
        break;
      case MatchType.ALL_WORDS_IN_KEYWORDS_MIXED_UP:
        results = this.mixedUp(utterance);
    }
    return this.sort(results);
  }

  private mixedUp(utterance: NormalizedUtterance) {
    if (this.options.maxDistance > 0) {
      throw new Error(
        'ALL_WORDS_IN_KEYWORDS_MIXED_UP does not support distance> 0'
      );
    }
    const results: SimilarWordResult<M>[] = [];
    for (const candidate of this.candidates) {
      for (const keyword of candidate.keywords) {
        if (this.containsAllWordsInKeyword(utterance, keyword)) {
          results.push(
            new SimilarWordResult<M>(
              candidate.owner,
              keyword,
              keyword.stemmed,
              0
            )
          );
        }
      }
    }
    return results;
  }

  private sort(results: SimilarWordResult<M>[]) {
    if (this.options.resultsSortType === SortType.NONE) {
      return results;
    }
    return results.sort((r1, r2) => r2.match.length - r1.match.length);
  }

  private containsAllWordsInKeyword(
    utterance: NormalizedUtterance,
    keyword: Keyword
  ): boolean {
    for (const word of keyword.stemmed.split(' ')) {
      if (!utterance.joinedStems.includes(word)) {
        return false;
      }
    }
    return true;
  }
}
