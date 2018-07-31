const mongoose = require('mongoose');

const url = "mongodb://user:todo2018@ds261521.mlab.com:61521/todoapp"
//process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp';

mongoose.Promise = global.Promise;
mongoose.connect(url, {useNewUrlParser: true});


module.exports = { mongoose };
