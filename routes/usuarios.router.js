const express = require("express");
const debug = require("debug")("app:routes");
const boom = require("@hapi/boom");

const UsuariosService = require("./../services/usuarios.service");
const validatorHandler = require("./../middlewares/validator.handler");
const { checkRoles } = require('./../middlewares/auth.handler');


const {
  createUsuarioSchema,
  updateUsuarioSchema,
  getUsuarioSchema,
} = require("./../schemas/usuario.schema");

const router = express.Router();
const service = new UsuariosService();

router.get("/", 
checkRoles('ADMIN', 'USER1'),
async (req, res, next) => {
  try {
    const usuarios = await service.find();
    res.status(200).json(usuarios);
  } catch (error) {
    next(error);
  }
});

router.get(
  "/:id",
  checkRoles('ADMIN', 'USER1'),
  validatorHandler(getUsuarioSchema, "params"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const usuarios = await service.findById(id);
      res.status(200).json(usuarios);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/",
  checkRoles('ADMIN', 'USER1'),
  validatorHandler(createUsuarioSchema, "body"),
  async (req, res, next) => {
    try {
      const body = req.body;
      await service.create(body);
      res.status(200).json({
        message: "Registro exitoso",
      });
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  "/:id",
  validatorHandler(getUsuarioSchema, "params"),
  validatorHandler(updateUsuarioSchema, "body"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      await service.update(id, body);
      res.status(200).json({
        message: "Actualización exitosa",
      });
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/:id",
  checkRoles('ADMIN', 'USER1'),
  validatorHandler(getUsuarioSchema, "params"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await service.delete(id);
      res.status(200).json({
        message: "Eliminación exitosa",
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
