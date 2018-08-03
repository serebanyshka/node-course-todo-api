const env = process.env.NODE_ENV || 0; // 0 -> development or 1 -> test

if(env == 0) { //development
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
  process.env.HEROKU_POSTGRESQL = 'mongodb://user:todo2018@ds261521.mlab.com:61521/todoapp';

} else if(env == 1) { //test
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
}
