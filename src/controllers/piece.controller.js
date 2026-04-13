const service = require('../services/piece.service');

const getByIntervention = async (req, res, next) => {
  try {
    const pieces = await service.getByIntervention(req.query.interventionId);
    res.json(pieces);
  } catch(e){ next(e); }
};

const create = async (req, res, next) => {
  try { res.status(201).json(await service.create(req.body)); } catch(e){ next(e); }
};

const remove = async (req, res, next) => {
  try { await service.remove(req.params.id); res.status(204).send(); } catch(e){ next(e); }
};

const coutTotal = async (req, res, next) => {
  try {
    const total = await service.coutTotal(req.params.interventionId);
    res.json({ interventionId: req.params.interventionId, coutTotalPieces: total });
  } catch(e){ next(e); }
};

module.exports = { getByIntervention, create, remove, coutTotal };