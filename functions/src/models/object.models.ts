import Joi from 'joi';

export const fieldsSchema: Array<string> = [
  "name",
  "description",
  "createdAt",
  "locate",
  "userId",
  "lossDate",
  "remuneration",
  "objectTypeId",
  "circumtances",
  "verify",
  "state",
  "favorite",
];

export const postSchema: any = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  locate: Joi.array().items(Joi.string()),
  remuneration: Joi.number().min(10).max(1000),
  userId: Joi.string(),
  lossDate: Joi.string(),
  categoryId: Joi.string(),
  circumtances: Joi.string(),
  verify: Joi.bool(),
  favorite: Joi.bool(),
  state: Joi.string(),
}).options({ abortEarly: false });

export const patchSchema: any = Joi.object({
  name: Joi.string(),
  description: Joi.string(),
  locate: Joi.array().items(Joi.string()),
  remuneration: Joi.number().min(10).max(1000),
  lossDate: Joi.string(),
  userId: Joi.string(),
  categoryId: Joi.string(),
  circumtances: Joi.string(),
  verify: Joi.bool(),
  favorite: Joi.bool(),
  state: Joi.string(),
}).options({ abortEarly: false });