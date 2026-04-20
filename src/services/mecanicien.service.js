const { prisma } = require('../models');

const getAll  = () => prisma.mecanicien.findMany();
const getById = (id) => prisma.mecanicien.findUnique({ where: { id: parseInt(id) } });

const create  = async (data) => {
  const existingEmail = await prisma.mecanicien.findUnique({ where: { email: data.email } });
  if (existingEmail) {
    const e = new Error("L'email est déjà utilisé pour ce mécanicien.");
    e.status = 409; throw e;
  }

  if (data.telephone) {
    const existingTelephone = await prisma.mecanicien.findFirst({ where: { telephone: data.telephone } });
    if (existingTelephone) {
      const e = new Error('Le téléphone est déjà utilisé pour ce mécanicien.');
      e.status = 409; throw e;
    }
  }

  return prisma.mecanicien.create({ data });
};

const update = async (id, data) => {
  const m = await prisma.mecanicien.findUnique({ where: { id: parseInt(id) } });
  if (!m) { const e = new Error('Mécanicien introuvable'); e.status = 404; throw e; }

  if (data.email) {
    const existingEmail = await prisma.mecanicien.findFirst({
      where: { email: data.email, NOT: { id: parseInt(id) } },
    });
    if (existingEmail) {
      const e = new Error("L'email est déjà utilisé pour ce mécanicien.");
      e.status = 409; throw e;
    }
  }

  if (data.telephone) {
    const existingTelephone = await prisma.mecanicien.findFirst({
      where: { telephone: data.telephone, NOT: { id: parseInt(id) } },
    });
    if (existingTelephone) {
      const e = new Error('Le téléphone est déjà utilisé pour ce mécanicien.');
      e.status = 409; throw e;
    }
  }

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