import firebase from './firebase';
import * as moment from 'moment';

import { ConfirmedCase } from './types';

const collection = 'confirmedCases';

const saveConfirmedCase = async (document: ConfirmedCase) => {
  const id = moment(document.dateCreated).format('DD-MM-YYYY');
  const { confirmedCases } = document;

  /*
   * Saves the document if that number of confirmedCases has not yet been saved
   */
  firebase
    .firestore()
    .collection(collection)
    .where('confirmedCases', '==', confirmedCases)
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

          console.log(`Added confirmed cases of ${confirmedCases} in ${id}.`);
        } else {
          console.log(
            `Confirmed cases already exist at ${id}. We tried to save ${confirmedCases}.`,
          );
        }
      } else {
        console.log(
          `Confirmed cases of ${confirmedCases} already exists in ${id}.`,
        );
      }
    });
};

export { saveConfirmedCase };
