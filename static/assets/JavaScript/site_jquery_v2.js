const urlCodePostal = 'http://localhost:3000/api/installation/code_postal/';
const urlActivite = 'http://localhost:3000/api/activite/code_postal/';

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
                    const activiteLibelle = $(this).text().trim();
                    const ajax = $.ajax({
                        url: urlActivite + $('#code_postal').val(),
                        dataType: 'json',
                        cache: true
                    });
                    ajax.done(function (data) {
                        console.log(data);
                        let installations = data.filter(activite => activite.activiteLibelle == activiteLibelle).
                        map(element => element.equipement.installation.nomUsuelDeLInstallation);
                        installations = installations.sort();
                        installations = [... new Set(installations)];
                        $('#info').html('');
                        for(let installation of installations)
                            $('#info').append(`<p> ${installation}
                                </p>`);

                    })
                })
            }


        });

    }
});

});