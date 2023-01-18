const express = require("express");
const debug = require("debug")("app:routes");

const ConfiguracionService = require("./../services/configuracion.service");
const validatorHandler = require("./../middlewares/validator.handler");

const {
  createConfiguracionSchema,
  updateConfiguracionSchema,
  getConfiguracionSchema,
} = require("./../schemas/configuracion.schema");

const router = express.Router();
const service = new ConfiguracionService();

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
        configuracion: configuracion,
        message: "Registro exitoso",
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

module.exports = router;
