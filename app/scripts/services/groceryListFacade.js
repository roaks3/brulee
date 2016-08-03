'use strict';

angular.module('bruleeApp.services')

  .service('groceryListFacade', function (bruleeDataService) {

    this.groceryLists = function () {
      return bruleeDataService.search('groceryLists');
    };

    this.groceryListCreate = function (groceryList) {
      var groceryListFields = {
        week_start: groceryList.week_start,
        recipe_days: groceryList.recipe_days,
        additional_ingredients: groceryList.additional_ingredients
      };

      return bruleeDataService.create('groceryLists', groceryListFields);
    };

    this.groceryListUpdate = function (groceryList) {
      return bruleeDataService.update('groceryLists', {
        recipe_days: groceryList.recipe_days,
        additional_ingredients: groceryList.additional_ingredients
      });
    };

    return this;

  });
