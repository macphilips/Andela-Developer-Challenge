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
          })
          .catch((err) => {
            throw err;
          }));
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
                console.log('body => ', res.body);
              });
          })
          .catch((err) => {
            throw err;
          }));
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
            })
            .catch((err) => {
              throw err;
            });
        }));
    });
    describe('POST /api/v1/account/change-password', () => {
      before(() => userRepository.clear());
      it('should change user password this endpoint requires user should be authenticated',
        () => userRepository
          .save({
            firstName: 'John', lastName: 'Doe', password: 'topsecret', email: 'user@local',
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
              .post(url)
              .set('x-access-token', token)
              .send({ time: 'wefgyrgf' })
              .then((res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
              }))
            .then(() => chai.request(app)
              .post(url)
              .set('x-access-token', token)
              .send({ time: '67:90' })
              .then((res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
              }))
            .then(() => chai.request(app)
              .post(url)
              .set('x-access-token', token)
              .send({ time: '-21:22' })
              .then((res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
              }))
            .catch((err) => {
              throw err;
            });
        });
      it('it should POST a reminder settings', () => userRepository.save({
        firstName: 'John', lastName: 'Doe', password: 'topsecret', email: 'example@local',
      })
        .then((user) => {
          const url = '/api/v1/account/user/reminder/settings';
          const token = createToken({ id: user.id });
          const time = '18:23';
          return chai.request(app)
            .put(url)
            .set('x-access-token', token)
            .send({ time })
            .then((res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('time').eql(time);
              res.body.should.have.property('userId').eql(user.id);
            })
            .catch((err) => {
              throw err;
            });
        }));
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
          })
          .catch((err) => {
            throw err;
          }));

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
                res.body.should.have.property('userId').eql(user.id);
              })
              .catch((err) => {
                throw err;
              }));
        });
    });
  });
});
