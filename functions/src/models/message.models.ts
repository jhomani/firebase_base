import Joi from 'joi';

export const fieldsSchema: Array<string> = [
  "text",
  "type",
  "image",
  "userId",
  "createdAd",
  "latitude",
  "longitude",
];

export const postSchema = Joi.object({
  type: Joi.string().required(),
  text: Joi.string(),
  file: Joi.object(),
  longitude: Joi.number(),
  latitude: Joi.number(),
}).with("longitude", "latitude").with("latitude", "longitude").options({ abortEarly: false });

export const patchSchema = Joi.object({
  type: Joi.string(),
  text: Joi.string(),
  file: Joi.object(),
  longitude: Joi.number(),
  latitude: Joi.number(),
}).options({ abortEarly: false });