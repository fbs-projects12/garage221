const router = require('express').Router();

router.use('/mecaniciens',   require('./mecanicien.routes'));
router.use('/vehicules',     require('./vehicule.routes'));
router.use('/interventions', require('./intervention.routes'));
router.use('/pieces',        require('./piece.routes'));

module.exports = router;
