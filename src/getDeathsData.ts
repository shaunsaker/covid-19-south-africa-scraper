import axios from 'axios';
import * as moment from 'moment';

import { csvToJson } from './utils';
import { DeathCase, DeathData } from './types';
import { saveDeathCase } from './saveDeathCase';

const url =
  'https://raw.githubusercontent.com/dsfsi/covid19za/master/data/covid19za_timeline_deaths.csv';
const source = 'https://github.com/dsfsi/covid19za';

const getDeathsData = async () => {
  const { data } = await axios.get(url);
  const json: DeathData[] = csvToJson(data);

  /*
   * Group by day and tally the death counts
   */
  const groupedJson = {};

  json.forEach(item => {
    if (!groupedJson[item.YYYYMMDD]) {
      groupedJson[item.YYYYMMDD] = [item];
    } else {
      groupedJson[item.YYYYMMDD].push(item);
    }
  });

  /*
   * Convert the grouped json into what we need
   */
  const deathCases: DeathCase[] = Object.keys(groupedJson).map(key => {
    const array = groupedJson[key];
    const deaths = array.length;

    return {
      deaths,
      dateCreated: moment(key).toISOString(),
      href: source,
      dateAdded: new Date().toISOString(),
    };
  });

  /*
   * Save the death cases
   */
  for (const deathCase of deathCases) {
    await saveDeathCase(deathCase);
  }
};

getDeathsData();

export { getDeathsData };
