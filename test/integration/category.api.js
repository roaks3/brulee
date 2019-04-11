const { expect } = require('chai');
const request = require('supertest');

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const api = require('../../api/dist');

app.use(bodyParser.json());
app.use('/api', api.router);

describe('Category API:', function() {
  let newCategory;

  after(function(done) {
    api.destroy()
      .then(res => done())
      .catch(err => done(err));
  });

  describe('POST /api/categories', function() {
    describe('with valid category data', function() {
      before(function(done) {
        request(app)
          .post('/api/categories')
          .send({
            name: 'test category'
          })
          .expect(200)
          .expect('Content-Type', /json/)
          .then(res => {
            newCategory = res.body;
            done();
          })
          .catch(err => done(err));
      });

      it('should return new category in response', function() {
        expect(!!newCategory.id).to.equal(true);
        expect(newCategory.name).to.equal('test category');
      });

      it('should create category in database', function(done) {
        request(app)
          .get(`/api/categories/${newCategory.id}`)
          .then(res => {
            expect(res.body.id).to.equal(newCategory.id);
            expect(res.body.name).to.equal('test category');
            expect(res.body.display_order).to.equal(7);
            done();
          })
          .catch(err => done(err));
      });
    });
  });

  describe('GET /api/categories', function() {
    it('should respond with category', function(done) {
      request(app)
        .get('/api/categories')
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
          expect(!!res.body.find(i => i.id === newCategory.id)).to.equal(true);
          done();
        })
        .catch(err => done(err));
    });
  });

  describe('PUT /api/categories/:id', function() {
    describe('with valid category data', function() {
      let updateResponse;

      before(function(done) {
        request(app)
          .put(`/api/categories/${newCategory.id}`)
          .send({
            name: 'test category updated',
            display_order: 200
          })
          .expect(200)
          .expect('Content-Type', /json/)
          .then(res => {
            updateResponse = res.body;
            done();
          })
          .catch(err => done(err));
      });

      it('should return updated category in response', function() {
        expect(updateResponse.id).to.equal(newCategory.id);
        expect(updateResponse.name).to.equal('test category updated');
      });

      it('should update category in database', function(done) {
        request(app)
          .get(`/api/categories/${newCategory.id}`)
          .then(res => {
            expect(res.body.id).to.equal(newCategory.id);
            expect(res.body.name).to.equal('test category updated');
            expect(res.body.display_order).to.equal(200);
            done();
          })
          .catch(err => done(err));
      });
    });
  });

  describe('DELETE /api/categories/:id', function() {
    describe('with valid deletion', function() {
      let deleteResponse;

      before(function(done) {
        request(app)
          .delete(`/api/categories/${newCategory.id}`)
          .expect(200)
          .expect('Content-Type', /json/)
          .then(res => {
            deleteResponse = res.body;
            done();
          })
          .catch(err => done(err));
      });

      it('should return deleted category in response', function() {
        expect(deleteResponse.id).to.equal(newCategory.id);
      });

      it('should delete category in database', function(done) {
        request(app)
          .get(`/api/categories/${newCategory.id}`)
          .then(res => {
            expect(!!res.body.id).to.equal(false);
            done();
          })
          .catch(err => done(err));
      });
    });
  });
});
