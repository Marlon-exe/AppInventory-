import { Utils } from "../config/utils.js";
import { pool } from "../config/db.js";

export class ProductoEntregadoCtrl {

  //retorna las metricas
  static getMetricas = async (req, res) => {
    try {
      const { inicio, fin } = req.query

      if (!inicio || !fin) {
        return Utils.serverResponse({
          response: res,
          code: 400,
          msg: "Rango de fechas requerido",
          value: false
        });
      };
      const query = `
            SELECT 
                pe.cantidad,
                TO_CHAR(pe.fecha_entrega, 'YYYY-MM-DD') as fecha,
                prod.tipo_producto AS producto
            FROM producto_entregado pe
            INNER JOIN producto prod ON pe.id_producto = prod.id_producto
            WHERE pe.fecha_entrega::date BETWEEN $1 AND $2
            ORDER BY pe.fecha_entrega ASC;`

      const result = await pool.query(query, [inicio, fin]);
      return Utils.serverResponse({
        response: res,
        code: 200,
        msg: "Entrega encontrada",
        value: true,
        data: result.rows
      })
    } catch (error) {
      res.status(500).json({ value: false, msg: "Error en el servidor" });
    }
  };

  static getAll = async (req, res) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const offset = (page - 1) * limit;

      const { inicio, fin } = req.query;
      const rangoTrue = Boolean(inicio && fin);


      const whereData = rangoTrue
        ? `WHERE pe.fecha_entrega::date BETWEEN $3 AND $4`
        : ``;
      const whereCount = rangoTrue
        ? `WHERE pe.fecha_entrega::date BETWEEN $1 AND $2`
        : "";

      const query = `
                SELECT 
                    pe.id_producto_entregado,
                    pe.id_producto,       
                    pe.id_persona_retiro,  
                    pe.id_persona_entrega, 
                    pe.cantidad,
                    TO_CHAR(pe.fecha_entrega, 'YYYY-MM-DD') as fecha,
                    p_retiro.nombre AS quien_retiro,
                    p_entrega.nombre AS quien_entrega,
                    prod.tipo_producto AS producto,
                    dep.nom_departamento AS departamento
                FROM producto_entregado pe
                INNER JOIN persona p_retiro ON pe.id_persona_retiro = p_retiro.id_persona
                INNER JOIN persona p_entrega ON pe.id_persona_entrega = p_entrega.id_persona
                INNER JOIN producto prod ON pe.id_producto = prod.id_producto
                INNER JOIN departamento dep ON p_retiro.id_departamento = dep.id_departamento
                ${whereData}
                ORDER BY pe.fecha_entrega DESC
                LIMIT $1 OFFSET $2;
            `
      const countQuery = `SELECT COUNT(*) FROM producto_entregado pe ${whereCount}`;

      const dataParams = rangoTrue
        ? [limit, offset, inicio, fin]
        : [limit, offset];

      const countParams = rangoTrue
        ? [inicio, fin]
        : [];
      const [result, countResult] = await Promise.all([
        pool.query(query, dataParams),
      pool.query(countQuery, countParams)
      ]);

      const totalRows = parseInt(countResult.rows[0].count,10);

