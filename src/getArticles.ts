import * as scrapeIt from 'scrape-it';
import * as moment from 'moment';

import { ArticlesData } from './types';
import { sortArrayOfObjectsByKey } from './utils';

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
  const sortedArticles = sortArrayOfObjectsByKey(articles, 'dateCreated', true);

  /*
   * Convert dateCreated into an iso string
   */
  const newArticles = sortedArticles
    .filter(article => article.dateCreated) // bad data
    .map(article => {
      const { dateCreated } = article;
      const dateParts = dateCreated.split(' ');
      const dayMatch = dateParts[1].match(/\d*/);
      const day = dayMatch && Number(dayMatch[0]);
      const month = dateParts[0];
      const year = Number(dateParts.reverse()[0]);
      const dateCreatedISOString = moment(
        `${day} ${month} ${year}`,
      ).toISOString();

      return {
        ...article,
        dateCreated: dateCreatedISOString,
      };
    })
    .filter(article => article.dateCreated); // bad data

  return newArticles;
};

getArticles();

export { getArticles };
