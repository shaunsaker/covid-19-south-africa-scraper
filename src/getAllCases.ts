import { getArticles } from './getArticles';
import { getArticleData } from './getArticleData';
import { saveConfirmedCase } from './saveConfirmedCase';

const getAllCases = async (): Promise<void> => {
  try {
    const articles = await getArticles();

    for (const article of articles) {
      const articleData = await getArticleData(article.href);
      const document = {
        ...article,
        ...articleData,
        dateAdded: new Date().toISOString(),
      };

      if (articleData.confirmedCases) {
        await saveConfirmedCase(document);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

getAllCases();

export { getAllCases };
