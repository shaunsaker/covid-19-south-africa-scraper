import * as scrapeIt from 'scrape-it';
import { ArticlesData } from './types';

const getArticles = async () => {
  /*
   * Get the articles
   */
  const url =
    'https://sacoronavirus.co.za/category/press-releases-and-notices/';
  const { data }: scrapeIt.ScrapeResult<ArticlesData> = await scrapeIt(url, {
    articles: {
      listItem: '#main article',
      data: {
        title: '.entry-title a',
        dateCreated: '.fusion-single-line-meta span:nth-of-type(2)',
        href: {
          selector: '.entry-title a',
          attr: 'href',
        },
      },
    },
  });

  /*
   * Select the latest article
   * Sort by latest dateCreated
   */
  const { articles } = data;
  const cases = articles.sort((a, b) => {
    if (a.dateCreated > b.dateCreated) {
      return -1;
    }
    if (a.dateCreated < b.dateCreated) {
      return 1;
    }
    return 0;
  });

  return cases;
};

export { getArticles };
