'use strict';

angular.module('bruleeApp.services')

  .service('bruleeDataService', function ($q) {

    let mongoId = function (object) {
      return _.isString(object._id) ? object._id : object._id.$oid;
    };

    let toBruleeId = function (object) {
      if (object.id) {
        return object;
      }
      return _.omit(_.set(object, 'id', mongoId(object)), '_id');
    };

    let toMongoId = function (object) {
      if (object._id) {
        return object;
      }
      return _.omit(_.set(object, '_id', object.id), 'id');
    };

    this.jsDataConfig = {
      // afterFindAll: function (resource, data) {
      //   return $q.when(_.map(data, toBruleeId));
      // },
      beforeCreate: function (resource, data) {
        return $q.when(toMongoId(data));
      },
      beforeInject: function (resource, instances) {
        _.forEach(_.flatten([instances]), function (instance) {
          instance = toBruleeId(instance);
        });
      }
    };

    return this;

  });
