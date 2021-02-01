import Joi from 'joi';

export const schema: Array<string> = [
  'email',
  'lastName',
  'firstName',
  'userTypeId',
  'phone',
  'avatar',
]

export const registerSchema = Joi.object({
  email: Joi.string().email().min(4).max(25).required(),
  password: Joi.string().min(6).max(32).required(),
  lastName: Joi.string().required(),
  firstName: Joi.string().required(),
  userTypeId: Joi.string().required(),
  phone: Joi.string().required(),
}).options({ abortEarly: false });

export const loginSchema = Joi.object({
  email: Joi.string().email().min(4).max(25).required(),
  password: Joi.string().min(6).max(32).required(),
});

export const patchSchema = Joi.object({
  email: Joi.string().email().min(4).max(25),
  lastName: Joi.string(),
  firstName: Joi.string(),
  userTypeId: Joi.string(),
  phone: Joi.string(),
}).options({ abortEarly: false });
