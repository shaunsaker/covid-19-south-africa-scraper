import firebase from './firebase';
import * as moment from 'moment';

import { ConfirmedCase } from './types';

const collection = 'confirmedCases';

/*
 * Saves the document if that number of confirmedCases has not yet been saved
 */
const saveConfirmedCase = async (document: ConfirmedCase) => {
  const id = moment(document.dateCreated).format('DD-MM-YYYY');
  const { confirmedCases } = document;

  firebase
    .firestore()
    .collection(collection)
    .where('confirmedCases', '==', confirmedCases)
    .get()
    .then(async snapshot => {
      if (snapshot.empty) {
        await firebase
          .firestore()
          .collection(collection)
          .doc(id)
          .set(document);

        console.log(`Added confirmed cases of ${confirmedCases} in ${id}.`);
      } else {
        console.log(
          `Confirmed cases of ${confirmedCases} already exists in ${id}.`,
        );
      }
    });
};

export { saveConfirmedCase };
