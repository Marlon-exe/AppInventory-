import { Utils } from '../config/utils.js';
import { pool } from '../config/db.js';

export class DepartamentoCtrl {

  //Optener por el id
  static getById = async (req, res) => {
    try {
      const { id } = req.params;
      const query = `SELECT * FROM departamento WHERE id_departamento = $1`;
      const result = await pool.query(query, [id]);

      if (result.rows.length === 0) {
        return Utils.serverResponse({
          response: res,
          code: 404,
          msg: "Departamento no encontrado",
          value: false
        })
      }
      return Utils.serverResponse({
        response: res,
        code: 200,
        msg: "Departamento encontrado",
        value: true,
        data: result.rows[0]
      })
    } catch (error) {
      console.error("DepartamentoCtrl.getById error:", error);
      res.status(500).json({ error: "Error local al obtener el departamento" });
    }
  }

  //OPtener todos
  static getAll = async (req, res) => {
    try {
      const query = `SELECT * FROM departamento ORDER BY id_departamento ASC`;
      const result = await pool.query(query);

      return Utils.serverResponse({
        response: res,
        code: 200,
        msg: "Departamentos obtenidos con exitos",
        value: true,
        data: result.rows
      })
    } catch (error) {
      console.error("DepartamentoCtrl.getAll error:", error);
      res.status(500).json({ error: "Error local al conseguir todos los departamentos" });
    }
  }

  //crear
  static create = async (req, res) => {
    try {
      const { nom_departamento } = req.body;
      if (!nom_departamento) {
        return Utils.serverResponse({
          response: res,
          code: 400,
          msg: "Es obligatorio el nombre del departamento",
          value: false
        })
      }
      const query = `INSERT INTO departamento (nom_departamento) VALUES ($1) RETURNING *`;
      const result = await pool.query(query, [nom_departamento]);

      return Utils.serverResponse({
        response: res,
        code: 201,
        msg: "Departamento creado con exito ",
        value: true,
        data: result.rows[0]
      })
    } catch (error) {
      console.error("DepartamentoCtrl.create error:", error);
      res.status(500).json({ error: "Error local al crear departamento" });
    }
  }

  static update = async (req, res) => {
    try {
      const { id } = req.params;
      const { nom_departamento } = req.body;

      if (!nom_departamento) {
        return Utils.serverResponse({
          response: res,
          code: 400,
          msg: "El nuevo es requerido",
          value: false
        });
      }
      const query = `UPDATE departamento SET nom_departamento = $1 WHERE id_departamento = $2 RETURNING *`;
      const result = await pool.query(query, [nom_departamento, id]);

      if (result.rows.length === 0) {
        return Utils.serverResponse({
          response: res,
          code: 404,
          msg: "No se pudo actulizar: Departamento no encontrado",
          value: false
        })
      }
      return Utils.serverResponse({
        response: res,
        code: 200,
        msg: "Departamento actualizado con exito",
        value: true,
        data: result.rows[0]
      })
    } catch (error) {
      console.error("Departamento.upadate error", error);
      res.status(500).json({ error: "Error local al actulizar departamento" })
    }
  }

  static delete = async (req, res) => {
    try {
      const { id } = req.params;

      const query = `DELETE FROM departamento WHERE id_departamento = $1 RETURNING *`;
      const result = await pool.query(query, [id]);

      if (result.rows.length === 0) {
        return Utils.serverResponse({
          response: res,
          code: 404,
          msg: "No se puedo eliminar: Departamento no encontrado",
          value: false
        })
      }

      return Utils.serverResponse({
        response: res,
        code: 200,
        msg: "Departamento eliminado correctamente",
        value: true,
        data: result.rows[0]
      })
    } catch (error) {
      console.error("Departamento.elimar error", error);
      res.status(500).json({ error: "Error local al eliminar departamento" });
    }
  }
}