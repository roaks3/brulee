'use strict';

angular.module('bruleeApp.services')

  .service('groceryListFacade', function ($q, bruleeDataService) {

    var index = 'ashlea2';
    var type = 'grocery_list';

    this.groceryLists = function() {
      return bruleeDataService.search({
        index: index,
        type: type,
        size: 500,
        body: {
          query: {
            match_all: {}
          }
        }
      })
        .then(function (data) {
          return oldlodash.map(data.hits.hits, function (hit) {
            return oldlodash.assign(hit._source, {
              id: hit._id
            });
          });
        });
    };

    this.groceryListCreate = function (groceryList) {
      var groceryListFields = {
        week_start: groceryList.week_start,
        recipe_days: groceryList.recipe_days,
        additional_ingredients: groceryList.additional_ingredients
      };

      return bruleeDataService.create({
        index: index,
        type: type,
        body: groceryListFields
      })
        .then(function (data) {
          return data._id;
        });
    };

    this.groceryListUpdate = function (groceryList) {
      return bruleeDataService.update({
        index: index,
        type: type,
        id: groceryList.id,
        body: {
          doc: {
            recipe_days: groceryList.recipe_days,
            additional_ingredients: groceryList.additional_ingredients
          }
        }
      });
    };

    return this;

  });
