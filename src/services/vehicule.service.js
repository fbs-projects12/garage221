const { prisma } = require('../models');

const getAll  = () => prisma.vehicule.findMany();
const getById = (id) => prisma.vehicule.findUnique({ where: { id: parseInt(id) } });

const create  = async (data) => {
  const existingImmat = await prisma.vehicule.findUnique({ where: { immatriculation: data.immatriculation } });
  if (existingImmat) {
    const e = new Error("L'immatriculation est déjà utilisée pour ce véhicule.");
    e.status = 409; throw e;
  }

  if (data.telProprietaire) {
    const existingTelephone = await prisma.vehicule.findFirst({ where: { telProprietaire: data.telProprietaire } });
    if (existingTelephone) {
      const e = new Error('Le téléphone du propriétaire est déjà utilisé pour ce véhicule.');
      e.status = 409; throw e;
    }
  }

  return prisma.vehicule.create({ data });
};

const update = async (id, data) => {
  const v = await prisma.vehicule.findUnique({ where: { id: parseInt(id) } });
  if (!v) { const e = new Error('Véhicule introuvable'); e.status = 404; throw e; }

  if (data.immatriculation) {
    const existingImmat = await prisma.vehicule.findFirst({
      where: { immatriculation: data.immatriculation, NOT: { id: parseInt(id) } },
    });
    if (existingImmat) {
      const e = new Error("L'immatriculation est déjà utilisée pour ce véhicule.");
      e.status = 409; throw e;
    }
  }

  if (data.telProprietaire) {
    const existingTelephone = await prisma.vehicule.findFirst({
      where: { telProprietaire: data.telProprietaire, NOT: { id: parseInt(id) } },
    });
    if (existingTelephone) {
      const e = new Error('Le téléphone du propriétaire est déjà utilisé pour ce véhicule.');
      e.status = 409; throw e;
    }
  }

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