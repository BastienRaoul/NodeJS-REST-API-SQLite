/* Load Modules */
const express = require('express');
const router = express.Router();

/* Load controller */
const ActiviteController = require('../../controller/activiteController');
const activiteController = new ActiviteController();

/**
 * Activite Entity routes
 */

router.get('/', function (req, res) {
   activiteController.findAll(res);
});

router.get('/code_postal/:code_postal', function (req, res) {
    activiteController.findByCodePostal(req,res);
});

router.get('/accessibilite_handicapes_a_mobilite_reduite/:accessibilite_handicapes_a_mobilite_reduite', function (req, res) {
    activiteController.findByHandicap(req,res);
});




module.exports = router;
