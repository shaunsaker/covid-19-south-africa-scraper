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

export interface ArticleData {
  paragraphs: Paragraph[];
}

type AssociationTypes = 'wordsInSentence' | 'valueFollowedBy';

interface Association {
  type: AssociationTypes;
  values: string[];
}

interface TargetValue {
  name: string;
  associations: Association[];
}

export type TargetValues = TargetValue[];
