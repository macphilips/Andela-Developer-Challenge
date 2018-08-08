// Require the dev-dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';
import * as assert from 'assert';
import bcrypt from 'bcryptjs';
import { createToken } from '../../../middlewares/jwtProvider';
import db from '../../../db';
import { app } from '../../../app';
import AuthenticationMiddleware from '../../../middlewares/jwtFilter';
import AccountController from '../../../controllers/accountController';
import { entrySampleWithoutID } from './entriesEndpoint';

chai.use(chaiHttp);
const should = chai.should();

const userRepository = db.connection.users;
const reminderRepository = db.connection.reminder;
const entriesRepository = db.connection.entries;

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
            res.body.should.have.property('status');
          }));

      it('it should not allow access to resource when provided with an invalid token',
        () => userRepository.save({
          firstName: 'John', lastName: 'Doe', password: 'topsecret', email: 'user@local',
        })
          .then((user) => {
            const token = createToken({ id: user.id }).substring(2);
            return chai.request(app)
              .get('/api/v1/account/me')
              .set(AuthenticationMiddleware.AUTHORIZATION_HEADER, token)
              .then((res) => {
                res.should.have.status(401);
                res.body.should.be.a('object');
                res.body.should.have.property('status');
                res.body.should.have.property('message');
              });
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
            .set(AuthenticationMiddleware.AUTHORIZATION_HEADER, token)
            .then((res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('status');
              res.body.should.have.property('message');
              res.body.should.have.property('user');
              res.body.user.should.have.property('firstName').eql(user.firstName);
              res.body.user.should.have.property('lastName').eql(user.lastName);
              res.body.user.should.have.property('email').eql(user.email);
              res.body.user.should.have.property('id').eql(user.id);
              res.body.user.should.not.have.property('password');
            });
        }));
    });

    describe('GET /api/v1/account/me/detailed Get User', () => {
      beforeEach(() => userRepository.clear());
      it('it should GET current user with the provided token',
        () => {
          let token;
          let reminder;
          let user;
          return userRepository.save({
            firstName: 'John',
            lastName: 'Doe',
            password: 'topsecret',
            email: 'user@local',
          })
            .then((result) => {
              user = result;
              token = createToken({ id: user.id });
              reminder = AccountController.getDefaultReminderSettings(user);
              return reminderRepository
                .save(reminder);
            })
            .then(() => entriesRepository.save({ ...entrySampleWithoutID, userID: user.id }))
            .then(() => entriesRepository.save({ ...entrySampleWithoutID, userID: user.id }))
            .then(() => entriesRepository.save({ ...entrySampleWithoutID, userID: user.id }))
            .then(() => entriesRepository.save({ ...entrySampleWithoutID, userID: user.id }))
            .then(() => chai.request(app)
              .get('/api/v1/account/me/detailed')
              .set(AuthenticationMiddleware.AUTHORIZATION_HEADER, token)
              .then((res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('status');
                res.body.should.have.property('message');
                res.body.should.have.property('user');
                res.body.user.should.have.property('firstName').eql(user.firstName);
                res.body.user.should.have.property('lastName').eql(user.lastName);
                res.body.user.should.have.property('email').eql(user.email);
                res.body.user.should.have.property('id').eql(user.id);
                res.body.user.should.not.have.property('password');

                res.body.user.should.have.property('entry');
                res.body.user.entry.should.have.property('count').eql(4);

                res.body.user.should.have.property('reminder');
                res.body.user.reminder.should.have.property('to').eql(reminder.to);
                res.body.user.reminder.should.have.property('from').eql(reminder.from);
                res.body.user.reminder.should.have.property('time').eql(reminder.time);
                res.body.user.reminder.should.have.property('userId').eql(user.id);
              }));
        }).timeout(7000);
    });

    describe('POST /api/v1/account/change-password update user for authorized user', () => {
      beforeEach(() => userRepository.clear());
      it('should not update password when old password is incorrect', () => userRepository
        .save({
          firstName: 'John', lastName: 'Doe', password: bcrypt.hashSync('topsecret', 8), email: 'user@local',
        })
        .then(user => chai.request(app)
          .post('/api/v1/account/change-password')
          .set(AuthenticationMiddleware.AUTHORIZATION_HEADER, createToken({ id: user.id }))
          .send({ oldPassword: 'incorrect', newPassword: 'new password' })
          .then((res) => {
            res.should.have.status(403);
            res.body.should.be.a('object');
            res.body.should.have.property('status');
            res.body.should.have.property('message');
            return userRepository.findOneByEmail(user.email);
          })
          .then((result) => {
            assertTrue(!bcrypt.compareSync('new password', result.password));
          })));

      it('should update user password, this endpoint requires user should be authenticated',
        () => userRepository
          .save({
            firstName: 'John', lastName: 'Doe', password: bcrypt.hashSync('topsecret', 8), email: 'user@local',
          })
          .then(user => chai.request(app)
            .post('/api/v1/account/change-password')
            .set(AuthenticationMiddleware.AUTHORIZATION_HEADER, createToken({ id: user.id }))
            .send({ oldPassword: 'topsecret', newPassword: 'new password' })
            .then((res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('status');
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
                .set(AuthenticationMiddleware.AUTHORIZATION_HEADER, token)
                .send({ time: '    ', from: 'SUNDAY', to: 'MONDAY' })
                .then((res) => {
                  res.should.have.status(400);
                  res.body.should.be.a('object');
                  res.body.should.have.property('status');
                  res.body.should.have.property('message');
                });
            })
            .then(() => chai.request(app)
              .put(url)
              .set(AuthenticationMiddleware.AUTHORIZATION_HEADER, token)
              .send({ time: 'wefgyrgf', from: 'SUNDAY', to: 'MONDAY' })
              .then((res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('status');
                res.body.should.have.property('message');
              }))

            .then(() => chai.request(app)
              .put(url)
              .set(AuthenticationMiddleware.AUTHORIZATION_HEADER, token)
              .send({ time: '67:90', from: 'SUNDAY', to: 'MONDAY' })
              .then((res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('status');
                res.body.should.have.property('message');
              }))

            .then(() => chai.request(app)
              .put(url)
              .set(AuthenticationMiddleware.AUTHORIZATION_HEADER, token)
              .send({ time: '23:09', from: 'SUNDAY', to: '$EFG@' })
              .then((res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('status');
                res.body.should.have.property('message');
              }))

            .then(() => chai.request(app)
              .put(url)
              .set(AuthenticationMiddleware.AUTHORIZATION_HEADER, token)
              .send({ time: '23:09', from: 'NSOKX', to: 'SUNDAY' })
              .then((res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('status');
                res.body.should.have.property('message');
              }))

            .then(() => chai.request(app)
              .put(url)
              .set(AuthenticationMiddleware.AUTHORIZATION_HEADER, token)
              .send({ time: '-21:22', from: 'SUNDAY', to: 'MONDAY' })
              .then((res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('status');
                res.body.should.have.property('message');
              })
              .catch((err) => {
                throw err;
              }));
        }).timeout(5000);

      it('it should PUT a reminder settings', () => {
        let token;
        return userRepository.save({
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
              .set(AuthenticationMiddleware.AUTHORIZATION_HEADER, token)
              .send(settings)
              .then((res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('status');
                res.body.should.have.property('message');
                res.body.should.have.property('reminder');
                res.body.reminder.should.have.property('time').eql(settings.time);
                res.body.reminder.should.have.property('from').eql(settings.from);
                res.body.reminder.should.have.property('to').eql(settings.to);
                res.body.reminder.should.have.property('userId').eql(reminder.userId);
              });
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
            res.body.should.have.property('status');
            res.body.should.have.property('message');
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
              .set(AuthenticationMiddleware.AUTHORIZATION_HEADER, token)
              .then((res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('status');
                res.body.should.have.property('message');
                res.body.should.have.property('reminder');
                res.body.reminder.should.have.property('time').eql(result.time);
                res.body.reminder.should.have.property('userId').eql(result.userId);
              }));
        });
    });
  });
});
