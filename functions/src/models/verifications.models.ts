import Joi from 'joi';

export const fieldsSchema: Array<string> = [
  "objectId",
  "userId",
  "ownerId",
  "questAndAnswer",
  "createdAt"
];

export const postSchema = Joi.object({
  questAndAnswer: Joi.array().items(Joi.object({ answer: Joi.string(), quest: Joi.string() })).required(),
  objectId: Joi.string().required(),
  userId: Joi.string(),
  ownerId: Joi.string(),
}).options({ abortEarly: false });

export const patchSchema = Joi.object({
  questAndAnswer: Joi.array().items(Joi.object({ answer: Joi.string(), quest: Joi.string() })),
  objectId: Joi.string(),
  userId: Joi.string(),
  ownerId: Joi.string(),
}).options({ abortEarly: false });