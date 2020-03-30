import { getArticles } from './getArticles';
import { getArticleData } from './getArticleData';
import { saveCase } from './saveCase';

const getLatestCase = async (): Promise<void> => {
  try {
    const articles = await getArticles();
    const latestArticle = articles[0];
    const articleData = await getArticleData(latestArticle.href);

    if (articleData.confirmedCases) {
      await saveCase(latestArticle, articleData);
    }
  } catch (error) {
    console.log(error);
  }
};

export default getLatestCase;
