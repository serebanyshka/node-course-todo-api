const { ObjectID } = require('mongodb');
const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');


// Todo.remove({}).then( res => console.log(res));
Todo.findOneAndRemove({text: "Will be removed"}).then( res => {
  console.log(res);
});
