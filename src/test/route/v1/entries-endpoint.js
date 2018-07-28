import chai from 'chai';
import bcrypt from 'bcryptjs';
import chaiHttp from 'chai-http';
import {app} from '../../../app';
import {createToken} from '../../../middlewares/jwt-provider';
import db from '../../../db';

const entrySampleWithoutID = {
  title: "Test case 1",
  content: 'Nam quis ultricies nisl. Nullam vel quam imperdiet, congue nunc dignissim, efficitur enim. Ut porta eu ipsum quis pellentesque. Suspendisse non molestie arcu. Cras nec convallis risus. Integer eu lectus vulputate, finibus sapien efficitur, consequat odio. In malesuada metus diam, non malesuada urna volutpat quis. ',
};

chai.use(chaiHttp);

const should = chai.should();

const userRepository = db.connection.users;
const entriesRepository = db.connection.entries;

describe('Entries API test', () => {
  before(() => {
    return db.init()
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
      }))
      .catch((err) => {
        throw err
      });
  });
  beforeEach(() => {
    return entriesRepository.clear()
  });
  describe('POST /api/v1/entries Create new entry', () => {
    it('it should create a new entry', () => {
      return userRepository.findAll()
        .then((users) => {
          const token = createToken({id: users[0].id});
          return chai.request(app)
            .post('/api/v1/entries')
            .set('x-access-token', token)
            .send(entrySampleWithoutID)
            .then((res) => {
              res.should.have.status(201);
              res.body.should.be.a('object');
              res.body.should.have.property('id');
              res.body.should.have.property('content');
              res.body.should.have.property('title');
              res.body.should.have.property('createdDate');
              res.body.should.have.property('lastModified');
            });
        });

    });
    it('it should not allow modification of entry using POST request', () => {
      let users;
      return userRepository.findAll()
        .then((result) => {
          users = result;
          return entriesRepository.save({...entrySampleWithoutID, userID: users[0].id});
        })
        .then((entry) => {
          const token = createToken({id: users[0].id});
          return chai.request(app)
            .post('/api/v1/entries')
            .set('x-access-token', token)
            .send(entry)
            .then((res) => {
              res.should.have.status(403);
              res.body.should.be.a('object');
              res.body.should.have.property('message');
            });
        }).catch((err) => {
          throw err;
        });
    });
  });
  describe('GET /api/v1/entries Get all entries', () => {
    it('it should return 404 error when user has no entries', () => {
      let users;
      return userRepository.findAll()
        .then((result) => {
          users = result;
          return entriesRepository.save({...entrySampleWithoutID, userID: users[1].id});
        })
        .then(() => entriesRepository.save({...entrySampleWithoutID, userID: users[1].id}))
        .then(() => entriesRepository.save({...entrySampleWithoutID, userID: users[1].id}))
        .then(() => {
          const user1Token = createToken({id: users[0].id});
          return chai.request(app)
            .get('/api/v1/entries')
            .set('x-access-token', user1Token)
            .then((res) => {
              res.should.have.status(404);
              res.body.should.be.a('object');
              res.body.should.have.property('message');
            });
        }).catch((err) => {
          throw err;
        });
    });
    it('it should list all entries owned by user with provided token', () => {
      let users;
      return userRepository.findAll()
        .then((result) => {
          users = result;
          return entriesRepository.save({...entrySampleWithoutID, userID: users[0].id});
        })
        .then(() => entriesRepository.save({...entrySampleWithoutID, userID: users[0].id}))
        .then(() => entriesRepository.save({...entrySampleWithoutID, userID: users[0].id}))
        .then(() => entriesRepository.save({...entrySampleWithoutID, userID: users[1].id}))
        .then(() => entriesRepository.save({...entrySampleWithoutID, userID: users[1].id}))
        .then(() => {
          const user1Token = createToken({id: users[0].id});
          return chai.request(app)
            .get('/api/v1/entries')
            .set('x-access-token', user1Token)
            .then((res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('entries');
              res.body.entries.length.should.be.eql(3);
            });
        }).catch((err) => {
          throw err;
        });
    });
  });

  describe('PUT /api/v1/entries/:id Modify entry', () => {
    it('it should modify entry owned by user', () => {
      let users;
      return userRepository.findAll()
        .then((result) => {
          users = result;
          return entriesRepository.save({...entrySampleWithoutID, userID: users[0].id});
        })
        .then((entry) => {
          const token = createToken({id: users[0].id});
          entry.content = 'Modified content';
          return chai.request(app)
            .put(`/api/v1/entries/${entry.id}`)
            .set('x-access-token', token)
            .send(entry)
            .then((res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('id').eql(entry.id);
              res.body.should.have.property('content').eql(entry.content);
              res.body.should.have.property('userID').eql(users[0].id);
              res.body.should.have.property('createdDate');
              res.body.should.have.property('lastModified');
            });
        })
        .catch((err) => {
          throw err;
        });
    });
    it('it should not modify entry not owned by user', () => {
      let users;
      return userRepository.findAll()
        .then((result) => {
          users = result;
          return entriesRepository.save({...entrySampleWithoutID, userID: users[1].id});
        })
        .then((entry) => {
          entry.content = 'Modified content';
          const token = createToken({id: users[0].id});
          return chai.request(app)
            .put(`/api/v1/entries/${entry.id}`)
            .set('x-access-token', token)
            .send(entrySampleWithoutID)
            .then((res) => {
              res.should.have.status(403);
              res.body.should.be.a('object');
              res.body.should.have.property('message');
            });
        })
        .catch((err) => {
          throw err;
        });
    });
  });
  describe('GET /api/v1/entries/:id Get Entry with given id', () => {
    it('it should get entry owned by user with provided token', () => {
      let users;
      return userRepository.findAll()
        .then((result) => {
          users = result;
          return entriesRepository.save({...entrySampleWithoutID, userID: users[0].id});
        })
        .then((entry) => {
          const user1Token = createToken({id: users[0].id});
          return chai.request(app)
            .get(`/api/v1/entries/${entry.id}`)
            .set('x-access-token', user1Token)
            .then((res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('content').eql(entry.content);
              res.body.should.have.property('userID').eql(users[0].id);
              res.body.should.have.property('createdDate');
              res.body.should.have.property('lastModified');
            });
        })
        .catch((err) => {
          throw err;
        });
    });
    it('it not should get entry not owned by user with given token', () => {
      let users;
      return userRepository.findAll()
        .then((result) => {
          users = result;
          return entriesRepository.save({...entrySampleWithoutID, userID: users[0].id});
        })
        .then(() => entriesRepository.save({...entrySampleWithoutID, userID: users[1].id}))
        .then((entry2) => {
          const user1Token = createToken({id: users[0].id});
          return chai.request(app)
            .get(`/api/v1/entries/${entry2.id}`)
            .set('x-access-token', user1Token)
            .then((res) => {
              res.should.have.status(403);
              res.body.should.be.a('object');
              res.body.should.have.property('message');

            });
        })
        .catch((err) => {
          throw err;
        });
    });
    it('it should return 404 error when entry with the given id doesn\'t exists', () => {
      let users;
      return userRepository.findAll()
        .then((result) => {
          users = result;
          return entriesRepository.save({...entrySampleWithoutID, userID: users[0].id});
        })
        .then(() => {
          const user1Token = createToken({id: users[0].id});
          return chai.request(app)
            .get('/api/v1/entries/567829')
            .set('x-access-token', user1Token)
            .then((res) => {
              res.should.have.status(404);
              res.body.should.be.a('object');
              res.body.should.have.property('message');
            });
        })
        .catch((err) => {
          throw err;
        });
    });
    // it('it should return 404 error when entry with the given id doesn\'t exists', () => {
    //   let users;
    //   return userRepository.findAll()
    //     .then((result) => {
    //       users = result;
    //       return entriesRepository.save({...entrySampleWithoutID, userID: users[0].id});
    //     })
    //     .then(() => {
    //       const user1Token = createToken({id: users[0].id});
    //       return chai.request(app)
    //         .get('/api/v1/entries/5yh90ik')
    //         .set('x-access-token', user1Token)
    //         .then((res) => {
    //           res.should.have.status(404);
    //           res.body.should.be.a('object');
    //           res.body.should.have.property('message');
    //         });
    //     })
    //     .catch((err) => {
    //       throw err;
    //     });
    // });
  });
});
