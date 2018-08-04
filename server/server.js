require('./config/config.js')

const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

const { mongoose } = require('./db/mongoose');
const { User } = require('./models/user');
const { Todo } = require('./models/todo');
const { authenticate } = require('./middleware/authenticate');

const PORT = process.env.PORT;
const app = express();

app.use(bodyParser.json());
// create new user
app.post('/users', (req, res) => {
  const {email, password} = req.body;
  const user = new User({ email, password });

  user.save()
    .then(() => user.generateAuthToken())
    .then( token => res.status(200).header('x-auth', token).send(user))
    .catch(err => res.status(400).send(err));
});
// login
app.post('/users/login', (req, res) => {
  const { email, password } = req.body;
  User
    .findByCredentials(email, password)
    .then(user => {
      return user.generateAuthToken()
        .then(token => res.status(200).header('x-auth', token).send(user))
    })
    .catch(err => res.status(400).send());
});
//get information about user
app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});
//logout
app.delete('/users/me/token', authenticate, (req, res) => {
  req.user
    .removeToken(req.token)
    .then(() => res.status(200).send())
    .catch(() => res.status(400).send());
});

// actions with todos
app.delete('/todos/:id', authenticate, (req, res) => {
  const _id = req.params.id;

  if(!ObjectID.isValid(_id)) {
    return res.status(404).send();
  }
  Todo.findOneAndRemove({ _id, _creator: req.user._id }).then( todo => {
      if(!todo) {
        return res.status(404).send();
      }
      res.status(200).send({ todo });
    })
    .catch(err => res.status(404).send());
});
//update todo
app.patch('/todos/:id', authenticate, (req, res) => {
  const _id = req.params.id;
  const {text, completed} = req.body;
  const body = { text, completed };

  if(!ObjectID.isValid(_id)) {
    return res.status(404).send();
  }

  if( typeof completed === 'boolean' && completed) {
    body.completedAt = (new Date()).getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }
  Todo.findOneAndUpdate({ _id, _creator: req.user._id }, {$set: body}, {new: true}).then(todo => {
      if(!todo) {
        return res.status(404).send();
      }
      res.status(200).send({todo});
    })
    .catch(e => res.status(400).send())
});
// add new todo
app.post('/todos', authenticate, (req, res) => {
  const todo = new Todo({
     text: req.body.text,
      _creator: req.user._id
    });

  todo
    .save()
    .then(doc => res.status(200).send(doc))
    .catch(err => res.status(400).send(err));
});

app.get('/todos', authenticate, (req, res) => {
  Todo.find({_creator: req.user._id}).then(todos => {
      res.status(200).send({todos});
    })
    .catch(err => res.status(400).send(err));
});

app.get('/todos/:id', authenticate, (req, res) => {
  const _id = req.params.id;

  if(!ObjectID.isValid(_id)) { //id is not valid, send empty body
    return res.status(404).send();
  }

  Todo.findOne({ _id, _creator: req.user._id }).then(todo => {
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
