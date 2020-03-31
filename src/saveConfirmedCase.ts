import firebase from './firebase';
import * as moment from 'moment';

import { ConfirmedCase } from './types';

/*
 * Saves the document if it does not already exist at that id
 */
const saveConfirmedCase = async (document: ConfirmedCase) => {
  const id = moment(document.dateCreated).format('DD-MM-YYYY');

  const { exists } = await firebase
    .firestore()
    .collection('confirmedCases')
    .doc(id)
    .get();

  if (!exists) {
    await firebase
      .firestore()
      .collection('confirmedCases')
      .doc(id)
      .set(document);

    console.log(`Added ${id}.`);
  } else {
    console.log(`No new data.`);
  }
};

export { saveConfirmedCase };
