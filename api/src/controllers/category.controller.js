const categoryService = require('../services/category.service');
const ingredientService = require('../services/ingredient.service');
const categorySerializer = require('../serializers/category.serializer');

const index = async req => {
  const categories = await categoryService.find({});

  return Promise.all(
    categories.map(async category => {
      const ingredients = await ingredientService.find({
        categoryId: category.id
      });
      return categorySerializer.serialize(category, ingredients);
    })
  );
};

const show = async req => {
  const categories = await categoryService.find({ ids: [req.params.id] });
  const ingredients = await ingredientService.find({
    categoryId: req.params.id
  });

  return categories && categories.length
    ? categorySerializer.serialize(categories[0], ingredients)
    : {};
};

const create = async req => {
  const created = await categoryService.create({
    ...req.body,
    display_order: req.body.order
  });

  return categorySerializer.serialize(created, []);
};

const update = async req => {
  const updated = await categoryService.update(req.params.id, {
    ...req.body,
    display_order: req.body.order
  });

  if (req.body.ingredient_ids) {
    await ingredientService.updateCategoryForAll(
      req.body.ingredient_ids,
      req.params.id
    );
  }

  const ingredients = await ingredientService.find({
    categoryId: req.params.id
  });

  return categorySerializer.serialize(updated, ingredients);
};

const destroy = async req => {
  const deleted = await categoryService.deleteOne(req.params.id);

  return categorySerializer.serialize(deleted, []);
};

module.exports = {
  index,
  show,
  create,
  update,
  destroy
};
