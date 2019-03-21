const urlCodePostalTous = 'http://localhost:3000/api/installation/';
const urlCodePostalTousActivite = 'http://localhost:3000/api/activite/';
const urlActivite = 'http://localhost:3000/api/activite/code_postal/';

class MonModele {
    /*
    Le constructeur
     */

     //todo: filtres:
    constructor() {
        this.installations = []; //La liste des informations
        this.activites = []; //La liste des avtivite
        this.codePostalSelectionne = null; //Le code postal séléctionné
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

    //on refait pareil que pour installation mais pour activite je pense ??
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

    getNomUsuelInstallationByActiviteLibelle(activiteLibelle) {
        let installations = this.activites.filter(activite => activite.activiteLibelle == activiteLibelle).map(element => element.equipement.installation.nomUsuelDeLInstallation);
        installations = [...new Set(installations)].sort();
        return installations;
    }
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
            search: ''

        }
    },
    created() {
        monModele.getInstallations().then(() => this.codesPostaux = monModele.getCodePostaux());
        monModele.getActivites().then(() => this.activitesLibelles = monModele.getActivitesLibelles());
    },

 //    mounted() {
 //   monModele.selectCodePostal().then(()=> this.activites = monModele.getActivitesLibelles());
 // },

    computed: {
      filteredList() {
        return this.activitesLibelles.filter(res => {
          return res.toLowerCase().includes(this.search.toLowerCase())
        })
      }
    },

    methods: {
        codePostalChanged: function(e){
            monModele.selectCodePostal(this.codePostal).then(()=> this.activitesLibelles = monModele.getActivitesLibelles());
        },
        selectActivite: function(activiteLibelle) {
            this.nomsUsuelsInstallations = monModele.getNomUsuelInstallationByActiviteLibelle(activiteLibelle);
            console.log(this.nomsUsuelsInstallations);
        }

    }


})
