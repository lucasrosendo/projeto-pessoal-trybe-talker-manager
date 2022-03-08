const crypto = require('crypto');
const validator = require('email-validator');

module.exports = (req, res) => {
  const token = crypto.randomBytes(8).toString('hex');
  const { email, password } = req.body;
  const validatorEmail = validator.validate(email);

  if (!email) res.status(400).send({ message: 'O campo "email" é obrigatório' });
  if (!password) res.status(400).send({ message: 'O campo "password" é obrigatório' });
  if (!validatorEmail) {
    return res.status(400).send({ message: 'O "email" deve ter o formato "email@email.com"' });
  } 
  if (password.length <= 5) {
    return res.status(400).send({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }
  return res.status(200).json({ token });  
};