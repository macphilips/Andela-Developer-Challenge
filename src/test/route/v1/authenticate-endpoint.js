// Require the dev-dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';
import bcrypt from 'bcryptjs';
import server from '../../../app';
import userRepository from '../../../repository/users';

chai.use(chaiHttp);

const should = chai.should();

describe('Authentication API test', () => {
  beforeEach((done) => {
    userRepository.clear();
    done();
  });
  describe('POST /api/v1/account/register Authenticate User', () => {
    it('should fail authentication when invalid email or password is provided', (done) => {
      userRepository.save({
        email: 'example@local',
        password: bcrypt.hashSync('topsecret', 8),
        name: 'Jane Doe',
      });
      chai.request(server)
        .post('/api/v1/authenticate')
        .send({ password: 'fakepass', email: 'example@local' })
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.not.have.property('token');
          res.body.should.have.property('auth').eql(false);
        });

      chai.request(server)
        .post('/api/v1/authenticate')
        .send({ password: 'topsecret', email: 'fakemail@local' })
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('auth').eql(false);
          res.body.should.not.have.property('token');
          done();
        });
    });
    it('it should authenticate user a return a valid token', (done) => {
      userRepository.save({
        email: 'example@local',
        password: bcrypt.hashSync('topsecret', 8),
        name: 'Jane Doe',
      });
      chai.request(server)
        .post('/api/v1/authenticate')
        .send({ password: 'topsecret', email: 'example@local' })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('token');
          res.body.should.have.property('auth').eql(true);
          done();
        });
    });
  });
});
