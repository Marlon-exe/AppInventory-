import { Utils } from "../config/utils.js";
import { pool } from "../config/db.js";

export class ProductoCtrl {

  static getAll = async (req, res) => {
    try {
      const query = `SELECT * FROM producto ORDER BY id_producto ASC`;
      const result = await pool.query(query);

      return Utils.serverResponse({
        response: res,
        code: 200,
        msg: "productos obtenidos con exito",
        value: true,
        data: result.rows
      })
    } catch (error) {
      console.error("ProductoCtrl.getAll error:", error);
      res.status(500).json({ error: "Error local al consegir todos los productos" });
    }
  }

  static getById = async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return Utils.serverResponse({
          response: res,
          code: 400,
          msg: "Es necesario el ID del producto ",
          value: false
        });
      }
      const query = `SELECT * FROM producto WHERE id_producto = $1`;
      const result = await pool.query(query, [id]);

      if (result.rows.length === 0) {
        return Utils.serverResponse({
          response: res,
          code: 400,
          msg: "Producto no existente",
          data: false
        })
      }
      return Utils.serverResponse({
        response: res,
        code: 200,
        msg: "Producto encontrado",
        value: true,
        data: result.rows[0]
      });
    } catch (error) {
      console.error("ProductoCtrl.getById error:", error);
      res.status(500).json({ error: "Error local al optener el producto " });
    }
  }

  static create = async (req, res) => {
    try {
      const { tipo_producto } = req.body;
      if (!tipo_producto) {
        return Utils.serverResponse({
          response: res,
          code: 400,
          msg: "El nombre del producto es obligatorio",
          value: false
        });
      }

      const chekQuery = `SELECT * FROM producto WHERE tipo_producto =$1`
      const exists = await pool.query(chekQuery, [tipo_producto]);

      if (exists.rows.length > 0) {
        return Utils.serverResponse({
          response: res,
          code: 409,
          msg: "Este producto ya esta registrado",
          value: false
        })
      }
      const query = `INSERT INTO producto (tipo_producto)
                      VALUES ($1)
                       RETURNING *`
      const result = await pool.query(query, [tipo_producto]);
      return Utils.serverResponse({
        response: res,
        code: 201,
        msg: "Producto creado",
        value: true,
        data: result.rows[0]
      })
    } catch (error) {
      console.error("ProductoCtrl.create error:", error);
      res.status(500).json({ error: "Error local al crear el producto" });
    }
  }

  static update = async (req, res) => {
    try {
      const { id } = req.params;
      const { tipo_producto } = req.body;

      if (!tipo_producto) {
        return Utils.serverResponse({
          response: res,
          code: 400,
          msg: "Es obligatorio que el producto tenga algun tipo",
          value: false
        })
      }
      const query = `
            UPDATE producto
            SET tipo_producto = $1
            WHERE id_producto =$2
            RETURNING * `;
      const result = await pool.query(query, [tipo_producto, id]);
      if (result.rows.length === 0) {
        return Utils.serverResponse({
          response: res,
          code: 404,
          value: false
        });
      }
      return Utils.serverResponse({
        response: res,
        code: 200,
        msg: "Producto actualizado",
        value: true,
        data: result.rows[0]
      })
    } catch (error) {
      console.error("ProductoCtrl.update error", error);
      res.status(500).json({ error: "Error local al actualizar el producto" });
    }
  }

  static delete = async (req, res) => {
    try {
      const { id } = req.params;
      const query = `
                    DELETE FROM producto
                    WHERE id_producto = $1 
                    RETURNING *`;
      const result = await pool.query(query, [id]);
      if (result.rows.length === 0) {
        return Utils.serverResponse({
          response: res,
          code: 404,
          msg: "No se pude eliminar le producto: El producto no existe",
          value: false
        })
      }
      return Utils.serverResponse({
        response: res,
        code: 200,
        msg: "Producto eliminado",
        value: true,
        data: result.rows[0]
      })

    } catch (error) {
      console.error("ProductoCtrl.delete error:", error);

      if (error.code === '23503') {
        return res.status(400).json({
          error: "No se puede elimianar el producto, esta asociado a otros registros"
        });
      }
      res.status(5000).json({ error: "Error local al eliminar el prodcuto" });
    }
  }
}