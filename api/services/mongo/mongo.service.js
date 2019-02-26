const fetch = require('node-fetch');

const normalizeId = obj => {
  obj.id = obj._id.$oid;
  delete obj._id;
  return obj;
};

const find = (collection, { q, s, l } = {}) =>
  fetch(`${process.env.API_URL}/${collection}?apiKey=${process.env.API_KEY}${q ? `&q=${q}` : ''}${s ? `&s=${s}` : ''}${l ? `&l=${l}` : ''}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .then(json => json && json.map(normalizeId));

const findOne = (collection, id) =>
  fetch(`${process.env.API_URL}/${collection}/${id}?apiKey=${process.env.API_KEY}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .then(normalizeId);

const create = (collection, obj) =>
  fetch(`${process.env.API_URL}/${collection}?apiKey=${process.env.API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(obj)
  })
    .then(res => res.json())
    .then(normalizeId);

const update = (collection, id, obj) =>
  fetch(`${process.env.API_URL}/${collection}/${id}?apiKey=${process.env.API_KEY}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(obj)
  })
    .then(res => res.json())
    .then(normalizeId);

const deleteOne = (collection, id) =>
  fetch(`${process.env.API_URL}/${collection}/${id}?apiKey=${process.env.API_KEY}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .then(normalizeId);

module.exports = {
  find,
  findOne,
  create,
  update,
  deleteOne
};
