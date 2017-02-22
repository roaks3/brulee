import angular from 'angular';
import uiRouter from 'angular-ui-router';
import jsData from 'js-data-angular';

import '../styles/main.scss';

import navBar from '../components/navBar/navBar';
import groceryListScreen from '../screens/groceryListScreen/groceryListScreen';
import recipeScreen from '../screens/recipeScreen/recipeScreen';
import ingredientListScreen from '../screens/ingredientListScreen/ingredientListScreen';
import ingredientScreen from '../screens/ingredientScreen/ingredientScreen';
import categoryEditScreen from '../screens/categoryEditScreen/categoryEditScreen';
import createListScreen from '../screens/createListScreen/createListScreen';
import addRecipeScreen from '../screens/addRecipeScreen/addRecipeScreen';

angular.module('bruleeApp', [
    jsData,
    uiRouter,

    navBar,
    groceryListScreen,
    recipeScreen,
    ingredientListScreen,
    ingredientScreen,
    categoryEditScreen,
    createListScreen,
    addRecipeScreen
  ])

  .config(function ($locationProvider, $stateProvider, $urlRouterProvider, DSHttpAdapterProvider) {
    'ngInject';

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

angular.element(document)
  .ready(() => {
    angular.bootstrap(document, ['bruleeApp'], {
      strictDi: true
    });
  });
