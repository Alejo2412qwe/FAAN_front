import { Component, OnInit } from '@angular/core';
import { ImageService } from 'src/app/Service/image.service';
import { Form } from 'src/app/Models/fomulario';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import { ToastrService } from 'ngx-toastr';
import { EXCLUDE_FIELDS, stylesForm } from 'src/app/util/const-validate';


@Component({
    selector: 'app-for-adopcion',
    templateUrl: './for-adopcion.component.html',
    styleUrls: ['./for-adopcion.component.css']
})
export class ForAdopcionComponent implements OnInit {
    public formulario = new Form();
    public submitted: boolean = false;
    public loading: boolean = false;
    public error: string = 'Llena este campo.'

    public listPersonaAutorizada: any[] = [
        { name: 'Madre' },
        { name: 'Padre' },
        { name: 'Tutor' },]

    constructor(private imageService: ImageService, private toastr: ToastrService) { }

    ngOnInit(): void {
    }

    public formValidate() {
        this.submitted = true;
        this.loading = true;
        if (
            Object.entries(this.formulario)
                .filter(([key]) => !EXCLUDE_FIELDS.includes(key))
                .every(([_, value]) => value) &&
            /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(this.formulario.correoE!)
        ) {
            this.generarPDF();
        } else {
            this.loading = false;
            this.toastr.error(
                '',
                'REVISE LOS CAMPOS OBLIGATORIOS'
            );
        }
    }

    public validarCorreoE(correo: string): boolean {
        const patronCorreo = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
        return patronCorreo.test(correo);
    }

