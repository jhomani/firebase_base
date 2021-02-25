import Joi from 'joi';

export const fieldsSchema: Array<string> = [
  "name",
  "description",
  "createdAt",
  "updatedAt",
  "lastMessage",
  "objectId",
  "membersId"
];

export const postSchema = Joi.object({
  name: Joi.string().required(),
  objectId: Joi.string(),
  membersId: Joi.array().items(Joi.string()).required(),
}).options({ abortEarly: false });

export const patchSchema = Joi.object({
  name: Joi.string().required(),
  objectId: Joi.string().required(),
  membersId: Joi.array().items(Joi.string()).required(),
}).options({ abortEarly: false });