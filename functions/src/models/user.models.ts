import { User } from '../interface/user.interface';
import Joi from 'joi';

export const schema: User = {
  email: 'string',
  password: 'string',
  name: 'string',
};

export const registerSchema = Joi.object({
  email: Joi.string().email().min(4).max(25).required(),
  password: Joi.string().min(6).max(32).required(),
  name: Joi.string().required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().min(4).max(25).required(),
  password: Joi.string().min(6).max(32).required(),
});

export const patchSchema = Joi.object({
  email: Joi.string().email().min(4).max(25),
  password: Joi.string().min(6).max(32),
  name: Joi.string(),
});
