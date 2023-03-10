const express = require("express");
const boom = require("@hapi/boom");
const passport = require("passport");

const { checkRoles } = require('./../middlewares/auth.handler');


const entidadesRouter = require("./entidades.router");
const usuariosRouter = require("./usuarios.router");
const authRouter = require("./auth.router");
const configuracionRouter = require("./configuracion.router");
const archivoRouter = require("./archivo.router");
const entradaRouter = require("./entrada.router");

function routerApi(app) {
  const router = express.Router();

  app.use("/api", router);

  router.use(
    "/entidades",
    passport.authenticate("jwt", { session: false }),
    checkRoles('ADMIN', 'USER1'),
    entidadesRouter
  );

  router.use(
    "/usuarios",
    // passport.authenticate("jwt", { session: false }),
    usuariosRouter
  );
  
  router.use("/auth", authRouter);

  router.use("/configuracion", configuracionRouter);

  router.use("/archivo", archivoRouter);

  router.use("/entrada", entradaRouter);
}

module.exports = routerApi;
