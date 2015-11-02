
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
          deferred.reject(error);
        } else {
          deferred.resolve(response._id);
        }
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
        var categories = _.map(body.hits.hits, function (hit) {
          return new Category(
            hit._id,
            hit._source.name,
            hit._source.order,
            hit._source.items
          );
        });
        deferred.resolve(categories);
      }, function (error) {
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
        }, function (error) {
          if (error) {
            // Do nothing
          }
        });
      });
    };

    this.removeCategory = function(categoryId) {
      var deferred = $q.defer();

      client.delete({
        index: 'ashlea',
        type: 'category',
        id: categoryId
      }, function (error) {
        if (error) {
          deferred.reject(error);
        } else {
          deferred.resolve();
        }
      });

      return deferred.promise;
    };

    this.createRecipe = function(recipe) {
      var deferred = $q.defer();

      client.create({
        index: 'ashlea',
        type: 'recipe',
        body: recipe
      }, function (error) {
        if (error) {
          deferred.reject(error);
        } else {
          deferred.resolve(true);
        }
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
        var recipes = _.map(body.hits.hits, function (hit) {
          var recipe = new Recipe(
            hit._source.name,
            null,
            hit._source.originalText
          );

          _.each(hit._source.ingredients, function (ingredient) {
            recipe.addIngredient(
              new Ingredient(
                ingredient.item,
                ingredient.amount
              )
            );
          });

          return recipe;
        });
        deferred.resolve(recipes);
      }, function (error) {
        deferred.reject(error);
      });

      return deferred.promise;
    };

    return this;
  }]);
