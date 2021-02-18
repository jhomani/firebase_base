import Joi from 'joi';

export const fieldsSchema: Array<string> = [
  "type",
  "content",
  "avatar",
  "userId",
];

export const postSchema = Joi.object({
  type: Joi.string().required(),
  content: Joi.string().required(),
  avatar: Joi.object(),
  userId: Joi.string(),
}).options({ abortEarly: false });

export const patchSchema = Joi.object({
  type: Joi.string(),
  content: Joi.string(),
  avatar: Joi.object(),
  userId: Joi.string(),
}).options({ abortEarly: false });