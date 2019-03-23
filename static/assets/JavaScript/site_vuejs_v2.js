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

    // getEquipements() {
    //     return new Promise((resolve, reject) => {
    //         fetch(urlCodePostalTousEquipement).then((response) => {
    //             return response.json();
    //         })
    //             .then((data) => {
    //                 this.equipements = data;
    //                 resolve(this.equipements)
    //             }).catch(() => {
    //             this.equipements = [];
    //             this.codePostalSelectionne = null;
    //             reject(this.installation);
    //         });
    //     });
    // }

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
            dialog: false,
            carte: '',
            checked: false,
            equipementsDonner: []

        }
    },
    created() {
        monModele.getInstallations().then(() => this.codesPostaux = monModele.getCodePostaux());
        monModele.getActivites().then(() => this.activitesLibelles = monModele.getActivitesLibelles());
        //monModele.getEquipements().then(() => this.equipementsDonner = monModele.getEquipementsDonner());
    },

 //    mounted() {
 //   monModele.selectCodePostal().then(()=> this.activites = monModele.getActivitesLibelles());
 // },

/*    mounted() {
       //On récupère la liste des activités
       monModele.selectCodesPostaux(this.handicap).then(()=> this.activites = monModele.getActivitesLibelles());
       //On initialise la carte
       this.carte = L.map('macarte').setView([47.218371,-1.553621], 11);
       L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
         attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
       }).addTo(this.carte);
       //On initialise le groupe de markers
       this.markers = L.layerGroup();
       monModele.selectCodePostal(this.codePostal).then(()=> this.activitesLibelles = monModele.getActivitesLibelles());
       this.carte = L.map('mapid').setView([47.218371,-1.553621], 11);
       L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
           attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
       }).addTo(carte);
       this.markers = L.layerGroup();
    },*/

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
        }
        // selectInstallation: function(nomUsuelInstallation) {
        //     this.equipementsDonner = monModele.getEquipementBynomUsuelsInstallation(nomUsuelInstallation);
        //     console.log(this.equipementsDonner);
        // }
    }
})

/* MAP */
//Initialisation de la carte avec les coordonnées du centre de la carte avec le zoom de la carte
  var carte = L.map('mapid').setView([47.218371,-1.553621], 11);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(carte);
/*
    //***********************Inserer un marqueur**************************************************

    // insérer un marker avec les coordonnées GPS du lieu
    var marker = L.marker([47.2234, -1.54547]).addTo(carte);
    // dans notre cas peut etre utilisé un circle marker avec les coordonnées GPS du lieu et le nombre de pixel du lieu
    //var marker = L.circleMarker([47.2234, -1.54547], 210000).addTo(carte);

    //************************Inserer une forme***************************************************
    //insérer un cercle d'influence avec les coordonnées et le rayon du cercle (en m)
    var influence = L.circle([47.2234, -1.54547], 5000).addTo(carte);

    //************************supprimer un élément*************************************************
    //cette commande sert à supprimer un élément sur la carte
    carte.removeLayer(influence);
 
//-----------------------------------------------------------------
 
// Cette petite méthode va permettre de générer un bulle d'information associer à un Marqueur
      marker.bindPopup('Salut'); // On associe un popup à un marker dans lequel on peut écrire un message par défaut en html
      var mapopup = marker.getPopup();// on la popup pour ensuite la manipuler
      mapopup.setContent('Salut, ça va ?');// on associe un message à la popup
      marker.openPopup();// cette commande permet d'ouvrir la popup dès l'affichage du marqueur
 
//-----------------------------------------------------------------
 
//Cette petite methode va nous permettre de déplacer un marker
//création d'un marker avec l'option draggable pour le déplacer et le bindPopup("") pour lui associé une popup
var marker2 = L.marker([47.2234, -1.600], {draggable:'true'}).bindPopup("").addTo(carte);
 
marker2.on('dragend', relachement);
 
function relachement(e) {
    marker2.getPopup().setContent(''+marker2.getLatLng());//ceci va permettre d'afficher les nouvelles coordonnées du marker
    marker2.openPopup();//permet de l'afficher dès le marker posé
}
//-----------------------------------------------------------------
 
// Les markers cluster Groups
 // Notre cluster
      var markers = L.markerClusterGroup();
      // Nos marqueurs
            var marker1 = L.marker([47.2434, -1.53547]);
      var marker2 = L.marker([47.2464, -1.53547]);
      var marker3 = L.marker([47.2494, -1.53547]);
      var marker4 = L.marker([47.2434, -1.53747]);
      var marker5 = L.marker([47.2434, -1.53947]);
 
      // On ajoute les marqueurs au cluster
      markers.addLayer(marker1);
      markers.addLayer(marker2);
      markers.addLayer(marker3);
      markers.addLayer(marker4);
      markers.addLayer(marker5);
 
      // On affiche le cluster
      carte.addLayer(markers);
      //-----------------------------------------------------------------*/