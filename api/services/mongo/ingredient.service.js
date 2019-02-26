const mongo = require('./mongo.service');

const find = q =>
  mongo.find('ingredients', { q });

const findOne = id =>
  mongo.findOne('ingredients', id);

const create = obj =>
  mongo.create('ingredients', obj);

const update = (id, obj) =>
  mongo.update('ingredients', id, obj);

const deleteOne = id =>
  mongo.deleteOne('ingredients', id);

module.exports = {
  find,
  findOne,
  create,
  update,
  deleteOne
};
