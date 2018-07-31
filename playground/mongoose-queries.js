const { ObjectID } = require('mongodb');
const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');

const strID = "5b5f8d21ef47f72470c64f52";
if(!ObjectID.isValid(strID)) {
  return console.log("Id isn't valid");
}
// Todo.find({ _id: strID }).then(todos => console.log('Todos '+ todos));
// Todo.findOne({ _id: strID}).then(todo => console.log('Todo' + todo));
Todo.findById({ _id: strID}).then(todo => {
  if(!todo) {
    // TODO: todo not found
    console.log('Object with this id not found');
  }
  console.log('by id Todo ' + todo);}).catch(err => console.log(err));
