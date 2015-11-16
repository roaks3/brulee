'use strict';

let elasticsearch = require('elasticsearch');
let _ = require('lodash');

let client = new elasticsearch.Client({
  host: 'localhost:9200',
  apiVersion: '1.2',
  log: 'trace'
});

let search = function (query) {
  return client.search(query)
    .then(function (data) {

      return _.map(data.hits.hits, function (hit) {
        return _.assign(hit._source, {
          id: hit._id
        });
      });

    });
};

let create = function (query) {
  return client.create(query);
};

let createIndex = function (query) {
  return client.indices.create(query);
};

let deleteIndex = function (query) {
  return client.indices.delete(query);
};

let createIngredients = function (index, newIngredients) {
  return Promise.all(_.map(newIngredients, function (newIngredient) {
    return create({
      index: index,
      type: 'ingredient',
      body: newIngredient
    })
  }))
    .then(function (data) {
      let createdIngredients = _(newIngredients)
        .zip(data)
        .map(function (ingredientParts) {
          return _.assign(ingredientParts[0], {
            id: ingredientParts[1]._id
          });
        })
        .value();

      return createdIngredients;
    });
};

let createIngredientsAndCatagories = function (oldIndex, newIndex) {
  return search({
    index: oldIndex,
    type: 'category',
    size: 500,
    body: {
      query: {
        match_all: {}
      }
    }
  })
    .then(function (hits) {

      let newIngredients = _(hits)
        .map('items')
        .flatten()
        .map(function (name) {
          return {
            name: name
          };
        })
        .value();

      return createIngredients(newIndex, newIngredients)
        .then(function (data) {
          let ingredientsByName = _.indexBy(data, 'name');

          let newCategories = _.map(hits, function (oldCategory) {
            return {
              name: oldCategory.name,
              order: oldCategory.order,
              ingredient_ids: _.map(oldCategory.items, function (item) {
                return ingredientsByName[item].id;
              })
            };
          });

          return Promise.all(_.map(newCategories, function (newCategory) {
            return create({
              index: newIndex,
              type: 'category',
              body: newCategory
            })
          }));
        });

    });
};

let createRecipes = function (oldIndex, newIndex) {
  return Promise.all([
    search({
      index: oldIndex,
      type: 'recipe',
      size: 500,
      body: {
        query: {
          match_all: {}
        }
      }
    }),
    search({
      index: newIndex,
      type: 'ingredient',
      size: 500,
      body: {
        query: {
          match_all: {}
        }
      }
    })
  ])
    .then(function (data) {
      let oldRecipes = data[0];
      let ingredients = data[1];

      let recipeIngredientNames = _(oldRecipes)
        .map(function (oldRecipe) {
          return _.map(oldRecipe.ingredients, 'item');
        })
        .flatten()
        .uniq()
        .value();

      let existingIngredientNames = _.map(ingredients, 'name');
      let newIngredientNames = _.difference(recipeIngredientNames, existingIngredientNames);
      let newIngredients = _.map(newIngredientNames, function (newIngredientName) {
        return {
          name: newIngredientName
        };
      });

      return createIngredients(newIndex, newIngredients)
        .then(function (data) {
          let ingredientsByName = _.indexBy(ingredients, 'name');
          let createdIngredientsByName = _.indexBy(data, 'name');
          ingredientsByName = _.merge(ingredientsByName, createdIngredientsByName);

          let newRecipes = _.map(oldRecipes, function (oldRecipe) {
            return {
              name: oldRecipe.name,
              original_text: oldRecipe.originalText,
              recipe_ingredients: _.map(oldRecipe.ingredients, function (ingredient) {
                return {
                  ingredient_id: ingredientsByName[ingredient.item].id,
                  amount: ingredient.amount
                };
              })
            };
          });

          return Promise.all(_.map(newRecipes, function (newRecipe) {
            return create({
              index: newIndex,
              type: 'recipe',
              body: newRecipe
            })
          }));
        });
    });
};

let srcIndex = 'ashlea';
let destIndex = 'ashlea2';

// Migrate categories and create ingredients in the process
/*deleteIndex({index: destIndex})
  .then(function () {
    return createIndex({index: destIndex});
  })*/
createIndex({index: destIndex})
  .then(function () {
    return createIngredientsAndCatagories(srcIndex, destIndex);
  })
  .then(function () {
    setTimeout(function () {
      return createRecipes(srcIndex, destIndex);
    }, 1000);
  })
  .catch(function (error) {
    console.error(error);
  });
