const express = require("express");
const app = express();
const {
  nuevoUsuario,
  mostrarUsuarios,
  actualizarauth,
  mostrarUsuario,
} = require("./database");
const bodyParser = require("body-parser");
const hbs = require("express-handlebars");
const expressFileUpload = require("express-fileupload");
const jwt = require("jsonwebtoken");
const { uniqueSort } = require("jquery");

const secretKey = "keys";
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(3000, () => console.log("Servidor encendido en el puerto3000"));

app.use(
  expressFileUpload({
    limits: { fileSize: 5000000 },
    abortOnLimit: true,
    responseOnLimit:
      "El peso del archivo que intentas subir supera el limite permitido",
  })
);

app.post("/Upload", (req, res) => {
  const { foto } = req.files;
  const { name } = foto;
  foto.mv(`${__dirname}/img/${name}`, (err) => {
    return res.send("archivo subido con exito");
  });
});

app.set("view engine", "handlebars");
app.engine(
  "handlebars",
  hbs({
    layoutsDir: __dirname + "/views",
    partialsDir: __dirname + "/views/components",
  })
);

app.get("/", (req, res) => {
  res.render("Home", { layout: "Home" });
});

app.post("/usuario", async (req, res) => {
  const { email, nombre, password } = req.body;
  try {
    const result = await nuevoUsuario(email, nombre, password);
    console.log(result);
    res.status(201).send(result);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

app.get("/usuarios", async (req, res) => {
  const datos = await mostrarUsuarios();
  res.render("Admin", { layout: "Admin", data: datos });
});

app.post("/auth", async (req, res) => {
  const { id, auth } = req.body;
  try {
    const result = await actualizarauth(id, auth);
    console.log(auth);
    res.send(result);
  } catch (error) {
    console.log(error);
  }
});

app.get("/Login", (req, res) => {
  res.render("Login", { layout: "Login" });
});

app.post("/verify", async (req, res) => {
  const { email, password } = req.body;
  const user = await mostrarUsuario(email, password);
  let token = user && user.auth ? jwt.sign(user, secretKey) : false;
  user
    ? user.auth
      ? res.redirect("/Evidencias?token=" + token)
      : res.send("Usted no está autorizado")
    : res.send("No existe este usuario en nuestra base de datos");

  res.send();
});

app.get("/Evidencias", (req, res) => {
  const { token } = req.query;

  jwt.verify(token, secretKey, (err, payload) => {
    err
      ? res.status(401).send({ error: "401 No Autorizado", message: err })
      : res.render("Evidencias", {
          layout: "Evidencias",
          nombre: payload.nombre,
        });
  });
});
