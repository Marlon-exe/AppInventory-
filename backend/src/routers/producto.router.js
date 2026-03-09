import { Router } from 'express';
import { ProductoCtrl } from '../controllers/producto.controller.js'

const productoRouter = Router();


/**
 * @swagger
 * tags:
 *   - name: Productos
 *     description: API para la gestión de productos
 */

/**
 * @swagger
 * /producto:
 *   get:
 *     summary: Obtener todos los productos
 *     tags: [Productos]
 *     responses:
 *       200:
 *         description: Productos obtenidos con éxito
 *       500:
 *         description: Error local al conseguir todos los productos
 *   post:
 *     summary: Crear un producto
 *     tags: [Productos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tipo_producto
 *             properties:
 *               tipo_producto:
 *                 type: string
 *                 example: Electrónicos
 *     responses:
 *       201:
 *         description: Producto creado correctamente
 *       400:
 *         description: El nombre del producto es obligatorio
 *       409:
 *         description: El producto ya está registrado
 *       500:
 *         description: Error local al crear el producto
 */

/**
 * @swagger
 * /producto/{id}:
 *   get:
 *     summary: Obtener producto por ID
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Producto encontrado
 *       400:
 *         description: Producto no existente
 *       500:
 *         description: Error local al obtener el producto
 *   put:
 *     summary: Actualizar producto
 *     tags: [Productos]
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
 *             required:
 *               - tipo_producto
 *             properties:
 *               tipo_producto:
 *                 type: string
 *                 example: Alimentos
 *     responses:
 *       200:
 *         description: Producto actualizado correctamente
 *       400:
 *         description: El tipo de producto es obligatorio
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error local al actualizar el producto
 *   delete:
 *     summary: Eliminar producto
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Producto eliminado correctamente
 *       404:
 *         description: El producto no existe
 *       400:
 *         description: El producto está asociado a otros registros
 *       500:
 *         description: Error local al eliminar el producto
 */


productoRouter.get('/', ProductoCtrl.getAll);
productoRouter.get('/:id', ProductoCtrl.getById);
productoRouter.post('/', ProductoCtrl.create);
productoRouter.put('/:id', ProductoCtrl.update);
productoRouter.delete('/:id', ProductoCtrl.delete);

export default productoRouter;