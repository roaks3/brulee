const categoryService = require('../services/category.service');
const categorySerializer = require('../serializers/category.serializer');

const index = async req => {
  const categories = await categoryService.find({});

  return categories.map(categorySerializer.serialize);
};

const show = async req => {
  const categories = await categoryService.find({ ids: [req.params.id] });

  return categories && categories.length
    ? categorySerializer.serialize(categories[0])
    : {};
};

const create = async req => {
  const created = await categoryService.create(req.body);

  return categorySerializer.serialize(created, []);
};

const update = async req => {
  const updated = await categoryService.update(req.params.id, req.body);

  return categorySerializer.serialize(updated);
};

const destroy = async req => {
  const deleted = await categoryService.deleteOne(req.params.id);

  return categorySerializer.serialize(deleted);
};

module.exports = {
  index,
  show,
  create,
  update,
  destroy
};
