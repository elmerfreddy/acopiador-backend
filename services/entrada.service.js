const boom = require("@hapi/boom");
var XLSX = require("xlsx");
const url = require("url");
const debug = require("debug")("app:services");

const { config } = require("./../config/config");
const pool = require("../libs/postgres.pool");

class EntradaService {
  async find() {
    const query = "SELECT * FROM dataset_entrada";
    const rta = await pool.query(query);
    debug(rta.rows.id);
    return rta.rows;
  }

  async findById(id) {
    const query = "SELECT * FROM dataset_entrada WHERE id=$1;";
    const rta = await pool.query(query, [id]);
    return rta.rows;
  }

  async findByEntidad(id) {
    const query = "SELECT * FROM dataset_entrada WHERE id_entidad=$1;";
    const rta = await pool.query(query, [id]);
    return rta.rows;
  }

  async findByConfiguracion(id) {
    const query = "SELECT * FROM dataset_entrada WHERE id_conf_dataset=$1;";
    const rta = await pool.query(query, [id]);
    return rta.rows;
  }

  async create(data) {
    let query =
      "INSERT INTO dataset_entrada(id_entidad, id_conf_dataset, id_usuario) ";
    query = query + "VALUES ($1, $2, $3) RETURNING *;";
    const rta = await pool.query(query, [
      data.id_entidad,
      data.id_conf_dataset,
      data.id_usuario,
    ]);
    return rta.rows[0];
  }

  async update(id, changes) {
    const entrada = await this.findById(id);
    debug("antiguo: ", entrada);
    const entradaChanged = {
      ...entrada,
      ...changes,
    };
    debug("nuevo: ", entradaChanged);

    let query = "UPDATE dataset_entrada SET ";
    query =
      query +
      "id_entidad=$1, id_conf_dataset=$2, id_usuario=$3, atributos=$4, file_url=$5 ";
    query = query + "WHERE id=$6;";
    const rta = await pool.query(query, [
      entradaChanged.id_entidad,
      entradaChanged.id_conf_dataset,
      entradaChanged.id_usuario,
      entradaChanged.atributos,
      entradaChanged.file_url,
      id,
    ]);
  }

  async loadArchivo(id, file) {
    debug(file.file.path);
    debug(config.tmpDir);
    let file_url = file.file.path;
    const wb = XLSX.readFile(file_url);
    const json = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
    const atributos = { ...json };
    file_url = file_url.replace(/\\/g, "/");
    file_url = "./" + file_url;
    debug(file_url);
    debug("atributos:", atributos);

    await this.update(id, { atributos, file_url });
    return "ok";
  }

  async download(id) {
    const configuracion = await this.findById(id);
    const archivo = configuracion[0].file_url;
    debug(archivo);
    return archivo;
  }
}

module.exports = EntradaService;
