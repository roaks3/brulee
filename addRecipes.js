
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
        $scope.isParsed = false;
        $scope.isSaved = false;

        $scope.addRecipe = function() {
            client.create({
                index: 'test',
                type: 'recipe',
                body: $scope.recipe
            }, function (error, response) {
                if (error) {
                    //console.trace(error.message);
                    console.log("Error:" + error);
                } else {
                    $scope.isSaved = true;
                }
                //console.log("Response:" + JSON.stringify(response));
            });
        };

        $scope.parseRecipeText = function() {
            $scope.recipe.ingredients = Ingredients.parse($scope.recipe.originalText);
            $scope.isParsed = true;
        };
    });
