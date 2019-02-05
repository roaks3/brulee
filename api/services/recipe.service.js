const mongo = require('./mongo.service');

const find = q =>
  mongo.find('recipes', { q });

const findOne = id =>
  mongo.findOne('recipes', id);

const create = obj =>
  mongo.create('recipes', obj);

const update = (id, obj) =>
  mongo.update('recipes', id, obj);

const deleteOne = id =>
  mongo.deleteOne('recipes', id);

module.exports = {
  find,
  findOne,
  create,
  update,
  deleteOne
};
