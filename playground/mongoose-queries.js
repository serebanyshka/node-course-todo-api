const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/modules/todo');

const strID = "5b5f8d21ef47f72470c64f52";

Todo.find({ _id: strID }).then(todos => console.log('Todos '+ todos));
Todo.findOne({ _id: strID}).then(todo => console.log('Todo' + todo));
Todo.findById({ _id: strID}).then(todo => console.log('by id Todo ' + todo));
