const csvToJson = csv => {
  const rows = csv.split('\n');
  const keys = rows[0].split(',');

  /*
   * Remove the last item from the array (it's a blank line)
   */
  rows.pop();

  /*
   * Remove the first item from the array
   */
  rows.shift();

  const json = rows.map(row => {
    const values = row.split(',');
    const object = {};

    keys.forEach((key, index) => {
      object[key] = values[index];
    });

    return object;
  });

  return json;
};

export { csvToJson };
