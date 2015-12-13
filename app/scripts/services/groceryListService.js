'use strict';

angular.module('bruleeApp.services')

  .service('groceryListService', function ($q, bruleeDataService) {

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
          return _.map(data.hits.hits, function (hit) {
            return _.assign(hit._source, {
              id: hit._id
            });
          });
        });
    };

    this.groceryListCreate = function (groceryList) {
      return bruleeDataService.create({
        index: index,
        type: type,
        body: groceryList
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
            recipe_days: groceryList.recipe_days
          }
        }
      });
    };

    return this;

  });
