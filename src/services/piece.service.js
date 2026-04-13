const { prisma } = require('../models');

const getByIntervention = (interventionId) =>
  prisma.pieceUtilisee.findMany({ where: { interventionId: parseInt(interventionId) } });

const create = async (data) => {
  const i = await prisma.intervention.findUnique({ where: { id: parseInt(data.interventionId) } });
  if (!i) { const e = new Error('Intervention introuvable'); e.status = 404; throw e; }
  return prisma.pieceUtilisee.create({ data });
};

const remove = async (id) => {
  const p = await prisma.pieceUtilisee.findUnique({ where: { id: parseInt(id) } });
  if (!p) { const e = new Error('Pièce introuvable'); e.status = 404; throw e; }
  return prisma.pieceUtilisee.delete({ where: { id: parseInt(id) } });
};

const coutTotal = async (interventionId) => {
  const pieces = await prisma.pieceUtilisee.findMany({ where: { interventionId: parseInt(interventionId) } });
  return pieces.reduce((sum, p) => sum + p.quantite * p.prixUnitaire, 0);
};

module.exports = { getByIntervention, create, remove, coutTotal };