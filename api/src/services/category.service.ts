import * as _ from 'lodash';
import * as pg from './pg.service';

export interface Category {
  id?: string;
  name?: string;
  display_order?: number;
}

export interface FindOpts {
  ids?: string[];
}

export const find = ({ ids }: FindOpts): Promise<Category[]> => {
  const query = pg.knex('categories').select();

  if (ids) {
    query.whereIn('id', ids);
  }

  return Promise.resolve(query);
};

export const create = async (obj: Category): Promise<Category> => {
  const fields = _.pick(obj, ['name', 'display_order']);

  const [result] = await pg
    .knex('categories')
    .insert({
      ...fields,
      display_order:
        fields.display_order ||
        function() {
          this.select(pg.knex.raw('max(display_order) + 1')).from('categories');
        }
    })
    .returning('*');

  return result || {};
};

export const update = async (id: string, obj: Category): Promise<Category> => {
  const fields = _.pick(obj, ['name', 'display_order']);

  const [result] = await pg
    .knex('categories')
    .update(fields)
    .where({ id })
    .returning('*');

  return result || {};
};

export const deleteOne = (id: string): Promise<Category> =>
  Promise.resolve(
    pg
      .knex('categories')
      .del()
      .where({ id })
      .return({ id })
  );
