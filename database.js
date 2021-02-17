const { Pool } = require("pg");
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  password: "postgres",
  database: "nasa",
  port: 5432,
});

const nuevoUsuario = async (email, nombre, password) => {
  const result = await pool.query(
    "INSERT INTO usuarios (email, nombre, password, auth) VALUES ($1,$2,$3,'false') RETURNING *",
    [email, nombre, password]
  );
  return result.rows;
};

const mostrarUsuarios = async () => {
  const results = await pool.query(`SELECT * FROM usuarios`);
  return results.rows;
};

const actualizarauth = async (id, auth) => {
  const result = await pool.query(
    "UPDATE usuarios SET auth= $1 WHERE id =$2 RETURNING *",
    [auth, id]
  );
  return result;
};

const mostrarUsuario = async (email, password) => {
  const result = await pool.query(
    "SELECT * FROM usuarios WHERE email = $1 AND password =$2",
    [email, password]
  );
  return result.rows[0];
};

module.exports = {
  nuevoUsuario,
  mostrarUsuarios,
  actualizarauth,
  mostrarUsuario,
};
