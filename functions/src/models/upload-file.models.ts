import Joi from 'joi';

export const fieldsSchema: Array<string> = [
  "slug",
  "link",
  "userId",
  "objectId",
];

export const postSchema = Joi.object({
  slug: Joi.string(),
  userId: Joi.string(),
  objectId: Joi.string(),
}).options({ abortEarly: false });

export const patchSchema = Joi.object({
  slug: Joi.string(),
  userId: Joi.string(),
  objectId: Joi.string(),
}).options({ abortEarly: false });