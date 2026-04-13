const router   = require('express').Router();
const ctrl     = require('../controllers/piece.controller');
const validate = require('../middlewares/validate');
const { pieceSchema } = require('../validators/schemas');

/**
 * @swagger
 * tags:
 *   name: Pièces
 *   description: Gestion des pièces utilisées
 */

/**
 * @swagger
 * /pieces:
 *   get:
 *     summary: Liste les pièces d'une intervention
 *     tags: [Pièces]
 *     parameters:
 *       - in: query
 *         name: interventionId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste retournée avec succès
 */
router.get('/', ctrl.getByIntervention);

/**
 * @swagger
 * /pieces/cout/{interventionId}:
 *   get:
 *     summary: Coût total des pièces d'une intervention
 *     tags: [Pièces]
 *     parameters:
 *       - in: path
 *         name: interventionId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Coût total calculé
 */
router.get('/cout/:interventionId', ctrl.coutTotal);

/**
 * @swagger
 * /pieces:
 *   post:
 *     summary: Ajouter une pièce à une intervention
 *     tags: [Pièces]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [interventionId, libelle, quantite, prixUnitaire]
 *             properties:
 *               interventionId:
 *                 type: integer
 *                 example: 1
 *               libelle:
 *                 type: string
 *                 example: Filtre à huile
 *               quantite:
 *                 type: integer
 *                 example: 2
 *               prixUnitaire:
 *                 type: number
 *                 example: 5000
 *     responses:
 *       201:
 *         description: Pièce ajoutée
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Intervention introuvable
 */
router.post('/', validate(pieceSchema), ctrl.create);

/**
 * @swagger
 * /pieces/{id}:
 *   delete:
 *     summary: Supprimer une pièce
 *     tags: [Pièces]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Supprimé
 *       404:
 *         description: Introuvable
 */
router.delete('/:id', ctrl.remove);

module.exports = router;