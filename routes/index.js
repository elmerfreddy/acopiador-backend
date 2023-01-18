const express = require("express");
const boom = require("@hapi/boom");
const passport = require("passport");

const { checkRoles } = require('./../middlewares/auth.handler');


const entidadesRouter = require("./entidades.router");
const usuariosRouter = require("./usuarios.router");
const authRouter = require("./auth.router");
const configuracionRouter = require("./configuracion.router");

function routerApi(app) {
  const router = express.Router();

  app.use("/api", router);

  router.use(
    "/entidades",
    passport.authenticate("jwt", { session: false }),
    checkRoles('ADMIN', 'OBSCD'),
    entidadesRouter
  );

  router.use(
    "/usuarios",
    passport.authenticate("jwt", { session: false }),
    usuariosRouter
  );
  
  router.use("/auth", authRouter);

  router.use("/configuracion", configuracionRouter);
}

module.exports = routerApi;
