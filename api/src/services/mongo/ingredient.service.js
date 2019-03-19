const _ = require('lodash');
const mongo = require('./mongo.service');

const find = ({ ids, names }) => {
  let q = {};

  if (ids) {
    q._id = {
      $in: ids.map(id => ({ $oid: id }))
    };
  }

  if (names) {
    q.name = {
      $in: names
    };
  }

  q = _.isEmpty(q) ? undefined : encodeURI(JSON.stringify(q));

  return mongo.find('ingredients', { q });
};

const findOne = id => mongo.findOne('ingredients', id);

const create = obj => mongo.create('ingredients', obj);

const update = (id, obj) => mongo.update('ingredients', id, obj);

const deleteOne = id => mongo.deleteOne('ingredients', id);

module.exports = {
  find,
  findOne,
  create,
  update,
  deleteOne
};
