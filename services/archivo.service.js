const boom = require("@hapi/boom");
const XLSX = require("xlsx");
const fs = require("node:fs");
const { v1: uuidv1 } = require("uuid");
const debug = require("debug")("app:services");

const pool = require("../libs/postgres.pool");

const ConfiguracionService = require("./configuracion.service");
const service = new ConfiguracionService();

class ArchivoService {

  async create(id) {
    const configuracion = await service.findById(id);
    const atributos = await service.findAtributo(id);

    var headers = [];
    for (let i = 0; i < atributos.length; i++) {
      const nombre = atributos[i].nombre;
      headers.push(nombre);
    }
    headers.push(configuracion.metrica_nombre);
    debug("headers: ", headers);

    // generamos excel
    const worksheet = XLSX.utils;
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "datos");
    XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: "A1" });
    const nombre = uuidv1();
    const ruta = `./files/configuracion/${nombre}.xlsx`;
    const file_nombre = nombre;
    const file_example = ruta;
    debug(ruta);
    // almacenamos archivo y en BD
    try {
      XLSX.writeFile(workbook, ruta, { compression: true });
      await service.update(id, { file_nombre, file_example });
    } catch (error) {
      throw boom.internal("No se pudo descargar el archivo. Intente de nuevo.");
    }
    return { file_example, file_nombre };
  }

  async download(id) {
    const configuracion = await service.findById(id);
    const archivo = configuracion.file_example;
    debug(archivo);
    return archivo;
  }
}

module.exports = ArchivoService;
