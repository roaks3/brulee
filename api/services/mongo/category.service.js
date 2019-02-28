const mongo = require('./mongo.service');

const find = q =>
  mongo.find('categories', { q });

const findOne = id =>
  mongo.findOne('categories', id);

const create = obj =>
  mongo.create('categories', obj);

const update = (id, obj) =>
  mongo.update('categories', id, obj);

const deleteOne = id =>
  mongo.deleteOne('categories', id);

module.exports = {
  find,
  findOne,
  create,
  update,
  deleteOne
};
