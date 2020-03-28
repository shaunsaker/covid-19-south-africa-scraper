import * as scrapeIt from 'scrape-it';

import { ArticlesData, LatestCaseData, TargetValues } from './types';
import firebase from './firebase';

const url = 'https://sacoronavirus.co.za/category/press-releases-and-notices/';

const run = async () => {
  try {
    /*
     * Get the articles
     */
    const { data }: scrapeIt.ScrapeResult<ArticlesData> = await scrapeIt(url, {
      articles: {
        listItem: '#main article',
        data: {
          title: '.entry-title a',
          dateCreated: '.fusion-single-line-meta .rich-snippet-hidden',
          href: {
            selector: '.entry-title a',
            attr: 'href',
          },
        },
      },
    });

    /*
     * Select the latest article
     * Only return the latest confirmed cases articles
     * Sort by latest dateCreated
     */
    const { articles } = data;
    const casesArticles = articles
      .filter(article => article.title.includes('Latest confirmed cases'))
      .sort((a, b) => {
        if (a.dateCreated > b.dateCreated) {
          return -1;
        }
        if (a.dateCreated < b.dateCreated) {
          return 1;
        }
        return 0;
      });
    const latestArticle = casesArticles[0];

    /*
     * Go to the url of the latest article
     */
    const {
      data: latestCaseData,
    }: scrapeIt.ScrapeResult<LatestCaseData> = await scrapeIt(
      latestArticle.href,
      {
        paragraphs: {
          listItem: '.post-content p',
          data: {
            text: {
              selector: 'span',
              how: 'text',
            },
          },
        },
      },
    );

    /*
     * Get the data using our target values construct
     */
    const targetValues: TargetValues = [
      {
        name: 'confirmedCases',
        associations: [
          {
            type: 'wordsInSentence',
            values: ['total', 'number', 'confirmed', 'cases'],
          },
          { type: 'valueFollowedBy', values: ['confirmed cases'] },
        ],
      },
    ];
    const values = {};

    targetValues.forEach(targetValue => {
      latestCaseData.paragraphs.forEach(({ text }) => {
        const sentences = text.split('.');

        sentences.forEach(sentence => {
          /*
           * Does the sentence have any associations with the targetValue
           */
          targetValue.associations.forEach(association => {
            if (association.type === 'wordsInSentence') {
              /*
               * It's a match if the sentence contains all of the values
               */
              const isMatch = Boolean(
                !association.values.filter(word => !sentence.includes(word))
                  .length,
              );

              if (isMatch) {
                /*
                 * Extract the number from the sentence
                 */
                const match = sentence.match(/\d+/);
                const number = match && Number(match[0]);

                values[targetValue.name] = values[targetValue.name]
                  ? [...values[targetValue.name], number]
                  : [number];
              }
            } else if (association.type === 'valueFollowedBy') {
              const regex = new RegExp(`\\d+ ${association.values[0]}`);
              const match = sentence.match(regex);
              const number =
                match && Number(match[0].replace(association.values[0], ''));

              if (number) {
                values[targetValue.name] = values[targetValue.name]
                  ? [...values[targetValue.name], number]
                  : [number];
              }
            }
          });
        });
      });
    });

    /*
     * Save the data to the db
     */
    const document = {
      ...latestArticle,
    };

    targetValues.forEach(targetValue => {
      const { name } = targetValue;
      const value = values[name][0];

      document[name] = value;
    });

    await firebase
      .firestore()
      .collection('confirmedCases')
      .add(document);

    console.log('DONE');
  } catch (error) {
    console.log(error);
  }
};

run();
