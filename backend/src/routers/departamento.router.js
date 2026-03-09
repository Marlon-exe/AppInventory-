import { Router } from 'express';
import { DepartamentoCtrl } from '../controllers/departamento.controller.js'

const departamendoRouter = Router();

/**
 * @swagger
 * tags:
 *   - name: Departamentos
 *     description: API para la gestión de departamentos
 */

/**
 * @swagger
 * /departamento:
 *   get:
 *     summary: Obtener todos
 *     tags: [Departamentos]
 *     responses:
 *       200:
 *         description: Departamentos obtenidos con éxito
 *       500:
 *         description: Error local al conseguir todos los departamentos
 *   post:
 *     summary: Crear departamento
 *     tags: [Departamentos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom_departamento:
 *                 type: string
 *     responses:
 *       201:
 *         description: Departamento creado con éxito
 *       400:
 *         description: Es obligatorio el nombre del departamento
 *       500:
 *         description: Error local al crear departamento
 */

/**
 * @swagger
 * /departamento/{id}:
 *   get:
 *     summary: Obtener por ID
 *     tags: [Departamentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Departamento encontrado
 *       404:
 *         description: Departamento no encontrado
 *       500:
 *         description: Error local al obtener el departamento
 *   put:
 *     summary: Actualizar departamento
 *     tags: [Departamentos]
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
 *               nom_departamento:
 *                 type: string
 *     responses:
 *       200:
 *         description: Departamento actualizado con éxito
 *       400:
 *         description: El nuevo nombre es requerido
 *       404:
 *         description: Departamento no encontrado
 *       500:
 *         description: Error local al actualizar departamento
 *   delete:
 *     summary: Eliminar departamento
 *     tags: [Departamentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Departamento eliminado correctamente
 *       404:
 *         description: Departamento no encontrado
 *       500:
 *         description: Error local al eliminar departamento
 */


departamendoRouter.get('/:id', DepartamentoCtrl.getById);
departamendoRouter.get('/', DepartamentoCtrl.getAll);
departamendoRouter.post('/', DepartamentoCtrl.create);
departamendoRouter.put('/:id', DepartamentoCtrl.update);
departamendoRouter.delete('/:id', DepartamentoCtrl.delete);

export default departamendoRouter;