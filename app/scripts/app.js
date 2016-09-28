
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
    'ui.bootstrap',
    'ngStorage',
    'bruleeApp.services',
    'js-data',
    'ui.router'
  ])

  .config(function ($locationProvider, $stateProvider, $urlRouterProvider, DSHttpAdapterProvider) {

    $locationProvider.html5Mode(true);

    $urlRouterProvider
      .otherwise('/createList');

    $stateProvider
      .state('createList', {
        url: '/createList',
        templateUrl: 'views/createList.html',
        controller: 'CreateListCtrl'
      })
      .state('addRecipes', {
        url: '/addRecipes',
        templateUrl: 'views/addRecipes.html',
        controller: 'AddRecipesCtrl'
      })
      .state('categories', {
        url: '/categories',
        templateUrl: 'views/category.html',
        controller: 'CategoryCtrl'
      })
      .state('groceries', {
        url: '/grocery',
        templateUrl: 'views/groceryList.html',
        controller: 'GroceryListCtrl'
      })
      .state('grocery', {
        url: '/grocery/:id',
        templateUrl: 'views/groceryList.html',
        controller: 'GroceryListCtrl'
      })
      .state('ingredients', {
        url: '/ingredient',
        templateUrl: 'views/ingredientList.html',
        controller: 'IngredientListCtrl'
      })
      .state('ingredient', {
        url: '/ingredient/:id',
        templateUrl: 'views/ingredient.html',
        controller: 'IngredientCtrl'
      })
      .state('recipes', {
        url: '/recipe',
        templateUrl: 'views/recipeList.html',
        controller: 'RecipeListCtrl'
      })
      .state('recipe', {
        url: '/recipe/:id',
        templateUrl: 'views/recipe.html',
        controller: 'RecipeCtrl'
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
angular.module('bruleeApp.services', []);
