
'use strict';

angular.module('bruleeApp.services')

  .service('recipesService', ['$q', 'esFactory', function ($q, esFactory) {
    var client = esFactory({
      host: 'https://mhkubr1u:ibllibv1l1c140a8@box-5981704.us-east-1.bonsai.io/',
      apiVersion: '1.2',
      log: 'error'
    });

    this.createCategory = function(category) {
      var deferred = $q.defer();

      client.create({
        index: 'ashlea',
        type: 'category',
        body: category
      }, function (error, response) {
        if (error) {
          //console.trace(error.message);
          console.log("Error:" + error);
          deferred.reject(error);
        } else {
          deferred.resolve(response._id);
        }
        //console.log("Response:" + JSON.stringify(response));
      });

      return deferred.promise;
    };

    this.getCategories = function() {
      var deferred = $q.defer();

      client.search({
        index: 'ashlea',
        type: 'category',
        size: 500,
        body: {
          query: {
            match_all: {}
          }
        }
      }).then(function (body) {
        var hitsJson = body;
        var categories = [];
        for (var i in hitsJson.hits.hits) {
          var categoryJson = hitsJson.hits.hits[i]._source;
          var categoryId = hitsJson.hits.hits[i]._id;
          var category = new Category(categoryId, categoryJson.name, categoryJson.order, categoryJson.items);
          categories.push(category);
        }
        deferred.resolve(categories);
      }, function (error) {
        console.trace(error.message);
        deferred.reject(error);
      });

      return deferred.promise;
    };

    this.updateCategories = function(categories) {
      angular.forEach(categories, function (category) {
        client.update({
          index: 'ashlea',
          type: 'category',
          id: category.id,
          body: {
            doc: {
              items: category.items
            }
          }
        }, function (error, response) {
          if (error) {
            //console.trace(error.message);
            console.log("Error:" + error);
          }
          //console.log("Response:" + JSON.stringify(response));
        });
      });
    };

    this.removeCategory = function(categoryId) {
      var deferred = $q.defer();

      client.delete({
        index: 'ashlea',
        type: 'category',
        id: categoryId
      }, function (error, response) {
        if (error) {
          //console.trace(error.message);
          console.log("Error:" + error);
          deferred.reject(error);
        } else {
          deferred.resolve();
        }
        //console.log("Response:" + JSON.stringify(response));
      });

      return deferred.promise;
    };

    this.createRecipe = function(recipe) {
      var deferred = $q.defer();

      client.create({
        index: 'ashlea',
        type: 'recipe',
        body: recipe
      }, function (error, response) {
        if (error) {
          //console.trace(error.message);
          console.log("Error:" + error);
          deferred.reject(error);
        } else {
          deferred.resolve(true);
        }
        //console.log("Response:" + JSON.stringify(response));
      });

      return deferred.promise;
    };

    this.getRecipes = function() {
      var deferred = $q.defer();

      client.search({
        index: 'ashlea',
        type: 'recipe',
        size: 500,
        body: {
          query: {
            match_all: {}
          }
        }
      }).then(function (body) {
        var recipes = [];
        var hitsJson = body;
        for (var i in hitsJson.hits.hits) {
          var recipeJson = hitsJson.hits.hits[i]._source;
          var recipe = new Recipe(recipeJson.name, null, recipeJson.originalText);
          for (var j in recipeJson.ingredients) {
            var ingredientJson = recipeJson.ingredients[j];
            var ingredient = new Ingredient(ingredientJson.item, ingredientJson.amount);
            recipe.addIngredient(ingredient);
          }
          recipes.push(recipe);
        }
        deferred.resolve(recipes);
      }, function (error) {
        console.trace(error.message);
        deferred.reject(recipes);
      });

      return deferred.promise;
    };

    return this;
  }]);
