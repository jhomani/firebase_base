import Joi from 'joi';

export const fieldsSchema: Array<string> = [
  "name",
  "description",
  "createdAt",
  "lastMessage",
  "objectId",
  "members"
];

export const postSchema = Joi.object({
  name: Joi.string().required(),
  objectId: Joi.string(),
  members: Joi.array().items(Joi.string()).required(),
}).options({ abortEarly: false });

export const patchSchema = Joi.object({
  name: Joi.string().required(),
  objectId: Joi.string().required(),
  members: Joi.array().items(Joi.string()).required(),
}).options({ abortEarly: false });