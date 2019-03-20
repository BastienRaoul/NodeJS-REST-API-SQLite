//Sans modele il restera des problemes
const urlCodePostalTous = 'http://localhost:3000/api/installation/';
const urlActivite = 'http://localhost:3000/api/activite/code_postal/';

$(document).ready(function () {
    let datalist = $(document.createElement('datalist'));
    datalist.attr('id', 'list');
    const ajax = $.ajax({
        url: urlCodePostalTous,
        dataType: 'json',
        cache: true
    });

    ajax.done(function (data) {
        const extract = $.map(data, function (objet) {
            return objet.codePostal;
        });

        let unique = [...new Set(extract)];
        unique = unique.sort();
        for (let codePostal of unique)
            datalist.append(`<option> ${codePostal} </option>`);

        $('#code_postal').attr("list", "list");
        $('#code_postal').change(function () {
            const ajax = $.ajax({
                url: urlActivite + $(this).val(),
                dataType: 'json',
                cache: true
            });
            ajax.done(function (data) {
                const extract = $.map(data, function (objet) {
                    return objet.activiteLibelle;
                });

                let unique = [... new Set(extract)].sort();

                const resultat = $('#resultat').html("");
                for (let activite of unique) {
                    let element = $(`<div> ${activite} </div>`);


                    resultat.append(element);
                    element.click(function () {
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


            })
        });
        ajax.fail(function () {
            console.log("error");
        });
        $('#code_postal').after(datalist);


    });

});