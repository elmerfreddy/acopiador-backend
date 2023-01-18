const express = require("express");
const debug = require("debug")("app:routes");

const ConfiguracionService = require("./../services/configuracion.service");
const validatorHandler = require("./../middlewares/validator.handler");

const {
  createConfiguracionSchema,
  updateConfiguracionSchema,
  getConfiguracionSchema,
  getAtributoSchema,
  getAtributoByConfSchema,
  createAtributoSchema,
  updateAtributoSchema,
} = require("./../schemas/configuracion.schema");

const router = express.Router();
const service = new ConfiguracionService();

// configuracion
router.get("/", async (req, res, next) => {
  try {
    const configuraciones = await service.find();
    res.status(200).json(configuraciones);
  } catch (error) {
    next(error);
  }
});

router.get(
  "/:id",
  validatorHandler(getConfiguracionSchema, "params"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const configuraciones = await service.findById(id);
      res.status(200).json(configuraciones);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/",
  validatorHandler(createConfiguracionSchema, "body"),
  async (req, res, next) => {
    try {
      const body = req.body;
      const configuracion = await service.create(body);
      res.status(200).json({
        message: "Registro exitoso",
        configuracion: configuracion,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  "/:id",
  validatorHandler(getConfiguracionSchema, "params"),
  validatorHandler(updateConfiguracionSchema, "body"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const configuracion = await service.update(id, body);
      res.status(200).json({
        configuracion: configuracion,
        message: "Actualización exitosa",
      });
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/:id",
  validatorHandler(getConfiguracionSchema, "params"),
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

// atributos

router.get(
  "/:id_c/atributos/",
  validatorHandler(getAtributoSchema, "params"),
  async (req, res, next) => {
    try {
      const id_configuracion = req.params.id_c;
      const atributos = await service.findAtributo(id_configuracion);
      res.status(200).json(atributos);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/:id_c/atributos/:id_a",
  validatorHandler(getAtributoByConfSchema, "params"),
  async (req, res, next) => {
    try {
      const id_configuracion = req.params.id_c;
      const id_atributo = req.params.id_a;
      const atributo = await service.findAtributoById(
        id_configuracion,
        id_atributo
      );
      res.status(200).json(atributo);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/:id_c/atributos/",
  validatorHandler(getAtributoSchema, "params"),
  validatorHandler(createAtributoSchema, "body"),
  async (req, res, next) => {
    try {
      const id_configuracion = req.params.id_c;
      const body = req.body;
      const atributo = await service.createAtributo(id_configuracion, body);
      res.status(200).json({
        message: "Registro exitoso",
        atributo: atributo,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  "/:id_c/atributos/:id_a",
  validatorHandler(getAtributoByConfSchema, "params"),
  validatorHandler(updateAtributoSchema, "body"),
  async (req, res, next) => {
    try {
      const id_configuracion = req.params.id_c;
      const id_atributo = req.params.id_a;
      const body = req.body;
      const rta = await service.updateAtributo(id_configuracion, id_atributo, body);
      res.status(200).json({
        message: "Registro exitoso",
      });
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/:id_c/atributos/:id_a",
  validatorHandler(getAtributoByConfSchema, "params"),
  async (req, res, next) => {
    try {
      const id_configuracion = req.params.id_c;
      const id_atributo = req.params.id_a;
      await service.deleteAtributo(id_configuracion, id_atributo);
      res.status(200).json({
        message: "Eliminación exitosa",
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
