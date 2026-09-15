const path = require("path");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const { cargarMascotas } = require("./archivos");

async function iniciarServidor() {
  // El servidor comienza a configurarse y escuchar solo después
  // de cargar correctamente los datos iniciales.
  const mascotas = await cargarMascotas();

  const app = express();

  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "..", "views"));
  app.use(expressLayouts);
  app.set("layout", "layouts/main");

  app.use(express.static(path.join(__dirname, "..", "public")));
  app.use(express.urlencoded({ extended: false }));

  app.get("/", (req, res) => {
    res.render("inicio", {
      title: "Inicio | Adopta una Mascota"
    });
  });

  app.get("/mascotas", (req, res) => {
    res.render("mascotas/lista", {
      title: "Mascotas | Adopta una Mascota",
      mascotas
    });
  });

  // Esta ruta debe estar antes de /mascotas/:id.
  app.get("/mascotas/nueva", (req, res) => {
    res.render("nueva", {
      title: "Nueva mascota | Adopta una Mascota",
      error: null,
      valores: {
        nombre: "",
        especie: "",
        edad: "",
        estado: "En adopción",
        descripcion: ""
      }
    });
  });

  app.get("/mascotas/:id", (req, res) => {
    const id = Number(req.params.id);
    const mascota = mascotas.find((item) => item.id === id);

    if (!mascota) {
      return res.status(404).render("no-encontrado", {
        title: "404 | Mascota no encontrada"
      });
    }

    res.render("mascotas/detalle", {
      title: `${mascota.nombre} | Adopta una Mascota`,
      mascota
    });
  });

  app.post("/mascotas", (req, res) => {
    const { nombre, especie, edad, estado, descripcion } = req.body;
    const edadNumero = Number(edad);

    const valores = {
      nombre: nombre || "",
      especie: especie || "",
      edad: edad || "",
      estado: estado || "",
      descripcion: descripcion || ""
    };

    if (
      !valores.nombre.trim() ||
      !valores.especie.trim() ||
      valores.edad === "" ||
      !valores.estado.trim() ||
      !valores.descripcion.trim()
    ) {
      return res.status(400).render("nueva", {
        title: "Nueva mascota | Adopta una Mascota",
        error: "Todos los campos son obligatorios.",
        valores
      });
    }

    if (!Number.isInteger(edadNumero) || edadNumero < 0) {
      return res.status(400).render("nueva", {
        title: "Nueva mascota | Adopta una Mascota",
        error: "La edad debe ser un número entero mayor o igual a 0.",
        valores
      });
    }

    const estadosPermitidos = ["En adopción", "Reservada", "Adoptada"];
    if (!estadosPermitidos.includes(valores.estado)) {
      return res.status(400).render("nueva", {
        title: "Nueva mascota | Adopta una Mascota",
        error: "El estado seleccionado no es válido.",
        valores
      });
    }

    const nuevoId = mascotas.length
      ? Math.max(...mascotas.map((item) => item.id)) + 1
      : 1;

    mascotas.push({
      id: nuevoId,
      nombre: valores.nombre.trim(),
      especie: valores.especie.trim(),
      edad: edadNumero,
      descripcion: valores.descripcion.trim(),
      estado: valores.estado,
      imagen: "/img/mascota.svg"
    });

    // El nuevo registro queda solamente en memoria.
    res.redirect("/mascotas");
  });

  // Página HTML 404 para rutas no existentes.
  app.use((req, res) => {
    res.status(404).render("no-encontrado", {
      title: "404 | Página no encontrada"
    });
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
  });
}

iniciarServidor().catch((error) => {
  console.error("No se pudieron cargar los datos iniciales:", error);
  process.exit(1);
});