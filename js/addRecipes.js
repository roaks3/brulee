
angular.module('addRecipesApp', ['elasticsearch', 'ui.bootstrap'])

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

        $scope.categoryMap = {};
        $scope.items = [];
        client.search({
            index: 'test',
            type: 'category',
            size: 500,
            body: {
                query: {
                    match_all: {}
                }
            }
        }).then(function (body) {
            var categories = [];
            var hitsJson = body;
            for (var i in hitsJson.hits.hits) {
                var categoryJson = hitsJson.hits.hits[i]._source;
                var name = categoryJson.name;
                for (var j in categoryJson.items) {
                    var item = categoryJson.items[j];
                    $scope.categoryMap[item] = name;
                    $scope.items.push(item);
                }
            }
        }, function (error) {
            console.trace(error.message);
        });

        $scope.addRecipe = function() {
            client.create({
                index: 'test3',
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

        $scope.removeIngredient = function(index) {
            $scope.recipe.ingredients.splice(index, 1);
        };

        $scope.getCategory = function(ingredient) {
            if (ingredient) {
                var item = $scope.categoryMap[ingredient.item];
                if (item) {
                    return $scope.categoryMap[ingredient.item];
                }
            }
            // set ingredient.isCategorized = false;
            return "None";
        };
    });
