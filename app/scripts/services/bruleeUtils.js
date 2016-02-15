'use strict';

angular.module('bruleeApp.services')

  .service('bruleeUtils', function () {

    this.replaceProperties = function (obj, source) {
      _.each(obj, function (v, k) {
        if (!source[k]) {
          delete obj[k];
        }
      });

      return _.assign(obj, source);
    };

    this.replaceEach = function (array, source) {
      _.remove(array, function (element) {
        return !!_.find(source, ['id', element.id]);
      });

      var scope = this;
      _.each(source, function (element) {
        var index = _.findIndex(array, ['id', element.id]);
        if (index && index >= 0) {
          scope.replaceProperties(array[index], element);
        } else {
          array.push(element);
        }
      });

      return array;
    };

    return this;

  });
