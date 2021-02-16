import Joi from 'joi';

export const fieldsSchema: Array<string> = [
  "name",
  "description",
  "createdAt",
  "latitude",
  "longitude",
  "userId",
  "lossDate",
  "images",
  "remuneration",
  "objectTypeId",
  "circumtances",
  "verify",
  "state",
  "favorite",
  "tagsId",
  "questAndAnswer",
];

export const postSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  remuneration: Joi.number(),
  latitude: Joi.number(),
  longitude: Joi.number(),
  images: Joi.array().items(Joi.object()).required(),
  lossDate: Joi.string(),
  objectTypeId: Joi.string(),
  circumtances: Joi.string(),
  verify: Joi.bool(),
  favorite: Joi.bool(),
  state: Joi.string(),
  tagsId: Joi.array().items(Joi.string()),
  questAndAnswer: Joi.array().items(Joi.object())
}).options({ abortEarly: false });

export const patchSchema = Joi.object({
  name: Joi.string(),
  description: Joi.string(),
  latitude: Joi.number(),
  longitude: Joi.number(),
  remuneration: Joi.number(),
  images: Joi.array().items(Joi.object()),
  lossDate: Joi.string(),
  userId: Joi.string(),
  objectTypeId: Joi.string(),
  circumtances: Joi.string(),
  verify: Joi.bool(),
  favorite: Joi.bool(),
  state: Joi.string(),
  tagsId: Joi.array().items(Joi.string()),
  questAndAnswer: Joi.array().items(Joi.object())
}).options({ abortEarly: false });