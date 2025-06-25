/*
  Autores: Octavio Sosa (363131) - Alan Klein(358518)
*/

window.addEventListener("load", inicio);

let sistema = new Sistema();

function inicio() {

    document.getElementById("datos").addEventListener("click", mostrarSeccion);
    document.getElementById("estadisticas").addEventListener("click", mostrarSeccion);
    document.getElementById("btnAgregarC").addEventListener("click", agregarCarrera);
    document.getElementById("btnAgregarP").addEventListener("click", agregarPatrocinador);
    document.getElementById("btnAgregarCorr").addEventListener("click", agregarCorredor);
    document.getElementById("btnInscribir").addEventListener("click", agregarInscripcion);
    document.getElementById("radNomCorr").addEventListener("click", tableConsultaInsc);
    document.getElementById("radNumCorr").addEventListener("click", tableConsultaInsc);
    document.getElementById("consultaCarrera").addEventListener("click", tableConsultaInsc);
    document.getElementById("carrRadio").addEventListener("change", drawRegionsMap);
    document.getElementById("inscripRadio").addEventListener("change", drawRegionsMap);


    document.getElementById("sectionEstadisticas").style.display = "none";
    document.getElementById("sectionDatos").style.display = "block";


    // Hace que el txtbox cedula de corredor solo permita numeros y no letras 

    document.getElementById("compCed").addEventListener("input", function () { this.value = this.value.replace(/[^0-9]/g, ''); });

    datosGenerales();
}

function mostrarSeccion(event) {

    if (event.target.id === "datos") {

        document.getElementById("sectionEstadisticas").style.display = "none";
        document.getElementById("sectionDatos").style.display = "block";

        document.getElementById("estadisticas").classList.remove("botonSeleccionado");
        document.getElementById("estadisticas").classList.add("ver");


        document.getElementById("datos").classList.remove("ver");
        document.getElementById("datos").classList.add("botonSeleccionado");

    } else {

        document.getElementById("sectionDatos").style.display = "none";
        document.getElementById("sectionEstadisticas").style.display = "block";

        document.getElementById("datos").classList.remove("botonSeleccionado");
        document.getElementById("datos").classList.add("ver");


        document.getElementById("estadisticas").classList.remove("ver");
        document.getElementById("estadisticas").classList.add("botonSeleccionado");

        datosGenerales();
        selectConsultaInscriptos();
        tableConsultaInsc();
        drawRegionsMap();
    }

}

function agregarCarrera(event) {

    event.preventDefault();

    if (document.getElementById("formCarreras").reportValidity()) {

        let nombre = document.getElementById("nomTxt").value;
        let depto = document.getElementById("selectDep").options[document.getElementById("selectDep").selectedIndex].text;

        let fecha = document.getElementById("FechaCarr").value;
        let cupo = parseInt(document.getElementById("CupoCarr").value);


        if (sistema.carreraExiste(nombre)) {
            alert("Esta carrera ya existe, pongale otro nombre");
        }
        else {
            let carr = new Carrera(nombre, depto, fecha, cupo);
            sistema.agregarCarrera(carr);
            document.getElementById("formCarreras").reset();

            mostrarSelect();
            datosInsc();
            drawRegionsMap();
        }
    }

}

function mostrarSelect() {

    let select = document.getElementById("carreraSelect");
    select.innerHTML = "";
    let carr = sistema.mostrarCarreras();

    for (let i = 0; i < carr.length; i++) {
        let nodo = document.createElement("option");
        nodo.innerHTML = carr[i].nombre;
        select.appendChild(nodo);
    }
}

// Muestra los corredores y carreras en la seccion inscripciones en los select con inner.HTML

function datosInsc() {

    let selectCorr = document.getElementById("nomCorredores");
    let selectCarr = document.getElementById("nomCarreras");

    selectCorr.innerHTML = "";
    selectCarr.innerHTML = "";

    let corr = sistema.ordenarCorrXNom();
    let carr = sistema.ordenarCarrXNom();

    for (let i = 0; i < corr.length; i++) {
        let nodo = document.createElement("option");
        nodo.innerHTML = corr[i].nombre + " -- " + corr[i].cedula;
        selectCorr.appendChild(nodo);

    }

    for (let x = 0; x < carr.length; x++) {
        let nodo = document.createElement("option");
        nodo.innerHTML = carr[x].nombre;
        selectCarr.appendChild(nodo);
    }

}

