const service = require('../services/intervention.service');

const getAll = async (req, res, next) => {
  try { res.json(await service.getAll()); } catch(e){ next(e); }
};

const getById = async (req, res, next) => {
  try {
    const i = await service.getById(req.params.id);
    if (!i) return res.status(404).json({ message: 'Intervention introuvable' });
    res.json(i);
  } catch(e){ next(e); }
};

const create = async (req, res, next) => {
  try { res.status(201).json(await service.create(req.body)); } catch(e){ next(e); }
};

const update = async (req, res, next) => {
  try { res.json(await service.update(req.params.id, req.body)); } catch(e){ next(e); }
};

const remove = async (req, res, next) => {
  try { await service.remove(req.params.id); res.status(204).send(); } catch(e){ next(e); }
};

module.exports = { getAll, getById, create, update, remove };