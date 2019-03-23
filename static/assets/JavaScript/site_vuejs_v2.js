const urlCodePostalTous = 'http://localhost:3000/api/installation/';
const urlCodePostalTousActivite = 'http://localhost:3000/api/activite/';
const urlCodePostalTousEquipement = 'http://localhost:3000/api/equipement/';
const urlActivite = 'http://localhost:3000/api/activite/code_postal/';

class MonModele {
    /*
    Le constructeur
     */

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

    selectCodePostal(codePostal, handicap) {
        return new Promise((resolve, reject) => {
            fetch(urlActivite + codePostal).then((response) => {
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

    getActivitesLibellesFromActivitiesList(tmpActivites) {
        return [...new Set(tmpActivites.map(function (element) {

            return element.activiteLibelle;
        }))].sort();
    }

    getNomUsuelInstallationByActiviteLibelle(activiteLibelle, handicapMobilite, handicapSensoriel) {
        let installations = this.applyHandicapOnActivities(this.activites, handicapMobilite, handicapSensoriel)
          .filter(activite => activite.activiteLibelle == activiteLibelle)
          .map(element => element.equipement.installation.nomUsuelDeLInstallation);

        installations = [...new Set(installations)].sort();
        console.log("installation get" + installations);
        return installations;
    }

    applyHandicapOnActivities(activitesList, handicapMobilite, handicapSensoriel){
      let activitiesHandicapMobilite = [];
      let activitiesHandicapSensoriel = [];
      let hasHandicap = false;
      if (handicapMobilite == "Oui"){
        activitiesHandicapMobilite = activitesList.filter(activite => activite.equipement.installation.accessibilite_handicapes_a_mobilite_reduite == handicapMobilite);
        hasHandicap = true;
      }

      if (handicapSensoriel == "Oui"){
        activitiesHandicapSensoriel = activitesList.filter(activite => activite.equipement.installation.accessibilite_handicapes_sensoriels == handicapSensoriel);
        hasHandicap = true;
      }

      if (handicapSensoriel == "Oui" && handicapMobilite == "Oui") {
        let intersection =
            [...activitiesHandicapMobilite].filter(x => activitiesHandicapSensoriel.includes(x));
          return intersection;
      }else if (hasHandicap) {
        return activitiesHandicapMobilite.concat(activitiesHandicapSensoriel);
      }else{
        return activitesList;
      }
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
            search: '',
            carte: '',
            handicapMobilite: "Non",
            handicapSensoriel: "Non",
            dialog: false,
            equipementsDonner: []

        }
    },
    created() {
        monModele.getInstallations().then(() => this.codesPostaux = monModele.getCodePostaux());
        monModele.getActivites().then(() => this.activitesLibelles = monModele.getActivitesLibelles());
    },
    mounted() {
      //On récupère la liste des activités
       monModele.selectCodePostal(this.codePostal).then(()=> this.activitesLibelles = monModele.getActivitesLibelles());
       this.carte = L.map('mapid').setView([47.218371,-1.553621], 11);
       L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
           attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
       }).addTo(carte);
    },

    computed: {
      //permet d'afficher dynamiquement les activite en fontion de la recherche
      filteredList() {
          return this.activitesLibelles.filter(res => {
            return res.toLowerCase().includes(this.search.toLowerCase());
          })
        }
    },

    methods: {
        handicapChanged: function(){
          activites = monModele.applyHandicapOnActivities(monModele.activites, this.handicapMobilite, this.handicapSensoriel);
          this.activitesLibelles = monModele.getActivitesLibellesFromActivitiesList(activites);
        },
        codePostalChanged: function(){
          if(this.codePostal != ""){
            monModele.selectCodePostal(this.codePostal).then((data)=> {
              activites = monModele.applyHandicapOnActivities(monModele.activites, this.handicapMobilite, this.handicapSensoriel);
              this.activitesLibelles = monModele.getActivitesLibellesFromActivitiesList(activites);
            });
          }else{
            monModele.getActivites().then(() => {
              activites = monModele.applyHandicapOnActivities(monModele.activites, this.handicapMobilite, this.handicapSensoriel);
              this.activitesLibelles = monModele.getActivitesLibellesFromActivitiesList(activites);
            });
          }

        },
        selectActivite: function(activiteLibelle) {
            this.nomsUsuelsInstallations = monModele.getNomUsuelInstallationByActiviteLibelle(activiteLibelle, this.handicapMobilite, this.handicapSensoriel);
        }
    }
})
