var doc = new jsPDF();
let checkInData;

fetch('https://jptdnmemfnftsbhyxnjw.supabase.co/rest/v1/volcanochill?select=*', {
    method: 'GET',
    headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwdGRubWVtZm5mdHNiaHl4bmp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk3NjQ2ODEsImV4cCI6MjAyNTM0MDY4MX0.pRahtxTbiVpNAo5esJsD4Kh3cKKaD-0GiC71pXuSglo',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwdGRubWVtZm5mdHNiaHl4bmp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk3NjQ2ODEsImV4cCI6MjAyNTM0MDY4MX0.pRahtxTbiVpNAo5esJsD4Kh3cKKaD-0GiC71pXuSglo'
    }
})
    .then(response => response.json())
    .then(data => {
        checkInData = data
        showData();
    })
    .catch(error => console.error('Error:', error));


function showData() {

    checkIn = "";
    lenguage = document.documentElement.lang;

    if (lenguage == "en") {

        checkIn = '<span class="heading-4-v2">Hello ' + checkInData[0].guest + '</span><p>Thank you for booking our property. Below you will find a table with the necessary codes to access.<div id="dataPrint"></p><h4 class="vct">Volcanochill Codes</h4><section class="section section-lg bg-default text-center"><div class="container"><div class="table-custom-responsive"><table class="table-custom table-custom-striped table-custom-primary"><thead><tr><th><span class="l-header">Check In</span>' +
            checkInData[0].check_in + '</th><th><span class="l-header">Check Out</span>' + checkInData[0].check_out + '</th></tr></thead><tbody><tr><td>Main Door</td><td>' + checkInData[0].main_door + '</td></tr><tr><td>Cabin #1</td><td>' + checkInData[0].cab_one + '</td></tr><tr><td>Cabin #2</td><td>' + checkInData[0].cab_two + '</td></tr><tr><td>Cabin #3</td><td>' + checkInData[0].cab_three + '</td></tr>' +
            '</tbody></table></div></div></section><h5>Wifi: volcanochillCR <br> Pass: poasvolcano</h5></div><div class="form-wrap form-wrap-button"><button class="button button-lg button-primary button-full-width" id="saveData">Download Codes</button></div>';
    }
    else {

        checkIn = '<span class="heading-4-v2">Hola ' + checkInData[0].guest + '</span><p>Gracias por reservar nuestra propiedad, a cotinuacion encontrara una tabla con los codigos necesarios para hacer su ingreso.<div id="dataPrint"></p><h4 class="vct">Codigos Volcanochill</h4><section class="section section-lg bg-default text-center"><div class="container"><div class="table-custom-responsive"><table class="table-custom table-custom-striped table-custom-primary"><thead><tr><th><span class="l-header">Check In</span>' +
            checkInData[0].check_in + '</th><th><span class="l-header">Check Out</span>' + checkInData[0].check_out + '</th></tr></thead><tbody><tr><td>Principal</td><td>' + checkInData[0].main_door + '</td></tr><tr><td>Cabaña #1</td><td>' + checkInData[0].cab_one + '</td></tr><tr><td>Cabaña #2</td><td>' + checkInData[0].cab_two + '</td></tr><tr><td>Cabaña #3</td><td>' + checkInData[0].cab_three + '</td></tr>' +
            '</tbody></table></div></div></section><h5>Wifi: volcanochillCR <br> Pass: poasvolcano</h5></div><div class="form-wrap form-wrap-button"><button class="button button-lg button-primary button-full-width" id="saveData">Download Codes</button></div>';
    }

    //Revisar el Pass para mostrar las contrasenas
    $("#checkCode").click(function () {
        userCodeWeb = $("#reservation-code").val().toLowerCase();
        codeReserva = checkInData[0].reservation_code.toLowerCase();

        if (userCodeWeb == codeReserva) {
            $("#check-in-code").css("display", "none");
            document.getElementById('check-in-user').innerHTML = checkIn;
            $("#saveData").on('click', function () {

                // saveDiv('dataPrint', 'volcanochill checkin');
                document.getElementById('dataPrint').scrollIntoView({
                    behavior: 'smooth', // Para un desplazamiento suave
                    block: 'end' // Para asegurarse de que el elemento esté en la parte inferior de la ventana
                });

                // Esperar hasta que se complete el desplazamiento
                setTimeout(function () {
                    html2canvas(document.querySelector('#dataPrint'), {
                        onrendered: function (canvas) {
                            return Canvas2Image.saveAsJPEG(canvas, null, null, 'volcanochill');
                        }
                    });
                }, 1000); // Espera 1 segundo (puedes ajustar el tiempo según sea necesario)
            });
        }

        else {
            $("#reservation-code").css("border", "solid 2px red");
            if (lenguage == "en"){
                $("#errorMsg").text("Use a valid reservation code.")
            } else {
                $("#errorMsg").text("Usa un codigo valido.")
            };
        };
    });

    return checkIn;
}

// Descargar Datos en PDF
// function saveDiv(divId, title) {
//     doc.fromHTML(`<html><head><title>${title}</title></head><body>` + document.getElementById(divId).innerHTML + `</body></html>`);
//     doc.save('div.pdf');
// }
