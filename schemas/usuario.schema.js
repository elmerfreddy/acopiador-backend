const Joi = require("joi");

const id = Joi.number().integer();
const nombre = Joi.string().trim().min(3);
const apellido = Joi.string().trim().min(2);
const cargo = Joi.string();
const celular = Joi.string().max(12);
const password = Joi.string();
const estado = Joi.string();
const email = Joi.string().email({tlds: false});
const token = Joi.string().token();
const rol = Joi.valid('ADMIN', 'USER1', 'ENTIDAD', 'REPORTES');


const limit = Joi.number().integer();
const offset = Joi.number().integer();

const createUsuarioSchema = Joi.object({
  id_entidad: id.required(),
  nombre: nombre.required(),
  apellido: apellido.required(),
  cargo: cargo,
  celular: celular,
  password: password,
  email: email.required(),
  rol: rol.required(),
});

const updateUsuarioSchema = Joi.object({
  id_entidad: id,
  nombre: nombre,
  apellido: apellido,
  cargo: cargo,
  celular: celular,
  email: email,
  estado: estado,
  token: token,
  rol: rol,
});

const getUsuarioSchema = Joi.object({
  id: id.required(),
});

module.exports = { createUsuarioSchema, updateUsuarioSchema, getUsuarioSchema };
