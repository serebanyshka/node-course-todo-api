const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');
const { User } = require('./../models/user');
const { todos, populateTodos, users, populateUsers } = require('./seed/seed');


beforeEach(populateUsers);
beforeEach('prepare todos',populateTodos);

describe('POST /todos', () => {
  it('should create a new Todo', done => {
    let text = 'Test todo text';
    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({ text })
      .expect(200)
      .expect( res => expect(res.body.text).toBe(text))
      .end( (err, res) => {
        if(err) {
           return done(err);
         }
         Todo.find({text}).then( res => {
             expect(res.length).toBe(1);
             expect(res[0].text).toEqual(text);
             done();
           })
           .catch(err => done(err));
       });
  });

  it('should not create a new Todo with invalid body data', done => {
    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({})
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

describe('GET /todos', () => {
  it('should return all todos', done => {
    request(app)
      .get('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect(res => expect(res.body.todos.length).toBe(1))
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should return todo doc', done => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect(res => expect(res.body.todo.text).toBe(todos[0].text))
      .end(done);
  });

  it('should return 404 if todo not found', done => {
    request(app)
      .get(`/todos/${new ObjectID().toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 if id is invalid', done => {
    request(app)
      .get(`/todos/123`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should not return todo doc', done => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('Should remove a todo', done => {
    const hexId = todos[1]._id.toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(200)
      .expect(res => expect(res.body.todo._id).toBe(hexId))
      .end((err, res) => {
        if(err) {
          return done(err);
        }
        Todo.findById({_id: hexId}).then(todo => {
          expect(todo).toBeFalsy();
          done();
        }).catch(err => done(err));
      });
  });

  it('should not remove a todo', done => {
    const hexId = todos[0]._id.toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end((err, res) => {
        if(err) {
          return done(err);
        }
        Todo.findById({_id: hexId}).then(todo => {
          expect(todo).toBeTruthy();
          done();
        }).catch(err => done(err));
      });
  });

  it('Should return 404 if todo not found', done => {
    const hexId = new ObjectID().toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('Should return 404 if id is invalid', done => {
    const hexId = "test";
    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('PATСH /todos/:id', () => {
  it('should update todo', done => {
    const text = "Text for test";
    const hexId = todos[0]._id.toHexString();
    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
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

  it('should not update todo', done => {
    const text = "Text for test";
    const hexId = todos[0]._id.toHexString();
    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({ text, completed: true })
      .expect(404)
      .end((err, res) => {
        if(err) {
          return done(err);
        }
        Todo.findOne({_id: hexId}).then(todo => {
          if(!todo) {
            return done(err);
          }
          expect(todo.text).not.toBe(text);
          done();
        })
      });
  });

  it('should clear completedAt when todo is not completed', done => {
    const text = "Text for test";
    const hexId = todos[1]._id.toHexString();
    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
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

describe('GET /users/me', () => {
  it('should return user if authenticated', done => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });
  it('should return 401 if not authenticated', done => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect(res => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe('POST /users', () => {
  it('should create a user', done => {
    const newUser = {email: 'test@test.com', password: 'qwerty123'};
    request(app)
      .post('/users')
      .send(newUser)
      .expect(200)
      .expect(res => {
        expect(res.headers['x-auth']).toBeTruthy();
        expect(res.body.email).toBe(newUser.email);
      })
      .end((err) => {
        if(err) {
          return done(err);
        }
        User.findOne({email: newUser.email}).then( user => {
          expect(user).toBeTruthy();
          expect(user.password).not.toBe(newUser.password);
          done();
        }).catch(err => done(err));
      });
  });

  it('should return validation errors if request invalid', done => {
    const email = 'testEmail',
     password = '123';
    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done);
  });

  it('should not create user if email in use', done => {
    request(app)
      .post('/users')
      .send({ email: users[0].email, password: 'qwerty12345'})
      .expect(400)
      .end(done);
  });
});
// _id: userTwoId,
// email: 'jen@example.com',
// password: 'userTwoPass'
describe('POST /users/login', () => {
  it('should login user and return auth token', done => {
    request(app)
      .post('/users/login')
      .send({ email: users[1].email, password: users[1].password })
      .expect(200)
      .expect(res => {
        expect(res.headers['x-auth']).toBeTruthy();
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }
        User.findById(users[1]._id).then(user => {
          expect(user.tokens[1].access).toBe('auth');
          expect(user.tokens[1].token).toBe(res.headers['x-auth']);
          done();
        }).catch(err => done(err));
      })
  });

  it('should reject invalid login', done => {
      // 400
      request(app)
        .post('/users/login')
        .send({email: users[1].email, password: 'qwerty'})
        .expect(400)
        .expect(res => expect(res.headers['x-auth']).toBeUndefined())
        .end((err, res) => {
          User
            .findOne(users[1]._id)
            .then(user => {
              expect(user.tokens.length).toBe(1);
              done();
            })
            .catch(err => done(err));
        });
  });
});

describe('DELETE /users/me/token', () => {
  it('should remove of token on logout', done => {
    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if(err) {
          return done(err);
        }
        User
          .findById(users[0]._id)
          .then(user => {
            expect(user.tokens.length).toBe(0);
            done();
          })
          .catch(err => done(err));
      });
  });
});
