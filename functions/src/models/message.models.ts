import Joi from 'joi';

export const fieldsSchema: Array<string> = [
  "text",
  "type",
  "image",
  "userId",
  "createdAd",
];

export const postSchema = Joi.object({
  type: Joi.string().required(),
  text: Joi.string(),
  file: Joi.object(),
}).xor("text", "file").options({ abortEarly: false });

export const patchSchema = Joi.object({
  type: Joi.string(),
  text: Joi.string(),
  file: Joi.object(),
}).options({ abortEarly: false });