
'use strict';

angular.module('bruleeApp.services', ['elasticsearch'])

    .factory('recipesFactory', ['$q', 'esFactory', function ($q, esFactory) {
        var client = esFactory({
            host: 'https://mhkubr1u:ibllibv1l1c140a8@box-5981704.us-east-1.bonsai.io/',
            apiVersion: '1.2',
            log: 'error'
        });

        var factory = {};

        factory.getCategories = function() {
            var deferred = $q.defer();

            client.search({
                index: 'test',
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

        factory.updateCategories = function(categories) {
            angular.forEach(categories, function (category) {
                client.update({
                    index: 'test',
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

        factory.createRecipe = function(recipe) {
            var deferred = $q.defer();

            client.create({
                index: 'test3',
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

        factory.getRecipes = function() {
            var deferred = $q.defer();

            client.search({
                index: 'test3',
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

        return factory;
    }]);
