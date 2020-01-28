const request = require('supertest')
const mongoose = require('mongoose')
const expect = require('chai').expect
const app = require('../app')

const User = require('../models/user')
const Serie = require('../models/serie')

const mongo = 'mongodb://localhost/test-minhas-series-rest'

describe('Testing REST API', () => {
  before('Connecting to mongodb', async () => {
    await mongoose.connect(mongo,  { useUnifiedTopology: true, useNewUrlParser:true, useFindAndModify: false })
    await User.deleteMany({})
    await User.create({
      username: 'rafael',
      password: '123456',
      roles: ['restrito']
    })
    await Serie.deleteMany({})
    return true
  })
  it('should return error', (done) => {
    request(app)
      .get('/series')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        expect(err).to.be.null
        expect(res.body.success).to.be.false
        done()
      })
  })
  it('should auth an user', (done) => {
    request(app)
      .post('/auth')
      .send({ username: 'rafael', password: '123456' })
      .expect(200)
      .end((err, res) => {
        expect(res.body.success).to.be.true
        expect(res.body.token).to.be.string
        done()
      })
  })
  it('should not auth an user', (done) => {
    request(app)
      .post('/auth')
      .send({ username: 'rafael', password: '1233456' })
      .expect(200)
      .end((err, res) => {
        expect(res.body.success).to.be.false
        expect(res.body.message).to.be.string
        done()
      })
  })
  describe('series', () => {
    let token = ''
    before('get token', (done) => {
      request(app)
        .post('/auth')
        .send({ username: 'rafael', password: '123456' })
        .expect(200)
        .end((err, res) => {
          token = res.body.token
          done()
        })
    })
    it('should return no series', (done) => {
      request(app)
        .get('/series')
        .set('x-access-token', token)
        .expect(200)
        .end((err, res) => {
          expect(res.body).be.empty
          done()
        })
    })
    it('shoud create new series', (done) => {
      request(app)
        .post('/series')
        .set('x-access-token', token)
        .send({ name: 'nova serie', status: 'watching' })
        .expect(200)
        .end((err, res) => {
          expect(res.body._id).be.string
          expect(res.body.name).to.be.equal('nova serie')
          expect(res.body.status).to.be.equal('watching')
          done()
        })
    })
  })
})