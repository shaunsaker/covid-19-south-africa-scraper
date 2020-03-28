import * as scrapeIt from 'scrape-it';
import { ArticleData, TargetValues } from './types';

const getArticleData = async href => {
  /*
   * Get the raw data
   */
  const { data }: scrapeIt.ScrapeResult<ArticleData> = await scrapeIt(href, {
    paragraphs: {
      listItem: '.post-content p',
      data: {
        text: {
          selector: '',
          how: 'text',
        },
      },
    },
  });

  /*
   * Get the data using our target values construct
   */
  const targetValues: TargetValues = [
    {
      name: 'confirmedCases',
      associations: [
        {
          type: 'wordsInSentence',
          values: ['total', 'number', 'cases'],
        },
        { type: 'valueFollowedBy', values: ['confirmed cases'] },
      ],
    },
  ];
  const articleData = {};

  targetValues.forEach(targetValue => {
    data.paragraphs.forEach(({ text }) => {
      const sentences = text.split('.');

      sentences.forEach(sentence => {
        /*
         * Does the sentence have any associations with the targetValue
         */
        targetValue.associations.forEach(association => {
          if (association.type === 'valueFollowedBy') {
            const regex = new RegExp(`\\d+ ${association.values[0]}`);
            const match = sentence.match(regex);
            const number =
              match && Number(match[0].replace(association.values[0], ''));

            if (number) {
              articleData[targetValue.name] = articleData[targetValue.name]
                ? [...articleData[targetValue.name], number]
                : [number];
            }
          } else if (association.type === 'wordsInSentence') {
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
              const match = sentence.match(/ \d+/);
              const number = match && Number(match[0].trim());

              articleData[targetValue.name] = articleData[targetValue.name]
                ? [...articleData[targetValue.name], number]
                : [number];
            }
          }
        });
      });
    });
  });

  return articleData;
};

export { getArticleData };
