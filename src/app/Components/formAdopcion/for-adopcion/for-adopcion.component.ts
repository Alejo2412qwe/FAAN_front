import { Component } from '@angular/core';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
    selector: 'app-for-adopcion',
    templateUrl: './for-adopcion.component.html',
    styleUrls: ['./for-adopcion.component.css']
})
export class ForAdopcionComponent {

    generarPDF() {

        const nombreInput = document.getElementById("nombre") as HTMLInputElement;
        const ocupacionInput = document.getElementById("ocupacion") as HTMLInputElement;
        const direccionCasaInput = document.getElementById("direccion_domicilio") as HTMLInputElement;
        const direccionTrabajoInput = document.getElementById("direccion_trabajo") as HTMLInputElement;
        const correoInput = document.getElementById("correo") as HTMLInputElement;
        const telefonoCasaInput = document.getElementById("telefono_casa") as HTMLInputElement;
        const telefonoTrabajoInput = document.getElementById("telefono_trabajo") as HTMLInputElement;
        const celularInput = document.getElementById("celular") as HTMLInputElement;
        const estadoCivilInput = document.getElementById("estado_civil") as HTMLInputElement;
        const numeroMiembrosInput = document.getElementById("num_miembros_familia") as HTMLInputElement;
        const edadNinosInput = document.getElementById("ninos_edad") as HTMLInputElement;
        const autorizadorInput = document.getElementById("autorizador") as HTMLInputElement;

        const acuerdoFamiliaSi = document.getElementById("acuerdo_familia_si") as HTMLInputElement;
        const acuerdoFamiliaNo = document.getElementById("acuerdo_familia_no") as HTMLInputElement;
        let acuerdoFamilia;
        const desacuerdoFamiliarInput = document.getElementById("razon_no_acuerdo") as HTMLInputElement;

        if (acuerdoFamiliaSi.checked) {
            acuerdoFamilia = 'SI';
        } else if (acuerdoFamiliaNo.checked) {
            acuerdoFamilia = 'NO';
        } else {
            acuerdoFamilia = 'NO SELECCIONADO';
        }


        let viveConUOtro;
        const viveConmigo = document.getElementById("viveConmigo") as HTMLInputElement;
        const viveConOtro = document.getElementById("viveOtro") as HTMLInputElement;
        if (viveConmigo.checked) {
            viveConUOtro = "VIVIRA CONMIGO";
        }
        if (viveConOtro.checked) {
            viveConUOtro = "VIVIRA CON OTRO";
        }

        let considerar;
        const considerarCompania = document.getElementById("compania") as HTMLInputElement;
        const considerarGuardian = document.getElementById("guardian") as HTMLInputElement;
        const considerarMiembro = document.getElementById("miembroFamilia") as HTMLInputElement;
        const considerarAmigo = document.getElementById("amigo") as HTMLInputElement;

        if (considerarCompania.checked) {
            considerar = "COMPAÑIA";
        }
        if (considerarGuardian.checked) {
            considerar = "GUARDIAN";
        }
        if (considerarMiembro.checked) {
            considerar = "MIEMBRO FAMILIAR";
        }
        if (considerarAmigo.checked) {
            considerar = "AMIGO";
        }

        let antes = "NO";
        const antesSI = document.getElementById("antesSi") as HTMLInputElement;

        if (antesSI.checked) {
            antes = "SI";
        }

        const animalPasadoInput = document.getElementById("animalPasado") as HTMLInputElement;
        const tiempoPasadoInput = document.getElementById("tiempoPasado") as HTMLInputElement;
        const animalAhoraInput = document.getElementById("animalAhora") as HTMLInputElement;

        let vacunado = "NO";
        const vacunaSI = document.getElementById("vacunaSI") as HTMLInputElement;
        if (vacunaSI.checked) {
            vacunado = "SI";
        }

        const vacunasAntesInput = document.getElementById("vacunasANTES") as HTMLInputElement;

        let desparasitado = "NO";
        const desparasitadoSI = document.getElementById("desparasitadoSI") as HTMLInputElement;
        if (desparasitadoSI.checked) {
            desparasitado = "SI";
        }

        const tiempoDesparasitadoInput = document.getElementById("tiempoDesparasita") as HTMLInputElement;
        const hotasSoloInput = document.getElementById("horasSolo") as HTMLInputElement;
        const pasariaAnimalInput = document.getElementById("pasariaAnimal") as HTMLInputElement;
        const problemaAlergiaInput = document.getElementById("problemaAlergia") as HTMLInputElement;
        const resultaAlergicoInput = document.getElementById("resultaAlergico") as HTMLInputElement;

        let planeaHijos = "NO";
        const planeaHijosSI = document.getElementById("planeaSI") as HTMLInputElement;
        if (planeaHijosSI.checked) {
            planeaHijos = "SI";
        }

        const embarazaInput = document.getElementById("embaraza") as HTMLInputElement;
        let conoceGastos = "NO";
        const conoceGastosSI = document.getElementById("gastosSI") as HTMLInputElement;
        if (conoceGastosSI.checked) {
            conoceGastos = "SI";
        }

        let tipoVivienda;
        const viviendaCasaInput = document.getElementById("casa") as HTMLInputElement;
        const viviendaDepaInput = document.getElementById("depa") as HTMLInputElement;

        if (viviendaCasaInput.checked) {
            tipoVivienda = "CASA";
        }
        if (viviendaDepaInput.checked) {
            tipoVivienda = "DEPARTAMENTO";
        }

        let vivienda;
        const viviendaPropiaInput = document.getElementById("propia") as HTMLInputElement;
        const viviendaRentadaInput = document.getElementById("rentada") as HTMLInputElement;
        const viviendaCompartidaInput = document.getElementById("compartida") as HTMLInputElement;

        if (viviendaPropiaInput.checked) {
            vivienda = "PROPIA";
        }
        if (viviendaRentadaInput.checked) {
            vivienda = "RENTADA";
        }
        if (viviendaCompartidaInput.checked) {
            vivienda = "COMPARTIDA";
        }

        let jardioPatio;
        const jardinSI = document.getElementById("jardin") as HTMLInputElement;
        const patioSI = document.getElementById("patio") as HTMLInputElement;
        if (jardinSI.checked) {
            jardioPatio = "JARDIN";
        }
        if (patioSI.checked) {
            jardioPatio = "PATIO";
        }

        let parteCasa;
        const jardinParte = document.getElementById("jardinParte") as HTMLInputElement;
        const patioParte = document.getElementById("patioParte") as HTMLInputElement;
        const azoteaParte = document.getElementById("azoteaParte") as HTMLInputElement;
        const dentronCasaParte = document.getElementById("dentroCasaParte") as HTMLInputElement;

        if (jardinParte.checked) {
            parteCasa = "JARDIN";
        }
        if (patioParte.checked) {
            parteCasa = "PATIO";
        }
        if (azoteaParte.checked) {
            parteCasa = "AZOTEA";
        }
        if (dentronCasaParte.checked) {
            parteCasa = "DENTRO DE LA CASA";
        }

        let dormirParte;
        const jardinDormir = document.getElementById("dormirJardin") as HTMLInputElement;
        const patioDormir = document.getElementById("dormirPatio") as HTMLInputElement;
        const azoteaDormir = document.getElementById("dormirAzotea") as HTMLInputElement;
        const dentronCasaDormir = document.getElementById("dormirDentroCasa") as HTMLInputElement;

        if (jardinDormir.checked) {
            dormirParte = "JARDIN";
        }
        if (patioDormir.checked) {
            dormirParte = "PATIO";
        }
        if (azoteaDormir.checked) {
            dormirParte = "AZOTEA";
        }
        if (dentronCasaDormir.checked) {
            dormirParte = "DENTRO DE LA CASA";
        }

        const vecinosAnimalesInput = document.getElementById("vecinosAnimales") as HTMLInputElement;

        let permiso = "NO";
        const permisoSI = document.getElementById("permisoSI") as HTMLInputElement;
        if (permisoSI.checked) {
            permiso = "SI";
        }

        const mudarseLugarInput = document.getElementById("mudarseLugar") as HTMLInputElement;
        const mudarseInput = document.getElementById("mudarse") as HTMLInputElement;

        let dispuesto = "NO";
        const dispuestoSI = document.getElementById("dispuestoSI") as HTMLInputElement;

        if (dispuestoSI.checked) {
            dispuesto = "SI";
        }

        const enterarseInput = document.getElementById("enterarseNosotros") as HTMLInputElement;
        const otrosComentarios = document.getElementById("otrosComentarios") as HTMLInputElement;

        //variables para el pdf
        const name = nombreInput.value;
        const email = ocupacionInput.value;
        const direccionCasa = direccionCasaInput.value;
        const direccionTrabajo = direccionTrabajoInput.value;
        const correo = correoInput.value;
        const telefonoCasa = telefonoCasaInput.value;
        const telefonoTrabajo = telefonoTrabajoInput.value;
        const celular = celularInput.value;
        const estadoCivil = estadoCivilInput.value;
        const numeroMiembros = numeroMiembrosInput.value;
        const edadNinos = edadNinosInput.value;
        const autorizador = autorizadorInput.value;
        const desacuerdoFamiliar = desacuerdoFamiliarInput.value;
        const animalPasado = animalPasadoInput.value;


        const data = {

            title: 'FORMULARIO PARA LA ADOGCIÓN',
            subtitle: 'INFORMACION DE LA VIVIENDA'
        };

        // Definir el contenido del PDF utilizando la estructura de pdfmake
        const documentDefinition = {
            content: [
                { text: data.title, style: 'header' },
                { text: 'NOMBRE: ' + name },
                { text: 'OCUPACION: ' + email },
                { text: 'DIRECCION DE DOMICILIO: ' + direccionCasa },
                { text: 'DIRECCION DEL TRABAJO: ' + direccionTrabajo },
                { text: 'CORREO ELECTRONICO: ' + correo },
                { text: 'TELEFONO DE CASA: ' + telefonoCasa },
                { text: 'TELEFONO DE TRABAJO: ' + telefonoTrabajo },
                { text: 'CELULAR: ' + celular },
                { text: 'ESTADO CIVIL: ' + estadoCivil },
                { text: 'NUMERO DE MIEMBROS EN EL HOGAR: ' + numeroMiembros },
                { text: 'EDAD DE LOS NIÑOS: ' + edadNinos },
                { text: 'AUTORIZADOR: ' + autorizador },
                { text: 'ACUERDO FAMILIAR: ' + acuerdoFamilia },
                { text: 'RAZON DEL DESACUERDO: ' + desacuerdoFamiliar },
                { text: 'PERSONAS CON LAS QUE VIVIRA: ' + viveConUOtro },
                { text: 'COMO SE CONSIDERARA EL ANIMALITO: ' + considerar },
                { text: 'SI HA TENIDO ANIMALES ANTES: ' + antes },
                { text: 'QUE ANIMAL ERA: ' + animalPasado },
                { text: 'CUANTO TIEMPO VIVIO: ' + tiempoPasadoInput.value },
                { text: 'DONDE SE ENCUENTRA AHORA: ' + animalAhoraInput.value },
                { text: 'SI FUE VACUNADO: ' + vacunado },
                { text: 'VACUNAS Y TIEMPO DE APLICACION: ' + vacunasAntesInput.value },
                { text: 'DESPARASITACION: ' + desparasitado },
                { text: 'TIEMPO DE DESPARASITACION: ' + tiempoDesparasitadoInput.value },
                { text: 'HORAS DE PERMANENCIA SOL@: ' + hotasSoloInput.value },
                { text: 'LUGAR DONDE PASARIA SOL@: ' + pasariaAnimalInput.value },
                { text: 'PERSONAS CON PROBLEMAS DE ALERGIA: ' + problemaAlergiaInput.value },
                { text: 'QUE SUCEDERIA CON ESTAS PERSONAS: ' + resultaAlergicoInput.value },
                { text: 'PLANEACION DE HIJOS: ' + planeaHijos },
                { text: 'QUE PASARIA SI EXISTE EMBARAZADA: ' + embarazaInput.value },
                { text: 'CONOCIMIENTO DE GASTOS: ' + conoceGastos },
                { text: data.subtitle },
                { text: 'TIPO DE VIVIENDA: ' + tipoVivienda },
                { text: 'VIVIENDA: ' + vivienda },
                { text: 'JARDIO O PATIO: ' + jardioPatio },
                { text: 'PARTE DONDE VIVIRIA EL ANIMALITO: ' + parteCasa },
                { text: 'PARTE DONDE DORMIRIA EL ANIMALITO: ' + dormirParte },
                { text: 'VECINOS QUE POSEAN OTRO ANIMAL: ' + vecinosAnimalesInput.value },
                { text: 'SE CUENTA CON EL PERMISO: ' + permiso },
                { text: 'QUE SUCEDERIA SI SE TUVIERA QUE MUDAD DE CASA, CIUDAD O PAIS: ' + mudarseLugarInput.value },
                { text: 'QUE SUCEDERIA SI NO SE ADMITIERAN ANIMALES: ' + mudarseInput.value },
                { text: 'DISPOSICION DEL TIEMPO DE ADAPTACION: ' + dispuesto },
                { text: 'COMO SE ENTERO DE LA FUNDACION: ' + enterarseInput.value },
                { text: 'OTROS COMENTARIOS: ' + otrosComentarios.value },

            ],
            styles: {
                header: {
                    fontSize: 22,
                    bold: true,
                }
            },
            anotherStyle: {
                alignment: 'center'
            }
        };

        // Generar el PDF
        const pdfDocGenerator = pdfMake.createPdf(documentDefinition);
        pdfDocGenerator.open();
    }


}
