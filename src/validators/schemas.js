const { z } = require('zod');

const mecanicienSchema = z.object({
  prenom:     z.string().min(2).max(50),
  nom:        z.string().min(2).max(50),
  email:      z.string().email({ message: 'Email invalide.' }),
  telephone:  z.string().min(8).max(20).optional(),
  specialite: z.enum(['moteur', 'carrosserie', 'electricite', 'autre']),
});

const vehiculeSchema = z.object({
  immatriculation: z.string().min(4).max(20),
  marque:          z.string().min(2).max(50),
  modele:          z.string().min(1).max(50),
  nomProprietaire: z.string().min(2).max(100),
  telProprietaire: z.string().min(8).max(20).optional(),
});

const interventionSchema = z.object({
  mecanicienId:     z.number().int().positive(),
  vehiculeId:       z.number().int().positive(),
  dateIntervention: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'DateIntervention doit être au format YYYY-MM-DD',
  }),
  description:      z.string().min(5),
  statut:           z.enum(['EN_ATTENTE', 'EN_COURS', 'TERMINEE']).optional(),
  coutMainOeuvre:   z.number().min(0),
});

const pieceSchema = z.object({
  interventionId: z.number().int().positive(),
  libelle:        z.string().min(2),
  quantite:       z.number().int().min(1),
  prixUnitaire:   z.number().min(0.01),
});

module.exports = { mecanicienSchema, vehiculeSchema, interventionSchema, pieceSchema };