import firebase from './firebase';
import * as moment from 'moment';

import { TestCase } from './types';

const collection = 'testCases';

/*
 * Saves the document if that number of tests has not yet been saved
 */
const saveTestCase = async (document: TestCase) => {
  const id = moment(document.dateCreated).format('DD-MM-YYYY');
  const { tests } = document;

  firebase
    .firestore()
    .collection(collection)
    .where('tests', '==', tests)
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

          console.log(`Added test cases of ${tests} in ${id}.`);
        } else {
          console.log(
            `Test cases already exists at ${id}. We tried to save ${tests}.`,
          );
        }
      } else {
        console.log(`Test cases of ${tests} already exists in ${id}.`);
      }
    });
};

export { saveTestCase };
