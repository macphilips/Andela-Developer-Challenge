// Require the dev-dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';
import bcrypt from 'bcryptjs';
import {app} from '../../../app';
import db from '../../../db';

chai.use(chaiHttp);

const should = chai.should();
const userRepository = db.connection.users;

describe('Authentication API test', () => {
  before(() => {
    return db.init();
  });
  describe('POST /api/v1/account/register Authenticate User', () => {
    before(() => {
      return userRepository.clear()
        .then(() => userRepository.save({
          email: 'example@local',
          password: bcrypt.hashSync('topsecret', 8),
          firstName: 'John', lastName: 'Doe',
        }));
    });
    it('should fail authentication when invalid email or password is provided', () => {
      return chai.request(app)
        .post('/api/v1/authenticate')
        .send({password: 'fakepass', email: 'example@local'})
        .then((res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.not.have.property('token');
          res.body.should.have.property('auth').eql(false);
        })
        .then(() => chai.request(app)
          .post('/api/v1/authenticate')
          .send({password: 'topsecret', email: 'fakemail@local'})
          .then((res) => {
            res.should.have.status(401);
            res.body.should.be.a('object');
            res.body.should.have.property('auth').eql(false);
            res.body.should.not.have.property('token');
          }))
        .catch((err) => {
          throw err;
        });
    });
    it('it should authenticate user a return a valid token', () => {
      return chai.request(app)
        .post('/api/v1/authenticate')
        .send({password: 'topsecret', email: 'example@local'})
        .then((res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('token');
          res.body.should.have.property('auth').eql(true);
        })
        .catch((err) => {
          throw err;
        });
    });
  });
});
