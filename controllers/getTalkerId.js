const fs = require('fs/promises');

const FILENAME = 'talker.json';

module.exports = (_req, res) => {
  try {
    const { id } = _req.params;
    fs.readFile(FILENAME).then((data) => {
      const talkers = JSON.parse(data);
      const talker = talkers.find((t) => t.id === parseInt(id, 10));

      if (!talker) {
        return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
      }

      return res.status(200).send(talker);
    });
  } catch (e) {
    return res.status(500).end();
  }
};