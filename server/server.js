require('./config/config.js')

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const { mongoose } = require('./db/mongoose');

const { User } = require('./models/user');
const { Todo } = require('./models/todo');

const PORT = process.env.PORT;
const app = express();

app.use(bodyParser.json());

app.post('/users', (req, res) => {
  const {email, password} = req.body;
  const user = new User({ email, password });

  user.save()
    .then(() => {
      return user.generateAuthToken();
    })
    .then( token => {
      res.status(200).header('x-auth', token).send(user);
    })
    .catch(err => res.status(400).send(err));
});

app.delete('/todos/:id', (req, res) => {
  const _id = req.params.id;

  if(!ObjectID.isValid(_id)) {
    return res.status(404).send();
  }
  Todo.findByIdAndRemove({ _id }).then( todo => {
      if(!todo) {
        return res.status(404).send();
      }
      res.status(200).send({ todo });
    })
    .catch(err => res.status(404).send());
});

app.patch('/todos/:id', (req, res) => {
  const _id = req.params.id;
  const body = _.pick(req.body, ['text', 'completed']);
  if(!ObjectID.isValid(_id)) {
    return res.status(404).send();
  }

  if(_.isBoolean(body.completed) && body.completed) {
    body.completedAt = (new Date()).getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }
  Todo.findByIdAndUpdate(_id, {$set: body}, {new: true}).then(todo => {
      if(!todo) {
        return res.status(404).send();
      }
      res.status(200).send({todo});
    })
    .catch(e => res.status(400).send())
});

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
