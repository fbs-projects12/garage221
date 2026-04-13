const { prisma } = require('../models');

const getAll  = () => prisma.mecanicien.findMany();
const getById = (id) => prisma.mecanicien.findUnique({ where: { id: parseInt(id) } });
const create  = (data) => prisma.mecanicien.create({ data });

const update = async (id, data) => {
  const m = await prisma.mecanicien.findUnique({ where: { id: parseInt(id) } });
  if (!m) { const e = new Error('Mécanicien introuvable'); e.status = 404; throw e; }
  return prisma.mecanicien.update({ where: { id: parseInt(id) }, data });
};

const remove = async (id) => {
  const m = await prisma.mecanicien.findUnique({ where: { id: parseInt(id) } });
  if (!m) { const e = new Error('Mécanicien introuvable'); e.status = 404; throw e; }

  const enCours = await prisma.intervention.count({
    where: { mecanicienId: parseInt(id), statut: 'EN_COURS' }
  });
  if (enCours > 0) {
    const e = new Error('Impossible : ce mécanicien a des interventions EN_COURS.');
    e.status = 409; throw e;
  }
  return prisma.mecanicien.delete({ where: { id: parseInt(id) } });
};

module.exports = { getAll, getById, create, update, remove };