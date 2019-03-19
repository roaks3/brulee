const _ = require('lodash');
const moment = require('moment');
const mongoGroceryListService = require('../services/mongo/groceryList.service');
const groceryListService = require('../services/groceryList.service');
const groceryListSerializer = require('../serializers/groceryList.serializer');

const index = async req => {
  const groceryLists = await groceryListService.find({
    ids: _.isString(req.query.ids) ? [req.query.ids] : req.query.ids
  });

  return Promise.all(
    groceryLists.map(async groceryList => {
      const [groceryListRecipes, groceryListIngredients] = await Promise.all([
        groceryListService.findGroceryListRecipes({
          groceryListIds: [groceryList.id]
        }),
        groceryListService.findGroceryListIngredients({
          groceryListIds: [groceryList.id]
        })
      ]);
      return groceryListSerializer.serialize(
        groceryList,
        groceryListRecipes,
        groceryListIngredients
      );
    })
  );
};

const recent = async req => {
  const groceryLists = await groceryListService.find({
    limit: req.query.limit,
    sortMostRecent: true
  });

  return Promise.all(
    groceryLists.map(async groceryList => {
      const [groceryListRecipes, groceryListIngredients] = await Promise.all([
        groceryListService.findGroceryListRecipes({
          groceryListIds: [groceryList.id]
        }),
        groceryListService.findGroceryListIngredients({
          groceryListIds: [groceryList.id]
        })
      ]);
      return groceryListSerializer.serialize(
        groceryList,
        groceryListRecipes,
        groceryListIngredients
      );
    })
  );
};

const show = async req => {
  const groceryLists = await groceryListService.find({ ids: [req.params.id] });

  const [groceryListRecipes, groceryListIngredients] = await Promise.all([
    groceryListService.findGroceryListRecipes({
      groceryListIds: [req.params.id]
    }),
    groceryListService.findGroceryListIngredients({
      groceryListIds: [req.params.id]
    })
  ]);

  return groceryLists && groceryLists.length
    ? groceryListSerializer.serialize(
        groceryLists[0],
        groceryListRecipes,
        groceryListIngredients
      )
    : {};
};

const recipeDayToGroceryListRecipe = (groceryList, recipeDay) => {
  let dowMoment =
    groceryList.week_start &&
    moment(groceryList.week_start, 'YYYY-MM-DD').day(recipeDay.day_of_week);
  if (
    dowMoment &&
    dowMoment.isBefore(moment(groceryList.week_start, 'YYYY-MM-DD'))
  ) {
    dowMoment = dowMoment.add(7, 'days');
  }

  return {
    grocery_list_id: groceryList.id,
    recipe_id: recipeDay.recipe_id,
    day_of_week: recipeDay.day_of_week,
    scheduled_for: dowMoment && dowMoment.toDate()
  };
};

const createGroceryListRecipe = (groceryList, recipeDay) =>
  groceryListService.createGroceryListRecipe(
    recipeDayToGroceryListRecipe(groceryList, recipeDay)
  );

const createGroceryListIngredient = (groceryListId, additionalIngredient) =>
  groceryListService.createGroceryListIngredient(
    Object.assign({}, additionalIngredient, { grocery_list_id: groceryListId })
  );

const create = async req => {
  const created = await mongoGroceryListService.create(req.body);

  await groceryListService.create(created);
  await Promise.all(
    (req.body.recipe_days || []).map(recipeDay =>
      createGroceryListRecipe(created, recipeDay)
    )
  );
  await Promise.all(
    (req.body.additional_ingredients || []).map(additionalIngredient =>
      createGroceryListIngredient(created.id, additionalIngredient)
    )
  );

  return created;
};

const updateGroceryListRecipesForGroceryList = (
  oldGroceryList,
  newGroceryList
) => {
  const createdRecipeDays = newGroceryList.recipe_days.filter(
    nrd =>
      !oldGroceryList.recipe_days.find(
        ord =>
          ord.recipe_id === nrd.recipe_id && ord.day_of_week === nrd.day_of_week
      )
  );
  const removedRecipeDays = oldGroceryList.recipe_days.filter(
    ord =>
      !newGroceryList.recipe_days.find(
        nrd =>
          nrd.recipe_id === ord.recipe_id && nrd.day_of_week === ord.day_of_week
      )
  );

  return Promise.all([
    ...createdRecipeDays.map(rd =>
      createGroceryListRecipe(
        Object.assign({}, newGroceryList, { id: oldGroceryList.id }),
        rd
      )
    ),
    ...removedRecipeDays.map(rd =>
      groceryListService.deleteOneGroceryListRecipe(
        oldGroceryList.id,
        rd.recipe_id,
        rd.day_of_week
      )
    )
  ]);
};

const updateAdditionalIngredientsForGroceryList = (
  oldGroceryList,
  newGroceryList
) => {
  const createdAdditionalIngredients = (
    newGroceryList.additional_ingredients || []
  ).filter(
    nai =>
      !(oldGroceryList.additional_ingredients || []).find(
        oai => oai.ingredient_id === nai.ingredient_id
      )
  );
  const removedAdditionalIngredients = (
    oldGroceryList.additional_ingredients || []
  ).filter(
    oai =>
      !(newGroceryList.additional_ingredients || []).find(
        nai => nai.ingredient_id === oai.ingredient_id
      )
  );
  const changedAdditionalIngredients = (
    newGroceryList.additional_ingredients || []
  ).filter(nai =>
    (oldGroceryList.additional_ingredients || []).find(
      oai =>
        oai.ingredient_id === nai.ingredient_id &&
        (oai.amount !== nai.amount || oai.unit !== nai.unit)
    )
  );

  return Promise.all([
    ...createdAdditionalIngredients.map(ai =>
      createGroceryListIngredient(oldGroceryList.id, ai)
    ),
    ...removedAdditionalIngredients.map(ai =>
      groceryListService.deleteOneGroceryListIngredient(
        oldGroceryList.id,
        ai.ingredient_id
      )
    ),
    ...changedAdditionalIngredients.map(ai =>
      groceryListService.updateGroceryListIngredient(
        oldGroceryList.id,
        ai.ingredient_id,
        ai
      )
    )
  ]);
};

const update = async req => {
  const original = await mongoGroceryListService.findOne(req.params.id);
  const updated = await mongoGroceryListService.update(req.params.id, req.body);

  await groceryListService.update(req.params.id, req.body);
  await updateGroceryListRecipesForGroceryList(original, req.body);
  await updateAdditionalIngredientsForGroceryList(original, req.body);

  return updated;
};

const destroy = async req => {
  const deleted = await mongoGroceryListService.deleteOne(req.params.id);

  await groceryListService.deleteGroceryListIngredientsForGroceryList(
    req.params.id
  );
  await groceryListService.deleteGroceryListRecipesForGroceryList(
    req.params.id
  );
  await groceryListService.deleteOne(req.params.id);

  return deleted;
};

module.exports = {
  index,
  recent,
  show,
  create,
  update,
  destroy
};
