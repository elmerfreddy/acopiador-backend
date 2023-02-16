const boom = require("@hapi/boom");
const bcrypt = require("bcrypt");
const debug = require("debug")("app:services");

const pool = require("../libs/postgres.pool");

class UsuariosService {

  async create(data) {
    try {
      const password = await this.createPassword();
      debug(password);
      const query =
        "INSERT INTO usuarios (id_entidad, nombre, apellido, cargo, celular, email, password, rol) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);";
      const rta = await pool.query(query, [
        data.id_entidad,
        data.nombre,
        data.apellido,
        data.cargo,
        data.celular,
        data.email,
        password,
        data.rol,
      ]);
      return rta;
    } catch (error) {
      if (error.constraint == "UQ_usuarios_email") {
        throw boom.badRequest(
          "El correo ya se encuentra registrado."
        );
      } else {
        // next(error);
        throw boom.badRequest("error: "+error)
      }
    }
  }

  async createPassword() {
    //const randomPassword = Math.random().toString(36).toUpperCase().slice(-8);
    const randomPassword = '123'
    debug("password:", randomPassword);
    const hash = await bcrypt.hash(randomPassword, 10);
    return hash;
  }

  async find() {
    const query =
      "SELECT id, id_entidad, nombre, apellido, cargo, celular, email, estado, rol FROM usuarios WHERE estado='ACTIVO';";
    const rta = await pool.query(query);
    return rta.rows;
  }

  async findById(id) {
    const query =
      "SELECT * FROM usuarios WHERE id=$1 AND estado='ACTIVO';";
    const rta = await pool.query(query, [id]);
    if (!rta.rowCount) {
      throw boom.notFound("Registro no encontrado");
    }
    return rta.rows[0];
  }

  async findByEmail(email) {
    const query =
      "SELECT * FROM usuarios WHERE email=$1 AND estado='ACTIVO';";
    const rta = await pool.query(query, [email]);
    if (!rta.rowCount) {
      throw boom.notFound("Registro no encontrado");
    }

    return rta.rows[0];
  }

  async update(id, changes) {
    const usuario = await this.findById(id);
    debug('antiguo: ', usuario);
    const usuarioChanged = {
      ...usuario,
      ...changes,
    };
    debug('nuevo: ',usuarioChanged);
    const query =
      "UPDATE usuarios SET nombre=$1, apellido=$2, cargo=$3, celular=$4, email=$5, id_entidad=$6, token=$7, password=$8, rol=$9 WHERE id=$10";
    const rta = await pool.query(query, [
      usuarioChanged.nombre,
      usuarioChanged.apellido,
      usuarioChanged.cargo,
      usuarioChanged.celular,
      usuarioChanged.email,
      usuarioChanged.id_entidad,
      usuarioChanged.token,
      usuarioChanged.password,
      usuarioChanged.rol,
      id,
    ]);
  }

  async delete(id) {
    const query = "UPDATE usuarios SET estado='ELIMINADO' WHERE id=$1;";
    const rta = await pool.query(query, [id]);
    if (!rta.rowCount) {
      throw boom.notFound("Registro no encontrado");
    }
    return rta.rows[0];
  }
}

module.exports = UsuariosService;
