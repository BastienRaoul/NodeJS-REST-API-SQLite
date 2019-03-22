const urlCodePostalTous = 'http://localhost:3000/api/installation/';
const urlCodePostalTousActivite = 'http://localhost:3000/api/activite/';
const urlCodePostalTousEquipement = 'http://localhost:3000/api/equipement/';
const urlActivite = 'http://localhost:3000/api/activite/code_postal/';

class MonModele {
    /*
    Le constructeur
     */

     //todo: filtres:
    constructor() {
        this.installations = []; //La liste des informations
        this.activites = []; //La liste des avtivite
        this.equipements = []; // liste equipement
        this.codePostalSelectionne = null; //Le code postal séléctionné
    }

    getEquipements() {
        return new Promise((resolve, reject) => {
            fetch(urlCodePostalTousEquipement).then((response) => {
                return response.json();
            })
                .then((data) => {
                    this.equipements = data;
                    resolve(this.equipements)
                }).catch(() => {
                this.equipements = [];
                this.codePostalSelectionne = null;
                reject(this.installation);
            });
        });
    }

    getInstallations() {
        return new Promise((resolve, reject) => {
            fetch(urlCodePostalTous).then((response) => {
                return response.json();
            })
                .then((data) => {
                    this.installations = data;
                    resolve(this.installations)
                }).catch(() => {
                this.installations = [];
                this.codePostalSelectionne = null;
                reject(this.installation);
            });
        });
    }

    //on refait pareil que pour installation mais pour activite
    getActivites() {
        return new Promise((resolve, reject) => {
            fetch(urlCodePostalTousActivite).then((response) => {
                return response.json();
            })
                .then((data) => {
                    this.activites = data;
                    resolve(this.activites)
                }).catch(() => {
                this.activites = [];
                this.codePostalSelectionne = null;
                reject(this.installation);
            });
        });
    }

    getCodePostaux() {
        return [...new Set(this.installations.map(element => element.codePostal))].sort();
    }
    getCodePostauxActivite() {
        return [...new Set(this.activites.map(element => element.codePostal))].sort();
    }

    selectCodePostal(codePstal) {
        return new Promise((resolve, reject) => {
            fetch(urlActivite + codePstal).then((response) => {
                return response.json();
            })
                .then((data) => {
                    this.activites = data;
                    resolve(this.activites);
                }).catch(() => {
                this.activites = [];
                this.activiteSelectionnee = null;
                resolve(this.installation);
            });
        });
    }

    getActivitesLibelles() {
        return [...new Set(this.activites.map(function (element) {
            return element.activiteLibelle;
        }))].sort();
    }

    getEquipementsDonner() {
        return [...new Set(this.equipements.map(function (element) {
            return element.equipement;
        }))].sort();
    }

    getNomUsuelInstallationByActiviteLibelle(activiteLibelle) {
        let installations = this.activites.filter(activite => activite.activiteLibelle == activiteLibelle).map(element => element.equipement.installation.nomUsuelDeLInstallation);
        installations = [...new Set(installations)].sort();
        console.log("installation get" + installations);
        return installations;
    }
    getNomUsuelInstallationByActiviteLibelleHandicap(activiteLibelle) {
        let installations = this.activites.filter(activite => activite.activiteLibelle == activiteLibelle).map(element => element.equipement.installation.accessibilite_handicapes_a_mobilite_reduite);
        installations = [...new Set(installations)].sort();
        console.log("installation get" + installations);
        return installations;
    }
    // getEquipementBynomUsuelsInstallation(nomUsuelInstallation) {
    //     let equipements = this.installations.filter(installation => installation.nomUsuelDeInstallation == nomUsuelInstallation).map(element => element.equipement.installation);
    //     equipements = [...new Set(equipements)].sort();
    //     console.log("equipement get" + equipements);
    //     return equipements;
    // }
}
const monModele = new MonModele();
const app = new Vue({
    el: '#app',
    data() {
        return {
            codePostal: '',
            codesPostaux: [],
            activitesLibelles: [],
            nomsUsuelsInstallations: [],
            search: '',
            checked: false,
            equipementsDonner: []

        }
    },
    created() {
        monModele.getInstallations().then(() => this.codesPostaux = monModele.getCodePostaux());
        monModele.getActivites().then(() => this.activitesLibelles = monModele.getActivitesLibelles());
        monModele.getEquipements().then(() => this.equipementsDonner = monModele.getEquipementsDonner());
    },

    computed: {
      //permet d'afficher dynamiquement les activite en fontion de la recherche
      filteredList() {
        if (this.checked) {
          return this.activitesLibelles.filter(res => {
            return res.toLowerCase().includes(this.search.toLowerCase());
        })
      } else {
          return this.activitesLibelles.filter(res => {
            return res.toLowerCase().includes(this.search.toLowerCase());
          })
        }
      }
    },

    methods: {
        codePostalChanged: function(e){
            monModele.selectCodePostal(this.codePostal).then(()=> this.activitesLibelles = monModele.getActivitesLibelles());
        },
        selectActivite: function(activiteLibelle) {
            this.nomsUsuelsInstallations = monModele.getNomUsuelInstallationByActiviteLibelle(activiteLibelle);
            console.log(this.nomsUsuelsInstallations);
        },
        selectInstallation: function(nomUsuelInstallation) {
            this.equipementsDonner = monModele.getEquipementBynomUsuelsInstallation(nomUsuelInstallation);
            console.log(this.equipementsDonner);
        }

    }


})
