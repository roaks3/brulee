
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
        template: '<create-list-screen></create-list-screen>'
      })
      .state('addRecipes', {
        url: '/addRecipes',
        template: '<add-recipe-screen></add-recipe-screen>'
      })
      .state('categories', {
        url: '/categories',
        template: '<category-edit-screen></category-edit-screen>'
      })
      .state('groceries', {
        url: '/grocery',
        template: '<grocery-list-screen></grocery-list-screen>'
      })
      .state('grocery', {
        url: '/grocery/:id',
        template: '<grocery-list-screen></grocery-list-screen>'
      })
      .state('ingredients', {
        url: '/ingredient',
        template: '<ingredient-list-screen></ingredient-list-screen>'
      })
      .state('ingredient', {
        url: '/ingredient/:id',
        template: '<ingredient-screen></ingredient-screen>'
      })
      .state('recipes', {
        url: '/recipe',
        template: '<recipe-list-screen></recipe-list-screen>'
      })
      .state('recipe', {
        url: '/recipe/:id',
        template: '<recipe-screen></recipe-screen>'
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
