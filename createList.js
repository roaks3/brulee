
angular.module('createListApp', ['elasticsearch'])

    .service('client', function (esFactory) {
        return esFactory({
            host: 'localhost:9200',
            apiVersion: '1.2',
            log: 'trace'
        });
    })

    .controller('CreateListController', function($scope, client, esFactory) {
        $scope.recipes = new Recipes();
        client.search({
            index: 'recipes',
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
                var name = recipeJson._name;
                var recipe = new Recipe(name, null, recipeJson._originalText);
                for (var j in recipeJson._ingredients._ingredients) {
                    var ingredientJson = recipeJson._ingredients._ingredients[j];
                    var ingredient = new Ingredient(ingredientJson._item, ingredientJson._amount);
                    recipe.addIngredient(ingredient);
                }
                $scope.recipes.add(recipe);
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
            var ingredientList = new Ingredients();
            angular.forEach($scope.recipes._recipes, function(recipe) {
                if (recipe._selected) ingredientList.combineAll(recipe.getIngredients());
            });

            $scope.shoppingList = [];
            var leftoverList = ingredientList._ingredients.map(function(ingredient) {
                return ingredient._item;
            });
            angular.forEach($scope.categories._categories, function(category) {
                var shoppingListCategory = {name: category._name, items: []};
                angular.forEach(category._items, function(item) {
                    var ingredient = ingredientList.getByItem(item);
                    if (ingredient != null) {
                        shoppingListCategory.items.push(item);
                    }
                    leftoverList = leftoverList.filter(function(element) {
                        return !(element === item);
                    });
                });
                $scope.shoppingList.push(shoppingListCategory);
            });

            $scope.shoppingList.push({name: "Leftovers", items: leftoverList});
        };
    });
