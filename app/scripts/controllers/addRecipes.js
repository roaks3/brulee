
'use strict';

angular.module('bruleeApp', ['ui.bootstrap', 'bruleeApp.services'])

    .service('client', function (recipesFactory) {
        return recipesFactory;
    })

    .controller('AddRecipesCtrl', function($scope, client) {
        $scope.recipe = new Recipe("", null, "");
        $scope.isParsed = false;
        $scope.isSaved = false;
        $scope.isNameInvalid = false;

        $scope.categoryMap = {};
        $scope.items = [];
        $scope.categoryNames = [];
        $scope.categories = [];

        client.getCategories().then(function (categories) {
            angular.forEach(categories, function (category) {
                for (var i in category.items) {
                    var item = category.items[i];
                    $scope.categoryMap[item] = category.name;
                    $scope.items.push(item);
                }
            });
            $scope.categories = categories;
            $scope.categoryNames = categories.map(function (category) {
                return category.name;
            });
        });

        $scope.addRecipe = function() {
            // Make sure there is a recipe name present
            if (!$scope.recipe.name) {
                $scope.isNameInvalid = true;
                return;
            }

            $scope.isNameInvalid = false;
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

            client.updateCategories($scope.categories);

            client.createRecipe($scope.recipe).then(function (success) {
                $scope.isSaved = success;
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
