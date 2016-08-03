'use strict';

angular.module('bruleeApp.services')

  .service('bruleeDataService', function ($http) {

    let databaseName = 'heroku_r2q4kcbs';
    let apiKey = 'VPQEa9jL2UFh3w24C6SWjqcWUoVYVDVB';
    let baseUrl = `https://api.mlab.com/api/1/databases/${databaseName}/collections`;
    let mongoConfig = {
      headers: {
        'Content-type': 'application/json'
      },
      params: {
        apiKey: apiKey
      }
    };

    this.create = function (collectionName, fields) {
      return $http
        .post(`${baseUrl}/${collectionName}`, _.omit(fields, 'id'), mongoConfig)
        .then(function (data) {
          return data.data._id.$oid;
        });
    };

    this.search = function (collectionName) {
      return $http
        .get(`${baseUrl}/${collectionName}`, mongoConfig)
        .then(function (data) {
          return _.map(data.data, function (element) {
            return _.omit(_.assign(element, {
              id: element._id
            }), '_id');
          });
        });
    };

    this.update = function (collectionName, fields) {
      return $http
        .put(`${baseUrl}/${collectionName}/${fields.id}`, _.omit(fields, 'id'), mongoConfig)
        .then(function (data) {
          return data.data;
        });
    };

    this.delete = function (collectionName, id) {
      return $http
        .delete(`${baseUrl}/${collectionName}/${id}`, mongoConfig)
        .then(function (data) {
          return data.data;
        });
    };

    return this;

  });
