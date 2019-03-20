const urlCodePostalTous = 'http://localhost:3000/api/installation/';
const urlActivite = 'http://localhost:3000/api/activite/code_postal/';

class MonModele {
    constructor() {
        this.installations = []; //Les maps me compliquent les transformations
        this.activites = [];
        this.codePostalSelectionne = null;
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

    getCodePostaux() {
        return [...new Set(this.installations.map(element => element.codePostal))].sort();
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

    getNomUsuelInstallationByActiviteLibelle(activiteLibelle) {
        let installations = this.activites.filter(activite => activite.activiteLibelle == activiteLibelle).map(element => element.equipement.installation.nomUsuelDeLInstallation);
        installations = [...new Set(installations)].sort();
        return installations;
    }
}

const app = new Vue({
    el: '#app',
    data() {
        return {
            codePostal: '',
            codesPostaux: []

        }
    },
    created() {
        const monModele = new MonModele();
        monModele.getInstallations().then(() => this.codesPostaux = monModele.getCodePostaux());
    },
    methods: {
        codePostalChanged: function(e){
            console.log(this.codePostal);
        }
    }
})