// Require the dev-dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';
import bcrypt from 'bcryptjs';
import { app } from '../../../app';
import db from '../../../db';

import AuthenticationMiddleware from '../../../middlewares/jwtFilter';
import { assertDefaultResponseBody, assertUserBody } from './accountRoute';

chai.use(chaiHttp);
const should = chai.should();

const userRepository = db.connection.users;

function validateSignUp(body) {
  const url = '/api/v1/auth/signup';
  return chai.request(app)
    .post(url)
    .send(body)
    .then((res) => {
      assertDefaultResponseBody(res, 400);
    });
}

function loginValidation(body, status) {
  const loginUrl = '/api/v1/auth/login';
  return chai.request(app)
    .post(loginUrl)
    .send(body)
    .then((res) => {
      assertDefaultResponseBody(res, status);
      res.body.should.not.have.property('token');
    });
}

describe('Authentication API test', () => {
  before(() => db.init());
  describe('POST /api/v1/auth/login Authenticate User', () => {
    before(() => userRepository.clear()
      .then(() => userRepository.save({
        email: 'example@local.host',
        password: bcrypt.hashSync('topsecret', 8),
        firstName: 'John',
        lastName: 'Doe',
      })));

    const loginUrl = '/api/v1/auth/login';
    it('should fail authentication when invalid email or password is provided',
      () => loginValidation({ password: 'fakepass', email: 'example@local.host' }, 401)
        .then(() => loginValidation({ password: 'topsecret', email: 'fakemail@local' }, 401)));
    it('it should not authenticate a user when provided with invalid email or password ',
      () => loginValidation({ password: '            ', email: 'example@local.host' }, 400)
        .then(() => loginValidation({ password: 'topsecret', email: '              ' }, 400)));

    it('it should authenticate user and return a valid token', () => chai.request(app)
      .post(loginUrl)
      .send({ password: 'topsecret', email: 'example@local.host' })
      .then((res) => {
        assertDefaultResponseBody(res);
        res.body.should.have.property('token');
      }));
  });

  describe('POST /api/v1/auth/signup create new user', () => {
    beforeEach(() => userRepository.clear());
    const url = '/api/v1/auth/signup';
    it('it should not POST a user when provided with invalid email or password ',
      () => validateSignUp({
        firstName: 'John', lastName: 'Doe', password: '1234', email: '',
      })
        .then(() => validateSignUp({
          firstName: 'John', lastName: 'Doe', password: 'topsecret',
        }))
        .then(() => validateSignUp({
          firstName: 'John', lastName: 'Doe', email: 'topsecret@local.host',
        }))
        .then(() => validateSignUp({
          firstName: '     ', lastName: 'Doe', email: 'topsecret@local.host', password: 'tyukbt678',
        }))
        .then(() => validateSignUp({
          firstName: 'John', lastName: '      ', email: 'topsecret@local.host', password: 'tyukbt678',
        }))
        .then(() => validateSignUp({
          firstName: 'Jo@$%#2hn', lastName: 'Doe', email: 'topsecret@local.host', password: 'tyukbt678',
        }))
        .then(() => validateSignUp({
          firstName: 'John', lastName: 'D(.)oe', email: 'topsecret@local.host', password: 'tyukbt678',
        }))
        .then(() => validateSignUp({
          firstName: 'John', lastName: 'Doe', email: '           ', password: 'tyukbt678',
        }))
        .then(() => validateSignUp({
          firstName: 'John', lastName: 'Doe', email: 'topsecret@local.host', password: '                  ',
        }))
        .then(() => validateSignUp({
          firstName: 'John', lastName: 'Doe', email: 'invalid-mail', password: 'tyukbt678',
        }))).timeout(5000);

    it('it should POST a user ', () => {
      const user = {
        firstName: 'John', lastName: 'Doe', password: 'topsecret', email: 'example@local.host',
      };
      return chai.request(app)
        .post('/api/v1/auth/signup')
        .send(user)
        .then((res) => {
          assertDefaultResponseBody(res, 201);
          res.headers.should.have.property(AuthenticationMiddleware.AUTHORIZATION_HEADER);
          assertUserBody(res.body, user);
        });
    });
    it('it should not POST a user when a user with given email already exists',
      () => userRepository.save({
        firstName: 'John', lastName: 'Doe', password: 'topsecret', email: 'example@local.host',
      })
        .then(user => chai.request(app)
          .post(url)
          .send(user)
          .then((res) => {
            assertDefaultResponseBody(res, 409);
          })));
  });
});
