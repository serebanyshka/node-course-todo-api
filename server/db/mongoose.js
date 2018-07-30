const mongoose = require('mongoose');

const url = 'mongodb://localhost:27017',
      dbname = 'TodoApp';

mongoose.Promise = global.Promise;
mongoose.connect(url + '/' + dbname, {useNewUrlParser: true});

module.exports = { mongoose };
