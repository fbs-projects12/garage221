const { PrismaClientKnownRequestError } = require('@prisma/client/runtime/library');

const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err instanceof PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(409).json({ message: 'Valeur déjà existante (doublon).' });
    }
    if (err.code === 'P2025') {
      return res.status(404).json({ message: 'Ressource introuvable.' });
    }
    return res.status(400).json({ message: err.message });
  }
  if (err.status) {
    return res.status(err.status).json({ message: err.message });
  }

  res.status(500).json({ message: 'Erreur serveur interne.' });
};

module.exports = errorHandler;