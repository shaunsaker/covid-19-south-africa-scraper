import axios from 'axios';
import * as moment from 'moment';

import { csvToJson, sortArrayOfObjectsByKey } from './utils';
import { ConfirmedCase, ProvincialCase } from './types';
import { saveConfirmedCase } from './saveConfirmedCase';

const url =
  'https://raw.githubusercontent.com/dsfsi/covid19za/master/data/covid19za_provincial_cumulative_timeline_confirmed.csv';
const source = 'https://github.com/dsfsi/covid19za';

const getProvincialData = async () => {
  const { data } = await axios.get(url);
  const json = csvToJson(data);

  /*
   * Sort the results
   */
  const sortedJson: ProvincialCase[] = sortArrayOfObjectsByKey(json, 'date');

  /*
   * Convert the json into what we need
   */
  const confirmedCases: ConfirmedCase[] = sortedJson.map(item => {
    return {
      confirmedCases: item.total && Number(item.total),
      dateCreated: moment(item.YYYYMMDD).toISOString(),
      href: source,
      dateAdded: new Date().toISOString(),
    };
  });

  /*
   * Save the confirmed cases
   */
  for (const confirmedCase of confirmedCases) {
    if (confirmedCase.confirmedCases) {
      await saveConfirmedCase(confirmedCase);
    }
  }
};

getProvincialData();

export { getProvincialData };
