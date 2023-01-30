const express = require("express");
const debug = require("debug")("app:routes");

const ArchivoService = require("./../services/archivo.service");
const validatorHandler = require("./../middlewares/validator.handler");

const { getSchema } = require("./../schemas/archivo.schema");

const router = express.Router();
const service = new ArchivoService();

router.post(
  "/:id",
  validatorHandler(getSchema, "params"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const rta = await service.create(id);
      res.status(200).json({
        message: "Registro exitoso",
        file: rta.file_example,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/download/:id",
  validatorHandler(getSchema, "params"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const archivo = await service.download(id);
      res.download(archivo, "SUIN-plantilla.xlsx");
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
