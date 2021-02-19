import Joi from 'joi';

export const fieldsSchema: Array<string> = [
  "termsConditions",
  "profitability",
  "createdAt",
];

export const postSchema = Joi.object({
  termsConditions: Joi.string().required(),
  profitability: Joi.number().required(),
}).options({ abortEarly: false });

export const patchSchema = Joi.object({
  termsConditions: Joi.string(),
  profitability: Joi.number()
}).options({ abortEarly: false });