import Joi from 'joi';

export const fieldsSchema: Array<string> = [
  "type",
  "content",
  "avatar",
  "userId",
  "radioLocate",
];

export const postSchema = Joi.object({
  type: Joi.string().required(),
  content: Joi.string().required(),
  avatar: Joi.object(),
  userId: Joi.string(),
  radioLocate: Joi.number(),
}).options({ abortEarly: false });

export const patchSchema = Joi.object({
  type: Joi.string(),
  content: Joi.string(),
  avatar: Joi.object(),
  userId: Joi.string(),
  radioLocate: Joi.number(),
}).options({ abortEarly: false });