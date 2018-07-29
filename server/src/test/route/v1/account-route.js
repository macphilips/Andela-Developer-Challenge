// Require the dev-dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';
import * as assert from 'assert';
import bcrypt from 'bcryptjs';
import { createToken } from '../../../middlewares/jwt-provider';
import db from '../../../db';
import { app } from '../../../app';

chai.use(chaiHttp);
const should = chai.should();

const userRepository = db.connection.users;
const reminderRepository = db.connection.reminder;

function assertTrue(match) {
  assert.equal(match, true);
}

describe('Account API test', () => {
  before(() => db.init());
  describe('User management test', () => {
    describe('GET /api/v1/account/me Get User', () => {
      beforeEach(() => userRepository.clear());
      it('it should not allow access to resource when authentication is not provided',
        () => chai.request(app)
          .get('/api/v1/account/me')
          .then((res) => {
            res.should.have.status(401);
            res.body.should.be.a('object');
            res.body.should.have.property('message');
          }));
      // .catch((err) => {
      //    throw err;
      //  }));
      it('it should not allow access to resource when provided with an invalid token',
        () => userRepository.save({
          firstName: 'John', lastName: 'Doe', password: 'topsecret', email: 'user@local',
        })
          .then((user) => {
            const token = createToken({ id: user.id }).substring(2);
            return chai.request(app)
              .get('/api/v1/account/me')
              .set('x-access-token', token)
              .then((res) => {
                res.should.have.status(401);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
              });
          }));
      // .catch((err) => {
      //   throw err;
      // }));

      it('it should GET current user with the provided token', () => userRepository.save({
        firstName: 'John',
        lastName: 'Doe',
        password: 'topsecret',
        email: 'user@local',
      })
        .then((user) => {
          const token = createToken({ id: user.id });
          return chai.request(app)
            .get('/api/v1/account/me')
            .set('x-access-token', token)
            .then((res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('firstName').eql(user.firstName);
              res.body.should.have.property('lastName').eql(user.lastName);
              res.body.should.have.property('email').eql(user.email);
              res.body.should.have.property('id').eql(user.id);
              res.body.should.not.have.property('password');
            });
          // .catch((err) => {
          //   throw err;
          // });
        }));
    });
    describe('POST /api/v1/account/change-password update user for authorized user', () => {
      beforeEach(() => userRepository.clear());
      it('should not update password when old password is incorrect', () => userRepository
        .save({
          firstName: 'John', lastName: 'Doe', password: bcrypt.hashSync('topsecret', 8), email: 'user@local',
        })
        .then(user => chai.request(app)
          .post('/api/v1/account/change-password')
          .set('x-access-token', createToken({ id: user.id }))
          .send({ oldPassword: 'incorrect', newPassword: 'new password' })
          .then((res) => {
            res.should.have.status(403);
            res.body.should.be.a('object');
            res.body.should.have.property('message');
            return userRepository.findOneByEmail(user.email);
          })
          .then((result) => {
            assertTrue(!bcrypt.compareSync('new password', result.password));
          })));
      // .catch((err) => {
      //   throw err;
      // })

      it('should update user password, this endpoint requires user should be authenticated',
        () => userRepository
          .save({
            firstName: 'John', lastName: 'Doe', password: bcrypt.hashSync('topsecret', 8), email: 'user@local',
          })
          .then(user => chai.request(app)
            .post('/api/v1/account/change-password')
            .set('x-access-token', createToken({ id: user.id }))
            .send({ oldPassword: 'topsecret', newPassword: 'new password' })
            .then((res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('message');
              return userRepository.findOneByEmail(user.email);
            })
            .then((result) => {
              assertTrue(bcrypt.compareSync('new password', result.password));
            })));
      // .catch((err) => {
      //   throw err;
      // })
    });
  });
  describe('Reminder test', () => {
    describe('PUT /api/v1/account/user/reminder/settings update reminder settings', () => {
      beforeEach(() => userRepository.clear());
      it('it should not POST a setting when provided with invalid time input',
        () => {
          const url = '/api/v1/account/user/reminder/settings';
          let token = '';
          return userRepository.save({
            firstName: 'John', lastName: 'Doe', password: 'topsecret', email: 'user@local',
          })
            .then((user) => {
              token = createToken({ id: user.id });
              return chai.request(app)
                .put(url)
                .set('x-access-token', token)
                .send({ time: '' })
                .then((res) => {
                  res.should.have.status(400);
                  res.body.should.be.a('object');
                  res.body.should.have.property('message');
                });
            })
            .then(() => chai.request(app)
              .put(url)
              .set('x-access-token', token)
              .send({ time: 'wefgyrgf' })
              .then((res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
              }))
            .then(() => chai.request(app)
              .put(url)
              .set('x-access-token', token)
              .send({ time: '67:90' })
              .then((res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
              }))
            .then(() => chai.request(app)
              .put(url)
              .set('x-access-token', token)
              .send({ time: '-21:22' })
              .then((res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
              }));
          // .catch((err) => {
          //   throw err;
          // });
        });
      it('it should PUT a reminder settings', () => {
        let token;
        userRepository.save({
          firstName: 'John', lastName: 'Doe', password: 'topsecret', email: 'example@local',
        })
          .then((user) => {
            token = createToken({ id: user.id });
            return reminderRepository.save({
              from: 'Monday', to: 'Sunday', time: '19:10', userId: user.id,
            });
          })
          .then((reminder) => {
            const url = '/api/v1/account/user/reminder/settings';
            const settings = { time: '18:23', from: 'TUESDAY', to: 'FRIDAY' };
            return chai.request(app)
              .put(url)
              .set('x-access-token', token)
              .send(settings)
              .then((res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('time').eql(settings.time);
                res.body.should.have.property('from').eql(settings.from);
                res.body.should.have.property('to').eql(settings.to);
                res.body.should.have.property('userId').eql(reminder.userId);
              });
            // .catch((err) => {
            //   throw err;
            // });
          });
      });
    });
    describe('GET /api/v1/account/user/reminder/settings Get reminder settings', () => {
      beforeEach(() => userRepository.clear());
      it('it should not allow access to resource when authentication is not provided',
        () => chai.request(app)
          .get('/api/v1/account/user/reminder/settings')
          .then((res) => {
            res.should.have.status(401);
            res.body.should.be.a('object');
            res.body.should.have.property('message');
          }));
      // .catch((err) => {
      //   throw err;
      // })
      it('it should GET current user reminder setting when provided with a valid token',
        () => {
          let token = '';
          return userRepository
            .save({
              firstName: 'John',
              lastName: 'Doe',
              password: 'topsecret',
              email: 'user@local',
            })
            .then((user) => {
              token = createToken({ id: user.id });
              return reminderRepository.save({
                from: 'Monday', to: 'Sunday', time: '19:10', userId: user.id,
              });
            })
            .then(result => chai.request(app)
              .get('/api/v1/account/user/reminder/settings')
              .set('x-access-token', token)
              .then((res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('time').eql(result.time);
                res.body.should.have.property('userId').eql(result.userId);
              }));
          // .catch((err) => {
          //   throw err;
          // })
        });
    });
  });
});
