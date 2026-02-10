import { Utils } from "../config/utils.js";
import { pool } from "../config/db.js";

export class PersonaCtrl {

  static getAll = async (req, res) => {
    try {
      const query = `SELECT 
                    p.id_persona, p.nombre, p.cedula, p.id_departamento,d.nom_departamento
                    FROM persona p
                    LEFT JOIN departamento d ON p.id_departamento = d.id_departamento
                    ORDER BY p.id_persona ASC`;
      const result = await pool.query(query);
      return Utils.serverResponse({
        response: res,
        code: 200,
        msg: "Personas optenidas",
        value: true,
        data: result.rows
      });
    } catch (error) {
      console.error("Persona getAll error ", error);
      res.status(500).json({ error: "Error al optener a las personas" })
    }
  }

  static getById = async (req, res) => {
    try {
      const { id } = req.params;
      const query = `SELECT 
                    p.id_persona,
                    p.nombre,
                    p.cedula,
                    p.id_departamento,
                    d.nom_departamento
                    FROM persona p
                    LEFT JOIN  departamento d ON p.id_departamento = d.id_departamento
                    WHERE p.id_persona = $1`;
      const result = await pool.query(query, [id]);
      if (result.rows.length === 0) {
        return Utils.serverResponse({
          response: res,
          code: 404,
          msg: "persona no encontrada",
          value: false
        });
      }
      return Utils.serverResponse({
        response: res,
        code: 200,
        msg: "persona encontrada",
        value: true,
        data: result.rows[0]
      })
    } catch (error) {
      console.error("PersonaCtrl.getById Error:", error);
      res.status(500).json({ error: "Error local al obtener a la persona" });
    }
  }

  static create = async (req, res) => {
    try {
      const { nombre, cedula, id_departamento } = req.body;

      if (!nombre || !cedula || !id_departamento) {
        return Utils.serverResponse({
          response: res,
          code: 400,
          msg: "Todos los campos son obligatorios",
          value: false
        });
      }
      const query = `
                    INSERT INTO persona (nombre, cedula, id_departamento)
                    values ($1, $2, $3)
                    RETURNING * ;`;

      const result = await pool.query(query, [nombre, cedula, id_departamento]);

      return Utils.serverResponse({
        response: res,
        code: 201,
        msg: "Persona creada",
        value: true,
        data: result.rows[0]
      })
    } catch (error) {
      console.error("PersonaCtrl.create error:", error);
      res.status(500).json({ error: "Error local al crear a la persona" });
    }
  }

  static update = async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, cedula, id_departamento } = req.body;
      if (!nombre || !cedula || !id_departamento) {
        return Utils.serverResponse({
          response: res,
          code: 400,
          msg: "Toodos los campos son obligatorios",
          value: false
        });
      }
      const query = `UPDATE persona
                      SET nombre = $1, cedula = $2, id_departamento = $3
                      WHERE id_persona = $4
                      RETURNING *`

      const result = await pool.query(query, [nombre, cedula, id_departamento, id]);
      if (result.rows.length === 0) {
        return Utils.serverResponse({
          response: res,
          code: 404,
          msg: "No se actualizo: la persona no encontrada",
          value: false
        })
      }
      return Utils.serverResponse({
        response: res,
        code: 200,
        msg: "Persona actualizada",
        value: true,
        data: result.rows[0]
      })
    } catch (error) {
      console.error("PersonaCtrl.update error", error);
      res.status(500).json({ error: "Error local al actualizar a esta persona" });
    }
  }

  static delete = async (req, res) => {
    try {
      const { id } = req.params;
      const query = `DELETE FROM persona WHERE id_persona = $1 RETURNING *`;
      const result = await pool.query(query, [id]);
      if (result.rows.length === 0) {
        return Utils.serverResponse({
          response: res,
          code: 404,
          msg: "No se pudo eliminar:Persona no encontrada",
          value: false
        })
      }
      return Utils.serverResponse({
        response: res,
        code: 200,
        msg: "Persona eliminada",
        value: true,
        data: result.rows[0]
      })
    } catch (error) {
      console.error("PersonaCtrl.delete Error", error);
      res.status(500).json({ error: "Error local al eliminar a la persona" });
    }
  }
}