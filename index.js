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
  if (data.length > 0) {
    res.status(200).send(data);
  }
  if (data === 0) {
    res.status(200).send([]);
  }
});

app.listen(PORT, () => {
  console.log('Online');
});