const { expect } = require('chai');
const request = require('supertest');

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const api = require('../../api/dist');

app.use(bodyParser.json());
app.use('/api', api);

describe('Grocery List API:', function() {
  let newGroceryList;

  describe('POST /api/groceryLists', function() {
    describe('with valid grocery list data', function() {
      before(function(done) {
        request(app)
          .post('/api/groceryLists')
          .send({
            week_start: '2019-02-17',
            recipe_days: [
              {
                // Grilled Steak
                recipe_id: '59bfcc13c2ef16276900d864',
                day_of_week: 0
              },
              {
                // Pizza
                recipe_id: '57c57712989e94dc397dd481',
                day_of_week: 2
              }
            ]
          })
          .expect(200)
          .expect('Content-Type', /json/)
          .then(res => {
            newGroceryList = res.body;
            done();
          })
          .catch(err => done(err));
      });

      it('should return new grocery list in response', function() {
        expect(!!newGroceryList.id).to.equal(true);
        expect(newGroceryList.week_start).to.equal('2019-02-17');
      });

      it('should create grocery list in database', function(done) {
        request(app)
          .get(`/api/groceryLists/${newGroceryList.id}`)
          .then(res => {
            expect(res.body.id).to.equal(newGroceryList.id);
            expect(res.body.week_start).to.equal('2019-02-17');

            let recipe1 = res.body.recipe_days.find(rd => rd.recipe_id === '59bfcc13c2ef16276900d864');
            expect(recipe1.recipe_id).to.equal('59bfcc13c2ef16276900d864');
            expect(recipe1.day_of_week).to.equal(0);

            let recipe2 = res.body.recipe_days.find(rd => rd.recipe_id === '57c57712989e94dc397dd481');
            expect(recipe2.recipe_id).to.equal('57c57712989e94dc397dd481');
            expect(recipe2.day_of_week).to.equal(2);
            done();
          })
          .catch(err => done(err));
      });
    });
  });

  describe('GET /api/groceryLists', function() {
    it('with id in query, should respond with grocery list', function(done) {
      request(app)
        .get('/api/groceryLists')
        .query({ ids: [newGroceryList.id] })
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
          expect(!!res.body.find(i => i.id === newGroceryList.id)).to.equal(true);
          done();
        })
        .catch(err => done(err));
    });

    it('with id not in query, should not respond with grocery list', function(done) {
      request(app)
        .get('/api/groceryLists')
        .query({ ids: [`a${newGroceryList.id}`] })
        .then(res => {
          expect(!!res.body.find(i => i.id === newGroceryList.id)).to.equal(false);
          done();
        })
        .catch(err => done(err));
    });
  });

  describe('PUT /api/groceryLists/:id', function() {
    describe('with valid grocery list data', function() {
      let updateResponse;

      before(function(done) {
        request(app)
          .put(`/api/groceryLists/${newGroceryList.id}`)
          .send({
            week_start: '2019-02-17',
            recipe_days: [
              {
                // Grilled Steak
                recipe_id: '59bfcc13c2ef16276900d864',
                day_of_week: 4
              },
              {
                // Grilled Chicken
                recipe_id: '5992e703bd966f4338636c27',
                day_of_week: 2
              }
            ],
            additional_ingredients: [
              {
                // bread
                ingredient_id: '57c5ab9b989e94dc397dd4fa',
                amount: '1',
                unit: 'loaf'
              },
              {
                // carrot
                ingredient_id: '57c5ab9b989e94dc397dd55a',
                amount: '2'
              }
            ]
          })
          .expect(200)
          .expect('Content-Type', /json/)
          .then(res => {
            updateResponse = res.body;
            done();
          })
          .catch(err => done(err));
      });

      it('should return updated grocery list in response', function() {
        expect(updateResponse.id).to.equal(newGroceryList.id);
        expect(updateResponse.week_start).to.equal('2019-02-17');
      });

      it('should update grocery list in database', function(done) {
        request(app)
          .get(`/api/groceryLists/${newGroceryList.id}`)
          .then(res => {
            expect(res.body.id).to.equal(newGroceryList.id);
            expect(res.body.week_start).to.equal('2019-02-17');

            let recipe1 = res.body.recipe_days.find(rd => rd.recipe_id === '59bfcc13c2ef16276900d864');
            expect(recipe1.recipe_id).to.equal('59bfcc13c2ef16276900d864');
            expect(recipe1.day_of_week).to.equal(4);

            let recipe2 = res.body.recipe_days.find(rd => rd.recipe_id === '5992e703bd966f4338636c27');
            expect(recipe2.recipe_id).to.equal('5992e703bd966f4338636c27');
            expect(recipe2.day_of_week).to.equal(2);

            let ingredient1 = res.body.additional_ingredients.find(ai => ai.ingredient_id === '57c5ab9b989e94dc397dd4fa');
            expect(ingredient1.ingredient_id).to.equal('57c5ab9b989e94dc397dd4fa');
            expect(ingredient1.amount).to.equal('1');

            let ingredient2 = res.body.additional_ingredients.find(ai => ai.ingredient_id === '57c5ab9b989e94dc397dd55a');
            expect(ingredient2.ingredient_id).to.equal('57c5ab9b989e94dc397dd55a');
            expect(ingredient2.amount).to.equal('2');
            done();
          })
          .catch(err => done(err));
      });
    });
  });

  describe('DELETE /api/groceryLists/:id', function() {
    describe('with valid deletion', function() {
      let deleteResponse;

      before(function(done) {
        request(app)
          .delete(`/api/groceryLists/${newGroceryList.id}`)
          .expect(200)
          .expect('Content-Type', /json/)
          .then(res => {
            deleteResponse = res.body;
            done();
          })
          .catch(err => done(err));
      });

      it('should return deleted grocery list in response', function() {
        expect(deleteResponse.id).to.equal(newGroceryList.id);
      });

      it('should delete grocery list in database', function(done) {
        request(app)
          .get(`/api/groceryLists/${newGroceryList.id}`)
          .then(res => {
            expect(!!res.body.id).to.equal(false);
            done();
          })
          .catch(err => done(err));
      });
    });
  });
});
