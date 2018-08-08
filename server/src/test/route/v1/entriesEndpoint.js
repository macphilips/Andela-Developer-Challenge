import chai from 'chai';
import bcrypt from 'bcryptjs';
import chaiHttp from 'chai-http';
import * as assert from 'assert';
import { app } from '../../../app';
import { createToken } from '../../../middlewares/jwtProvider';
import db from '../../../db';
import AuthenticationMiddleware from '../../../middlewares/jwtFilter';

export const entrySampleWithoutID = {
  title: 'Test case 1',
  content: 'Nam quis ultricies nisl. Nullam vel quam imperdiet, congue nunc dignissim, efficitur enim. Ut porta eu ipsum quis pellentesque. Suspendisse non molestie arcu. Cras nec convallis risus. Integer eu lectus vulputate, finibus sapien efficitur, consequat odio. In malesuada metus diam, non malesuada urna volutpat quis. ',
};

chai.use(chaiHttp);

const should = chai.should();

const userRepository = db.connection.users;
const entriesRepository = db.connection.entries;

function assertTrue(match) {
  assert.equal(match, true);
}

describe('Entries API test', () => {
  before(() => db.init()
    .then(() => userRepository.clear())
    .then(() => userRepository.save({
      email: 'example1@local',
      password: bcrypt.hashSync('topsecret', 8),
      firstName: 'Jane',
      lastName: 'Doe',
    }))
    .then(() => userRepository.save({
      email: 'example2@local',
      password: bcrypt.hashSync('topsecret', 8),
      firstName: 'Jane',
      lastName: 'Doe',
    })));

  beforeEach(() => entriesRepository.clear());
  describe('POST /api/v1/entries Create new entry', () => {
    it('it should create a new entry', () => userRepository.findAll()
      .then((users) => {
        const token = createToken({ id: users[0].id });
        return chai.request(app)
          .post('/api/v1/entries')
          .set(AuthenticationMiddleware.AUTHORIZATION_HEADER, token)
          .send(entrySampleWithoutID)
          .then((res) => {
            res.should.have.status(201);
            res.body.should.be.a('object');
            res.body.should.have.property('message');
            res.body.should.have.property('status');
            res.body.should.have.property('entry');

            res.body.entry.should.have.property('id');
            res.body.entry.should.have.property('content').eql(entrySampleWithoutID.content);
            res.body.entry.should.have.property('title').eql(entrySampleWithoutID.title);
            res.body.entry.should.have.property('createdDate');
            res.body.entry.should.have.property('lastModified');
          });
      }));
    it('it should not allow modification of entry using POST request', () => {
      let users;
      return userRepository.findAll()
        .then((result) => {
          users = result;
          return entriesRepository.save({ ...entrySampleWithoutID, userID: users[0].id });
        })
        .then((entry) => {
          const token = createToken({ id: users[0].id });
          return chai.request(app)
            .post('/api/v1/entries')
            .set(AuthenticationMiddleware.AUTHORIZATION_HEADER, token)
            .send(entry)
            .then((res) => {
              res.should.have.status(403);
              res.body.should.be.a('object');
              res.body.should.have.property('message');
              res.body.should.have.property('status');
            });
        });
    });

    it('it should not POST a entry when provided with invalid entry input ',
      () => userRepository.findAll()
        .then((users) => {
          const url = '/api/v1/entries';
          const token = createToken({ id: users[0].id });
          return chai.request(app)
            .post(url)
            .set(AuthenticationMiddleware.AUTHORIZATION_HEADER, token)
            .send({ title: '       ', content: entrySampleWithoutID.content })
            .then((res) => {
              res.should.have.status(400);
              res.body.should.be.a('object');
            })
            .then(() => chai.request(app)
              .post(url)
              .set(AuthenticationMiddleware.AUTHORIZATION_HEADER, token)
              .send({ title: entrySampleWithoutID.title, content: '                 ' })
              .then((res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
              }))
            .then(() => chai.request(app)
              .post(url)
              .set(AuthenticationMiddleware.AUTHORIZATION_HEADER, token)
              .send({ title: '23', content: entrySampleWithoutID.content })
              .then((res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
              }));
        }));
  });
  describe('GET /api/v1/entries Get all entries', () => {
    it('it should return 404 error when user has no entries', () => {
      let users;
      return userRepository.findAll()
        .then((result) => {
          users = result;
          return entriesRepository.save({ ...entrySampleWithoutID, userID: users[1].id });
        })
        .then(() => entriesRepository.save({ ...entrySampleWithoutID, userID: users[1].id }))
        .then(() => entriesRepository.save({ ...entrySampleWithoutID, userID: users[1].id }))
        .then(() => {
          const user1Token = createToken({ id: users[0].id });
          return chai.request(app)
            .get('/api/v1/entries')
            .set(AuthenticationMiddleware.AUTHORIZATION_HEADER, user1Token)
            .then((res) => {
              res.should.have.status(404);
              res.body.should.be.a('object');
              res.body.should.have.property('message');
              res.body.should.have.property('status');
            });
        });
    });
    it('it should list all entries owned by user with provided token', () => {
      let users;
      return userRepository.findAll()
        .then((result) => {
          users = result;
          return entriesRepository.save({ ...entrySampleWithoutID, userID: users[0].id });
        })
        .then(() => entriesRepository.save({ ...entrySampleWithoutID, userID: users[0].id }))
        .then(() => entriesRepository.save({ ...entrySampleWithoutID, userID: users[0].id }))
        .then(() => entriesRepository.save({ ...entrySampleWithoutID, userID: users[1].id }))
        .then(() => entriesRepository.save({ ...entrySampleWithoutID, userID: users[1].id }))
        .then(() => {
          const user1Token = createToken({ id: users[0].id });
          return chai.request(app)
            .get('/api/v1/entries')
            .set(AuthenticationMiddleware.AUTHORIZATION_HEADER, user1Token)
            .then((res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('message');
              res.body.should.have.property('status');
              res.body.should.have.property('entries');
              res.body.entries.length.should.be.eql(3);
            });
        });
    });
  });
  describe('PUT /api/v1/entries/:id Modify entry', () => {
    it('it should not PUT a entry when provided with invalid entry input ',
      () => {
        let token;
        return userRepository.findAll()
          .then((users) => {
            token = createToken({ id: users[0].id });
            return entriesRepository.save({ ...entrySampleWithoutID, userID: users[0].id });
          })
          .then((entry) => {
            const url = `/api/v1/entries/${entry.id}`;
            return chai.request(app)
              .put(url)
              .set(AuthenticationMiddleware.AUTHORIZATION_HEADER, token)
              .send({ title: '       ', content: entrySampleWithoutID.content })
              .then((res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
              })
              .then(() => chai.request(app)
                .put(url)
                .set(AuthenticationMiddleware.AUTHORIZATION_HEADER, token)
                .send({ title: entrySampleWithoutID.title, content: '                 ' })
                .then((res) => {
                  res.should.have.status(400);
                  res.body.should.be.a('object');
                }))
              .then(() => chai.request(app)
                .put(url)
                .set(AuthenticationMiddleware.AUTHORIZATION_HEADER, token)
                .send({ title: '23', content: entrySampleWithoutID.content })
                .then((res) => {
                  res.should.have.status(400);
                  res.body.should.be.a('object');
                }));
          });
      }).timeout(5000);
    it('should return a 404 error when users try to modify entry that doesn\'t exists',
      () => userRepository.findAll()
        .then((user) => {
          const token = createToken({ id: user.id });
          return chai.request(app)
            .put('/api/v1/entries/93764623')
            .set(AuthenticationMiddleware.AUTHORIZATION_HEADER, token)
            .send({ ...entrySampleWithoutID, id: 764623, userID: user.id })
            .then((res) => {
              res.should.have.status(404);
              res.body.should.be.a('object');
              res.body.should.have.property('message');
              res.body.should.have.property('status');
            });
        }));

    it('it should return 400 error when entry with invalid id is provided', () => {
      let user;
      return userRepository.findAll()
        .then((users) => {
          [user] = users;
          return entriesRepository.save({ ...entrySampleWithoutID, userID: users[0].id });
        })
        .then(() => {
          const user1Token = createToken({ id: user.id });
          return chai.request(app)
            .put('/api/v1/entries/5yh90ik')
            .set(AuthenticationMiddleware.AUTHORIZATION_HEADER, user1Token)
            .send({ ...entrySampleWithoutID, id: '5yh90ik', userID: user.id })
            .then((res) => {
              res.should.have.status(400);
              res.body.should.be.a('object');
              res.body.should.have.property('message');
              res.body.should.have.property('status');
            });
        });
    });
    it('it should modify entry owned by user', () => {
      let users;
      return userRepository.findAll()
        .then((result) => {
          users = result;
          return entriesRepository.save({ ...entrySampleWithoutID, userID: users[0].id });
        })
        .then((result) => {
          const token = createToken({ id: users[0].id });
          const entry = { ...result };
          entry.content = 'Modified content';
          return chai.request(app)
            .put(`/api/v1/entries/${entry.id}`)
            .set(AuthenticationMiddleware.AUTHORIZATION_HEADER, token)
            .send(entry)
            .then((res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('message');
              res.body.should.have.property('status');
              res.body.should.have.property('entry');

              res.body.entry.should.have.property('id').eql(entry.id);
              res.body.entry.should.have.property('content').eql(entry.content);
              res.body.entry.should.have.property('userID').eql(users[0].id);
              res.body.entry.should.have.property('createdDate');
              res.body.entry.should.have.property('lastModified');
            });
        });
    });
    it('it should not modify entry not owned by user', () => {
      let users;
      return userRepository.findAll()
        .then((result) => {
          users = result;
          return entriesRepository.save({ ...entrySampleWithoutID, userID: users[1].id });
        })
        .then((result) => {
          const entry = { ...result };
          entry.content = 'Modified content';
          const token = createToken({ id: users[0].id });
          return chai.request(app)
            .put(`/api/v1/entries/${entry.id}`)
            .set(AuthenticationMiddleware.AUTHORIZATION_HEADER, token)
            .send(entrySampleWithoutID)
            .then((res) => {
              res.should.have.status(403);
              res.body.should.be.a('object');
              res.body.should.have.property('message');
              res.body.should.have.property('status');
            });
        });
    });
    it('should not modify entry after day it was created', () => {
      let users;
      let aDayB4;
      return userRepository.findAll()
        .then((result) => {
          users = result;
          const now = new Date();
          aDayB4 = new Date(now.getTime() - (864e5));

          return entriesRepository.save({
            ...entrySampleWithoutID,
            createdDate: aDayB4,
            lastModified: aDayB4,
            userID: users[0].id,
          });
        })
        .then((result) => {
          const token = createToken({ id: users[0].id });
          const entry = { ...result };
          entry.content = 'Modified content';
          return chai.request(app)
            .put(`/api/v1/entries/${entry.id}`)
            .set(AuthenticationMiddleware.AUTHORIZATION_HEADER, token)
            .send(entry)
            .then((res) => {
              res.should.have.status(403);
              res.body.should.be.a('object');
              res.body.should.have.property('message');
              res.body.should.have.property('status');
              return entriesRepository.findById(entry.id);
            });
        }).then((entry) => {
          assert.equal(entry.lastModified.getDay() === aDayB4.getDay(), true);
        });
    });
    // it('should modify entry within the same day it was created', () => {
    //   let users;
    //   return userRepository.findAll()
    //     .then((result) => {
    //       users = result;
    //       const now = new Date();
    //       const aDayB4 = new Date(now.getFullYear(), now.getMonth(), now.getDay() - 1);
    //       return entriesRepository.save({
    //         ...entrySampleWithoutID,
    //         createdDate: aDayB4,
    //         lastModified: aDayB4,
    //         userID: users[0].id,
    //       });
    //     })
    //     .then((result) => {
    //       const token = createToken({ id: users[0].id });
    //       const entry = { ...result };
    //       entry.content = 'Modified content';
    //       return chai.request(app)
    //         .put(`/api/v1/entries/${entry.id}`)
    //         .set(AuthenticationMiddleware.AUTHORIZATION_HEADER, token)
    //         .send(entry)
    //         .then((res) => {
    //           res.should.have.status(403);
    //           res.body.should.be.a('object');
    //           res.body.should.have.property('id').eql(entry.id);
    //           res.body.should.have.property('content').eql(entry.content);
    //           res.body.should.have.property('userID').eql(users[0].id);
    //           res.body.should.have.property('createdDate');
    //           res.body.should.have.property('lastModified');
    //         });
    //     })
    // });
  });
  describe('GET /api/v1/entries/:id Get Entry with given id', () => {
    it('it should get entry owned by user with provided token', () => {
      let users;
      return userRepository.findAll()
        .then((result) => {
          users = result;
          return entriesRepository.save({ ...entrySampleWithoutID, userID: users[0].id });
        })
        .then((entry) => {
          const user1Token = createToken({ id: users[0].id });
          return chai.request(app)
            .get(`/api/v1/entries/${entry.id}`)
            .set(AuthenticationMiddleware.AUTHORIZATION_HEADER, user1Token)
            .then((res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('message');
              res.body.should.have.property('status');
              res.body.should.have.property('entry');

              res.body.entry.should.have.property('content').eql(entry.content);
              res.body.entry.should.have.property('userID').eql(users[0].id);
              res.body.entry.should.have.property('createdDate');
              res.body.entry.should.have.property('lastModified');
            });
        });
    });
    it('it not should get entry not owned by user with given token', () => {
      let users;
      return userRepository.findAll()
        .then((result) => {
          users = result;
          return entriesRepository.save({ ...entrySampleWithoutID, userID: users[0].id });
        })
        .then(() => entriesRepository.save({ ...entrySampleWithoutID, userID: users[1].id }))
        .then((entry2) => {
          const user1Token = createToken({ id: users[0].id });
          return chai.request(app)
            .get(`/api/v1/entries/${entry2.id}`)
            .set(AuthenticationMiddleware.AUTHORIZATION_HEADER, user1Token)
            .then((res) => {
              res.should.have.status(403);
              res.body.should.be.a('object');
              res.body.should.have.property('message');
              res.body.should.have.property('status');
            });
        });
    });
    it('it should return 404 error when entry with the given id doesn\'t exists', () => {
      let users;
      return userRepository.findAll()
        .then((result) => {
          users = result;
          return entriesRepository.save({ ...entrySampleWithoutID, userID: users[0].id });
        })
        .then(() => {
          const user1Token = createToken({ id: users[0].id });
          return chai.request(app)
            .get('/api/v1/entries/567829')
            .set(AuthenticationMiddleware.AUTHORIZATION_HEADER, user1Token)
            .then((res) => {
              res.should.have.status(404);
              res.body.should.be.a('object');
              res.body.should.have.property('message');
              res.body.should.have.property('status');
            });
        });
    });
    it('it should return 400 error when entry with invalid id is provided', () => {
      let users;
      const url = '/api/v1/entries/5yh90ik';
      return userRepository.findAll()
        .then((result) => {
          users = result;
          return entriesRepository.save({ ...entrySampleWithoutID, userID: users[0].id });
        })
        .then(() => {
          const user1Token = createToken({ id: users[0].id });
          return validateIDTest(chai.request(app)
            .get(url), user1Token);
        })
        .then(() => {
          const user1Token = createToken({ id: users[0].id });
          return validateIDTest(chai.request(app)
            .put(url), user1Token);
        })
        .then(() => {
          const user1Token = createToken({ id: users[0].id });
          return validateIDTest(chai.request(app)
            .delete(url), user1Token);
        });
    });
  });

  describe('DELETE /api/v1/entries/:id Delete Entry', () => {
    it('it should delete entry owned by user with provided token', () => {
      let users;
      return userRepository.findAll()
        .then((result) => {
          users = result;
          return entriesRepository.save({ ...entrySampleWithoutID, userID: users[0].id });
        })
        .then(() => entriesRepository.save({ ...entrySampleWithoutID, userID: users[0].id }))
        .then(() => entriesRepository.save({ ...entrySampleWithoutID, userID: users[0].id }))
        .then((entry) => {
          const user1Token = createToken({ id: users[0].id });
          return chai.request(app)
            .delete(`/api/v1/entries/${entry.id}`)
            .set(AuthenticationMiddleware.AUTHORIZATION_HEADER, user1Token)
            .then((res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('message');
              res.body.should.have.property('status');
              return entriesRepository.findAllByCreator(users[0].id);
            })
            .then((entries) => {
              assertTrue(entries.length === 2);
            });
        });
    }).timeout(5000);
    it('it not should detele entry not owned by user with given token', () => {
      let users;
      return userRepository.findAll()
        .then((result) => {
          users = result;
          return entriesRepository.save({ ...entrySampleWithoutID, userID: users[0].id });
        })
        .then(() => entriesRepository.save({ ...entrySampleWithoutID, userID: users[1].id }))
        .then((entry2) => {
          const user1Token = createToken({ id: users[0].id });
          return chai.request(app)
            .delete(`/api/v1/entries/${entry2.id}`)
            .set(AuthenticationMiddleware.AUTHORIZATION_HEADER, user1Token)
            .then((res) => {
              res.should.have.status(403);
              res.body.should.be.a('object');
              res.body.should.have.property('message');
              res.body.should.have.property('status');
            });
        });
    });
    it('it should return 404 error when entry with the given id doesn\'t exists', () => {
      let users;
      return userRepository.findAll()
        .then((result) => {
          users = result;
          return entriesRepository.save({ ...entrySampleWithoutID, userID: users[0].id });
        })
        .then(() => {
          const user1Token = createToken({ id: users[0].id });
          return chai.request(app)
            .delete('/api/v1/entries/567829')
            .set(AuthenticationMiddleware.AUTHORIZATION_HEADER, user1Token)
            .then((res) => {
              res.should.have.status(404);
              res.body.should.be.a('object');
              res.body.should.have.property('message');
              res.body.should.have.property('status');
            });
        });
    });
  });
});

function validateIDTest(promise, token) {
  return promise
    .set(AuthenticationMiddleware.AUTHORIZATION_HEADER, token)
    .then((res) => {
      res.should.have.status(400);
      res.body.should.be.a('object');
      res.body.should.have.property('message');
      res.body.should.have.property('status');
    });
}
