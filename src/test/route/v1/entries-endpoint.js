import chai from 'chai';
import bcrypt from 'bcryptjs';
import chaiHttp from 'chai-http';
import entriesRepository from '../../../main/repository/entries';
import userRepository from '../../../main/repository/users';
import server from '../../../main/app';
import TokenProvider from '../../../main/security/jwt-provider';

const entrySampleWithoutID = {
  content: 'Nam quis ultricies nisl. Nullam vel quam imperdiet, congue nunc dignissim, efficitur enim. Ut porta eu ipsum quis pellentesque. Suspendisse non molestie arcu. Cras nec convallis risus. Integer eu lectus vulputate, finibus sapien efficitur, consequat odio. In malesuada metus diam, non malesuada urna volutpat quis. ',
};

chai.use(chaiHttp);

const should = chai.should();

describe('Entries API test', () => {
  before((done) => {
    userRepository.clear();
    userRepository.save({
      email: 'example1@local',
      password: bcrypt.hashSync('topsecret', 8),
      name: 'Jane Doe',
    });
    userRepository.save({
      email: 'example2@local',
      password: bcrypt.hashSync('topsecret', 8),
      name: 'Jane Doe',
    });
    done();
  });

  beforeEach((done) => {
    entriesRepository.clear();
    done();
  });
  describe('POST /api/v1/entries Create new entry', () => {
    it('it should create a new entry', (done) => {
      const users = userRepository.findAll();
      const token = TokenProvider.createToken({id: users[0].id});
      chai.request(server)
        .post('/api/v1/entries')
        .set('x-access-token', token)
        .send(entrySampleWithoutID)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('id');
          res.body.should.have.property('content');
          res.body.should.have.property('createdDate');
          res.body.should.have.property('lastModified');
          done();
        });
    });
    it('it should not allow modification of entry using POST request', (done) => {
      const users = userRepository.findAll();
      const token = TokenProvider.createToken({id: users[0].id});
      const entry = entriesRepository.save({...entrySampleWithoutID, creatorID: users[0].id});
      chai.request(server)
        .post('/api/v1/entries')
        .set('x-access-token', token)
        .send(entry)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          done();
        });
    });
  });
  describe('GET /api/v1/entries Get all entries', () => {
    it('it should list all entries owned by user with provided token', (done) => {
      const users = userRepository.findAll();
      const user1Token = TokenProvider.createToken({id: users[0].id});
      // const user2Token = TokenProvider.createToken({id: users[1].id});
      entriesRepository.save({...entrySampleWithoutID, creatorID: users[0].id});
      entriesRepository.save({...entrySampleWithoutID, creatorID: users[0].id});
      entriesRepository.save({...entrySampleWithoutID, creatorID: users[0].id});
      entriesRepository.save({...entrySampleWithoutID, creatorID: users[1].id});
      entriesRepository.save({...entrySampleWithoutID, creatorID: users[1].id});

      chai.request(server)
        .get('/api/v1/entries')
        .set('x-access-token', user1Token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(3);
          done();
        });
    });
  });
  describe('PUT /api/v1/entries/:id Modify entry', () => {
    it('it should modify entry owned by user', (done) => {
      const users = userRepository.findAll();
      const token = TokenProvider.createToken({id: users[0].id});
      const entry = entriesRepository.save({...entrySampleWithoutID, creatorID: users[0].id});
      entry.content = 'Modified content';
      chai.request(server)
        .put(`/api/v1/entries/${entry.id}`)
        .set('x-access-token', token)
        .send(entry)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('id').eql(entry.id);
          res.body.should.have.property('content').eql(entry.content);
          res.body.should.have.property('creatorID').eql(users[0].id);
          res.body.should.have.property('createdDate');
          res.body.should.have.property('lastModified');
          done();
        });
    });
    it('it should not modify entry not owned by user', (done) => {
      const users = userRepository.findAll();
      const token = TokenProvider.createToken({id: users[0].id});
      const entry = entriesRepository.save({...entrySampleWithoutID, creatorID: users[1].id});
      entry.content = 'Modified content';
      chai.request(server)
        .put(`/api/v1/entries/${entry.id}`)
        .set('x-access-token', token)
        .send(entrySampleWithoutID)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          done();
        });
    });
  });
  describe('GET /api/v1/entries/:id Create new entry', () => {
  });
});