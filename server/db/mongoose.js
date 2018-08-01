const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI || 'mongodb://user:todo2018@ds261521.mlab.com:61521/todoapp'; //connect to mongodb with heroku
mongoose.Promise = global.Promise;

mongoose.connect(uri, {useNewUrlParser: true});

module.exports = { mongoose };
