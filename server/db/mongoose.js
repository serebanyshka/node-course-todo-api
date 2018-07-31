const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;

mongoose.Promise = global.Promise;
console.log(uri);
mongoose.connect(uri, {useNewUrlParser: true});


module.exports = { mongoose };
