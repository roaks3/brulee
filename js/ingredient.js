
var Ingredient = (function() {

	var Ingredient = function(item, amount) {
		this._item = item;
		this._amount = amount;
	};

	Ingredient.parseSingle = function(text) {
		if (text == null) {
			return null;
		}

		text = text.trim();
		if (text == "") {
			return null;
		}

		var amount = "" + text.match(/^\d[\/\d]*/);
		if (amount == null) {
			amount = "1";
		}

		var item = text.substr(amount.length);
		item = item.trim();

		return new Ingredient(item, amount);
	};

	Ingredient.addSingle = function(ingredients, addIngredient) {
		var item = addIngredient._item;
		var amount = addIngredient._amount;
		ingredients[item] = Ingredient.addAmounts(ingredients[item], amount);
		return ingredients;
	};

	Ingredient.parse = function(text) {
		var unparsedIngredients = text.split("\n");
		var ingredients = {};
		for (var i = 0; i < unparsedIngredients.length; i++) {
			var singleIngredient = Ingredient.parseSingle(unparsedIngredients[i]);
			Ingredient.addSingle(ingredients, singleIngredient);
		}
		return ingredients;
	};

	Ingredient.addAll = function(leftIngredients, rightIngredients) {
		var resultIngredients = {};
		for (var item in leftIngredients) {
			resultIngredients[item] = Ingredient.addAmounts(resultIngredients[item], leftIngredients[item]);
		}
		for (var item in rightIngredients) {
			resultIngredients[item] = Ingredient.addAmounts(resultIngredients[item], rightIngredients[item]);
		}
		return resultIngredients;
	};

	Ingredient.addAmounts = function(leftAmount, rightAmount) {
		var resultAmount = "";
		if (leftAmount == null) {
			resultAmount = rightAmount;
		} else if (rightAmount == null) {
			resultAmount = leftAmount;
		} else {
			resultAmount = leftAmount + " + " + rightAmount;
			//resultAmount = Ratio.parse(leftAmount).add(rightAmount).simplify().toLocaleString();
		}
		return resultAmount;
	};

	return Ingredient;

} ());
