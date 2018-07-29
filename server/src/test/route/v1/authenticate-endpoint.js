// Require the dev-dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';
import bcrypt from 'bcryptjs';
import { app } from '../../../app';
import db from '../../../db';

chai.use(chaiHttp);
const should = chai.should();

const userRepository = db.connection.users;

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
    it('should fail authentication when invalid email or password is provided', () => chai.request(app)
      .post('/api/v1/auth/login')
      .send({ password: 'fakepass', email: 'example@local.host' })
      .then((res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        res.body.should.not.have.property('token');
        res.body.should.have.property('auth').eql(false);
      })
      .then(() => chai.request(app)
        .post('/api/v1/auth/login')
        .send({ password: 'topsecret', email: 'fakemail@local' })
        .then((res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('auth').eql(false);
          res.body.should.not.have.property('token');
        })));
    // .catch((err) => {
    //   throw err;
    // })
    it('it should authenticate user a return a valid token', () => chai.request(app)
      .post('/api/v1/auth/login')
      .send({ password: 'topsecret', email: 'example@local.host' })
      .then((res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('token');
        res.body.should.have.property('auth').eql(true);
      }));
    // .catch((err) => {
    //   throw err;
    // })
  });

  describe('POST /api/v1/auth/signup create new user', () => {
    beforeEach(() => userRepository.clear());
    const url = '/api/v1/auth/signup';
    it('it should not POST a user when provided with invalid email or password ',
      () => chai.request(app)
        .post(url)
        .send({
          firstName: 'John', lastName: 'Doe', password: '1234', email: '',
        })
        .then((res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
        })
        .then(() => chai.request(app)
          .post(url)
          .send({
            firstName: 'John', lastName: 'Doe', password: 'topsecret',
          })
          .then((res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
          }))
        .then(() => chai.request(app)
          .post(url)
          .send({
            firstName: 'John', lastName: 'Doe', email: 'topsecret@local.host',
          })
          .then((res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
          }))
        .then(() => chai.request(app)
          .post(url)
          .send({
            firstName: 'John', lastName: 'Doe', email: 'invalid-mail', password: 'tyukbt678',
          })
          .then((res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
          })));
    // .catch((err) => {
    //   throw err;
    // })

    it('it should POST a user ', () => {
      const user = {
        firstName: 'John', lastName: 'Doe', password: 'topsecret', email: 'example@local.host',
      };
      return chai.request(app)
        .post('/api/v1/auth/signup')
        .send(user)
        .then((res) => {
          res.should.have.status(201);
          res.headers.should.have.property('x-access-token');
          res.body.should.be.a('object');
          res.body.should.have.property('id');
          res.body.should.have.property('firstName');
          res.body.should.have.property('lastName');
          res.body.should.have.property('email');
          res.body.should.not.have.property('password');
        });
      // .catch((err) => {
      //   throw err;
      // });
    });
    it('it should not POST a user when a user with given email already exists',
      () => userRepository.save({
        firstName: 'John', lastName: 'Doe', password: 'topsecret', email: 'example@local.host',
      })
        .then(user => chai.request(app)
          .post(url)
          .send(user)
          .then((res) => {
            res.should.have.status(403);
            res.body.should.be.a('object');
            res.body.should.have.property('message');
          })));
    // .catch((err) => {
    //   throw err;
    // })
  });
});
