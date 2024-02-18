import express from "express";
import mysql from "mysql";
import cors from 'cors';

const app = express();
app.use(
  express.json(),
  cors()
);

const conexion = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sm52_arduino'
});

conexion.connect(function (error) {
  if (error) {
    console.log("Error al conectar");
  } else {
    console.log("Conexion realizada exitosamente");
  }
});



app.get('/detecciones', (peticion, respuesta) => {
  const sql = "SELECT * FROM detecciones";
  conexion.query(sql, (error, resultado) => {
    if (error) return respuesta.json({ error: "Error en la consulta" });
    return respuesta.json({ detecciones: resultado });
  });
});

app.get('/obtenerDeteccionBetween', (peticion, respuesta) => {
  const min = peticion.query.min;
  const max = peticion.query.max;
  const sql = "SELECT * FROM detecciones WHERE dato_sensor BETWEEN ? AND ?";
  conexion.query(sql, [min, max], (error, resultado) => {
    if (error) return respuesta.json({ error: "Error en la consulta" });
    return respuesta.json({ detecciones: resultado });
  });
});


app.get('/obtenerDeteccion/:id', (peticion, respuesta) => {
  const deteccionId = peticion.params.id;
  const sql = `SELECT * FROM detecciones WHERE id = ${deteccionId}`;
  conexion.query(sql, (error, resultado) => {
    if (error) return respuesta.json({ error: "Error en la consulta" });
    if (resultado.length === 0) {
      return respuesta.json({ error: "Deteccion no encontrada" });
    }
    return respuesta.json({ deteccion: resultado[0] });
  });
});


app.put('/actualizardeteccion/:id', (peticion, respuesta) => {
  const deteccionId = peticion.params.id;
  const { mensaje, dato_sensor, hora } = peticion.body;
  const sql = `UPDATE detecciones SET mensaje = ?, dato_sensor = ? WHERE id = ?`;
  conexion.query(sql, [mensaje, dato_sensor, deteccionId], (error, resultado) => {
    if (error) return respuesta.json({ error: "Error al actualizar la detección" });
    return respuesta.json({ mensaje: "Detección actualizada con éxito" });
  });
});


app.post('/agregarDeteccion', (req, res) => {
  const { mensaje, dato_sensor } = req.body;
  const sql = 'INSERT INTO detecciones (mensaje, dato_sensor) VALUES (?, ?)';
  conexion.query(sql, [mensaje, dato_sensor], (error, resultado) => {
    if (error) {
      return res.json({ error: 'Error al agregar' });
    }
    return res.json({ mensaje: 'Agregado exitosamente' });
  });
});

app.delete('/eliminarDeteccion/:id', (req, res) => {
  const deteccionId = req.params.id;
  const sql = 'DELETE FROM detecciones WHERE id = ?';

  conexion.query(sql, [deteccionId], (error, resultado) => {
    if (error) {
      return res.json({ error: 'Error al eliminar la deteccion' });
    }

    if (resultado.affectedRows === 0) {
      return res.json({ error: 'deteccion no encontrada' });
    }

    return res.json({ mensaje: 'deteccion eliminada exitosamente' });
  });
});
  

app.listen(8082, () => {
  console.log("Servidor iniciado...");

  
});