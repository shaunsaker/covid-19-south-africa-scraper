import firebase from './firebase';
import * as moment from 'moment';

import { ConfirmedCase } from './types';

const collection = 'confirmedCases';

const saveConfirmedCase = async (document: ConfirmedCase) => {
  const id = moment(document.dateCreated).format('DD-MM-YYYY');
  const { confirmedCases } = document;

  /*
   * Don't save if the confirmedCases are lower than the latest (can happen when incorrect numbers are extracted from the articles) or if they are the same
   */
  const hasGreaterConfirmedCases = !(
    await firebase
      .firestore()
      .collection(collection)
      .where('confirmedCases', '>=', confirmedCases)
      .get()
  ).empty;

  if (hasGreaterConfirmedCases) {
    console.log(`Confirmed cases of ${confirmedCases} already exists.`);
    return;
  }

  await firebase
    .firestore()
    .collection(collection)
    .doc(id)
    .set(document);
};

export { saveConfirmedCase };
