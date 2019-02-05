import angular from 'angular';
import uiRouter from 'angular-ui-router';
import jsData from 'js-data-angular';

import '../styles/main.scss';

import navBar from '../components/navBar/navBar';
import groceryListScreen from '../screens/groceryListScreen/groceryListScreen';
import recipeScreen from '../screens/recipeScreen/recipeScreen';
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
    ingredientScreen,
    categoryEditScreen,
    createListScreen,
    addRecipeScreen
  ])

  .config(function ($locationProvider, $stateProvider, $urlRouterProvider, DSHttpAdapterProvider) {
    'ngInject';

    $locationProvider.html5Mode(true);

    $urlRouterProvider
      .otherwise('/grocery');

    $stateProvider
      .state('createList', {
        url: '/createList',
        template: '<create-list-screen></create-list-screen>'
      })
      .state('addRecipes', {
        url: '/addRecipes',
        template: '<add-recipe-screen></add-recipe-screen>'
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
        url: '/ingredients',
        template: '<category-edit-screen></category-edit-screen>'
      })
      .state('ingredient', {
        url: '/ingredient/:id',
        template: '<ingredient-screen></ingredient-screen>'
      })
      .state('recipe', {
        url: '/recipe/:id',
        template: '<recipe-screen></recipe-screen>'
      });

    _.assign(DSHttpAdapterProvider.defaults, {
      log: false,
      basePath: process.env.BRULEE_API_ENABLED ? process.env.BRULEE_API_URL : process.env.API_URL,
      httpConfig: {
        headers: {
          'Content-type': 'application/json'
        },
        params: {
          apiKey: process.env.API_KEY
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