      return Utils.serverResponse({
        response: res,
        code: 200,
        msg: "Listado de entregas optenido",
        value: true,
        data: {
          registros: result.rows,
          total: totalRows,
          paginas: Math.ceil(totalRows / limit),
          paginaActual: page
        }
      });
    } catch (error) {
      console.error("ProductoEntregadoCtrl.getAll error:", error);
      res.status(500).json({ error: "Error local al  obtner el historial de entregas" });
    }
  }


  static getById = async (req, res) => {
    try {
      const { id } = req.params;
      const query = `
                SELECT 
                    pe.id_producto_entregado,
                    pe.cantidad,
                    TO_CHAR(pe.fecha_entrega, 'YYYY-MM-DD') as fecha,
                    p_retiro.nombre AS quien_retiro,
                    p_entrega.nombre AS quien_entrega,
                    prod.tipo_producto AS producto
                FROM producto_entregado pe
                INNER JOIN persona p_retiro ON pe.id_persona_retiro = p_retiro.id_persona
                INNER JOIN persona p_entrega ON pe.id_persona_entrega = p_entrega.id_persona
                INNER JOIN producto prod ON pe.id_producto = prod.id_producto
                WHERE pe.id_producto_entregado = $1
            `;
      const result = await pool.query(query, [id]);

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
        msg: "Entrega encontrada",
        value: true,
        data: result.rows[0]
      })
    } catch (error) {
      console.error("ProdcutoEntregadoCtrl.getById error:", error);
      res.status(500).json({ error: "Error local al obtener el detalle de la entrega" })
    }
  }

  static create = async (req, res) => {
    try {
      const { id_persona_retiro, id_persona_entrega, id_producto, cantidad, fecha_entrega } = req.body;

      if (!id_persona_retiro || !id_persona_entrega || !id_producto || !cantidad) {
        return Utils.serverResponse({
          response: res,
          code: 400,
          msg: "Todos los campos son obligatorios",
          value: false
        });
      }
      const query = `
                INSERT INTO producto_entregado (
                    id_persona_retiro, 
                    id_persona_entrega, 
                    id_producto, 
                    cantidad, 
                    fecha_entrega
                )
                VALUES ($1, $2, $3, $4, COALESCE($5, CURRENT_DATE))
                RETURNING *, TO_CHAR(fecha_entrega, 'YYYY-MM-DD') as fecha
                `;
      const result = await pool.query(query, [id_persona_retiro, id_persona_entrega, id_producto, cantidad, fecha_entrega]);

      return Utils.serverResponse({
        response: res,
        code: 201,
        msg: "Entrega resgistrada",
        value: true,
        data: result.rows[0]
      })
    } catch (error) {
      console.error("ProductoEntregadoCtrl.create error:", error);

      if (error.code === '23514') {
        return res.status(400).json({
          error: "La cantidad debe ser mayor a 0"
        });
      }
      res.status(500).json({ error: "Error interno al registrar la entrega" });
    }
  }

  static update = async (req, res) => {
    try {
      const { id } = req.params;
      const { id_persona_retiro, id_persona_entrega, id_producto, cantidad, fecha_entrega } = req.body;
      const query = `
                UPDATE producto_entregado 
                SET 
                    id_persona_retiro = COALESCE($1, id_persona_retiro),
                    id_persona_entrega = COALESCE($2, id_persona_entrega),
                    id_producto = COALESCE($3, id_producto),
                    cantidad = COALESCE($4, cantidad),
                    fecha_entrega = COALESCE($5, fecha_entrega)
                WHERE id_producto_entregado = $6
                RETURNING *, TO_CHAR(fecha_entrega, 'YYYY-MM-DD') as fecha
            `;

      const result = await pool.query(query, [id_persona_retiro || null, id_persona_entrega || null,
      id_producto || null, cantidad || null, fecha_entrega || null, id])

      if (result.rows.length === 0) {
        return Utils.serverResponse({
          response: res,
          code: 404,
          msg: "No se encontraron campos para actualizar",
          value: false
        })
      }

      return Utils.serverResponse({
        response: res,
        code: 200,
        msg: "Se realizaron los cambios",
        value: true,
        data: result.rows[0]
      });
    } catch (error) {
      console.error("Error en update parcial:", error);
      res.status(500).json({ error: "Error interno" });

    }
  }

  static delete = async (req, res) => {
    try {
      const { id } = req.params;
      const query = `
                DELETE FROM producto_entregado 
                WHERE id_producto_entregado = $1 
                RETURNING id_producto_entregado
            `;
      const result = await pool.query(query, [id]);

      if (result.rows.length === 0) {
        return Utils.serverResponse({
          response: res,
          code: 404,
          msg: "No se encontró el registro que intenta eliminar",
          value: false
        });
      }

      return Utils.serverResponse({
        response: res,
        code: 200,
        msg: `Registro con ID ${id} eliminado correctamento`,
        value: true
      })
    } catch (error) {
      console.error("Error en ProductoEntregadoCtrl.delete:", error)

      if (error.code === '23503') {
        return res.status(400).json({
          error: "No se puede eliminar este registro porque otros datos dependen de él."
        });
      }
      res.status(500).json({ error: "Error interno al intentar eliminar la entrega" });
    }
  }
}