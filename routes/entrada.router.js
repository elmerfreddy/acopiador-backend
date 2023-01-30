const express = require("express");
const debug = require("debug")("app:routes");

const EntradaService = require("./../services/entrada.service");
const validatorHandler = require("./../middlewares/validator.handler");

const {
  getEntradaSchema,
  createEntradaSchema,
} = require("./../schemas/entrada.schema");

const router = express.Router();
const service = new EntradaService();

router.get("/", async (req, res, next) => {
  try {
    const entradas = await service.find();
    res.status(200).json(entradas);
  } catch (error) {
    next(error);
  }
});

router.get(
  "/:id",
  validatorHandler(getEntradaSchema, "params"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const entrada = await service.findById(id);
      res.status(200).json(entrada);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/entidad/:id",
  validatorHandler(getEntradaSchema, "params"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const entrada = await service.findByEntidad(id);
      res.status(200).json(entrada);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/config/:id",
  validatorHandler(getEntradaSchema, "params"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const entrada = await service.findByConfiguracion(id);
      res.status(200).json(entrada);
    } catch (error) {
      next(error);
    }
  }
);


router.post(
  "/",
  validatorHandler(createEntradaSchema, "body"),
  async (req, res, next) => {
    try {
      const body = req.body;
      const rta = await service.create(body);
      const id = rta.id;
      res.status(200).json(id);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/upload/:id",
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const file = req.files;
      const data = await service.loadArchivo(id, file);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/download/:id",
  validatorHandler(getEntradaSchema, "params"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const archivo = await service.download(id);
      res.download(archivo, "SUIN-entrada.xlsx");
    } catch (error) {
      next(error);
    }
  }
);




module.exports = router;
