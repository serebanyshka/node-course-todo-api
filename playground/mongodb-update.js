const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017',
      dbname = 'TodoApp';

MongoClient
  .connect(url, {useNewUrlParser: true})
  .then(client => {
    const db = client.db(dbname);
    const collection = db.collection('TodoApp');
    const usersCltn = db.collection('Users');

    // collection
    //   .findOneAndUpdate({text: 'Some text here'}, {$set: {completed: true}}, {returnOriginal: false})
    //   .then(doc => {
    //     console.log(doc.value);
    //   })
    //   .catch(err => console.log(err));

    usersCltn
        .findOneAndUpdate({name: 'Jen'}, {$inc: {age: 4}, $set: {name: 'Sergei'} }, {returnOriginal: false})
        .then(doc => console.log(doc.value))
        .catch(err => console.log(err));
    client.close();
  })
  .catch(err => console.log(err));
