
'use strict';

/**
 * @ngdoc overview
 * @name bruleeApp
 * @description
 * # bruleeApp
 *
 * Main module of the application.
 */
angular.module('bruleeApp', [
        'ngRoute',
        'ui.bootstrap',
        'bruleeApp.services'
    ])

    .config(function ($routeProvider) {
        $routeProvider
            .when('/createList', {
                templateUrl: 'views/createList.html',
                controller: 'CreateListCtrl'
            })
            .when('/addRecipes', {
                templateUrl: 'views/addRecipes.html',
                controller: 'AddRecipesCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    });

/**
 * @ngdoc overview
 * @name bruleeApp.services
 * @description
 * # bruleeApp.services
 *
 * Main services module of the application.
 */
angular.module('bruleeApp.services', [
        'elasticsearch'
    ]);
