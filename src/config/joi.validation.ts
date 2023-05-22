import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  MONGO_DB_URI: Joi.required(),
  PORT: Joi.number().default(3001),
  DEFAULT_LIMI: Joi.number().default(6),
});