    public async generarPDF() {

        const imageDataUrl = await this.imageService.getImageDataUrl('assets/img/faan.jpg');

        const documentDefinition = {
            content: [
                { image: imageDataUrl, width: 300, height: 130, style: 'roundedImage' },
                { text: 'SOLICITUD DE ADOPCIÓN', style: 'header' },

                { text: 'PERSONALES:', style: 'subheader' },
                {
                    ul: [
                        { text: 'Nombre: ' + this.formulario.nombre, style: 'question' },
                        { text: 'Ocupación: ' + this.formulario.ocupacion, style: 'question' },
                        { text: 'Dirección domiciliaria: ' + this.formulario.direccionDomiciliaria, style: 'question' },
                        { text: 'Dirección de trabajo: ' + this.formulario.direccionTrabajo, style: 'question' },
                        { text: 'Correo electrónico: ' + this.formulario.correoE, style: 'question' },
                        { text: 'Teléfono de casa: ' + this.formulario.telefonoCasa, style: 'question' },
                        { text: 'Tel. trabajo: ' + this.formulario.telefonoTrabajo, style: 'question' },
                        { text: 'Celular: ' + this.formulario.celular, style: 'question' },
                        { text: 'Estado civil: ' + this.formulario.estadoCivil, style: 'question' },
                        { text: 'Número de miembros en la familia: ' + this.formulario.numeroMiembros, style: 'question' },
                        { text: 'Niños- edad: ' + this.formulario.edadNinos, style: 'question' },

                    ]
                },
                { text: '\n 1. ¿Quién es la persona que autorizará la adopción del animal? (madre, padre, tutor, etc) ', style: 'question' },
                { text: '\n' + this.formulario.autorizacion1 },

                { text: `\n 2. ¿Están todos los miembros de la familia enterados y de acuerdo de la intención de adoptar un animal de compañía? Si __${this.formulario.todoMiembrosAcuerdo2 === 'SI' ? 'X' : ''}__ No__${this.formulario.todoMiembrosAcuerdo2 === 'NO' ? 'X' : ''}__ `, style: 'question' },

                { text: `\n 3. ¿Están de acuerdo? Si __${this.formulario.acuerdo3 === 'SI' ? 'X' : ''}__ No__${this.formulario.acuerdo3 === 'NO' ? 'X' : ''}__ `, style: 'question' },
                { text: '\n' + this.formulario.responseWhy3, },

                { text: `\n 4. El animalito viviría con: Conmigo y mi familia__${this.formulario.viviraCon4 === 'A' ? 'X' : ''}__ Es obsequio para un conocido__${this.formulario.viviraCon4 === 'B' ? 'X' : ''}__`, style: 'question' },

                { text: '\n 5. Como lo vas a considerar?: ', style: 'question' },
                { text: `Una compañía ___${this.formulario.considerar5 === 'A' ? 'X' : ''}___Un guardián ___${this.formulario.considerar5 === 'B' ? 'X' : ''}___ Un miembro más de la familia ___${this.formulario.considerar5 === 'C' ? 'X' : ''}___ Un amigo___${this.formulario.considerar5 === 'D' ? 'X' : ''}___`, style: 'question' },

                { text: '\n 6. ¿Han tenido animales de compañía con anterioridad? ', style: 'question' },
                { text: '\n' + this.formulario.animalesAnterioridad6, },

                { text: '\n 7. ¿Qué animal era? ', style: 'question' },
                { text: '\n' + this.formulario.animalPasado7, },


                { text: '\n 8. ¿Cuánto tiempo vivió con ustedes? ', style: 'question' },
                { text: '\n' + this.formulario.tiempoVivido8, },

                { text: '\n 9. ¿En dónde está ahora el animal? ¿Por qué? Falleció, Como?', style: 'question' },
                { text: '\n' + this.formulario.animalAhora9, },

                { text: '\n 10. ¿Estaba vacunado? ', style: 'question' },
                { text: '\n' + this.formulario.vacunado10, },

                { text: '\n 11. ¿Qué vacunas se le aplicaron? y ¿Cada cuánto tiempo se vacunaba?', style: 'question' },
                { text: '\n' + this.formulario.vacunasAntes11, },

                { text: '\n 12. ¿Estaba desparasitado? ¿Cada cuánto tiempo se desparasitaba?  ', style: 'question' },
                { text: '\n' + this.formulario.desparasitado12, },

                { text: '\n 13. ¿Cuántas horas del día permanecería solo?', style: 'question' },
                { text: '\n' + this.formulario.horasSolo14, },

                { text: '\n 14. ¿En dónde estaría mientras no hubiera nadie en casa? ', style: 'question' },
                { text: '\n' + this.formulario.pasariaAnimal15, },

                { text: '\n 15. ¿Hay alguien en su familia con problemas de alergias? ', style: 'question' },
                { text: '\n' + this.formulario.problemaAlergia16, },

                { text: '\n 16. ¿Qué sucedería si alguien resultara alérgico al animal? ', style: 'question' },
                { text: '\n' + this.formulario.resultaAlergico17, },

                { text: '\n 17. ¿Planea tener hijos? ', style: 'question' },
                { text: '\n' + this.formulario.planeaHijos18, },


                { text: '\n 18. ¿Qué sucedería si usted o en caso de ser hombre, su pareja quedara embarazada?', style: 'question' },
                { text: '\n' + this.formulario.embaraza19, },

                { text: '\n 19. ¿Conoce los gastos que implica tener un perro o gato? ', style: 'question' },
                { text: '\n' + this.formulario.conoceGastos20, },

                { text: '\n 20. ¿Qué sucedería en caso de separación?', style: 'question' },
                { text: '\n' + this.formulario.separacionFamilia21, },

                { text: '\n VIVIENDA', style: 'subheader' },

                { text: `\n 21. Tu vivienda es: Casa_${this.formulario.tipoVivienda22 === 'A' ? 'X' : ''}_ Departamento_${this.formulario.tipoVivienda22 === 'B' ? 'X' : ''}_`, style: 'question' },
                { text: `Tu vivienda es: Propia__${this.formulario.vivienda23 === 'A' ? 'X' : ''}_ Rentada _${this.formulario.vivienda23 === 'B' ? 'X' : ''}_ Compartida _${this.formulario.vivienda23 === 'C' ? 'X' : ''}__Compartida _${this.formulario.vivienda23 === 'D' ? 'X' : ''}__`, style: 'Otra' },

                { text: '\n 22. ¿Tiene jardín o patio? ', style: 'question' },
                { text: '\n' + this.formulario.jardioPatio24, },

                { text: '\n 23. En que parte de tu casa va a vivir el animalito:', style: 'question' },
                {
                    text: `Jardín__${this.formulario.parteCasaVivirAnimal25 === 'A' ? 'X' : ''}__ Patio___${this.formulario.parteCasaVivirAnimal25 === 'B' ? 'X' : ''}__ Azotea__${this.formulario.parteCasaVivirAnimal25 === 'C' ? 'X' : ''}__ Dentro de casa__${this.formulario.parteCasaVivirAnimal25 === 'D' ? 'X' : ''}__`, style: 'question'
                },

                { text: '\n 24. ¿En dónde dormiría? ', style: 'question' },
                {
                    text: `Jardín__${this.formulario.dormirAnimalParte26 === 'A' ? 'X' : ''}__ Patio___${this.formulario.dormirAnimalParte26 === 'B' ? 'X' : ''}__ Azotea__${this.formulario.dormirAnimalParte26 === 'C' ? 'X' : ''}__ Dentro de casa__${this.formulario.dormirAnimalParte26 === 'D' ? 'X' : ''}__`, style: 'question'
                },

                { text: '\n 25.Si vive en departamento, ¿hay otros vecinos que tengan animales de compañía? ', style: 'question' },
                { text: '\n' + this.formulario.vecinosAnimales27, },

                { text: '\n 26. En caso de renta o condominio cuentas con el permiso de tu casero o administración para poseer animales de compañía?', style: 'question' },
                { text: '\n' + this.formulario.permiso28, },

                { text: '\n 27. ¿Qué sucedería si tuviera que mudarse a otra casa o ciudad /país? ', style: 'question' },
                { text: '\n' + this.formulario.mudarseLugar29, },

                { text: '\n 28. ¿Qué sucedería si al mudarse algún lugar donde no admiten perros o gatos o de tener algún problema familiar o económico? ', style: 'question' },
                { text: '\n' + this.formulario.mudarse30, },

                { text: '\n 29. ¿Está dispuesto a que el perro o gato tenga un periodo de ajuste en el que aprenda dónde debe ir al baño y se adapte a la familia? ', style: 'question' },
                { text: '\n' + this.formulario.dispuesto31, },

                { text: '\n 30. ¿Cómo te enteraste de nosotros?', style: 'question' },
                { text: '\n' + this.formulario.enterarse32, },

                { text: '\n 31. otros comentarios.', style: 'question' },
                { text: '' + this.formulario.otrosComentarios33, },


                { text: '\n Una vez llenado este formulario pasaremos a los siguientes requerimientos:', },
                { text: '\n Después de conocer el perro o gato con interés en adoptar, se deberá realizar una visita de convivencia, así como recibir una platica sobre el cuidado de una mascota. ' },

                {
                    text: 'Entregar copia de Identificación oficial y comprobante de domicilio (planilla servicios básicos) Tener la disponibilidad de recibir una visita de parte de la asociación para conocer el lugar donde habitará el animalito en adopción.'
                },
                {
                    text: 'Segunda visita de familiarización y entrega de donativo de $ 15.00 o su equivalente en comida para perros los cual ayudara a seguir con nuestra labor.'
                },
                {
                    text: 'Es obligación de FAAN entregarte al animalito vacunado, desparasitado y esterilizado si tiene edad para hacerlo.'
                },
                {
                    text: 'Si al terminar de leer aún estas convencido de aDOGtar, llénala esta solicitud y envíala a nuestros contactos 0998681859.'
                },

            ],
            styles: stylesForm
        };

        const pdfDocGenerator = pdfMake.createPdf(documentDefinition as any);
        pdfDocGenerator.download('Formulario.pdf');
        this.submitted = false;
        this.loading = false;
    }
}