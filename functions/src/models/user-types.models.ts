import Joi from 'joi';

export const fieldsSchema: Array<string> = [
  "name",
  "abbreviation",
  "description",
];

export const postSchema = Joi.object({
  name: Joi.string().required(),
  abbreviation: Joi.string().required(),
  description: Joi.string(),
}).options({ abortEarly: false });

export const patchSchema = Joi.object({
  name: Joi.string(),
  abbreviation: Joi.string(),
  description: Joi.string(),
}).options({ abortEarly: false });
