const express = require('express');
const bodyParser = require('body-parser');
const { mongoose } = require('./db/mongoose');

const { User } = require('./modules/User');
const { Todo } = require('./modules/Todo');

const PORT = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  const todo = new Todo({ text: req.body.text });

  todo
    .save()
    .then(doc => res.status(200).send(doc))
    .catch(err => res.status(400).send(err));
});

app.listen(3000, () => {
  console.log('Started on port 3000');
});

app.get('/todos', (req, res) => {
  Todo.find().then(todos => {
      res.status(200).send({todos});
    })
    .catch(err => res.status(400).send(err));
});

module.exports = { app };