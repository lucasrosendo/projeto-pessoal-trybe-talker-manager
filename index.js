const express = require('express');
const bodyParser = require('body-parser');

const talkerC = require('./controllers/talkerC');
const getTalkerId = require('./controllers/getTalkerId');
const login = require('./controllers/login');
const authEmailPass = require('./middlewares/authEmailPass');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';
// não remova esse endpoint, e para o avaliador funcionar

app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', talkerC);
app.get('/talker/:id', getTalkerId);
app.post('/login', authEmailPass, login);
// app.post('/talker', (req, res) => {

// });

app.listen(PORT, () => {
  console.log('Online');
});