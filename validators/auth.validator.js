const Joi = require('joi');
const { REGISTRATION_TYPES, OPERATOR_TYPES } = require('../config/constants');

const registrationSchema = Joi.object({
  fullName: Joi.string().required().min(2).max(100),
  email: Joi.string().email().required(),
  mobileNumber: Joi.string().pattern(/^[0-9]{10}$/).required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.ref('password'),
  address: Joi.string().allow(''),
  registrationType: Joi.string()
    .valid(...Object.values(REGISTRATION_TYPES))
    .required(),
  operatorType: Joi.string()
    .valid(...Object.values(OPERATOR_TYPES), '') // Allow empty string as valid
    .when('registrationType', {
      is: REGISTRATION_TYPES.PRODUCTION,
      then: Joi.required(), // Required if `registrationType` is `production`
      otherwise: Joi.allow('') // Allow empty for other registration types
    })
}).with('password', 'confirmPassword');

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

module.exports = {
  registrationSchema,
  loginSchema
};
