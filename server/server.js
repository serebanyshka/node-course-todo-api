const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const { mongoose } = require('./db/mongoose');

const { User } = require('./models/User');
const { Todo } = require('./models/Todo');

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

app.get('/todos', (req, res) => {
  Todo.find().then(todos => {
      res.status(200).send({todos});
    })
    .catch(err => res.status(400).send(err));
});

app.get('/todos/:id', (req, res) => {
  const id = req.params.id;

  if(!ObjectID.isValid(id)) { //id is not valid, send empty body
    return res.status(404).send();
  }

  Todo.findById(id).then(todo => {
      if(!todo) {
        return res.status(404).send();
      }
      res.status(200).send({ todo });
    })
    .catch(err => res.status(400).send())
});

app.listen(PORT, () => {
  console.log(`Started on port ${PORT}`);
});

module.exports = { app };
