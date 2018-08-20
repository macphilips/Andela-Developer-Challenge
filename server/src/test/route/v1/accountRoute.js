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

export function assertDefaultResponseBody(res, status) {
  const code = status || 200;
  res.should.have.status(code);
  res.body.should.be.a('object');
  res.body.should.have.property('status');
  res.body.should.have.property('message');
}

function validateAuth(url, token) {
  let promise = chai.request(app)
    .get(url);
  if (token) promise = promise.set(AuthenticationMiddleware.AUTHORIZATION_HEADER, token);
  return promise.then((res) => {
    assertDefaultResponseBody(res, 401);
  });
}

function validateReminderSettings(token, body) {
  const url = '/api/v1/account/user/reminder/settings';
  chai.request(app)
    .put(url)
    .set(AuthenticationMiddleware.AUTHORIZATION_HEADER, token)
    .send(body)
    .then((res) => {
      assertDefaultResponseBody(res, 400);
    });
}

function assetReminderBody(body, reminder, userId) {
  body.should.have.property('reminder');
  body.reminder.should.have.property('time').eql(reminder.time);
  body.reminder.should.have.property('from').eql(reminder.from);
  body.reminder.should.have.property('to').eql(reminder.to);
  body.reminder.should.have.property('userId').eql(userId);
}

export function assertUserBody(body, user) {
  body.should.have.property('user');
  body.user.should.have.property('firstName').eql(user.firstName);
  body.user.should.have.property('lastName').eql(user.lastName);
  body.user.should.have.property('email').eql(user.email);
  if (user.id) body.user.should.have.property('id').eql(user.id);
  body.user.should.not.have.property('password');
}

describe('Account API test', () => {
  before(() => db.init());
  describe('User management test', () => {
    describe('GET /api/v1/account/me Get User', () => {
      beforeEach(() => userRepository.clear());
      it('it should not allow access to resource when authentication is not provided',
        () => validateAuth('/api/v1/account/me'));

      it('it should not allow access to resource when provided with an invalid token',
        () => userRepository.save({
          firstName: 'John', lastName: 'Doe', password: 'topsecret', email: 'user@local',
        })
          .then(user => validateAuth('/api/v1/account/me', createToken({ id: user.id }).substring(2))));

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
              assertDefaultResponseBody(res);
              assertUserBody(res.body, user);
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
                assertDefaultResponseBody(res);
                res.body.should.have.property('data');

                res.body.data.should.have.property('entry');
                res.body.data.entry.should.have.property('count').eql(4);

                assertUserBody(res.body.data, user);
                assetReminderBody(res.body.data, reminder, user.id);
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
            assertDefaultResponseBody(res, 403);
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
              assertDefaultResponseBody(res);
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
          // const url = '/api/v1/account/user/reminder/settings';
          let token = '';
          return userRepository.save({
            firstName: 'John', lastName: 'Doe', password: 'topsecret', email: 'user@local',
          })
            .then((user) => {
              token = createToken({ id: user.id });
              return validateReminderSettings(token, { time: '    ', from: 'SUNDAY', to: 'MONDAY' });
            })
            .then(() => validateReminderSettings(token, { time: 'wefgyrgf', from: 'SUNDAY', to: 'MONDAY' }))
            .then(() => validateReminderSettings(token, { time: '67:90', from: 'SUNDAY', to: 'MONDAY' }))
            .then(() => validateReminderSettings(token, { time: '23:09', from: 'SUNDAY', to: '$EFG@' }))
            .then(() => validateReminderSettings(token, { time: '23:09', from: 'NSOKX', to: 'SUNDAY' }))
            .then(() => validateReminderSettings(token, { time: '-21:22', from: 'SUNDAY', to: 'MONDAY' }));
        }).timeout(5000);

      it('it should PUT a reminder settings', () => {
        let token;
        return userRepository.save({
          firstName: 'John', lastName: 'Doe', password: 'topsecret', email: 'example@local',
        })
          .then((user) => {
            token = createToken({ id: user.id });
            return reminderRepository.save({
              from: 'Monday', to: 'Sunday', time: '19:10', userId: user.id, enabled: false,
            });
          })
          .then((reminder) => {
            const url = '/api/v1/account/user/reminder/settings';
            const settings = { time: '18:23', from: 'TUESDAY', to: 'FRIDAY' };
            const { userId } = reminder;
            return chai.request(app)
              .put(url)
              .set(AuthenticationMiddleware.AUTHORIZATION_HEADER, token)
              .send(settings)
              .then((res) => {
                assertDefaultResponseBody(res);
                settings.time = `${settings.time}:00`;
                assetReminderBody(res.body, settings, userId);
              });
          });
      });
    });
    describe('GET /api/v1/account/user/reminder/settings Get reminder settings', () => {
      beforeEach(() => userRepository.clear());
      it('it should not allow access to resource when authentication is not provided',
        () => validateAuth('/api/v1/account/user/reminder/settings'));
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
                from: 'Monday', to: 'Sunday', time: '19:10', userId: user.id, enabled: false,
              });
            })
            .then(result => chai.request(app)
              .get('/api/v1/account/user/reminder/settings')
              .set(AuthenticationMiddleware.AUTHORIZATION_HEADER, token)
              .then((res) => {
                const { userId } = result;
                assertDefaultResponseBody(res);
                assetReminderBody(res.body, result, userId);
              }));
        });
    });
  });
});
