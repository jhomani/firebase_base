import Joi from 'joi';

export const fieldsSchema: Array<string> = [
  "name",
  "description",
];

export const postSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string(),
}).options({ abortEarly: false });

export const patchSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string(),
}).options({ abortEarly: false });