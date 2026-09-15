const fs = require("fs/promises");
const path = require("path");

async function cargarMascotas() {
  const archivo = path.join(__dirname, "..", "datos", "mascotas.json");
  const contenido = await fs.readFile(archivo, "utf8");
  return JSON.parse(contenido);
}

module.exports = { cargarMascotas };