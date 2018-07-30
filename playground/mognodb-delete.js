const { MongoClient, ObjectID } = require('mongodb');

const url = 'mongodb://localhost:27017',
      dbname = 'TodoApp';
MongoClient
  .connect(url, {useNewUrlParser: true})
  .then(client => {
    const db = client.db('TodoApp');
    const usersCol = db.collection('Users');
    usersCol
      .deleteMany({name: 'Andrew'})
      .then(res => {console.log(`Delete all Andrew: ${res.result}`)});

    usersCol
      .findOneAndDelete({_id: new ObjectID("5b5f1e533e400ba0f0405e5b")})
      .then(res => console.log(`Delete Mike: ${res.result}`));

    client.close();
  })
  .catch(err => console.log(err));
