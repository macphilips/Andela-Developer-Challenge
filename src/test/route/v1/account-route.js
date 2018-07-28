// Require the dev-dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';
import {createToken} from '../../../middlewares/jwt-provider';
import db from "../../../db";
import {app} from '../../../app';

chai.use(chaiHttp);
const should = chai.should();

const userRepository = db.connection.users;
const reminderRepository = db.connection.reminder;

describe('Account API test', () => {
  before(() => {
    return db.init();
  });
  describe('User management test', () => {
    describe('POST /api/v1/account/register create new user', () => {
      beforeEach(() => {
        return userRepository.clear();
      });
      it('it should not POST a user when provided with invalid email or password ', () => {
        return chai.request(app)
          .post('/api/v1/account/register')
          .send({
            firstName: 'John', lastName: 'Doe', password: 'topsecret', email: ''
          })
          .then((res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
          }).then(() => {
            return chai.request(app)
              .post('/api/v1/account/register')
              .send({
                firstName: 'John', lastName: 'Doe', password: 'topsecret'
              })
              .then((res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
              });
          }).then(() => {
            return chai.request(app)
              .post('/api/v1/account/register')
              .send({
                firstName: 'John', lastName: 'Doe', email: 'topsecret'
              })
              .then((res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
              });
          })
          .catch((err) => {
            throw err;
          });
      });
      it('it should POST a user ', () => {
        const user = {
          firstName: 'John', lastName: 'Doe', password: 'topsecret', email: 'example@local'
        };
        return chai.request(app)
          .post('/api/v1/account/register')
          .send(user)
          .then((res) => {
            res.should.have.status(201);
            res.body.should.be.a('object');
            res.body.should.have.property('id');
            res.body.should.have.property('firstName');
            res.body.should.have.property('lastName');
            res.body.should.have.property('email');
            res.body.should.not.have.property('password');
          })
          .catch((err) => {
            throw err;
          });
      });
      it('it should not POST a user when a user with given email already exists', () => {
        return userRepository.save({
          firstName: 'John', lastName: 'Doe', password: 'topsecret', email: 'example@local'
        })
          .then(user => chai.request(app)
            .post('/api/v1/account/register')
            .send(user)
            .then((res) => {
              res.should.have.status(400);
              res.body.should.be.a('object');
              res.body.should.have.property('message');
            })
            .catch((err) => {
              throw err;
            }));
      });
    });
    describe('GET /api/v1/account/me Get User', () => {
      beforeEach(() => {
        return userRepository.clear();
      });
      it('it should not allow access to resource when authentication is not provided', () => {
        return chai.request(app)
          .get('/api/v1/account/me')
          .then((res) => {
            res.should.have.status(401);
            res.body.should.be.a('object');
            res.body.should.have.property('message');
          })
          .catch((err) => {
            throw err;
          });
      });
      it('it should not allow access to resource when provided with an invalid token', () => {
        return userRepository.save({firstName: 'John', lastName: 'Doe', password: 'topsecret', email: 'user@local'})
          .then((user) => {
            const token = createToken({id: user.id}).substring(2);
            return chai.request(app)
              .get('/api/v1/account/me')
              .set('x-access-token', token)
              .then((res) => {
                res.should.have.status(401);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
              });
          });
      });
      it('it should GET current user with the provided token', () => {
        return userRepository.save({
          firstName: 'John',
          lastName: 'Doe',
          password: 'topsecret',
          email: 'user@local'
        })
          .then((user) => {
            const token = createToken({id: user.id});
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
          });
      });
    });
  });
});
