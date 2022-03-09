const express = require('express');
const bodyParser = require('body-parser');
const validator = require('email-validator');
const fs = require('fs');

const crypto = require('crypto');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000'; 
const FILENAME = './talker.json';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});
const verificaToken = (token, response) => {
  if (!token) response.status(401).send({ message: 'Token não encontrado' });
  if (token.length < 16) response.status(401).send({ message: 'Token inválido' });
};
app.get('/talker', (_request, response) => {
  const data = JSON.parse(fs.readFileSync(FILENAME));
  if (!data) response.status(200).json([]);
  return response.status(200).json(data);
});

app.get('/talker/search', (request, response) => {
  const token = request.headers.authorization;
  verificaToken(token, response);
  const { q } = request.query;
  const data = JSON.parse(fs.readFileSync(FILENAME));
  const mapFinal = data.filter((obj) => obj.name.includes(q));
  return response.status(200).json(mapFinal);
});

app.get('/talker/:id', (request, response) => {
  const { id } = request.params;
  const data = JSON.parse(fs.readFileSync(FILENAME));
  const mapFinal = data.find((obj) => obj.id === Number(id));
  if (!mapFinal) response.status(404).send({ message: 'Pessoa palestrante não encontrada' });
  return response.status(200).json(mapFinal);
});

app.post('/login', (request, response) => { 
  const token = crypto.randomBytes(8).toString('hex');
  const { email, password } = request.body;
  const emailVal = validator.validate(email);
  if (!email) response.status(400).send({ message: 'O campo "email" é obrigatório' });
  if (!password) response.status(400).send({ message: 'O campo "password" é obrigatório' });
  if (!emailVal) {
    return response.status(400).send({ message: 'O "email" deve ter o formato "email@email.com"' });
  } 
  if (password.length <= 5) {
    return response.status(400).send({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }
  return response.status(200).json({ token });
});

const verificaName = (name, response) => {
  if (!name) response.status(400).send({ message: 'O campo "name" é obrigatório' });
  if (name.length < 3) {
    return response.status(400).send({ message: 'O "name" deve ter pelo menos 3 caracteres' });
  }
};

const verificaAge = (age, response) => {
  if (!age) response.status(400).send({ message: 'O campo "age" é obrigatório' });
  if (age < 18) {
    return response.status(400).send({ message: 'A pessoa palestrante deve ser maior de idade' });
  }
};

const verificaTalkWatcher = (talk, response) => {
  const dateForm = /\d{2}\/\d{2}\/\d{4}/.test(talk.watchedAt);
  if (!dateForm) {
    return response.status(400)
    .send({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }
};

const verificaTalkRate = (talk, response) => {
  if (talk.rate < 1 || talk.rate > 5) {
    return response.status(400).send({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  }
};

const verificaTalk = (talk, response) => {
  if (!talk) {
    return response.status(400)
    .send({ message: 'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios',
  });
  }
  verificaTalkRate(talk, response);
  if (!talk.watchedAt || !talk.rate) {
    return response.status(400)
    .send({ message: 'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios',
  });
  }
  verificaTalkWatcher(talk, response);
};
app.post('/talker', (request, response) => {
  const { name, age, talk } = request.body;
  const token = request.headers.authorization;
  const data = JSON.parse(fs.readFileSync(FILENAME));
  const id = (data.length) + 1;
  verificaTalk(talk, response);
  verificaToken(token, response);
  verificaName(name, response);
  verificaAge(age, response);
  fs.writeFileSync('./talker.json', JSON.stringify([...data, { name, age, talk, id }]));
  return response.status(201).json({ name, age, talk, id });
});

app.put('/talker/:id', (request, response) => {
  const { name, age, talk } = request.body;
  const token = request.headers.authorization;
  const { id } = request.params;
  const data = JSON.parse(fs.readFileSync(FILENAME));
  verificaTalk(talk, response);
  verificaToken(token, response);
  verificaName(name, response);
  verificaAge(age, response);
  const mapFinal = data.filter((obj) => obj.id !== Number(id));
  fs.writeFileSync('./talker.json', 
  JSON.stringify([...mapFinal, { name, age, talk, id: Number(id) }]));
  return response.status(200).json({ name, age, talk, id: Number(id) });
});

app.delete('/talker/:id', (request, response) => {
  const token = request.headers.authorization;
  verificaToken(token, response);
  const { id } = request.params;
  const data = JSON.parse(fs.readFileSync(FILENAME));
  const mapFinal = data.filter((obj) => obj.id !== Number(id));
  fs.writeFileSync('./talker.json', 
  JSON.stringify(mapFinal));
  return response.status(204).json({});
});

app.listen(PORT, () => {
  console.log('Online');
});