const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI || process.env.HEROKU_POSTGRESQL;
mongoose.Promise = global.Promise;
console.log(uri);
if(!uri) {
  uri = 'mongodb://user:todo2018@ds261521.mlab.com:61521/todoapp';
}
console.log(uri);
mongoose.connect( (uri, {useNewUrlParser: true});


module.exports = { mongoose };
