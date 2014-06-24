
var Ingredient = (function() {

	var Ingredient = function(item, amount) {
		this._item = item;
		this._amount = amount;
	};

	Ingredient.parseSingle = function(text) {
		var ingredients = {};
		text = text.trim();
		if (text != "") {
			var amount = "" + text.match(/^\d[\/\d]*/);
			if (amount == null) {
				amount = "1";
			}
			var item = text.substr(amount.length);
			item = item.trim();
			ingredients[item] = amount;
		}
		return ingredients;
	};

	Ingredient.addSingle = function(ingredients, addIngredient) {
		for (var item in addIngredient) {
			ingredients[item] = Ingredient.addAmounts(ingredients[item], addIngredient[item]);
		}
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
