import firebase from './firebase';
import * as moment from 'moment';

import { RecoveredCase } from './types';

const collection = 'recoveryCases';

/*
 * Saves the document if that number of recovered has not yet been saved
 */
const saveRecoveryCase = async (document: RecoveredCase) => {
  const id = moment(document.dateCreated).format('DD-MM-YYYY');
  const { recovered } = document;

  firebase
    .firestore()
    .collection(collection)
    .where('recovered', '==', recovered)
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

          console.log(`Added recovered cases of ${recovered} in ${id}.`);
        } else {
          console.log(
            `Recovered cases already exists at ${id}. We tried to save ${recovered}.`,
          );
        }
      } else {
        console.log(`Recovered cases of ${recovered} already exists in ${id}.`);
      }
    });
};

export { saveRecoveryCase };
