

//Initialisation de la carte avec les coordonnées du centre de la carte avec le zoom de la carte
/*	var carte = L.map('mapid').setView([47.218371,-1.553621], 11);
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(carte);*/
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

	//************************Un peu plus d'interactivité*************************************************
 
//Cette petite méthode sert à placer un Marqueur au click de la souris
      carte.on('click', placerMarqueur);
 
function placerMarqueur(e) {
    marker.setLatLng(e.latlng);
};
 
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