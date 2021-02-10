import Joi from 'joi';

export const fieldsSchema: Array<string> = [
  "fullName",
  "phone",
  "userId",
  "slug"
];

export const postSchema = Joi.object({
  fullName: Joi.string().required(),
  phone: Joi.string().required(),
  slug: Joi.string().required(),
}).options({ abortEarly: false });

export const patchSchema = Joi.object({
  fullName: Joi.string(),
  phone: Joi.string(),
  slug: Joi.string(),
}).options({ abortEarly: false });