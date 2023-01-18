const express = require("express");
const debug = require("debug")("app:routes");

const EntidadesService = require("./../services/entidades.service");
const validatorHandler = require("./../middlewares/validator.handler");

const {
  createEntidadSchema,
  updateEntidadSchema,
  getEntidadSchema,
} = require("./../schemas/entidad.schema");

const router = express.Router();
const service = new EntidadesService();

router.get("/", async (req, res, next) => {
  try {
    const entidades = await service.find();
    res.status(200).json(entidades);
  } catch (error) {
    next(error);
  }
});

router.get(
  "/:id",
  validatorHandler(getEntidadSchema, "params"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const entidad = await service.findById(id);
      res.status(200).json(entidad);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/",
  validatorHandler(createEntidadSchema, "body"),
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
  validatorHandler(getEntidadSchema, "params"),
  validatorHandler(updateEntidadSchema, "body"),
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
  validatorHandler(getEntidadSchema, "params"),
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