function agregarPatrocinador(event) {

    event.preventDefault();

    if (document.getElementById("formPatrocinadores").reportValidity()) {

        let nombre = document.getElementById("nomPat").value;
        let rubro = document.getElementById("rubPat").options[document.getElementById("rubPat").selectedIndex].text;
        let carrerasSelect = document.getElementById("carreraSelect");

        let carreras = [];

        for (let opciones of carrerasSelect.selectedOptions) {

            carreras.push(opciones.value);

        }

        let patr = new Patrocinador(nombre, rubro, carreras);

        if (sistema.patrocinadorExiste(patr)) {

            alert("Patrocinador actualizado.");

        } else {

            sistema.agregarPatrocinador(patr);

            alert("Patrocinador agregado exitosamente.");

        }


        document.getElementById("formPatrocinadores").reset();
        mostrarSelect();
    }

}

function agregarCorredor(event) {

    event.preventDefault();

    if (document.getElementById("formCorredores").reportValidity()) {

        let nombre = document.getElementById("compNom").value;
        let edad = document.getElementById("compEdad").value;
        let ci = document.getElementById("compCed").value;
        let fechaVenc = document.getElementById("fechaVenComp").value;

        let tipoSeleccionado = document.querySelector('input[name="radioDeportista"]:checked');
        let tipoDepor = tipoSeleccionado ? tipoSeleccionado.value : "Comun";

        let corr = new Corredor(nombre, edad, ci, fechaVenc, tipoDepor);


        if (sistema.cedulaCorredorExiste(corr)) {

            alert("La cedula de este corredor ya registrada, ingrese otra.");

        } else {

            sistema.agregarCorredor(corr);
            datosInsc();

        }


        document.getElementById("formCorredores").reset();

    }

}

function agregarInscripcion(event) {

    event.preventDefault();

    let nombreCorredor = document.getElementById("nomCorredores").value;
    let nombreCarrera = document.getElementById("nomCarreras").value;

    //  .find() busca un elemento en el array que cumpla la condicion de que sea exactamente igual la variable de arriba nombreCorredor

    let corredor = sistema.corredores.find(co => `${co.nombre} -- ${co.cedula}` === nombreCorredor);
    let carrera = sistema.carreras.find(ca => ca.nombre === nombreCarrera);


    let patrocinadores = "";

    let existe = false;

    for (let i = 0; i < sistema.patrocinadores.length; i++) {

        let p = sistema.patrocinadores[i];


        if (p.carreras.includes(nombreCarrera)) {
            patrocinadores += `\nNombre: ${p.nombre}\nRubro: ${p.rubro}\n`;
            existe = true;
        }

    }

    if (!existe) {

        patrocinadores = "No hay patrocinadores";
    }


    let fechaCarrera = new Date(carrera.fecha);
    let fechaVencimiento = new Date(corredor.fechVenc);


    if (fechaVencimiento < fechaCarrera) {

        alert(`No se puede inscribir ya que su fecha de vencimiento esta o estara vencida para la fecha.\nFecha de vencimiento de ficha medica: ${corredor.fechVenc} \nFecha de la carrera: ${carrera.fecha}`);

        return;
    }

    if (sistema.corredorInscripto(corredor, carrera)) {

        alert("No se puede inscribir al mismo corredor 2 veces en la misma carrera.");

        return;
    }

    if (carrera.cupo <= 0) {

        alert("Ya no quedan cupos para inscribirse en la carrera.");

        return;

    }


    let insc = new Inscripcion(corredor, carrera);
    sistema.agregarInscripcion(insc);
    carrera.cupo -= 1;
    carrera.inscriptos += 1;

    alert(`Inscripción realizada correctamente.\n\nCorredor: ${corredor.nombre}\nCedula: ${corredor.cedula}\nEdad: ${corredor.edad}\nTipo de corredor: ${corredor.tipoDepor}\nNumero de inscripcion: ${carrera.inscriptos}  \n\nCarrera: ${carrera.nombre} \nDepartamento: ${carrera.departamento} \nFecha: ${carrera.fecha}\nCupo restante: ${carrera.cupo}\n\nPatrocinadores: ${patrocinadores}`);


    // Parte imprimir PDF

    // Quita los saltos de linea para la impresion de el PDF

    patrocinadores = patrocinadores.replace(/\n/g, " ");


    let impresion = {

        Corredor: corredor.nombre,
        Cedula: corredor.cedula,
        Edad: corredor.edad,
        Tipo_de_corredor: corredor.tipoDepor,
        Numero_de_inscripcion: carrera.inscriptos,
        Carrera: carrera.nombre,
        Departamento: carrera.departamento,
        Cupo_restante: carrera.cupo,
        Fecha: carrera.fecha,
        Patrocinadores: patrocinadores

    }


    // Convierte el objeto impresion a formato legible

    let texto = JSON.stringify(impresion, null, 2);


    texto = texto.replace(/\"([^"]+)\"/g, '$1');

    let { jsPDF } = window.jspdf;
    let doc = new jsPDF();

    doc.text(texto, 10, 10);

    doc.save("datos.pdf");

    datosGenerales();

}

