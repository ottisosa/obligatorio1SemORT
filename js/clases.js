/*
  Autores: Octavio Sosa (363131) - Alan Klein(358518)
*/


class Carrera {

    constructor(nom, depto, fecha, cupo) {

        this.nombre = nom;
        this.departamento = depto;
        this.fecha = fecha;
        this.cupo = cupo;
        this.inscriptos = 0;

    }
    toString() {
        return " " + this.nombre + " " + this.departamento + " " + this.fecha + " " + this.cupo;
    }
}

class Patrocinador {

    constructor(nom, rub, carr) {

        this.nombre = nom;
        this.rubro = rub;
        this.carreras = carr;

    }
    toString() {
        return " " + this.nombre + " " + this.rubro + " " + this.carreras;
    }
}

class Corredor {

    constructor(nom, edad, ci, fechVenc, tipoDep) {

        this.nombre = nom;
        this.edad = edad;
        this.cedula = ci;
        this.fechVenc = fechVenc;
        this.tipoDepor = tipoDep;

    }
    toString() {

        return " " + this.nombre + " " + this.edad + " " + this.cedula + " " + this.fechVenc + " " + this.tipoDepor;
    }

}

class Inscripcion {

    constructor(corr, carr) {

        this.num = 0;
        this.corredor = corr;
        this.carrera = carr;


    }
    toString() {

        return " " + this.corredor + " " + this.carrera + " ";
    }
}

class Sistema {

    constructor() {

        this.carreras = [];
        this.patrocinadores = [];
        this.corredores = [];
        this.inscripciones = [];

        this.numCorrInsc = 0;
    }

    agregarCarrera(carrera) {

        this.carreras.push(carrera);
    }

    mostrarCarreras() {

        return this.carreras;

    }

    corredorInscripto(corr, carr) {

        let inscripto = false;

        for (let i = 0; i < this.inscripciones.length && !inscripto; i++) {

            if (this.inscripciones[i].corredor === corr && this.inscripciones[i].carrera === carr) {

                inscripto = true;

            }
        }

        return inscripto;
    }

    mostrarCorredores() {

        return this.corredores;

    }

    carreraExiste(carr) {

        let existe = false;

        for (let i = 0; i < this.carreras.length && !existe; i++) {
            if (this.carreras[i].nombre == carr) {
                existe = true;
            }
        }
        return existe;
    }

    mostrarPatrocinadores() {

        return this.patrocinadores;
    }

    agregarPatrocinador(patr) {

        this.patrocinadores.push(patr);

    }

    patrocinadorExiste(patr) {

        for (let i = 0; i < this.patrocinadores.length; i++) {
            if (this.patrocinadores[i].nombre === patr.nombre) {
                this.patrocinadores[i].rubro = patr.rubro;
                this.patrocinadores[i].carreras = patr.carreras

                return true;
            }
        }
        return false;
    }

    agregarCorredor(corr) {

        this.corredores.push(corr);

    }

    cedulaCorredorExiste(corr) {

        let existe = false;

        for (let i = 0; i < this.corredores.length && !existe; i++) {
            if (this.corredores[i].cedula == corr.cedula) {
                existe = true;
            }
        }
        return existe;
    }

    agregarInscripcion(insc) {

        this.numCorrInsc++;
        insc.num = this.numCorrInsc;
        this.inscripciones.push(insc);

    }

    ordenarCarrXNom() {

        return this.carreras.sort((a, b) => a.nombre.localeCompare(b.nombre));

    }

    ordenarCorrXNum() {

        return this.inscripciones.sort((a, b) => a.num - b.num);

    }

    ordenarCorrXNom() {

        return this.corredores.sort((a, b) => a.nombre.localeCompare(b.nombre));

    }

    ordenarCorrInsc() {

        return this.inscripciones.sort((a, b) => a.corredor.nombre.localeCompare(b.corredor.nombre));

    }

    promedioInscriptos() {

        let contadorCarr = 0;

        for (let i = 0; i < this.inscripciones.length; i++) {

            contadorCarr++;

        }

        if (contadorCarr === 0) {

            return "Sin Datos.";

        }

        let cantCarreras = this.carreras.length;
        let promedio = (contadorCarr / cantCarreras).toFixed(2);

        if (promedio == "0.00") {

            return "Sin Datos.";
        }

        return promedio;
    }

    carrMasInsc() {

        let mayorInsc = 0;
        let carrMasInsc = [];

        for (let carr of this.carreras) {

            if (carr.inscriptos > mayorInsc) {
                mayorInsc = carr.inscriptos;
                carrMasInsc = [carr.nombre];
            } else if (carr.inscriptos === mayorInsc) {
                carrMasInsc.push(carr.nombre);
            }
        }

        if (carrMasInsc.length === 0) {

            return "Sin Datos.";

        }

        return carrMasInsc;

    }

    carrSinInsc() {

        let carrSinInsc = [];

        for (let carr of this.carreras) {

            if (carr.inscriptos === 0) {
                carrSinInsc.push(carr.nombre);
            }
        }

        if (carrSinInsc.length === 0) {

            return "Sin Datos.";

        }

        carrSinInsc.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

        return carrSinInsc;
    }

    porcCorrElite() {

        let cantCorrElite = 0;

        for (let corr of this.corredores) {

            if (corr.tipoDepor === "Elite") {

                cantCorrElite++;
            }
        }

        let totalCorr = this.corredores.length;

        if (totalCorr == 0) {
            return "Sin Datos.";
        }

        let porcentaje = (cantCorrElite / totalCorr) * 100;

        return porcentaje.toFixed(2) + "%";

    }
}

