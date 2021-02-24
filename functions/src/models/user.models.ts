import Joi from 'joi';

export const schema: Array<string> = [
  'email',
  'lastName',
  'firstName',
  'userTypeId',
  'phone',
  'rating',
  'objectsFavorites',
  'avatar',
  'verifyStatus'
]

export const registerSchema = Joi.object({
  email: Joi.string().email().min(4).max(25).required(),
  password: Joi.string().min(6).max(32).required(),
  lastName: Joi.string().required(),
  firstName: Joi.string().required(),
  phone: Joi.string().required(),
  rating: Joi.object(),
  userTypeId: Joi.string(),
  objectsFavorites: Joi.array().items(Joi.string()),
  avatar: Joi.object({ id: Joi.string(), link: Joi.string() }),
}).options({ abortEarly: false });

export const loginSchema = Joi.object({
  email: Joi.string().email().min(4).max(25).required(),
  password: Joi.string().min(6).max(32).required(),
});

export const newPasswordSchema = Joi.object({
  newPassword: Joi.string().min(6).max(32).required(),
  resetCode: Joi.string().min(4).max(4).required(),
  email: Joi.string().email().min(4).max(25).required(),
});

export const verifyCodeSchema = Joi.object({
  resetCode: Joi.string().min(4).max(4).required(),
  email: Joi.string().email().min(4).max(25).required(),
});

export const resetPasswordSchema = Joi.object({
  email: Joi.string().email().min(4).max(25).required(),
});

export const patchSchema = Joi.object({
  email: Joi.string().email().min(4).max(25),
  lastName: Joi.string(),
  rating: Joi.number(),
  firstName: Joi.string(),
  userTypeId: Joi.string(),
  phone: Joi.string(),
  deleteFavorite: Joi.string(),
  addFavorite: Joi.string(),
  avatar: Joi.object({ id: Joi.string(), link: Joi.string() }),
}).options({ abortEarly: false });

export const socialMediaSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string(),
  avatar: Joi.object().required(),
  email: Joi.string().required(),
}).options({ abortEarly: false });