const router   = require('express').Router();
const ctrl     = require('../controllers/vehicule.controller');
const validate = require('../middlewares/validate');
const { vehiculeSchema } = require('../validators/schemas');

/**
 * @swagger
 * tags:
 *   name: Véhicules
 *   description: Gestion des véhicules des clients
 */

/**
 * @swagger
 * /vehicules:
 *   get:
 *     summary: Liste tous les véhicules
 *     tags: [Véhicules]
 *     responses:
 *       200:
 *         description: Liste retournée avec succès
 */
router.get('/', ctrl.getAll);

/**
 * @swagger
 * /vehicules/{id}:
 *   get:
 *     summary: Récupérer un véhicule par ID
 *     tags: [Véhicules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Véhicule trouvé
 *       404:
 *         description: Introuvable
 */
router.get('/:id', ctrl.getById);

/**
 * @swagger
 * /vehicules:
 *   post:
 *     summary: Enregistrer un véhicule
 *     tags: [Véhicules]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [immatriculation, marque, modele, nomProprietaire]
 *             properties:
 *               immatriculation:
 *                 type: string
 *                 example: DK-1234-AB
 *               marque:
 *                 type: string
 *                 example: Toyota
 *               modele:
 *                 type: string
 *                 example: Corolla
 *               nomProprietaire:
 *                 type: string
 *                 example: Amadou Diop
 *               telProprietaire:
 *                 type: string
 *                 example: "771234567"
 *     responses:
 *       201:
 *         description: Véhicule enregistré
 *       400:
 *         description: Données invalides
 *       409:
 *         description: Immatriculation déjà existante
 */
router.post('/', validate(vehiculeSchema), ctrl.create);

/**
 * @swagger
 * /vehicules/{id}:
 *   put:
 *     summary: Modifier un véhicule
 *     tags: [Véhicules]
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
router.put('/:id', validate(vehiculeSchema), ctrl.update);

/**
 * @swagger
 * /vehicules/{id}:
 *   delete:
 *     summary: Supprimer un véhicule
 *     tags: [Véhicules]
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
 *         description: Interventions liées — suppression impossible
 */
router.delete('/:id', ctrl.remove);

module.exports = router;