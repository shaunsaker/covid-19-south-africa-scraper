import * as scrapeIt from 'scrape-it';
import { RawArticleData, ArticleData, TargetValues } from './types';

const getArticleData = async (href): Promise<ArticleData> => {
  /*
   * Get the raw data
   */
  const { data }: scrapeIt.ScrapeResult<RawArticleData> = await scrapeIt(href, {
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
              articleData[targetValue.name] =
                articleData[targetValue.name] || number; // keep initial value
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
               * Extract the number(s) from the sentence
               */
              const match = sentence.match(/[^a-z ] *([.0-9])*\d/g);
              const numbers = match.map(item => {
                const noBlankSpaces = item.split(' ').join('');
                const number = Number(noBlankSpaces);

                return number;
              });
              const number = match && Math.max(...numbers); // take the largest matched number

              articleData[targetValue.name] =
                articleData[targetValue.name] || number; // keep initial value
            }
          }
        });
      });
    });
  });

  return articleData;
};

getArticleData(
  'https://sacoronavirus.co.za/2020/04/24/update-on-covid-19-24th-april-2020/',
);

export { getArticleData };
