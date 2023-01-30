const Joi = require("joi");

const id = Joi.number().integer();

const getSchema = Joi.object({
  id: id.required(),
});

module.exports = { getSchema };