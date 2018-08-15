import chai from 'chai';
import bcrypt from 'bcryptjs';
import chaiHttp from 'chai-http';
import * as assert from 'assert';
import { app } from '../../../app';
import { createToken } from '../../../middlewares/jwtProvider';
import db from '../../../db';
import AuthenticationMiddleware from '../../../middlewares/jwtFilter';
import { assertDefaultResponseBody } from './accountRoute';

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

function assertEntryBody(body, entry, userID) {
  body.should.have.property('entry');
  body.entry.should.have.property('id');
  if (entry.id) body.entry.should.have.property('id').eql(entry.id);
  body.entry.should.have.property('content').eql(entry.content);
  body.entry.should.have.property('title').eql(entry.title);
  body.entry.should.have.property('userID').eql(userID);
  body.entry.should.have.property('createdDate');
  body.entry.should.have.property('lastModified');
}

function validateEntryInput(url, body, token, update) {
  let method = chai.request(app);
  if (update) {
    method = method.put(url);
  } else {
    method = method.post(url);
  }
  return method
    .set(AuthenticationMiddleware.AUTHORIZATION_HEADER, token)
    .send(body)
    .then((res) => {
      assertDefaultResponseBody(res, 400);
    });
}

function validateInput(url, user, update) {
  const token = createToken({ id: user.id });
  return validateEntryInput(url, { title: '       ', content: entrySampleWithoutID.content }, token, update)
    .then(() => validateEntryInput(url, {
      title: entrySampleWithoutID.title,
      content: '                 ',
    }, token, update))
    .then(() => validateEntryInput(url, { title: '23', content: entrySampleWithoutID.content }, token, update));
}

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
        const [user] = users;
        const token = createToken({ id: user.id });
        return chai.request(app)
          .post('/api/v1/entries')
          .set(AuthenticationMiddleware.AUTHORIZATION_HEADER, token)
          .send(entrySampleWithoutID)
          .then((res) => {
            assertDefaultResponseBody(res, 201);
            assertEntryBody(res.body, entrySampleWithoutID, user.id);
          });
      }));
    it('it should not allow modification of entry using POST request', () => {
      let user;
      return userRepository.findAll()
        .then((result) => {
          [user] = result;
          return entriesRepository.save({ ...entrySampleWithoutID, userID: user.id });
        })
        .then((entry) => {
          const token = createToken({ id: user.id });
          return chai.request(app)
            .post('/api/v1/entries')
            .set(AuthenticationMiddleware.AUTHORIZATION_HEADER, token)
            .send(entry)
            .then((res) => {
              assertDefaultResponseBody(res, 403);
            });
        });
    });

    it('it should not POST a entry when provided with invalid entry input ',
      () => userRepository.findAll()
        .then(users => validateInput('/api/v1/entries', users[0])));
  });
  describe('GET /api/v1/entries Get all entries', () => {
    // it('it should return 404 error when user has no entries', () => {
    //   let user;
    //   let user1;
    //   return userRepository.findAll()
    //     .then((result) => {
    //       [user, user1] = result;
    //       return entriesRepository.save({ ...entrySampleWithoutID, userID: user1.id });
    //     })
    //     .then(() => entriesRepository.save({ ...entrySampleWithoutID, userID: user1.id }))
    //     .then(() => entriesRepository.save({ ...entrySampleWithoutID, userID: user1.id }))
    //     .then(() => {
    //       const user1Token = createToken({ id: user.id });
    //       return chai.request(app)
    //         .get('/api/v1/entries')
    //         .set(AuthenticationMiddleware.AUTHORIZATION_HEADER, user1Token)
    //         .then((res) => {
    //           assertDefaultResponseBody(res, 404);
    //         });
    //     });
    // });
    it('it should list all entries owned by user with provided token', () => {
      let user;
      let user1;
      return userRepository.findAll()
        .then((result) => {
          [user, user1] = result;
          return entriesRepository.save({ ...entrySampleWithoutID, userID: user.id });
        })
        .then(() => entriesRepository.save({ ...entrySampleWithoutID, userID: user.id }))
        .then(() => entriesRepository.save({ ...entrySampleWithoutID, userID: user.id }))
        .then(() => entriesRepository.save({ ...entrySampleWithoutID, userID: user1.id }))
        .then(() => entriesRepository.save({ ...entrySampleWithoutID, userID: user1.id }))
        .then(() => {
          const user1Token = createToken({ id: user.id });
          return chai.request(app)
            .get('/api/v1/entries')
            .set(AuthenticationMiddleware.AUTHORIZATION_HEADER, user1Token)
            .then((res) => {
              assertDefaultResponseBody(res, 200);
              res.body.should.have.property('data');
              res.body.data.should.have.property('page');
              res.body.data.should.have.property('totalEntries');
              res.body.data.should.have.property('entries');
              res.body.data.entries.length.should.be.eql(3);
            });
        });
    }).timeout(7000);
  });
  describe('PUT /api/v1/entries/:id Modify entry', () => {
    it('it should not PUT a entry when provided with invalid entry input ',
      () => {
        let user;
        return userRepository.findAll()
          .then((users) => {
            [user] = users;
            return entriesRepository.save({ ...entrySampleWithoutID, userID: users.id });
          })
          .then(entry => validateInput(`/api/v1/entries/${entry.id}`, user, true));
      }).timeout(5000);
    it('should return a 404 error when users try to modify entry that doesn\'t exists',
      () => userRepository.findAll()
        .then((users) => {
          const [user] = users;
          const token = createToken({ id: user.id });
          return chai.request(app)
            .put('/api/v1/entries/93764623')
            .set(AuthenticationMiddleware.AUTHORIZATION_HEADER, token)
            .send({ ...entrySampleWithoutID, id: 764623, userID: user.id })
            .then((res) => {
              assertDefaultResponseBody(res, 404);
            });
        }));

    it('it should return 400 error when entry with invalid id is provided', () => {
      let user;
      return userRepository.findAll()
        .then((users) => {
          [user] = users;
          return entriesRepository.save({ ...entrySampleWithoutID, userID: user.id });
        })
        .then(() => {
          const user1Token = createToken({ id: user.id });
          return chai.request(app)
            .put('/api/v1/entries/5yh90ik')
            .set(AuthenticationMiddleware.AUTHORIZATION_HEADER, user1Token)
            .send({ ...entrySampleWithoutID, id: '5yh90ik', userID: user.id })
            .then((res) => {
              assertDefaultResponseBody(res, 400);
            });
        });
    });
    it('it should modify entry owned by user', () => {
      let user;
      return userRepository.findAll()
        .then((result) => {
          [user] = result;
          return entriesRepository.save({ ...entrySampleWithoutID, userID: user.id });
        })
        .then((result) => {
          const token = createToken({ id: user.id });
          const entry = { ...result };
          entry.content = 'Modified content';
          return chai.request(app)
            .put(`/api/v1/entries/${entry.id}`)
            .set(AuthenticationMiddleware.AUTHORIZATION_HEADER, token)
            .send(entry)
            .then((res) => {
              assertDefaultResponseBody(res);
              assertEntryBody(res.body, entry, user.id);
            });
        });
    });
    it('it should not modify entry not owned by user', () => {
      let user;
      let user1;
      return userRepository.findAll()
        .then((result) => {
          [user, user1] = result;
          return entriesRepository.save({ ...entrySampleWithoutID, userID: user1.id });
        })
        .then((result) => {
          const entry = { ...result };
          entry.content = 'Modified content';
          const token = createToken({ id: user.id });
          return chai.request(app)
            .put(`/api/v1/entries/${entry.id}`)
            .set(AuthenticationMiddleware.AUTHORIZATION_HEADER, token)
            .send(entrySampleWithoutID)
            .then((res) => {
              assertDefaultResponseBody(res, 403);
            });
        });
    });
    it('should not modify entry after day it was created', () => {
      let user;
      let aDayB4;
      return userRepository.findAll()
        .then((result) => {
          [user] = result;
          const now = new Date();
          aDayB4 = new Date(now.getTime() - (864e5));

          return entriesRepository.save({
            ...entrySampleWithoutID,
            createdDate: aDayB4,
            lastModified: aDayB4,
            userID: user.id,
          });
        })
        .then((result) => {
          const token = createToken({ id: user.id });
          const entry = { ...result };
          entry.content = 'Modified content';
          return chai.request(app)
            .put(`/api/v1/entries/${entry.id}`)
            .set(AuthenticationMiddleware.AUTHORIZATION_HEADER, token)
            .send(entry)
            .then((res) => {
              assertDefaultResponseBody(res, 403);
              return entriesRepository.findById(entry.id);
            });
        }).then((entry) => {
          assert.equal(entry.lastModified.getDay() === aDayB4.getDay(), true);
        });
    });
  });
  describe('GET /api/v1/entries/:id Get Entry with given id', () => {
    it('it should get entry owned by user with provided token', () => {
      let user;
      return userRepository.findAll()
        .then((result) => {
          [user] = result;
          return entriesRepository.save({ ...entrySampleWithoutID, userID: user.id });
        })
        .then((entry) => {
          const user1Token = createToken({ id: user.id });
          return chai.request(app)
            .get(`/api/v1/entries/${entry.id}`)
            .set(AuthenticationMiddleware.AUTHORIZATION_HEADER, user1Token)
            .then((res) => {
              assertDefaultResponseBody(res);
              assertEntryBody(res.body, entry, user.id);
            });
        });
    });
    it('it not should get entry not owned by user with given token', () => {
      let user;
      let user1;
      return userRepository.findAll()
        .then((result) => {
          [user, user1] = result;
          return entriesRepository.save({ ...entrySampleWithoutID, userID: user.id });
        })
        .then(() => entriesRepository.save({ ...entrySampleWithoutID, userID: user1.id }))
        .then((entry2) => {
          const user1Token = createToken({ id: user.id });
          return chai.request(app)
            .get(`/api/v1/entries/${entry2.id}`)
            .set(AuthenticationMiddleware.AUTHORIZATION_HEADER, user1Token)
            .then((res) => {
              assertDefaultResponseBody(res, 403);
            });
        });
    });
    it('it should return 404 error when entry with the given id doesn\'t exists', () => {
      let user;
      return userRepository.findAll()
        .then((result) => {
          [user] = result;
          return entriesRepository.save({ ...entrySampleWithoutID, userID: user.id });
        })
        .then(() => {
          const user1Token = createToken({ id: user.id });
          return chai.request(app)
            .get('/api/v1/entries/567829')
            .set(AuthenticationMiddleware.AUTHORIZATION_HEADER, user1Token)
            .then((res) => {
              assertDefaultResponseBody(res, 404);
            });
        });
    });
    it('it should return 400 error when entry with invalid id is provided', () => {
      let user;
      const url = '/api/v1/entries/5yh90ik';
      return userRepository.findAll()
        .then((result) => {
          [user] = result;
          return entriesRepository.save({ ...entrySampleWithoutID, userID: user.id });
        })
        .then(() => {
          const user1Token = createToken({ id: user.id });
          return validateIDTest(chai.request(app)
            .get(url), user1Token);
        })
        .then(() => {
          const user1Token = createToken({ id: user.id });
          return validateIDTest(chai.request(app)
            .put(url), user1Token);
        })
        .then(() => {
          const user1Token = createToken({ id: user.id });
          return validateIDTest(chai.request(app)
            .delete(url), user1Token);
        });
    });
  });
  describe('DELETE /api/v1/entries/:id Delete Entry', () => {
    it('it should delete entry owned by user with provided token', () => {
      let user;
      return userRepository.findAll()
        .then((result) => {
          [user] = result;
          return entriesRepository.save({ ...entrySampleWithoutID, userID: user.id });
        })
        .then(() => entriesRepository.save({ ...entrySampleWithoutID, userID: user.id }))
        .then(() => entriesRepository.save({ ...entrySampleWithoutID, userID: user.id }))
        .then((entry) => {
          const user1Token = createToken({ id: user.id });
          return chai.request(app)
            .delete(`/api/v1/entries/${entry.id}`)
            .set(AuthenticationMiddleware.AUTHORIZATION_HEADER, user1Token)
            .then((res) => {
              assertDefaultResponseBody(res);
              return entriesRepository.findAllByCreator(user.id);
            })
            .then((data) => {
              assertTrue(data.entries.length === 2);
            });
        });
    }).timeout(5000);
    it('it not should detele entry not owned by user with given token', () => {
      let user;
      let user2;
      return userRepository.findAll()
        .then((result) => {
          [user, user2] = result;
          return entriesRepository.save({ ...entrySampleWithoutID, userID: user.id });
        })
        .then(() => entriesRepository.save({ ...entrySampleWithoutID, userID: user2.id }))
        .then((entry2) => {
          const user1Token = createToken({ id: user.id });
          return chai.request(app)
            .delete(`/api/v1/entries/${entry2.id}`)
            .set(AuthenticationMiddleware.AUTHORIZATION_HEADER, user1Token)
            .then((res) => {
              assertDefaultResponseBody(res, 403);
            });
        });
    });
    it('it should return 404 error when entry with the given id doesn\'t exists', () => {
      let user;
      return userRepository.findAll()
        .then((result) => {
          [user] = result;
          return entriesRepository.save({ ...entrySampleWithoutID, userID: user.id });
        })
        .then(() => {
          const user1Token = createToken({ id: user.id });
          return chai.request(app)
            .delete('/api/v1/entries/567829')
            .set(AuthenticationMiddleware.AUTHORIZATION_HEADER, user1Token)
            .then((res) => {
              assertDefaultResponseBody(res, 404);
            });
        });
    });
  });
});
