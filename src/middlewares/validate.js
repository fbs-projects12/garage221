const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: 'Données invalides',
      details: result.error.issues.map((issue) => issue.message),
    });
  }
  next();
};

module.exports = validate;