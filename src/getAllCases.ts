import { getArticles } from './getArticles';
import { getArticleData } from './getArticleData';
import { saveCase } from './saveCase';

const getAllCases = async () => {
  try {
    const articles = await getArticles();

    for (const article of articles) {
      const articleData = await getArticleData(article.href);

      await saveCase(article, articleData);
    }
  } catch (error) {
    console.log(error);
  }
};

getAllCases();
