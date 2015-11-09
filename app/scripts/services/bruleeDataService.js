'use strict';

angular.module('bruleeApp.services')

  .service('bruleeDataService', function ($q, esFactory) {
    
    this.client = esFactory({
      host: 'https://mhkubr1u:ibllibv1l1c140a8@box-5981704.us-east-1.bonsai.io/',
      apiVersion: '1.2',
      log: 'error'
    });

    this.create = function (data) {
      var deferred = $q.defer();

      this.client.create(data, function (error, response) {
        if (error) {
          deferred.reject(error);
        } else {
          deferred.resolve(response);
        }
      });

      return deferred.promise;
    };

    this.search = function (data) {
      var deferred = $q.defer();

      this.client.search(data)
        .then(function (body) {
          deferred.resolve(body);
        }, function (error) {
          deferred.reject(error);
        });

      return deferred.promise;
    };

    this.update = function (data) {
      var deferred = $q.defer();

      this.client.update(data, function (error) {
        if (error) {
          deferred.reject(error);
        } else {
          deferred.resolve();
        }
      });

      return deferred.promise;
    };

    this.delete = function (data) {
      var deferred = $q.defer();

      this.client.delete(data, function (error) {
        if (error) {
          deferred.reject(error);
        } else {
          deferred.resolve();
        }
      });

      return deferred.promise;
    };

    return this;

  });
