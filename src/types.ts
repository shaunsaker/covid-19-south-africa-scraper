interface BaseCase {
  dateCreated: string;
  href: string;
  dateAdded: string;
}

export interface ConfirmedCase extends BaseCase {
  confirmedCases: number;
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

export interface DeathCase extends BaseCase {
  deaths: number;
}

export interface TestData {
  date: string;
  YYYYMMDD: string;
  cumulative_tests: string;
  recovered: string;
  deaths: string;
}

export interface RecoveredCase extends BaseCase {
  recovered: number;
}

export interface TestCase extends BaseCase {
  tests: number;
}
