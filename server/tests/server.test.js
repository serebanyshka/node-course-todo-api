const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');
const { User } = require('./../models/user');
const { Todo } = require('./../models/todo');
const { app } = require('./../server');


const todos = [{
  _id: new ObjectID(),
  text: 'First test todo'
}, {
  _id: new ObjectID(),
  text: 'Second test todo',
  completed: true,
  completedAt: (new Date()).getTime()
}];

beforeEach(done => {
  Todo.remove({}).then(() => Todo.insertMany(todos)).then(() => done());
});

describe('PATСH /todos/:id', () => {
  it('should update todo', done => {
    const text = "Text for test";
    const hexId = todos[0]._id.toHexString();
    request(app)
      .patch(`/todos/${hexId}`)
      .send({ text, completed: true })
      .expect(200)
      .expect(res => {
        const todo = res.body.todo;
        expect(todo.completed).toBeTruthy();
        expect(todo.text).toBe(text);
        expect(typeof todo.completedAt).toBe('number');
      })
      .end(done);
  });
  it('should clear completedAt when todo is not completed', done => {
    const text = "Text for test";
    const hexId = todos[1]._id.toHexString();
    request(app)
      .patch(`/todos/${hexId}`)
      .send({ text, completed: false })
      .expect(200)
      .expect(res => {
        const todo = res.body.todo;
        expect(todo.completed).toBeFalsy();
        expect(todo.text).toBe(text);
        expect(todo.completedAt).toBe(null);
      })
      .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('Should remove a todo', done => {
      const hexId = todos[1]._id.toHexString();
      request(app)
        .delete(`/todos/${hexId}`)
        .expect(200)
        .expect(res => expect(res.body.todo.text).toBe(todos[1].text))
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          Todo.findById({_id: res.body.todo._id}).then(todo => {
            expect(todo).toBeFalsy();
            done();
          }).catch(err => done(err));
        });
  });
  it('Should return 404 if todo not found', done => {
    const hexId = new ObjectID().toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });
  it('Should return 404 if id is invalid', done => {
    const hexId = "test";
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });
});

describe('GET /todos', () => {
  it('should return all todos', done => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect(res => expect(res.body.todos.length).toBe(2))
      .end(done);
  });
});

describe('POST /todos', () => {
  it('should create a new Todo', done => {
    let text = 'Test todo text';
    request(app)
      .post('/todos')
      .send({ text })
      .expect(200)
      .expect( res => expect(res.body.text).toBe(text))
      .end( (err, res) => {
        if(err) {
          return done(err);
        }
        Todo
          .find({text})
          .then( todos => {
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
            done();
          })
          .catch(err => done(err));
      });
  });

  it('should not create a new Todo with invalid body data', done => {
    request(app)
      .post('/todos')
      .expect(400)
      .end( (err, res) => {
        if(err) {
          return done(err);
        }
        Todo
          .find()
          .then(todos => {
            expect(todos.length).toBe(2);
            done();
          })
          .catch(err => done(err))
      })
  });
});

describe('GET /todos/id', () => {
  it('should return todo doc', done => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect(res => expect(res.body.todo.text).toBe(todos[0].text))
      .end(done);
  });

  it('should return 404 if todo not found', done => {
    request(app)
      .get(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 if id is invalid', done => {
    request(app)
      .get(`/todos/123`)
      .expect(404)
      .end(done);
  });
});
