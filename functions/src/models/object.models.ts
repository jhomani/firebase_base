import Joi from 'joi';

export const fieldsSchema: Array<string> = [
  "name",
  "description",
  "createdAt",
  "locate",
  "userId",
  "lossDate",
  "images",
  "remuneration",
  "objectTypeId",
  "circumtances",
  "verify",
  "state",
  "favorite",
];

export const postSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  locate: Joi.array().items(Joi.number()),
  remuneration: Joi.number().min(10).max(1000),
  images: Joi.array().items(Joi.object()).required(),
  lossDate: Joi.string(),
  categoryId: Joi.string(),
  circumtances: Joi.string(),
  verify: Joi.bool(),
  favorite: Joi.bool(),
  state: Joi.string(),
}).options({ abortEarly: false });

export const patchSchema = Joi.object({
  name: Joi.string(),
  description: Joi.string(),
  locate: Joi.array().items(Joi.number()),
  remuneration: Joi.number().min(10).max(1000),
  images: Joi.array().items(Joi.object()),
  lossDate: Joi.string(),
  userId: Joi.string(),
  categoryId: Joi.string(),
  circumtances: Joi.string(),
  verify: Joi.bool(),
  favorite: Joi.bool(),
  state: Joi.string(),
}).options({ abortEarly: false });