'use strict';

angular.module('bruleeApp.services')

  .service('bruleeUtils', function () {

    this.replaceProperties = function (obj, source) {
      oldlodash.each(obj, function (v, k) {
        if (!source[k]) {
          delete obj[k];
        }
      });

      return oldlodash.assign(obj, source);
    };

    this.replaceEach = function (array, source) {
      oldlodash.remove(array, function (element) {
        return oldlodash.includes(source, 'id', element.id);
      });

      var scope = this;
      oldlodash.each(source, function (element) {
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
