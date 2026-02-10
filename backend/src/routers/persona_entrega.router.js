import { Router } from "express";
import { ProductoEntregadoCtrl } from "../controllers/producto_entregado.controller.js";

const productoEntregadoRouter = Router();

/**
 * @swagger
 * tags:
 *   - name: Productos Entregados
 *     description: Gestión y control de productos entregados
 */

/**
 * @swagger
 * /producto-entregado/stats:
 *   get:
 *     summary: Obtener estadísticas de entregas por rango de fechas para el gráfico
 *     tags: [Productos Entregados]
 *     parameters:
 *       - in: query
 *         name: inicio
 *         schema:
 *           type: string
 *           format: date
 *         example: "2025-01-01"
 *         description: Fecha de inicio (YYYY-MM-DD)
 *       - in: query
 *         name: fin
 *         schema:
 *           type: string
 *           format: date
 *         example: "2025-01-07"
 *         description: Fecha de fin (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Datos para el gráfico obtenidos correctamente
 */

/**
 * @swagger
 * /producto-entregado:
 *   get:
 *     summary: Obtener historial de productos entregados (paginado)
 *     tags: [Productos Entregados]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Cantidad de registros por página
 *     responses:
 *       200:
 *         description: Listado de entregas obtenido correctamente
 *       500:
 *         description: Error local al obtener el historial de entregas
 *   post:
 *     summary: Registrar entrega de producto
 *     tags: [Productos Entregados]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_persona_retiro
 *               - id_persona_entrega
 *               - id_producto
 *               - cantidad
 *             properties:
 *               id_persona_retiro:
 *                 type: integer
 *                 example: 1
 *               id_persona_entrega:
 *                 type: integer
 *                 example: 2
 *               id_producto:
 *                 type: integer
 *                 example: 3
 *               cantidad:
 *                 type: integer
 *                 example: 5
 *               fecha_entrega:
 *                 type: string
 *                 format: date
 *                 example: "2025-01-15"
 *     responses:
 *       201:
 *         description: Entrega registrada correctamente
 *       400:
 *         description: Datos inválidos o incompletos
 *       500:
 *         description: Error interno al registrar la entrega
 */

/**
 * @swagger
 * /producto-entregado/{id}:
 *   get:
 *     summary: Obtener detalle de una entrega por ID
 *     tags: [Productos Entregados]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Entrega encontrada
 *       404:
 *         description: Entrega no encontrada
 *       500:
 *         description: Error local al obtener el detalle de la entrega
 *   put:
 *     summary: Actualizar entrega de producto (actualización parcial)
 *     tags: [Productos Entregados]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_persona_retiro:
 *                 type: integer
 *                 example: 1
 *               id_persona_entrega:
 *                 type: integer
 *                 example: 2
 *               id_producto:
 *                 type: integer
 *                 example: 4
 *               cantidad:
 *                 type: integer
 *                 example: 10
 *               fecha_entrega:
 *                 type: string
 *                 format: date
 *                 example: "2025-01-20"
 *     responses:
 *       200:
 *         description: Entrega actualizada correctamente
 *       404:
 *         description: No se encontraron datos para actualizar
 *       500:
 *         description: Error interno al actualizar la entrega
 *   delete:
 *     summary: Eliminar registro de entrega
 *     tags: [Productos Entregados]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Registro eliminado correctamente
 *       404:
 *         description: Registro no encontrado
 *       400:
 *         description: No se puede eliminar por dependencia de datos
 *       500:
 *         description: Error interno al intentar eliminar la entrega
 */

productoEntregadoRouter.get("/stats", ProductoEntregadoCtrl.getMetricas);
productoEntregadoRouter.get("/", ProductoEntregadoCtrl.getAll);
productoEntregadoRouter.get("/:id", ProductoEntregadoCtrl.getById);
productoEntregadoRouter.post("/", ProductoEntregadoCtrl.create);
productoEntregadoRouter.put("/:id", ProductoEntregadoCtrl.update);
productoEntregadoRouter.delete("/:id", ProductoEntregadoCtrl.delete);

export default productoEntregadoRouter;
