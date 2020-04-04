import firebase from './firebase';
import * as moment from 'moment';

import { DeathCase } from './types';

const collection = 'deathCases';

/*
 * Saves the document if it does not already exist at that id
 */
const saveDeathCase = async (document: DeathCase) => {
  const id = moment(document.dateCreated).format('DD-MM-YYYY');

  const { exists } = await firebase
    .firestore()
    .collection(collection)
    .doc(id)
    .get();

  if (!exists) {
    await firebase
      .firestore()
      .collection(collection)
      .doc(id)
      .set(document);

    console.log(`Added ${id}.`);
  } else {
    console.log(`No new data.`);
  }
};

export { saveDeathCase };
