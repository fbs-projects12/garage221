const { prisma } = require('../models');

const getAll  = () => prisma.vehicule.findMany();
const getById = (id) => prisma.vehicule.findUnique({ where: { id: parseInt(id) } });
const create  = (data) => prisma.vehicule.create({ data });

const update = async (id, data) => {
  const v = await prisma.vehicule.findUnique({ where: { id: parseInt(id) } });
  if (!v) { const e = new Error('Véhicule introuvable'); e.status = 404; throw e; }
  return prisma.vehicule.update({ where: { id: parseInt(id) }, data });
};

const remove = async (id) => {
  const v = await prisma.vehicule.findUnique({ where: { id: parseInt(id) } });
  if (!v) { const e = new Error('Véhicule introuvable'); e.status = 404; throw e; }

  const count = await prisma.intervention.count({ where: { vehiculeId: parseInt(id) } });
  if (count > 0) {
    const e = new Error('Impossible : ce véhicule possède des interventions liées.');
    e.status = 409; throw e;
  }
  return prisma.vehicule.delete({ where: { id: parseInt(id) } });
};

module.exports = { getAll, getById, create, update, remove };