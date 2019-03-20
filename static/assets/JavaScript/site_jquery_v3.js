const urlCodePostal = 'http://localhost:3000/api/installation/code_postal/';
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
                resolve(this.installation);
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
                resolve(this.installation);
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

$(document).ready(function(){


    $('#code_postal').autocomplete({
    source : function(req, resp){
        const ajax = $.ajax({
            url : urlCodePostal+$('#code_postal').val(),
            dataType : 'json',
            cache: true
        });
        ajax.done(function(data){
                const extract =$.map(data, function(objet){
                return objet.codePostal;
                });
                const unique = [... new Set(extract)];
                resp(unique);
        });
        ajax.fail(function(){
            console.log("error");
        });
    },
    minLength: 2,
    select : function(event,ui){
                const ajax = $.ajax({
            url : urlActivite+ui.item.value,
            dataType : 'json',
            cache: true
        });
        ajax.done(function(data){

            const extract = $.map(data,function(objet){
                return objet.activiteLibelle;
            });

            const unique = [... new Set(extract)];
            unique.sort();

            const resultat = $('#resultat').html("");
            for(let activite of unique){
                const element = $(`<div> ${activite} </div>`);
                resultat.append(element);
                element.click(function(){
                    
                })
            }


        });

    }
});

});