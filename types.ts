export interface Synonym {
  term: string;
  translation: string;
}

export interface Example {
  en: string;
  cn: string;
}

export interface WordDetail {
  word: string;
  phonetic: string;
  partOfSpeech: string;
  definition: string;
  synonyms: Synonym[];
  derivatives: string[];
  examples: Example[];
}

export interface AnalysisResult {
  mainTranslation: string;
  isSentenceOrParagraph: boolean;
  vocabulary: WordDetail[];
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  sourceText: string;
  result: AnalysisResult;
}