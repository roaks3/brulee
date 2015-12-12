'use strict';

angular.module('bruleeApp.services')

  .service('categoryService', function ($q, bruleeDataService) {

    var index = 'ashlea2';
    var type = 'category';

    this.categories = function() {
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

    this.categoryCreate = function (category) {
      return bruleeDataService.create({
        index: index,
        type: type,
        body: category
      })
        .then(function (data) {
          return data._id;
        });
    };

    this.categoryUpdate = function (category) {
      return bruleeDataService.update({
        index: index,
        type: type,
        id: category.id,
        body: {
          doc: {
            ingredient_ids: category.ingredient_ids
          }
        }
      });
    };

    this.categoryUpdateBulk = function (categories) {
      var scope = this;
      return $q.all(
        _.map(categories, function (category) {
          return scope.categoryUpdate(category);
        })
      );
    };

    this.categoryDelete = function (categoryId) {
      return bruleeDataService.delete({
        index: index,
        type: type,
        id: categoryId
      });
    };

    return this;

  });
