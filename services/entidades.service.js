const boom = require("@hapi/boom");
const debug = require("debug")("app:services");

const pool = require("../libs/postgres.pool");

class EntidadesService {
  async create(data) {
    const query = "INSERT INTO entidades (nombre, sigla) VALUES ($1, $2) RETURNING *;";
    const rta = await pool.query(query, [data.nombre, data.sigla]);
    debug("rta-entidades", rta);
    return rta;
  }

  async find() {
    const query = "SELECT * FROM entidades WHERE estado='ACTIVO';";
    const rta = await pool.query(query);
    return rta.rows;
  }

  async findById(id) {
    const query = "SELECT * FROM entidades WHERE id=$1 AND estado='ACTIVO';";
    const rta = await pool.query(query, [id]);
    if (!rta.rowCount) {
      throw boom.notFound("Registro no encontrado");
    }
    return rta.rows[0];
  }

  async update(id, changes) {
    const entidad = await this.findById(id);
    debug(entidad);
    const entidadChanged = {
      ...entidad,
      ...changes,
    };
    debug(entidadChanged);
    const query = "UPDATE entidades SET nombre=$1, sigla=$2 WHERE id=$3";
    const rta = await pool.query(query, [
      entidadChanged.nombre,
      entidadChanged.sigla,
      id,
    ]);
  }

  async delete(id) {
    const query = "UPDATE entidades SET estado='ELIMINADO' WHERE id=$1;";
    const rta = await pool.query(query, [id]);
    debug(rta);
    if (!rta.rowCount) {
      throw boom.notFound("Registro no encontrado");
    }
    return rta.rows[0];
  }
}

module.exports = EntidadesService;
