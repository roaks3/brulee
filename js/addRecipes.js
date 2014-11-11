
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
        $scope.categoryNames = [];
        $scope.categories = [];
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
            var categories = {};
            var hitsJson = body;
            for (var i in hitsJson.hits.hits) {
                var categoryJson = hitsJson.hits.hits[i]._source;
                var name = categoryJson.name;
                for (var j in categoryJson.items) {
                    var item = categoryJson.items[j];
                    $scope.categoryMap[item] = name;
                    $scope.items.push(item);
                    categories[name] = true;
                }
                $scope.categories.push({
                    id: hitsJson.hits.hits[i]._id, 
                    name: name, 
                    items: categoryJson.items
                });
            }
            $scope.categoryNames = Object.keys(categories);
        }, function (error) {
            console.trace(error.message);
        });

        $scope.addRecipe = function() {
            angular.forEach($scope.recipe.ingredients, function (ingredient) {
                if (ingredient.selectedCategory) {
                    // Do not add if it already belongs to a category
                    if (!$scope.isCategorized(ingredient)) {
                        $scope.categoryMap[ingredient.item] = ingredient.selectedCategory;
                        $scope.items.push(ingredient.item);
                        angular.forEach($scope.categories, function (category) {
                            if (category.name === ingredient.selectedCategory) {
                                category.items.push(ingredient.item);
                            }
                        });
                    }
                    // Do not save the selectedCategory in the database
                    delete ingredient["selectedCategory"];
                }
            });

            $scope.updateCategories();

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

        $scope.updateCategories = function() {
            angular.forEach($scope.categories, function (category) {
                client.update({
                    index: 'test',
                    type: 'category',
                    id: category.id,
                    body: {
                        doc: {
                            items: category.items
                        }
                    }
                }, function (error, response) {
                    if (error) {
                        //console.trace(error.message);
                        console.log("Error:" + error);
                    }
                    //console.log("Response:" + JSON.stringify(response));
                });
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
            return "None";
        };

        $scope.isCategorized = function(ingredient) {
            if (ingredient) {
                var item = $scope.categoryMap[ingredient.item];
                if (item) {
                    return true;
                }
            }
            return false;
        };

        $scope.setSelectedCategory = function(ingredient, category) {
            ingredient.selectedCategory = category;
        };
    });
