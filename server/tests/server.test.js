const expect = require('expect');
const request = require('supertest');

const { User } = require('./../modules/User');
const { Todo } = require('./../modules/Todo');
const { app } = require('./../server');

beforeEach(done => {
  Todo.remove({}).then( () => done());
});

describe('POST /todos', () => {
  it('should create a new Todo', done => {
    let text = 'Test todo text';
    request(app)
      .post('/todos')
      .send({ text })
      .expect(200)
      .expect( res=> expect(res.body.text).toBe(text))
      .end( (err, res) => {
        if(err) {
          return done(err);
        }
        Todo
          .find()
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
      .send({})
      .expect(400)
      .end( (err, res) => {
        if(err) {
          return done(err);
        }
        Todo
          .find()
          .then(todos => {
            expect(todos.length).toBe(0);
            done();
          })
          .catch(err => done(err))
      })
  });
});
