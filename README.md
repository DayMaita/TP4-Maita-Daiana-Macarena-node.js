# Trabajo práctico 04

## Descripción

Aplicación web desarrollada con Node.js, Express y EJS para consultar mascotas en adopción y agregar temporalmente nuevos registros mediante un formulario.

La aplicación utiliza datos iniciales almacenados en `datos/mascotas.json`. Los nuevos registros se agregan únicamente en memoria y no modifican el archivo JSON.

## Instalación

Desde la carpeta del proyecto ejecutar:

```bash
npm install
```

## Ejecución

Para iniciar la aplicación:

```bash
npm start
```

Luego abrir en el navegador:

```text
http://localhost:3000
```

Para comprobar la sintaxis:

```bash
npm run check
```

## Páginas y rutas

- `GET /` — página inicial.
- `GET /mascotas` — listado de mascotas.
- `GET /mascotas/nueva` — formulario para agregar una mascota.
- `GET /mascotas/:id` — detalle de una mascota.
- `POST /mascotas` — valida y agrega una mascota en memoria.
- Rutas inexistentes — página HTML 404.

La ruta `/mascotas/nueva` está declarada antes de `/mascotas/:id`.

## Estructura de vistas

- `views/layouts/main.ejs`: layout principal compartido.
- `views/partials/encabezado.ejs`: encabezado y navegación.
- `views/partials/pie.ejs`: pie de página.
- `views/inicio.ejs`: página inicial.
- `views/mascotas/lista.ejs`: catálogo y estado vacío.
- `views/mascotas/detalle.ejs`: detalle de una mascota.
- `views/nueva.ejs`: formulario.
- `views/no-encontrado.ejs`: página HTML 404.

### Diferencia entre layout, vista y parcial

El **layout** contiene la estructura general que se repite en todas las páginas, como el HTML principal, CSS, encabezado, contenido y pie.

Una **vista** contiene el contenido específico de una página, por ejemplo el listado o el detalle de una mascota.

Un **parcial** es un fragmento reutilizable que se incluye en distintas vistas. En este proyecto se utilizan parciales para el encabezado y el pie.

## Datos enviados a una vista mediante `res.render`

`res.render()` permite procesar una plantilla EJS y enviarle datos.

Por ejemplo:

```js
res.render("mascotas/lista", {
  title: "Mascotas | Adopta una Mascota",
  mascotas
});
```

La vista recibe el arreglo `mascotas` y puede recorrerlo para mostrar sus datos.

## Recursos estáticos

Los recursos de `public/` se sirven mediante:

```js
app.use(express.static(path.join(__dirname, "..", "public")));
```

Por eso el CSS se referencia como `/css/estilos.css`, la imagen como `/img/mascota.svg` y JavaScript como `/js/app.js`, sin escribir `/public` en las URLs.

## `express.urlencoded`

`express.urlencoded({ extended: false })` permite que Express pueda leer los datos enviados por formularios HTML mediante `req.body`.

## Formulario

El formulario utiliza:

```html
<form action="/mascotas" method="post">
```

Tiene controles etiquetados para nombre, especie, edad, estado y descripción.

La aplicación valida que los campos estén completos y que la edad sea un número entero mayor o igual a cero. Si existe un error, responde con estado `400`, muestra un mensaje con `role="alert"` y conserva los valores ingresados.

## Recorrido POST, redirección y GET

El usuario completa el formulario y realiza un `POST /mascotas`.

El servidor lee `req.body`, convierte la edad a número, valida los datos, genera un nuevo identificador y agrega la mascota al arreglo en memoria.

Si todo es correcto, responde con una redirección:

```js
res.redirect("/mascotas");
```

El navegador realiza entonces un `GET /mascotas` y muestra la nueva tarjeta.

## Persistencia de los datos

Los cinco registros iniciales se leen desde `datos/mascotas.json`.

Los registros creados mediante el formulario no se escriben en el JSON. Por ese motivo, las nuevas mascotas desaparecen cuando se reinicia el servidor. Al reiniciar, la aplicación vuelve a cargar únicamente los cinco registros iniciales del archivo.

## Estructura del proyecto

```text
tp-04-mascotas-ejs/
├── datos/
│   └── mascotas.json
├── public/
│   ├── css/
│   │   └── estilos.css
│   ├── img/
│   │   └── mascota.svg
│   └── js/
│       └── app.js
├── src/
│   ├── archivos.js
│   └── index.js
├── views/
│   ├── layouts/
│   │   └── main.ejs
│   ├── partials/
│   │   ├── encabezado.ejs
│   │   └── pie.ejs
│   ├── mascotas/
│   │   ├── lista.ejs
│   │   └── detalle.ejs
│   ├── inicio.ejs
│   ├── nueva.ejs
│   └── no-encontrado.ejs
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## Persistencia

La persistencia es temporal en memoria. No se utiliza base de datos ni se modifica el archivo JSON cuando se crea una nueva mascota.
