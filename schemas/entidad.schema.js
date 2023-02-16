const Joi = require("joi");

const id = Joi.number().integer();
const nombre = Joi.string().trim().min(3);
const sigla = Joi.string().trim().min(2);
const estado = Joi.string();

const limit = Joi.number().integer();
const offset = Joi.number().integer();

const createEntidadSchema = Joi.object({
  nombre: nombre.required(),
  sigla: sigla.required(),
});

const updateEntidadSchema = Joi.object({
  nombre: nombre,
  sigla: sigla,
  estado: estado,
});

const getEntidadSchema = Joi.object({
  id: id.required(),
});

module.exports = { createEntidadSchema, updateEntidadSchema, getEntidadSchema };
