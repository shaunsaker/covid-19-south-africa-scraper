import axios from 'axios';
import * as moment from 'moment';

import { csvToJson } from './utils';
import { TestData, RecoveredCase, TestCase, DeathCase } from './types';
import { saveRecoveryCase } from './saveRecoveryCase';
import { saveTestCase } from './saveTestCase';
import { saveDeathCase } from './saveDeathCase';

const url =
  'https://raw.githubusercontent.com/dsfsi/covid19za/master/data/covid19za_timeline_testing.csv';
const source = 'https://github.com/dsfsi/covid19za';

const getRecoveriesTestsAndDeathsData = async () => {
  const { data } = await axios.get(url);
  const json: TestData[] = csvToJson(data);

  /*
   * Grab all the unique recoveries, tests and deaths
   */
  const recoveries: RecoveredCase[] = [];
  const tests: TestCase[] = [];
  const deaths: DeathCase[] = [];

  json.forEach(item => {
    if (item.recovered && Number(item.recovered)) {
      if (
        !recoveries.filter(
          recoveryCase => recoveryCase.recovered === Number(item.recovered),
        ).length
      ) {
        recoveries.push({
          recovered: Number(item.recovered),
          dateCreated: moment(item.YYYYMMDD).toISOString(),
          href: source,
          dateAdded: new Date().toISOString(),
        });
      }
    }

    /*
     * Grab all the unique tests
     */
    if (item.cumulative_tests && Number(item.cumulative_tests)) {
      if (
        !tests.filter(
          testCase => testCase.tests === Number(item.cumulative_tests),
        ).length
      ) {
        tests.push({
          tests: Number(item.cumulative_tests),
          dateCreated: moment(item.YYYYMMDD).toISOString(),
          href: source,
          dateAdded: new Date().toISOString(),
        });
      }
    }

    /*
     * Grab all the unique deaths
     */
    if (item.deaths && Number(item.deaths)) {
      if (
        !deaths.filter(deathCase => deathCase.deaths === Number(item.deaths))
          .length
      ) {
        deaths.push({
          deaths: Number(item.deaths),
          dateCreated: moment(item.YYYYMMDD).toISOString(),
          href: source,
          dateAdded: new Date().toISOString(),
        });
      }
    }
  });

  for (const recoveryCase of recoveries) {
    await saveRecoveryCase(recoveryCase);
  }

  for (const testCase of tests) {
    await saveTestCase(testCase);
  }

  for (const deathCase of deaths) {
    await saveDeathCase(deathCase);
  }
};

getRecoveriesTestsAndDeathsData();

export { getRecoveriesTestsAndDeathsData };
