const router   = require('express').Router();
const ctrl     = require('../controllers/intervention.controller');
const validate = require('../middlewares/validate');
const { interventionSchema } = require('../validators/schemas');

/**
 * @swagger
 * tags:
 *   name: Interventions
 *   description: Gestion des interventions
 */

/**
 * @swagger
 * /interventions:
 *   get:
 *     summary: Liste toutes les interventions
 *     tags: [Interventions]
 *     responses:
 *       200:
 *         description: Liste retournée avec succès
 */
router.get('/', ctrl.getAll);

/**
 * @swagger
 * /interventions/{id}:
 *   get:
 *     summary: Récupérer une intervention par ID
 *     tags: [Interventions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Intervention trouvée
 *       404:
 *         description: Introuvable
 */
router.get('/:id', ctrl.getById);

/**
 * @swagger
 * /interventions:
 *   post:
 *     summary: Créer une intervention
 *     tags: [Interventions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [mecanicienId, vehiculeId, dateIntervention, description, coutMainOeuvre]
 *             properties:
 *               mecanicienId:
 *                 type: integer
 *                 example: 1
 *               vehiculeId:
 *                 type: integer
 *                 example: 1
 *               dateIntervention:
 *                 type: string
 *                 example: "2024-01-15"
 *               description:
 *                 type: string
 *                 example: Vidange moteur complète
 *               coutMainOeuvre:
 *                 type: number
 *                 example: 15000
 *     responses:
 *       201:
 *         description: Intervention créée en EN_ATTENTE
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Mécanicien ou véhicule introuvable
 */
router.post('/', validate(interventionSchema), ctrl.create);

/**
 * @swagger
 * /interventions/{id}:
 *   put:
 *     summary: Modifier une intervention
 *     tags: [Interventions]
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
 *     responses:
 *       200:
 *         description: Mis à jour
 *       404:
 *         description: Introuvable
 */
router.put('/:id', validate(interventionSchema), ctrl.update);

/**
 * @swagger
 * /interventions/{id}:
 *   delete:
 *     summary: Supprimer une intervention
 *     tags: [Interventions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Supprimé
 *       409:
 *         description: Pièces liées — suppression impossible
 */
router.delete('/:id', ctrl.remove);

module.exports = router;