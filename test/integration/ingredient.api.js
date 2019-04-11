const { expect } = require('chai');
const request = require('supertest');

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const api = require('../../api/dist');

app.use(bodyParser.json());
app.use('/api', api.router);

describe('Ingredient API:', function() {
  let newIngredient;

  after(function(done) {
    api.destroy()
      .then(res => done())
      .catch(err => done(err));
  });

  describe('POST /api/ingredients', function() {
    describe('with valid ingredient data', function() {
      before(function(done) {
        request(app)
          .post('/api/ingredients')
          .send({
            name: 'test ingredient',
            category_id: '57c3909f989e94dc397dd465'
          })
          .expect(200)
          .expect('Content-Type', /json/)
          .then(res => {
            newIngredient = res.body;
            done();
          })
          .catch(err => done(err));
      });

      it('should return new ingredient in response', function() {
        expect(!!newIngredient.id).to.equal(true);
        expect(newIngredient.name).to.equal('test ingredient');
      });

      it('should create ingredient in database', function(done) {
        request(app)
          .get(`/api/ingredients/${newIngredient.id}`)
          .then(res => {
            expect(res.body.id).to.equal(newIngredient.id);
            expect(res.body.name).to.equal('test ingredient');
            done();
          })
          .catch(err => done(err));
      });
    });
  });

  describe('GET /api/ingredients', function() {
    it('with id in query, should respond with ingredient', function(done) {
      request(app)
        .get('/api/ingredients')
        .query({ ids: [newIngredient.id] })
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
          expect(!!res.body.find(i => i.id === newIngredient.id)).to.equal(true);
          done();
        })
        .catch(err => done(err));
    });

    it('with id not in query, should not respond with ingredient', function(done) {
      request(app)
        .get('/api/ingredients')
        .query({ ids: [`a${newIngredient.id}`] })
        .then(res => {
          expect(!!res.body.find(i => i.id === newIngredient.id)).to.equal(false);
          done();
        })
        .catch(err => done(err));
    });

    it('with name in query, should respond with ingredient', function(done) {
      request(app)
        .get('/api/ingredients')
        .query({ names: [newIngredient.name] })
        .then(res => {
          expect(!!res.body.find(i => i.id === newIngredient.id)).to.equal(true);
          done();
        })
        .catch(err => done(err));
    });

    it('with name not in query, should not respond with ingredient', function(done) {
      request(app)
        .get('/api/ingredients')
        .query({ names: [`a${newIngredient.name}`] })
        .then(res => {
          expect(!!res.body.find(i => i.id === newIngredient.id)).to.equal(false);
          done();
        })
        .catch(err => done(err));
    });
  });

  describe('PUT /api/ingredients/:id', function() {
    describe('with valid ingredient data', function() {
      let updateResponse;

      before(function(done) {
        request(app)
          .put(`/api/ingredients/${newIngredient.id}`)
          .send({
            name: 'test ingredient updated',
            category_id: '57c3909f989e94dc397dd462'
          })
          .expect(200)
          .expect('Content-Type', /json/)
          .then(res => {
            updateResponse = res.body;
            done();
          })
          .catch(err => done(err));
      });

      it('should return updated ingredient in response', function() {
        expect(updateResponse.id).to.equal(newIngredient.id);
        expect(updateResponse.name).to.equal('test ingredient updated');
      });

      it('should update ingredient in database', function(done) {
        request(app)
          .get(`/api/ingredients/${newIngredient.id}`)
          .then(res => {
            expect(res.body.id).to.equal(newIngredient.id);
            expect(res.body.name).to.equal('test ingredient updated');
            done();
          })
          .catch(err => done(err));
      });
    });
  });

  describe('DELETE /api/ingredients/:id', function() {
    describe('with valid deletion', function() {
      let deleteResponse;

      before(function(done) {
        request(app)
          .delete(`/api/ingredients/${newIngredient.id}`)
          .expect(200)
          .expect('Content-Type', /json/)
          .then(res => {
            deleteResponse = res.body;
            done();
          })
          .catch(err => done(err));
      });

      it('should return deleted ingredient in response', function() {
        expect(deleteResponse.id).to.equal(newIngredient.id);
      });

      it('should delete ingredient in database', function(done) {
        request(app)
          .get(`/api/ingredients/${newIngredient.id}`)
          .then(res => {
            expect(!!res.body.id).to.equal(false);
            done();
          })
          .catch(err => done(err));
      });
    });
  });
});
