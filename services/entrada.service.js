const boom = require("@hapi/boom");
var XLSX = require("xlsx");
const _ = require('lodash');
const debug = require("debug")("app:services");

const { config } = require("./../config/config");
const pool = require("../libs/postgres.pool");
const ConfiguracionService = require("./configuracion.service");

const service = new ConfiguracionService();

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
    debug(rta.rowCount)
    if (!rta.rowCount) {
      throw boom.notFound("Registro no encontrado");
    }
    return rta.rows[0];
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
    const date = new Date().getTime();
    const file_name = date + "_" + file.file.name;
    const file_url = "./files/entrada/" + file_name;
    try {
      await file.file.mv(file_url);
    } catch (error) {
      throw boom.internal("No se pudo subir el archivo.");
    }

    debug("archivo almacenado en: ", file_url);
    return file_url;
  }

  async saveData(id, file_url) {
    debug("almacenando archivo en BD...");

    const header_wb = XLSX.readFile(file_url, { sheetRows: 1 });
    const header_csv = XLSX.utils.sheet_to_csv(
      header_wb.Sheets[header_wb.SheetNames[0]]
    );
    const header = header_csv.split(",");
    debug(header);

    const headerValidado = await this.validarHeader(id, header);

    const wb = XLSX.readFile(file_url);
    const json = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);

    const atributos = JSON.stringify(json);
    return "ok";
  }

  async validarHeader(id, header) {
    // obtener header
    const entrada = await this.findById(id);
    const id_config = entrada.id_conf_dataset;    
    const configuracion = await service.findById(id_config);
    const atributos = await service.findAtributo(id_config);
    var header_bd = [];
    for (let i = 0; i < atributos.length; i++) {
      const nombre = atributos[i].nombre;
      header_bd.push(nombre);
    }
    header_bd.push(configuracion.metrica_nombre);

    // comparar headers
    debug("header_bd:", header_bd);
    debug("header:", header);
    const isEqual = _.isEqual(header_bd, header)
    debug("igual:",isEqual);
  }

  async download(id) {
    const configuracion = await this.findById(id);
    const archivo = configuracion[0].file_url;
    debug(archivo);
    return archivo;
  }
}

module.exports = EntradaService;
