import { Router } from 'express';
import { PersonaCtrl } from '../controllers/persona.controller.js';

const personaRouter = Router();

/**
 * @swagger
 * tags:
 *   - name: Personas
 *     description: API para la gestión de personas
 */

/**
 * @swagger
 * /persona:
 *   get:
 *     summary: Obtener todas las personas
 *     tags: [Personas]
 *     responses:
 *       200:
 *         description: Personas obtenidas con éxito
 *       500:
 *         description: Error al obtener las personas
 *   post:
 *     summary: Crear una persona
 *     tags: [Personas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - cedula
 *               - id_departamento
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Juan Pérez
 *               cedula:
 *                 type: string
 *                 example: 0102030405
 *               id_departamento:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Persona creada correctamente
 *       400:
 *         description: Todos los campos son obligatorios
 *       500:
 *         description: Error local al crear la persona
 */

/**
 * @swagger
 * /persona/{id}:
 *   get:
 *     summary: Obtener persona por ID
 *     tags: [Personas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Persona encontrada
 *       404:
 *         description: Persona no encontrada
 *       500:
 *         description: Error local al obtener la persona
 *   put:
 *     summary: Actualizar persona
 *     tags: [Personas]
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
 *               - nombre
 *               - cedula
 *               - id_departamento
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: María López
 *               cedula:
 *                 type: string
 *                 example: 0908070605
 *               id_departamento:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Persona actualizada correctamente
 *       400:
 *         description: Todos los campos son obligatorios
 *       404:
 *         description: Persona no encontrada
 *       500:
 *         description: Error local al actualizar la persona
 *   delete:
 *     summary: Eliminar persona
 *     tags: [Personas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Persona eliminada correctamente
 *       404:
 *         description: Persona no encontrada
 *       500:
 *         description: Error local al eliminar la persona
 */



personaRouter.get('/', PersonaCtrl.getAll);
personaRouter.get('/:id', PersonaCtrl.getById);
personaRouter.post('/', PersonaCtrl.create);
personaRouter.put('/:id', PersonaCtrl.update);
personaRouter.delete('/:id', PersonaCtrl.delete);

export default personaRouter;