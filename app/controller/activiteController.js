/* Load Car Data Access Object */
const ActiviteDao = require('../dao/activiteDao');

/* Load Controller Common function */
const ControllerCommon = require('./common/controllerCommon');

/**
 * Activite Controller
 */
class ActiviteController {

    constructor() {
        this.activiteDao = new ActiviteDao();
        this.common = new ControllerCommon();
    }

    /**
     * Finds all entities.
     * @return all entities
     */
     findByHandicap(req,res){
         const accessibilite_handicapes_a_mobilite_reduite = req.params.accessibilite_handicapes_a_mobilite_reduite;
         this.activiteDao.findByHandicap(accessibilite_handicapes_a_mobilite_reduite)
             .then(this.common.findSuccess(res))
             .catch(this.common.findError(res));
     }

    findAll(res) {
            this.activiteDao.findAll()
            .then(this.common.findSuccess(res))
            .catch(this.common.findError(res));
    };

    findByCodePostal(req,res){
        const codePostal = req.params.code_postal;
        this.activiteDao.findByCodePostal(codePostal)
            .then(this.common.findSuccess(res))
            .catch(this.common.findError(res));
    }

}

module.exports = ActiviteController;
