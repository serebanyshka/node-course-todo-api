const {MongoClient, ObjectID} = require('mongodb');

const url = 'mongodb://localhost:27017',
      dbname = 'TodoApp';

MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
  if(err) {
    console.log(err);
    return;
  }
  console.log('Connected to MongoDB server');
  const db = client.db('TodoApp');

  // db.collection('TodoApp').insertOne({
  //   text: 'Something to do',
  //   completed: false
  // }, (err, res) => {
  //   if(err) {
  //     console.log(err);
  //     return;
  //   }
  //   console.log(JSON.stringify(res.ops, undefined, 2));
  // });
  // db.collection('TodoApp').find({}).toArray((err, res) => {
  //   if(err) {
  //     console.log(err);
  //     return;
  //   }
  //   res.forEach(obj => console.log(obj._id.getTimestamp()));
  // });

  client.close();
});
