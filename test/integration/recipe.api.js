const { expect } = require('chai');
const request = require('supertest');

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const api = require('../../api/dist');

app.use(bodyParser.json());
app.use('/api', api.router);

describe('Recipe API:', function() {
  let newRecipe;

  after(function(done) {
    api.destroy()
      .then(res => done())
      .catch(err => done(err));
  });

  describe('POST /api/recipes', function() {
    describe('with valid recipe data', function() {
      before(function(done) {
        request(app)
          .post('/api/recipes')
          .send({
            name: 'test recipe',
            original_text: '1 test ingredient\n2 carrot',
            url: 'https://google.com',
            recipe_ingredients: [
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
            newRecipe = res.body;
            done();
          })
          .catch(err => done(err));
      });

      it('should return new recipe in response', function() {
        expect(!!newRecipe.id).to.equal(true);
        expect(newRecipe.name).to.equal('test recipe');

        // contains recipe ingredients
        let ingredient1 = newRecipe.recipe_ingredients.find(ri => ri.ingredient_id === '57c5ab9b989e94dc397dd4fa');
        expect(ingredient1.ingredient_id).to.equal('57c5ab9b989e94dc397dd4fa');
      });

      it('should create recipe in database', function(done) {
        request(app)
          .get(`/api/recipes/${newRecipe.id}`)
          .then(res => {
            expect(res.body.id).to.equal(newRecipe.id);
            expect(res.body.name).to.equal('test recipe');
            expect(res.body.original_text).to.equal('1 test ingredient\n2 carrot');
            expect(res.body.url).to.equal('https://google.com');

            let ingredient1 = res.body.recipe_ingredients.find(ri => ri.ingredient_id === '57c5ab9b989e94dc397dd4fa');
            expect(ingredient1.ingredient_id).to.equal('57c5ab9b989e94dc397dd4fa');
            expect(ingredient1.amount).to.equal('1');
            expect(ingredient1.unit).to.equal('loaf');

            let ingredient2 = res.body.recipe_ingredients.find(ri => ri.ingredient_id === '57c5ab9b989e94dc397dd55a');
            expect(ingredient2.ingredient_id).to.equal('57c5ab9b989e94dc397dd55a');
            expect(ingredient2.amount).to.equal('2');
            expect(!!ingredient2.unit).to.equal(false);
            done();
          })
          .catch(err => done(err));
      });
    });
  });

  describe('GET /api/recipes', function() {
    it('with id in query, should respond with recipe', function(done) {
      request(app)
        .get('/api/recipes')
        .query({ ids: [newRecipe.id] })
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
          expect(!!res.body.find(i => i.id === newRecipe.id)).to.equal(true);
          done();
        })
        .catch(err => done(err));
    });

    it('with id not in query, should not respond with recipe', function(done) {
      request(app)
        .get('/api/recipes')
        .query({ ids: [`a${newRecipe.id}`] })
        .then(res => {
          expect(!!res.body.find(i => i.id === newRecipe.id)).to.equal(false);
          done();
        })
        .catch(err => done(err));
    });

    it('with used ingredientId, should respond with recipe', function(done) {
      request(app)
        .get('/api/recipes')
        .query({ ingredientId: '57c5ab9b989e94dc397dd4fa' })
        .then(res => {
          expect(!!res.body.find(i => i.id === newRecipe.id)).to.equal(true);
          done();
        })
        .catch(err => done(err));
    });

    it('with includeUseCounts true, should respond with 0 use count in recipe', function(done) {
      request(app)
        .get('/api/recipes')
        .query({ ids: [newRecipe.id], includeUseCounts: true })
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
          expect(res.body.find(i => i.id === newRecipe.id).use_count).to.equal(0);
          done();
        })
        .catch(err => done(err));
    });
  });

  describe('PUT /api/recipes/:id', function() {
    describe('with valid recipe data', function() {
      let updateResponse;

      before(function(done) {
        request(app)
          .put(`/api/recipes/${newRecipe.id}`)
          .send({
            name: 'test recipe updated',
            url: 'https://heroku.com',
            tags: 'chicken,beef',
            prepare_time_in_minutes: 12,
            cook_time_in_minutes: 30,
            original_text: '1 test ingredient',
            instructions: 'step 1',
            modifications: 'half chicken',
            // nutrition_facts: '1g sugar'
            recipe_ingredients: [
              {
                // bread
                ingredient_id: '57c5ab9b989e94dc397dd4fa',
                amount: '2',
                unit: 'loaf'
              },
              {
                // celery
                ingredient_id: '57c5ab9b989e94dc397dd54a',
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

      it('should return updated recipe in response', function() {
        expect(updateResponse.id).to.equal(newRecipe.id);
        expect(updateResponse.name).to.equal('test recipe updated');

        // contains recipe ingredients
        let ingredient1 = updateResponse.recipe_ingredients.find(ri => ri.ingredient_id === '57c5ab9b989e94dc397dd4fa');
        expect(ingredient1.ingredient_id).to.equal('57c5ab9b989e94dc397dd4fa');
      });

      it('should update recipe in database', function(done) {
        request(app)
          .get(`/api/recipes/${newRecipe.id}`)
          .then(res => {
            expect(res.body.id).to.equal(newRecipe.id);
            expect(res.body.name).to.equal('test recipe updated');
            expect(res.body.url).to.equal('https://heroku.com');
            expect(res.body.tags).to.equal('chicken,beef');
            expect(res.body.prepare_time_in_minutes).to.equal(12);
            expect(res.body.cook_time_in_minutes).to.equal(30);
            expect(res.body.original_text).to.equal('1 test ingredient');
            expect(res.body.instructions).to.equal('step 1');
            expect(res.body.modifications).to.equal('half chicken');
            // expect(res.body.nutrition_facts).to.equal('1g sugar');

            let ingredient1 = res.body.recipe_ingredients.find(ri => ri.ingredient_id === '57c5ab9b989e94dc397dd4fa');
            expect(ingredient1.ingredient_id).to.equal('57c5ab9b989e94dc397dd4fa');
            expect(ingredient1.amount).to.equal('2');
            expect(ingredient1.unit).to.equal('loaf');

            let ingredient2 = res.body.recipe_ingredients.find(ri => ri.ingredient_id === '57c5ab9b989e94dc397dd54a');
            expect(ingredient2.ingredient_id).to.equal('57c5ab9b989e94dc397dd54a');
            expect(ingredient2.amount).to.equal('2');
            expect(!!ingredient2.unit).to.equal(false);
            done();
          })
          .catch(err => done(err));
      });
    });
  });

  describe('DELETE /api/recipes/:id', function() {
    describe('with valid deletion', function() {
      let deleteResponse;

      before(function(done) {
        request(app)
          .delete(`/api/recipes/${newRecipe.id}`)
          .expect(200)
          .expect('Content-Type', /json/)
          .then(res => {
            deleteResponse = res.body;
            done();
          })
          .catch(err => done(err));
      });

      it('should return deleted recipe in response', function() {
        expect(deleteResponse.id).to.equal(newRecipe.id);
      });

      it('should delete recipe in database', function(done) {
        request(app)
          .get(`/api/recipes/${newRecipe.id}`)
          .then(res => {
            expect(!!res.body.id).to.equal(false);
            done();
          })
          .catch(err => done(err));
      });
    });
  });
});
