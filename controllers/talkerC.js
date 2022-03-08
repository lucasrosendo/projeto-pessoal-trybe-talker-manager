const fs = require('fs/promises');

const FILENAME = 'talker.json';

module.exports = async (req, res) => {
  const data = await fs.readFile(FILENAME);
  const talkers = JSON.parse(data);
  if (data.length > 0) {
    res.status(200).send(talkers);
  }
  if (data === 0) {
    res.status(200).send([]);
  }
};