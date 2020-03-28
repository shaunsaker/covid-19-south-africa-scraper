import { getArticles } from './getArticles';
import { getArticleData } from './getArticleData';
import { saveCase } from './saveCase';

const getLatestCase = async () => {
  try {
    const articles = await getArticles();
    const latestArticle = articles[0];
    const articleData = await getArticleData(latestArticle.href);

    await saveCase(latestArticle, articleData);
  } catch (error) {
    console.log(error);
  }
};

export default getLatestCase;
