// var assert = require('assert')
import 'babel-polyfill'

var app = require('../server.js')
var should = require('chai').should()
var expect = require('chai').expect()
var saga = require('../public/src/sagas/index')
var request = require('supertest')

describe('POST /login', function() {
  it('Response with name json', function(done) {
    request(app)
      .post('/api/login')
      .set('Accept', 'application/json')
      .send({
        autoLogin: false,
        email: "harryfyodor@163.com",
        password: "234"
      })
      .expect(200)
      .end(function(err, res) {
        if(err) {
          done(err)
        }
        res.body.name.should.be.eql('234');
        done()
      })
  })
})

/*
describe('Sagas', function() {
  describe('Login', function() {

  })
})
*/