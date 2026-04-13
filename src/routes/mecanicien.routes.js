const router   = require('express').Router();
const ctrl     = require('../controllers/mecanicien.controller');
const validate = require('../middlewares/validate');
const { mecanicienSchema } = require('../validators/schemas');

/**
 * @swagger
 * tags:
 *   name: Mécaniciens
 *   description: Gestion des mécaniciens du garage
 */

/**
 * @swagger
 * /mecaniciens:
 *   get:
 *     summary: Liste tous les mécaniciens
 *     tags: [Mécaniciens]
 *     responses:
 *       200:
 *         description: Liste retournée avec succès
 */
router.get('/', ctrl.getAll);

/**
 * @swagger
 * /mecaniciens/{id}:
 *   get:
 *     summary: Récupérer un mécanicien par ID
 *     tags: [Mécaniciens]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Mécanicien trouvé
 *       404:
 *         description: Introuvable
 */
router.get('/:id', ctrl.getById);

/**
 * @swagger
 * /mecaniciens:
 *   post:
 *     summary: Créer un mécanicien
 *     tags: [Mécaniciens]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [prenom, nom, email, specialite]
 *             properties:
 *               prenom:
 *                 type: string
 *                 example: Moussa
 *               nom:
 *                 type: string
 *                 example: Diallo
 *               email:
 *                 type: string
 *                 example: moussa.diallo@garage221.sn
 *               telephone:
 *                 type: string
 *                 example: "771234567"
 *               specialite:
 *                 type: string
 *                 enum: [moteur, carrosserie, electricite, autre]
 *                 example: moteur
 *     responses:
 *       201:
 *         description: Mécanicien créé
 *       400:
 *         description: Données invalides
 *       409:
 *         description: Email déjà utilisé
 */
router.post('/', validate(mecanicienSchema), ctrl.create);

/**
 * @swagger
 * /mecaniciens/{id}:
 *   put:
 *     summary: Modifier un mécanicien
 *     tags: [Mécaniciens]
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
router.put('/:id', validate(mecanicienSchema), ctrl.update);

/**
 * @swagger
 * /mecaniciens/{id}:
 *   delete:
 *     summary: Supprimer un mécanicien
 *     tags: [Mécaniciens]
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
 *         description: Interventions EN_COURS liées
 */
router.delete('/:id', ctrl.remove);

module.exports = router;