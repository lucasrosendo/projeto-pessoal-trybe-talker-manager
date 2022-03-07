const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs/promises');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';
const FILENAME = 'talker.json';

// não remova esse endpoint, e para o avaliador funcionar

app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (req, res) => {
  const data = await fs.readFile(FILENAME);
  const talkers = JSON.parse(data);
  if (data.length > 0) {
    res.status(200).send(talkers);
  }
  if (data === 0) {
    res.status(200).send([]);
  }
});

app.get('/talker/:id', (_req, res) => {
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
});

app.listen(PORT, () => {
  console.log('Online');
});