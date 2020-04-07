import firebase from './firebase';
import * as moment from 'moment';

import { DeathCase } from './types';

const collection = 'deathCases';

/*
 * Saves the document if that number of confirmedCases has not yet been saved
 */
const saveDeathCase = async (document: DeathCase) => {
  const id = moment(document.dateCreated).format('DD-MM-YYYY');
  const { deaths } = document;

  firebase
    .firestore()
    .collection(collection)
    .where('deaths', '==', deaths)
    .get()
    .then(async snapshot => {
      if (snapshot.empty) {
        /*
         * And a document doesn't already exist
         */
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

          console.log(`Added death cases of ${deaths} in ${id}.`);
        } else {
          console.log(
            `Death cases already exists at ${id}. We tried to save ${deaths}.`,
          );
        }
      } else {
        console.log(`Death cases of ${deaths} already exists in ${id}.`);
      }
    });
};

export { saveDeathCase };
