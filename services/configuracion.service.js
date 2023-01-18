const boom = require("@hapi/boom");
const debug = require("debug")("app:services");

const pool = require("../libs/postgres.pool");

class ConfiguracionService {
  async find() {
    const query = "SELECT * FROM conf_dataset WHERE estado='ACTIVO';";
    const rta = await pool.query(query);
    return rta.rows;
  }

  async findById(id) {
    const query = "SELECT * FROM conf_dataset WHERE id=$1 AND estado='ACTIVO';";
    const rta = await pool.query(query, [id]);
    if (!rta.rowCount) {
      throw boom.notFound("Registro no encontrado");
    }
    return rta.rows[0];
  }

  async create(data) {
    let query = "INSERT INTO conf_dataset ";
    query =
      query +
      "(id_entidad, descripcion, conf_tipo, metodo, metrica_nombre, metrica_tipo, metrica_ejemplo, ws_url, ws_token, ws_body, formulario, file_example) ";
    query =
      query +
      "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *;";
    debug(query);
    const rta = await pool.query(query, [
      data.id_entidad,
      data.descripcion,
      data.conf_tipo,
      data.metodo,
      data.metrica_nombre,
      data.metrica_tipo,
      data.metrica_ejemplo,
      data.ws_url,
      data.ws_token,
      data.ws_body,
      data.formulario,
      data.file_example,
    ]);

    const id_conf = rta.rows[0].id;
    return id_conf;
  }

  async update(id, changes) {
    const configuracion = await this.findById(id);
    debug("antiguo: ", configuracion);
    const configuracionChanged = {
      ...configuracion,
      ...changes,
    };
    debug("nuevo: ", configuracionChanged);
    let query = "UPDATE conf_dataset SET ";
    query =
      query +
      "id_entidad=$1, descripcion=$2, conf_tipo=$3, metodo=$4, metrica_nombre=$5, metrica_tipo=$6, ";
    query =
      query +
      "metrica_ejemplo=$7, ws_url=$8, ws_token=$9, ws_body=$10, formulario=$11, file_example=$12 ";
    query = query + "WHERE id=$13";
    debug(query);

    const rta = await pool.query(query, [
      configuracionChanged.id_entidad,
      configuracionChanged.descripcion,
      configuracionChanged.conf_tipo,
      configuracionChanged.metodo,
      configuracionChanged.metrica_nombre,
      configuracionChanged.metrica_tipo,
      configuracionChanged.metrica_ejemplo,
      configuracionChanged.ws_url,
      configuracionChanged.ws_token,
      configuracionChanged.ws_body,
      configuracionChanged.formulario,
      configuracionChanged.file_example,
      id,
    ]);

    const id_conf = rta.rows[0].id;
    try {
      await this.updateAtributo(id, data.atributos);
    } catch (error) {
      next(error);
    }
  }

  async delete(id) {
    const query = "UPDATE conf_dataset SET estado='ELIMINADO' WHERE id=$1;";
    const rta = await pool.query(query, [id]);
    debug(rta);
    if (!rta.rowCount) {
      throw boom.notFound("Registro no encontrado");
    }
    return rta.rows[0];
  }

  async createAtributo(id, data) {
    const query =
      "INSERT INTO atributo (id_conf_dataset, nombre, tipo, ejemplo) VALUES ($1, $2, $3, $4) RETURNING *;";
    const rta = await pool.query(query, [
      id,
      data.nombre,
      data.tipo,
      data.ejemplo,
    ]);
  }

  async updateAtributo(data) {
    const query =
      "UPDATE atributo SET nombre=$1, tipo=$2, ejemplo=$3 WHERE id=$4 ;";
    const rta = await pool.query(query, [
      data.nombre,
      data.tipo,
      data.ejemplo,
      data.id,
    ]);
  }

  async deleteAtributo(id) {
    const query = "DELETE FROM atributo WHERE id=$1;";
    const rta = await pool.query(query, [id]);
    debug(rta);
    if (!rta.rowCount) {
      throw boom.notFound("Registro no encontrado");
    }
    return rta.rows[0];
  }
}

module.exports = ConfiguracionService;
