const express = require("express");
const passport = require("passport");

const { config } = require("./../config/config");
const AuthService = require("./../services/auth.service");

const validatorHandler = require("./../middlewares/validator.handler");

const { loginSchema, passwordSchema } = require("./../schemas/auth.schema");

const router = express.Router();

const service = new AuthService();

router.post(
  "/login",
  validatorHandler(loginSchema, "body"),
  passport.authenticate("local", { session: false }),
  async (req, res, next) => {
    try {
      const usuario = req.user;
      res.json(service.signToken(usuario))
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/changePassword",
  passport.authenticate("jwt", { session: false }),
  validatorHandler(passwordSchema, "body"),
  async (req, res, next) => {
    try {
      const body = req.body;
      await service.changePassword(body);
      res.status(200).json({
        message: "Registro exitoso",
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post("/logout/:id",
async(req, res, next)=>{
  try {
    const { id } = req.params;
  } catch (error) {
    
  }
})

module.exports = router;
