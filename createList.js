
angular.module('createListApp', ['elasticsearch'])

    .service('client', function (esFactory) {
        return esFactory({
            host: 'localhost:9200',
            apiVersion: '1.2',
            log: 'trace'
        });
    })

    .controller('CreateListController', function($scope, client, esFactory) {
        $scope.recipes = [];
        client.search({
            index: 'test',
            type: 'recipe',
            size: 500,
            body: {
                query: {
                    match_all: {}
                }
            }
        }).then(function (body) {
            var hitsJson = body;
            for (var i in hitsJson.hits.hits) {
                var recipeJson = hitsJson.hits.hits[i]._source;
                var name = recipeJson.name;
                var recipe = new Recipe(name, null, recipeJson.originalText);
                for (var j in recipeJson.ingredients) {
                    var ingredientJson = recipeJson.ingredients[j];
                    var ingredient = new Ingredient(ingredientJson.item, ingredientJson.amount);
                    recipe.addIngredient(ingredient);
                }
                $scope.recipes.push(recipe);
            }
        }, function (error) {
            console.trace(error.message);
        });

        $scope.shoppingList = [];

        $scope.categories = new Categories();
        client.search({
            index: 'recipes',
            type: 'category',
            size: 500,
            body: {
                query: {
                    match_all: {}
                }
            }
        }).then(function (body) {
            var hitsJson = body;
            for (var i in hitsJson.hits.hits) {
                var categoryJson = hitsJson.hits.hits[i]._source;
                var name = categoryJson._name;
                var order = categoryJson._order;
                var category = new Category(name, order, null);
                for (var j in categoryJson._items) {
                    var item = categoryJson._items[j];
                    category.addItem(item);
                }
                $scope.categories.add(category);
            }
        }, function (error) {
            console.trace(error.message);
        });

        $scope.calculateShoppingList = function() {
            var ingredientList = [];
            angular.forEach($scope.recipes, function(recipe) {
                if (recipe._selected) ingredientList = Ingredients.combineAll(ingredientList, recipe.ingredients);
            });

            $scope.shoppingList = [];
            var leftoverList = ingredientList.map(function(ingredient) {
                return ingredient.item;
            });
            angular.forEach($scope.categories._categories, function(category) {
                var shoppingListCategory = {name: category.name, items: []};
                angular.forEach(category.items, function(item) {
                    var ingredient = Ingredients.getByItem(ingredientList, item);
                    if (ingredient !== null) {
                        shoppingListCategory.items.push(item);
                    }
                    leftoverList = leftoverList.filter(function(element) {
                        return element !== item;
                    });
                });
                $scope.shoppingList.push(shoppingListCategory);
            });

            $scope.shoppingList.push({name: "Leftovers", items: leftoverList});
        };
    });
