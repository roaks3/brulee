
'use strict';

angular.module('bruleeApp.services')

  .service('recipesService', function ($q, categoryService, esFactory) {
    var client = esFactory({
      host: 'https://mhkubr1u:ibllibv1l1c140a8@box-5981704.us-east-1.bonsai.io/',
      apiVersion: '1.2',
      log: 'error'
    });

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
  });
