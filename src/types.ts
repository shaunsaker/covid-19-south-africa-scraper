export interface ConfirmedCase extends Article {
  confirmedCases: number;
  dateAdded: string;
}

interface Article {
  title?: string;
  dateCreated: string;
  href: string;
}

export interface ArticlesData {
  articles: Article[];
}

interface Paragraph {
  text: string;
}

export interface RawArticleData {
  paragraphs: Paragraph[];
}

type AssociationTypes = 'wordsInSentence' | 'valueFollowedBy';

interface Association {
  type: AssociationTypes;
  values: string[];
}

type TargetValueName = 'confirmedCases';

interface TargetValue {
  name: TargetValueName;
  associations: Association[];
}

export type TargetValues = TargetValue[];

export interface ArticleData {
  [key: string]: number;
}

export interface ProvincialCase {
  total: string;
  date: string;
  YYYYMMDD: string;
}

export interface DeathData {
  report_id: string;
  date: string;
  YYYYMMDD: string;
}

export interface DeathCase {
  deaths: number;
  dateCreated: string;
  href: string;
  dateAdded: string;
}
