const Joi = require("joi");

const id = Joi.number().integer();
const data = Joi.object();
const url = Joi.string();

const getEntradaSchema = Joi.object({
  id: id.required(),
});

const createEntradaSchema = Joi.object({
  id_entidad: id.required(),
  id_conf_dataset: id.required(),
  id_usuario: id.required(),
  atributos: data.required(),
  file_url: url.required(),
});

module.exports = {getEntradaSchema, createEntradaSchema}
