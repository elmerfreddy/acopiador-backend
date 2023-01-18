const Joi = require("joi");

const id = Joi.number().integer();
const email = Joi.string().email({tlds: false});
const password = Joi.string();

const loginSchema = Joi.object({
  email: email.required(),
  password: password.required()
});

const passwordSchema = Joi.object({
  id: id.required(),
  newPassword: password.required()
});

module.exports = { loginSchema, passwordSchema };