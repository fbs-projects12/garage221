const { PrismaClientKnownRequestError, PrismaClientValidationError } = require('@prisma/client/runtime/library');

const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err instanceof PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const field = err.meta?.target?.[0];
      const model = err.meta?.modelName;
      let message = 'Valeur déjà existante.';

      if (model === 'Mecanicien') {
        if (field === 'email') message = "L'email est déjà utilisé pour ce mécanicien.";
        else if (field === 'telephone') message = 'Le téléphone est déjà utilisé pour ce mécanicien.';
      } else if (model === 'Vehicule') {
        if (field === 'immatriculation') message = "L'immatriculation est déjà utilisée pour ce véhicule.";
        else if (field === 'telProprietaire') message = 'Le téléphone du propriétaire est déjà utilisé pour ce véhicule.';
      } else if (model === 'Intervention') {
        message = 'Une valeur est déjà existante pour cette intervention.';
      }

      return res.status(409).json({ message });
    }
    if (err.code === 'P2025') {
      return res.status(404).json({ message: 'Ressource introuvable.' });
    }
    return res.status(400).json({ message: err.message });
  }

  if (err instanceof PrismaClientValidationError) {
    return res.status(400).json({ message: `Données invalides : ${err.message}` });
  }

  if (err.status) {
    return res.status(err.status).json({ message: err.message });
  }

  res.status(500).json({ message: 'Erreur serveur interne.' });
};

module.exports = errorHandler;