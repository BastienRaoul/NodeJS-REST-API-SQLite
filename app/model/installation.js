/**
 * Installation Entity (ES6 Class)
 */

class Installation {
    constructor(noDeLInstallation, nomUsuelDeLInstallation, codePostal, nomDeLaCommune, accessibilite_handicapes_a_mobilite_reduite, accessibilite_handicapes_sensoriels) {
        this.noDeLInstallation= noDeLInstallation;
        this.nomUsuelDeLInstallation = nomUsuelDeLInstallation;
        this.codePostal = codePostal;
        this.nomDeLaCommune =nomDeLaCommune;
        this.accessibilite_handicapes_a_mobilite_reduite = accessibilite_handicapes_a_mobilite_reduite;
        this.accessibilite_handicapes_sensoriels = accessibilite_handicapes_sensoriels;
       // console.log(this);
    }
}

module.exports = Installation;
