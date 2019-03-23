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

    //on refait pareil que pour installation mais pour activite, ce qui permet de récupérer les activités
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
    // Gère la recheche avec la gestion des handicaps
    applyHandicapOnActivities(activitesList, handicapMobilite, handicapSensoriel){
      let activitiesHandicapMobilite = []; // tableau pour mobilité
      let activitiesHandicapSensoriel = []; // tableau pour Sensoriel
      let hasHandicap = false;

      //Si handicapMobilite = Oui alors on affecte au tableau activitiesHandicapMobilite toutes les activités qui ont des installations correspondant
      if (handicapMobilite == "Oui"){
        activitiesHandicapMobilite = activitesList.filter(activite => activite.equipement.installation.accessibilite_handicapes_a_mobilite_reduite == handicapMobilite);
        hasHandicap = true;
      }
      //Si handicapSensoriel = Oui alors on affecte au tableau activitiesHandicapSensoriel toutes les activités qui ont des installations correspondant
      if (handicapSensoriel == "Oui"){
        activitiesHandicapSensoriel = activitesList.filter(activite => activite.equipement.installation.accessibilite_handicapes_sensoriels == handicapSensoriel);
        hasHandicap = true;
      }

      // Si les deux sont vrai on fait une intersection
      if (handicapSensoriel == "Oui" && handicapMobilite == "Oui") {
        let intersection =
            [...activitiesHandicapMobilite].filter(x => activitiesHandicapSensoriel.includes(x));
          return intersection;
        //sinon on fait concatène les deux tableaux
      }else if (hasHandicap) {
        return activitiesHandicapMobilite.concat(activitiesHandicapSensoriel);
        //si aucun des cas précedent est vrai on affiche les acivités sans modification
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
            handicapMobilite: "Non", // valeur de la checkbox
            handicapSensoriel: "Non",  // valeur de la checkbox
            dialog: false,
            equipementsDonner: []

        }
    },
    created() {
        // on récupère les codesPostaux et les activités
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
      //permet d'afficher dynamiquement les activite en fontion de la recherche faites par la personne
      filteredList() {
          return this.activitesLibelles.filter(res => {
            return res.toLowerCase().includes(this.search.toLowerCase());
          })
        }
    },

    methods: {
        //Quand on appui sur une des deux checkbox pour les handicapés
        handicapChanged: function(){
          activites = monModele.applyHandicapOnActivities(monModele.activites, this.handicapMobilite, this.handicapSensoriel);
          this.activitesLibelles = monModele.getActivitesLibellesFromActivitiesList(activites);
        },
        //Quand le code postal est changé
        codePostalChanged: function(){
          //Si le code postal n'est pas vide on cherche les acivités
          if(this.codePostal != ""){
            // on attend la réponse de la promesse et on met a jour la liste d'activités par rapport au code Postal
            // puis des handicap
            monModele.selectCodePostal(this.codePostal).then((data)=> {
              activites = monModele.applyHandicapOnActivities(monModele.activites, this.handicapMobilite, this.handicapSensoriel);
              this.activitesLibelles = monModele.getActivitesLibellesFromActivitiesList(activites);
            });
          }else{
            // on attend la réponse de la promesse
            monModele.getActivites().then(() => {
              activites = monModele.applyHandicapOnActivities(monModele.activites, this.handicapMobilite, this.handicapSensoriel);
              this.activitesLibelles = monModele.getActivitesLibellesFromActivitiesList(activites);
            });
          }

        },
        selectActivite: function(activiteLibelle) {
            // Quand un clique est fait sur une activité on affiche les installation de celle-ci
            this.nomsUsuelsInstallations = monModele.getNomUsuelInstallationByActiviteLibelle(activiteLibelle, this.handicapMobilite, this.handicapSensoriel);
        }
    }
})
