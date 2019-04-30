import * as express from 'express';
import * as categoryService from '../services/category.service';
import categorySerializer from '../serializers/category.serializer';

export interface Category {
  id?: string;
  name?: string;
  display_order?: number;
}

export const index = async (req: express.Request): Promise<Category[]> => {
  const categories = await categoryService.find({});

  return categories.map(categorySerializer.serialize);
};

export const show = async (req: express.Request): Promise<Category> => {
  const categories = await categoryService.find({ ids: [req.params.id] });

  return categories && categories.length
    ? categorySerializer.serialize(categories[0])
    : {};
};

export const create = async (req: express.Request): Promise<Category> => {
  const created = await categoryService.create(req.body);

  return categorySerializer.serialize(created);
};

export const update = async (req: express.Request): Promise<Category> => {
  const updated = await categoryService.update(req.params.id, req.body);

  return categorySerializer.serialize(updated);
};

export const destroy = async (req: express.Request): Promise<Category> => {
  const deleted = await categoryService.deleteOne(req.params.id);

  return categorySerializer.serialize(deleted);
};