// Parte de estadisticas

function datosGenerales() {

    // Promedio de inscriptos 

    let promedio = document.getElementById("promInsc");
    promedio.innerHTML = "";
    let prom = sistema.promedioInscriptos();
    let nodo = document.createElement("span");
    nodo.innerHTML = prom;
    promedio.appendChild(nodo);

    // ul con las carreras con mas inscriptos

    let listaCarrMasInsc = document.getElementById("ulCarrMasInsc");
    listaCarrMasInsc.innerHTML = "";
    let listaMasInsc = sistema.carrMasInsc();

    if (listaMasInsc === "Sin Datos.") {

        let nodo = document.createElement("li");
        nodo.innerHTML = listaMasInsc;
        listaCarrMasInsc.appendChild(nodo);

    } else {

        for (let nombreCarr of listaMasInsc) {
            let nodo = document.createElement("li");
            nodo.innerHTML = nombreCarr;
            listaCarrMasInsc.appendChild(nodo);
        }

    }

    // ul con las carreras sin inscriptos

    let listaCarrSinInsc = document.getElementById("ulCarrSinInsc");
    listaCarrSinInsc.innerHTML = "";
    let listaSinInsc = sistema.carrSinInsc();

    if (listaSinInsc === "Sin Datos.") {

        let nodo = document.createElement("li");
        nodo.innerHTML = listaSinInsc;
        listaCarrSinInsc.appendChild(nodo);

    } else {

        for (let nombreCarr of listaSinInsc) {
            let nodo = document.createElement("li");
            nodo.innerHTML = nombreCarr;
            listaCarrSinInsc.appendChild(nodo);
        }

    }

    // Span porcentaje de corredores de elite

    let porcentaje = document.getElementById("porcCorrElite");
    porcentaje.innerHTML = "";
    let porc = sistema.porcCorrElite();
    let nodo2 = document.createElement("span");
    nodo2.innerHTML = porc;
    porcentaje.appendChild(nodo2);

}

function selectConsultaInscriptos() {

    let selectCarr = document.getElementById("consultaCarrera");

    selectCarr.innerHTML = "";

    let carr = sistema.ordenarCarrXNom();


    for (let i = 0; i < carr.length; i++) {

        let nodo = document.createElement("option");
        nodo.innerHTML = carr[i].nombre;
        selectCarr.appendChild(nodo);

    }

}


function tableConsultaInsc() {

    let tabla = document.getElementById("tablaCorredores");
    let carreraSeleccionada = document.getElementById("consultaCarrera").value;

    let inscOrdenadas;

    if (document.getElementById("radNomCorr").checked) {

        inscOrdenadas = sistema.ordenarCorrInsc();

        tabla.innerHTML = "";


    } else {

        inscOrdenadas = sistema.ordenarCorrXNum();

        tabla.innerHTML = "";


    }

    for (let insc of inscOrdenadas) {

        if (insc.carrera.nombre === carreraSeleccionada) {


            let corredor = insc.corredor;


            let fila = tabla.insertRow();

            let c1 = fila.insertCell();
            c1.innerHTML = corredor.nombre;

            let c2 = fila.insertCell();
            c2.innerHTML = corredor.edad;

            let c3 = fila.insertCell();
            c3.innerHTML = corredor.cedula;

            let c4 = fila.insertCell();
            c4.innerHTML = corredor.fechVenc;

            let c5 = fila.insertCell();
            c5.innerHTML = insc.num;
        }
    }

}


