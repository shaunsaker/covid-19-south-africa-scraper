import firebase from './firebase';

const saveCase = async (article, articleData) => {
  /*
   * Save the data to the db if it does not exist
   */
  const document = {
    ...article,
    dateAdded: new Date().toISOString(),
  };

  // const { exists } = await firebase
  //   .firestore()
  //   .collection('confirmedCases')
  //   .doc(document.dateCreated)
  //   .get();
  const exists = false; // TODO:

  if (!exists) {
    Object.keys(articleData).forEach(key => {
      const value = articleData[key][0];

      document[key] = value;
    });

    await firebase
      .firestore()
      .collection('confirmedCases')
      .doc(document.dateCreated)
      .set(document);

    console.log(`Added ${document.dateCreated}.`);
  } else {
    console.log(`No new data.`);
  }
};

export { saveCase };
