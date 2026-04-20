const { prisma } = require('../models');

const getAll = () =>
  prisma.intervention.findMany({
    include: { mecanicien: true, vehicule: true, piecesUtilisees: true }
  });

const getById = (id) =>
  prisma.intervention.findUnique({
    where: { id: parseInt(id) },
    include: { mecanicien: true, vehicule: true, piecesUtilisees: true }
  });

const create = async (data) => {
  const mec = await prisma.mecanicien.findUnique({ where: { id: parseInt(data.mecanicienId) } });
  if (!mec) { const e = new Error('Mécanicien introuvable'); e.status = 404; throw e; }

  const veh = await prisma.vehicule.findUnique({ where: { id: parseInt(data.vehiculeId) } });
  if (!veh) { const e = new Error('Véhicule introuvable'); e.status = 404; throw e; }

  const date = new Date(data.dateIntervention);
  if (Number.isNaN(date.getTime())) {
    const e = new Error('DateIntervention invalide, format attendu YYYY-MM-DD.');
    e.status = 400; throw e;
  }

  return prisma.intervention.create({
    data: { ...data, dateIntervention: date, statut: 'EN_ATTENTE' },
    include: { mecanicien: true, vehicule: true, piecesUtilisees: true }
  });
};

const update = async (id, data) => {
  const i = await prisma.intervention.findUnique({ where: { id: parseInt(id) } });
  if (!i) { const e = new Error('Intervention introuvable'); e.status = 404; throw e; }

  const payload = { ...data };
  if (data.dateIntervention) {
    const date = new Date(data.dateIntervention);
    if (Number.isNaN(date.getTime())) {
      const e = new Error('DateIntervention invalide, format attendu YYYY-MM-DD.');
      e.status = 400; throw e;
    }
    payload.dateIntervention = date;
  }

  return prisma.intervention.update({
    where: { id: parseInt(id) },
    data: payload,
    include: { mecanicien: true, vehicule: true, piecesUtilisees: true }
  });
};

const remove = async (id) => {
  const i = await prisma.intervention.findUnique({ where: { id: parseInt(id) } });
  if (!i) { const e = new Error('Intervention introuvable'); e.status = 404; throw e; }

  const count = await prisma.pieceUtilisee.count({ where: { interventionId: parseInt(id) } });
  if (count > 0) {
    const e = new Error('Impossible : des pièces sont liées à cette intervention.');
    e.status = 409; throw e;
  }
  return prisma.intervention.delete({ where: { id: parseInt(id) } });
};

module.exports = { getAll, getById, create, update, remove };