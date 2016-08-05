'use strict';

angular.module('bruleeApp.services')

  .factory('GroceryList', function (bruleeDataService, DS) {

    return DS.defineResource(_.assign({
      name: 'groceryList',
      endpoint: 'groceryLists'
    }, bruleeDataService.jsDataConfig));

  })

  .service('groceryListFacade', function (GroceryList) {

    this.groceryLists = function () {
      return GroceryList.findAll();
    };

    this.groceryListCreate = function (groceryList) {
      return GroceryList.create({
        week_start: groceryList.week_start,
        recipe_days: groceryList.recipe_days,
        additional_ingredients: groceryList.additional_ingredients
      });
    };

    this.groceryListUpdate = function (groceryList) {
      return GroceryList.update(groceryList.id, {
        week_start: groceryList.week_start,
        recipe_days: groceryList.recipe_days,
        additional_ingredients: groceryList.additional_ingredients
      });
    };

    return this;

  });
