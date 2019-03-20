//Sans modele il restera des problemes
const url = 'http://localhost:3000/api/test/test1';

$(document).ready(function () {

    const ajax = $.ajax({
        url: url,
        dataType: 'json',
        cache: true
    });

    ajax.done(function (data) {
        console.log(data);
        const selectElement = $('div#display select');
        for(let nom of data.noms){
            selectElement.append(`<option> ${nom} </option> `);
        }
        });



});