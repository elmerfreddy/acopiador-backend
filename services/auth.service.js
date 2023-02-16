const boom = require("@hapi/boom");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const debug = require("debug")("app:services");

const { config } = require("./../config/config");
const UsuariosService = require("./usuarios.service");
const service = new UsuariosService();

class AuthService {
  async getUser(email, password) {
    const usuario = await service.findByEmail(email);
    // verificamos email
    if (!usuario) {
      throw boom.unauthorized(
        "El usuario y/o contraseña es incorrecto. Intente de nuevo."
      );
    }
    debug("usuario encontrado: ");

    // verificamos contraseña
    const isMatch = await bcrypt.compare(password, usuario.password);
    if (!isMatch) {
      debug("Contraseña no coincide");
      throw boom.unauthorized(
        "El usuario y/o contraseña es incorrecto. Intente de nuevo."
      );
    }
    debug("usuario autenticado");

    delete usuario.password;
    delete usuario.token;
    return usuario;
  }

  async changePassword(data) {
    const newPassword = data.newPassword;
    const password = await bcrypt.hash(newPassword, 10);
    debug("new password: ", password);

    const id = data.id;
    debug("id: ", id);
    service.update(id, { password });
    return id;
  }

  signToken(user) {
    const payload = {
      sub: user.id,
      entidad: user.id_entidad,
      rol: user.rol,
    };
    const token = jwt.sign(payload, config.jwtSecret, {expiresIn: '30min'});
    // almacenamos token
    service.update(user.id, { token });
    debug("user: ", user, "token: ", token);

    return {
      user,
      token,
    };
  }

  async logout(id){
    const usuario = await service.findById(email);
    
  }
}

module.exports = AuthService;
