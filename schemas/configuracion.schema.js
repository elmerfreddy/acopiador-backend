const Joi = require("joi");

const id = Joi.number().integer();
const texto = Joi.string().trim().min(3);
const conf_tipo = Joi.valid("ENTRADA", "VALIDADOS");
const metodo = Joi.valid("WEB SERVICE", "ARCHIVO", "FORMULARIO");
const url = Joi.string().uri();
const atributos_create = Joi.array().items({
  nombre: texto.required(),
  tipo: texto.required(),
  ejemplo: texto,
});
const atributos_update = Joi.array().items({
  id: id.required(),
  nombre: texto,
  tipo: texto,
  ejemplo: texto,
});
const estado = Joi.string();

const getConfiguracionSchema = Joi.object({
  id: id.required(),
});

const createConfiguracionSchema = Joi.object({
  id_entidad: id.required(),
  descripcion: texto.required(),
  conf_tipo: conf_tipo.required(),
  metodo: metodo.required(),
  metrica_nombre: texto,
  metrica_tipo: texto,
  metrica_ejemplo: texto,
  ws_url: url,
  ws_token: texto,
  ws_body: texto,
  formulario: texto,
  file_example: url,
});

const updateConfiguracionSchema = Joi.object({
  id_entidad: id,
  descripcion: texto,
  conf_tipo: conf_tipo,
  metodo: metodo,
  metrica_nombre: texto,
  metrica_tipo: texto,
  metrica_ejemplo: texto,
  ws_url: url,
  ws_token: texto,
  ws_body: texto,
  formulario: texto,
  file_example: url,
});

const getAtributoSchema = Joi.object({
  id_c: id.required(),
});

const getAtributoByConfSchema = Joi.object({
  id_c: id.required(),
  id_a: id.required(),
});

const createAtributoSchema = Joi.object({
  nombre: texto.required(),
  tipo: texto.required(),
  ejemplo: texto
});

const updateAtributoSchema = Joi.object({
  nombre: texto,
  tipo: texto,
  ejemplo: texto
});


module.exports = {
  createConfiguracionSchema,
  updateConfiguracionSchema,
  getConfiguracionSchema,
  getAtributoSchema,
  getAtributoByConfSchema,
  createAtributoSchema,
  updateAtributoSchema
};
