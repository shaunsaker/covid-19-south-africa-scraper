interface Article {
  title: string;
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
