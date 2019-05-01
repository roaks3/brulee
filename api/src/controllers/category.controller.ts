import * as express from 'express';
import { CategoryResponse } from '../models/category.model';
import * as categoryService from '../services/category.service';
import * as categorySerializer from '../serializers/category.serializer';

export const index = async (
  req: express.Request
): Promise<CategoryResponse[]> => {
  const categories = await categoryService.find({});

  return categories.map(categorySerializer.serialize);
};

export const show = async (req: express.Request): Promise<CategoryResponse> => {
  const categories = await categoryService.find({ ids: [req.params.id] });

  return categories && categories.length
    ? categorySerializer.serialize(categories[0])
    : {};
};

export const create = async (
  req: express.Request
): Promise<CategoryResponse> => {
  const created = await categoryService.create(req.body);

  return categorySerializer.serialize(created);
};

export const update = async (
  req: express.Request
): Promise<CategoryResponse> => {
  const updated = await categoryService.update(req.params.id, req.body);

  return categorySerializer.serialize(updated);
};

export const destroy = async (
  req: express.Request
): Promise<CategoryResponse> => {
  const deleted = await categoryService.deleteOne(req.params.id);

  return categorySerializer.serialize(deleted);
};