// Parte de el mapa 


google.charts.load('current', {
    'packages': ['geochart'],
});
google.charts.setOnLoadCallback(drawRegionsMap);

function drawRegionsMap() {

    if (document.getElementById("carrRadio").checked) {

        var data = google.visualization.arrayToDataTable(datosCarrMapa());

    } else {

        var data = google.visualization.arrayToDataTable(datosInscMapa());

    }

    var options = {
        region: 'UY',
        resolution: 'provinces',
        colorAxis: { colors: ['#d0e6f9', '#003366'] },
        backgroundColor: '#f5f5f5',
        datalessRegionColor: '#cccccc',
        defaultColor: '#f5f5f5'
    };


    var chart = new google.visualization.GeoChart(document.getElementById('mapaUru'));
    chart.draw(data, options);
}

function datosCarrMapa() {

    // Filtrar datos del mapa por carreras

    let carrMap = {};

    for (let carr of sistema.carreras) {

        let depto = carr.departamento;

        if (!carrMap[depto]) {

            carrMap[depto] = 1;
        } else {

            carrMap[depto]++;
        }

    }

    let codDeptos = {
        'Montevideo': 'UY-MO',
        'Canelones': 'UY-CA',
        'Maldonado': 'UY-MA',
        'Rocha': 'UY-RO',
        'Treinta y Tres': 'UY-TT',
        'Cerro Largo': 'UY-CL',
        'Rivera': 'UY-RV',
        'Artigas': 'UY-AR',
        'Salto': 'UY-SA',
        'Paysandú': 'UY-PA',
        'Río Negro': 'UY-RN',
        'Soriano': 'UY-SO',
        'Colonia': 'UY-CO',
        'San José': 'UY-SJ',
        'Flores': 'UY-FS',
        'Florida': 'UY-FD',
        'Lavalleja': 'UY-LA',
        'Durazno': 'UY-DU',
        'Tacuarembó': 'UY-TA'
    };

    let datosMapa = [['Region', 'Cantidad Carreras']];

    for (let dep of Object.keys(carrMap)) {

        let codigo = codDeptos[dep];

        if (codigo) {

            datosMapa.push([codigo, carrMap[dep]]);
        }
    }

    return datosMapa;
}


function datosInscMapa() {

    // Filtrar datos del mapa por inscripciones

    let carrMap = {};

    for (let carr of sistema.carreras) {

        let depto = carr.departamento;
        let inscrip = carr.inscriptos;

        if (!carrMap[depto]) {

            carrMap[depto] = inscrip;
        } else {

            carrMap[depto] += inscrip;
        }

    }

    let codDeptos = {
        'Montevideo': 'UY-MO',
        'Canelones': 'UY-CA',
        'Maldonado': 'UY-MA',
        'Rocha': 'UY-RO',
        'Treinta y Tres': 'UY-TT',
        'Cerro Largo': 'UY-CL',
        'Rivera': 'UY-RV',
        'Artigas': 'UY-AR',
        'Salto': 'UY-SA',
        'Paysandú': 'UY-PA',
        'Río Negro': 'UY-RN',
        'Soriano': 'UY-SO',
        'Colonia': 'UY-CO',
        'San José': 'UY-SJ',
        'Flores': 'UY-FS',
        'Florida': 'UY-FD',
        'Lavalleja': 'UY-LA',
        'Durazno': 'UY-DU',
        'Tacuarembó': 'UY-TA'
    };

    let datosMapa = [['Region', 'Cantidad Inscriptos']];

    for (let depto of Object.keys(carrMap)) {

        let codigo = codDeptos[depto];

        if (codigo) {

            datosMapa.push([codigo, carrMap[depto]]);
        }
    }

    return datosMapa;
}