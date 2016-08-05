
'use strict';

/**
 * @ngdoc overview
 * @name bruleeApp
 * @description
 * # bruleeApp
 *
 * Main module of the application.
 */
angular.module('bruleeApp', [
    'ngRoute',
    'ui.bootstrap',
    'ngStorage',
    'bruleeApp.services',
    'js-data'
  ])

  .config(function ($routeProvider, DSHttpAdapterProvider) {
    $routeProvider
      .when('/createList', {
        templateUrl: 'views/createList.html',
        controller: 'CreateListCtrl'
      })
      .when('/addRecipes', {
        templateUrl: 'views/addRecipes.html',
        controller: 'AddRecipesCtrl'
      })
      .when('/categories', {
        templateUrl: 'views/category.html',
        controller: 'CategoryCtrl'
      })
      .when('/grocery', {
        templateUrl: 'views/groceryList.html',
        controller: 'GroceryListCtrl'
      })
      .when('/grocery/:id', {
        templateUrl: 'views/groceryList.html',
        controller: 'GroceryListCtrl'
      })
      .when('/ingredient', {
        templateUrl: 'views/ingredientList.html',
        controller: 'IngredientListCtrl'
      })
      .when('/ingredient/:id', {
        templateUrl: 'views/ingredient.html',
        controller: 'IngredientCtrl'
      })
      .when('/recipe', {
        templateUrl: 'views/recipeList.html',
        controller: 'RecipeListCtrl'
      })
      .when('/recipe/:id', {
        templateUrl: 'views/recipe.html',
        controller: 'RecipeCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

    var databaseName = 'heroku_r2q4kcbs';
    _.assign(DSHttpAdapterProvider.defaults, {
      log: false,
      basePath: `https://api.mlab.com/api/1/databases/${databaseName}/collections`,
      httpConfig: {
        headers: {
          'Content-type': 'application/json'
        },
        params: {
          apiKey: 'VPQEa9jL2UFh3w24C6SWjqcWUoVYVDVB'
        }
      }
    });
  });

/**
 * @ngdoc overview
 * @name bruleeApp.services
 * @description
 * # bruleeApp.services
 *
 * Main services module of the application.
 */
angular.module('bruleeApp.services', [
    'elasticsearch'
  ]);
