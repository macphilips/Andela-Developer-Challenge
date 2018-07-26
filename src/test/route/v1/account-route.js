// Require the dev-dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../../app';
import userRepository from '../../../db/repository/users';
import {createToken} from '../../../middlewares/jwt-provider';

chai.use(chaiHttp);
const should = chai.should();

describe('Account API test', () => {
  describe('POST /api/v1/account/register create new user', () => {
    beforeEach((done) => {
      userRepository.clear();
      done();
    });
    it('it should not POST a user when provided with invalid email or password ', (done) => {
      chai.request(server)
        .post('/api/v1/account/register')
        .send({ name: 'John Doe', password: 'topsecret', email: '' })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
        });
      chai.request(server)
        .post('/api/v1/account/register')
        .send({ name: 'John Doe', password: 'topsecret' })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
        });
      chai.request(server)
        .post('/api/v1/account/register')
        .send({ name: 'John Doe', email: 'topsecret' })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          done();
        });
    });
    it('it should POST a user ', (done) => {
      const user = { name: 'John Doe', password: 'topsecret', email: 'example@local' };
      chai.request(server)
        .post('/api/v1/account/register')
        .send(user)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('id');
          res.body.should.have.property('name');
          res.body.should.have.property('email');
          res.body.should.not.have.property('password');
          done();
        });
    });
    it('it should not POST a user when a user with given email already exists', (done) => {
      const user = userRepository.save({ name: 'John Doe', password: 'topsecret', email: 'example@local' });
      chai.request(server)
        .post('/api/v1/account/register')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          done();
        });
    });
  });
  describe('GET /api/v1/account/me Get User', () => {
    beforeEach((done) => {
      userRepository.clear();
      done();
    });
    it('it should not allow access to resource when authentication is not provided', (done) => {
      chai.request(server)
        .get('/api/v1/account/me')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          done();
        });
    });
    it('it should not allow access to resource when provided with an invalid token', (done) => {
      const user = userRepository.save({ name: 'Jane Doe', email: 'user@local' });
      const token = createToken({ id: user.id }).substring(2);
      chai.request(server)
        .get('/api/v1/account/me')
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          done();
        });
    });
    it('it should GET current user with the provided token', (done) => {
      const user = userRepository.save({ name: 'Jane Doe', email: 'user@local' });
      const token = createToken({ id: user.id });
      chai.request(server)
        .get('/api/v1/account/me')
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('name').eql(user.name);
          res.body.should.have.property('email').eql(user.email);
          res.body.should.have.property('id').eql(user.id);
          done();
        });
    });
  });
});
