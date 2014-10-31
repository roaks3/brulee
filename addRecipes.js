
angular.module('addRecipesApp', ['elasticsearch'])

    .service('client', function (esFactory) {
        return esFactory({
            host: 'localhost:9200',
            apiVersion: '1.2',
            log: 'trace'
        });
    })

    .controller('AddRecipesController', function($scope, client, esFactory) {
        $scope.recipe = new Recipe("", null, "");

        $scope.addRecipe = function() {
            client.create({
                index: 'test',
                type: 'recipe',
                body: $scope.recipe
            }, function (error, response) {
                console.trace(error.message);
            });
        };

        $scope.parseRecipeText = function() {
            $scope.recipe.ingredients = Ingredients.parse($scope.recipe.originalText);
        };
    });
