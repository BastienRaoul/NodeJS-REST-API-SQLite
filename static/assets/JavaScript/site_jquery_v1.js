const urlCodePostalTous = 'http://localhost:3000/api/installation/';
const urlActivite = 'http://localhost:3000/api/activite/code_postal/';

class MonModele {
    constructor(){
        this.installations = []; //Les maps me compliquent les transformations
        this.activites = [];
        this.codePostalSelectionne = null;
    }

    getInstallations(){
        return new Promise((resolve, reject)=>{
            const ajax = $.ajax({
                url: urlCodePostalTous,
                dataType: 'json',
                cache: true
            });
            ajax.done( (data) => {
                this.installations = data;
                resolve(this.installations);
            });
            ajax.fail(function(){
                this.installations = [];
                this.codePostalSelectionne = null;
                reject(this.installation);
            });
        });



    }

    getCodePostaux(){
        return [... new Set(this.installations.map(element => element.codePostal))].sort();
    }

    selectCodePostal(codePstal){
        return new Promise((resolve, rect)=>{
            const ajax = $.ajax({
                url: urlActivite + codePstal,
                dataType: 'json',
                cache: true
            });
            ajax.done( (data) => {
                this.activites = data;
                resolve(this.activites);
            });
            ajax.fail(function(){
                this.activites = [];
                this.activiteSelectionnee = null;
                reject(this.installation);
            });
        })
    }

    getActivitesLibelles(){
        return [... new Set(this.activites.map( function (element) {
            return element.activiteLibelle;
        }))].sort();
    }

    getNomUsuelInstallationByActiviteLibelle(activiteLibelle){
        let installations = this.activites.filter(activite => activite.activiteLibelle == activiteLibelle).
        map(element => element.equipement.installation.nomUsuelDeLInstallation);
        installations = [... new Set(installations)].sort();
        return installations;
    }
}

$(document).ready(function () {
    const monModele = new MonModele();


    /*
    //Test du modele
    monModele.getInstallations().
        then(() =>{
            monModele.getCodePostaux()}).
        then(()=> monModele.selectCodePostal('44170')).
        then(()=> console.log(monModele.getNomUsuelInstallationByActiviteLibelle('Activités de forme et de santé')));

    */

    const codePostalElement =  $('#code_postal');
    const  resultatElement = $('#resultat');
    const infoElement = $('#info');

    let datalist = $(document.createElement('datalist'));
    datalist.attr('id', 'list');
    const codePostalPromesse = monModele.getInstallations();
    codePostalPromesse.
    then(()=> {
        for (let codePostal of monModele.getCodePostaux())
            datalist.append(`<option> ${codePostal} </option>`);
        codePostalElement.attr("list", "list");
        codePostalElement.change(function (){
            monModele.selectCodePostal($(this).val()).
                then(()=>{
                resultatElement.html("");
                infoElement.html("");
                for (let activite of monModele.getActivitesLibelles()) {
                    let element = $(`<div> ${activite} </div>`);
                    element.click(function(){
                        const activiteLibelle = $(this).text().trim();
                        const nomsUsuels = monModele.getNomUsuelInstallationByActiviteLibelle(activiteLibelle);
                        infoElement.html("");
                        for(let nom of nomsUsuels)
                              infoElement.append(`<p> ${nom} </p>`);
                    });
                    resultatElement.append(element);
                }
            });
        });
        codePostalElement.after(datalist);
    });
});