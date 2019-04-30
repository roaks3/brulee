import * as _ from 'lodash';
import * as pg from './pg.service';

export interface Ingredient {
  id?: string;
  name?: string;
  category_id?: string;
}

export interface FindOpts {
  ids?: string[];
  names?: string[];
  categoryId?: string;
}

export const find = ({
  ids,
  names,
  categoryId
}: FindOpts): Promise<Ingredient[]> => {
  const query = pg.knex('ingredients').select();

  if (ids) {
    query.whereIn('id', ids);
  }

  if (names) {
    query.whereIn('name', names);
  }

  if (categoryId) {
    query.where({ category_id: categoryId });
  }

  return Promise.resolve(query);
};

export const create = async (obj: Ingredient): Promise<Ingredient> => {
  const fields = _.pick(obj, ['name', 'category_id']);

  const [result] = await pg
    .knex('ingredients')
    .insert(fields)
    .returning('*');

  return result || {};
};

export const update = async (
  id: string,
  obj: Ingredient
): Promise<Ingredient> => {
  const fields = _.pick(obj, ['name', 'category_id']);

  const [result] = await pg
    .knex('ingredients')
    .update(fields)
    .where({ id })
    .returning('*');

  return result || {};
};

export const deleteOne = (id: string): Promise<Ingredient> =>
  Promise.resolve(
    pg
      .knex('ingredients')
      .del()
      .where({ id })
      .return({ id })
  );
