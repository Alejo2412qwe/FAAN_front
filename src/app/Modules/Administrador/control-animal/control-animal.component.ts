import { Component, OnInit } from '@angular/core';
import { Animal, Notificaciones, TipoAnimal, TipoVacuna, Vacuna } from 'src/app/Models/models';
import { AlergiaAnimales } from 'src/app/Payloads/payloadAlergiaAnimal';
import { EnfermedadAnimales } from 'src/app/Payloads/payloadEnfermedadAnimal';
import { ExamenFisicoAnimales } from 'src/app/Payloads/payloadExamenFisicoAnimal';
import { TratamientoAnimales } from 'src/app/Payloads/payloadTratamientoAnimal';
import { VacunasAnimales } from 'src/app/Payloads/payloadVacunasAnimal';
import { AnimalService } from 'src/app/Service/animal.service';
import { NotifacionesService } from 'src/app/Service/notifaciones.service';
import { PayloadService } from 'src/app/Service/peyloads.service';
import { TipoVacunaService } from 'src/app/Service/tipoVacuna.service';
import { VacunaService } from 'src/app/Service/vacuna.service';

@Component({
  selector: 'app-control-animal',
  templateUrl: './control-animal.component.html',
  styleUrls: ['./control-animal.component.css']
})
export class ControlAnimalComponent implements OnInit {


  constructor(
    private animalesService: AnimalService,
    private tipoVacunaService: TipoVacunaService,
    private vacunaService: VacunaService,
    private payloadservice: PayloadService,
  ) {}
  tipoVacunaSeleccionada: TipoVacuna = new TipoVacuna();
  // tipoEnfermedadSeleccionada: TipoEnfermedad = new TipoEnfermedad();
  // tipoTratamientoSeleccionada: TipoTratamiento = new TipoTratamiento();
  // tipoAlergiaSeleccionada: TipoAlergias = new TipoAlergias();

  ngOnInit(): void {
    // this.getAllTiposVacunas();
    // this.getAllTiposAlergias();
    // this.getAllTiposTratamiento();
    // this.getAllTiposEfermedades();
    this.getAllMascotas()
  }

  selectedSections: number[] = [];
  showVacunas: boolean = false;
  showEnfermedades: boolean = false;
  showTratamientos: boolean = false;
  showAlergias: boolean = false;
  showExamenesFisicos: boolean = false;

  showCard(section: number) {
    const index = this.selectedSections.indexOf(section);
    if (index === -1) {
      // If the section is not already selected, add it to the array.
      this.selectedSections.push(section);
    } else {
      // If the section is already selected, remove it from the array.
      this.selectedSections.splice(index, 1);
    }
  }

  // GET ANIMALES FOR PARAMETERS
  public ListAnimales!: Animal[];

  // PAGES
  isPage: number = 0;
  isSize: number = 8
  isSosrt: string[] = ['nombreAnimal', 'asc']

  pageTotal: number = 0;
  isFirst: boolean = false;
  isLast: boolean = false;
  isTextDigit:string="pegui";

  public getAllMascotas(): void {
    try {
      this.animalesService.getAllAnimalesPagesOrPlacaOrName(this.isTextDigit, this.isPage, this.isSize, this.isSosrt).subscribe((data: any) => {
        if (data !== null) {
          this.ListAnimales = data.content;
          console.log(data.content)
          this.pageTotal = data.totalPages
        }
      });
    } catch (error) {
      console.log('Exeption')
    }
  }

  anteriorPage(): void {
    if (!this.isFirst) {
      this.isPage--;
      this.getAllMascotas();
    }
  }

  siguientePage(): void {
    if (!this.isLast) {
      this.isPage++;
      this.getAllMascotas();
    }
  }

  // VER DATOS VACUNAS
//   vacunasAnimales: VacunasAnimales[] = [];

//   public getListaVacunasByIdFichaMedica(idFichaMedica: number) {
//     this.payloadservice.getPeyloadVacunasAnimalById(idFichaMedica).subscribe((data) => {
//       this.vacunasAnimales = data
//     })
//   }

//   // VER DATOS ENFERMEDADES
//   enfermedadAnimales: EnfermedadAnimales[] = [];

//   public getPeyloadEnfermedadAnimal(idFichaMedica: number) {
//     this.payloadservice.getPeyloadEnfermedadAnimalById(idFichaMedica).subscribe((data2) => {
//       this.enfermedadAnimales = data2
//       console.log(data2)
//     })
//   }

//   // VER DATOS TRATAMIENTOS
//   tratamientoAnimales: TratamientoAnimales[] = [];

//   public getPeyloadTratamientoAnimal(idFichaMedica: number) {
//     this.payloadservice.getPeyloadPeyloadTratamientoAnimalById(idFichaMedica).subscribe((data3) => {
//       this.tratamientoAnimales = data3
//       console.log(data3)
//     })
//   }

//   // VER DATOS ALERGIAS
//   alergiasAnimales: AlergiaAnimales[] = [];

//   public getPeyloadAlergiaAnimal(idFichaMedica: number) {
//     this.payloadservice.getPeyloadAlergiaAnimalById(idFichaMedica).subscribe((data4) => {
//       this.alergiasAnimales = data4
//       console.log(data4)
//     })
//   }

//   // VER DATOS EXAMENFISICO
//   examenfisicoli: ExamenFisicoAnimales[] = [];

//   public getPeyloadExamenFisicoAnimal(idFichaMedica: number) {
//     this.payloadservice.getPeyloadExamenFisicoAnimalById(idFichaMedica).subscribe((data5) => {
//       this.examenfisicoli = data5
//       console.log(data5)
//     })
//   }
//   public loadingVacuna: boolean = false;
//   public loadingEnfermedad: boolean = false;
//   public loadingTratamiento: boolean = false;
//   public loadingAlergia: boolean = false;
//   public isEmpty(obj: any) {
// 		// return Object.keys(obj).length === 0;
// 		return obj ? Object.keys(obj).length === 0 : true;
// 	}

//   public onRowSelect(event: any) {
// 		this.tipoVacuna = event;
//     this.tipoVacunaSeleccionada = event;
// 	}

//   public onRowSelectEnfermedad(event: any) {
// 		this.tipoEnfermedad = event;
//     this.tipoEnfermedadSeleccionada = event;
// 	}

//   public onRowSelectTratamiento(event: any) {
// 		this.tipoTratamiento = event;
//     this.tipoTratamientoSeleccionada = event;
// 	}

//   public onRowSelectAlergia(event: any) {
// 		this.tipoAlergia = event;
//     this.tipoAlergiaSeleccionada = event;
// 	}

//   // TEXT FOR INPUT SEARCH
//   public isTextDigit: string = ""

//   // MODAL
//   visible: boolean = false;

//   showModalAnimales() {
//     this.visible = true;
//     this.getAllMascotas();
//   }

//   // MODAL TIPO VACUNA
//   tipoVacuna = new TipoVacuna();
//   visibleTipoVacuna: boolean = false;

// // MODAL TIPO ENFERMEDAD
//   tipoEnfermedad = new TipoEnfermedad();
//   visibleTipoEnfermedad: boolean = false;

//   // MODAL TIPO Tratamiento
//   tipoTratamiento = new TipoTratamiento();
//   visibleTipoTratamiento: boolean = false;


//   // MODAL TIPO Alergia
//   tipoAlergia = new TipoAlergias();
//   visibleTipoAlergia: boolean = false;


//   // MODAL TIPO ExamenFisico
//   tipoExamenFisico = new ExamenFisico();
//   visibleExamenFisico: boolean = false;

//   showModalTipoVacuna() {
//     this.visibleTipoVacuna = true;
//     this.tipoVacuna = {} as TipoVacuna;
//   }

//   showModalTipoEnfermedad() {
//     this.visibleTipoEnfermedad = true;
//     this.tipoEnfermedad = {} as TipoEnfermedad;
//   }

//   showModalTipoTratamiento() {
//     this.visibleTipoTratamiento = true;
//     this.tipoTratamiento = {} as TipoTratamiento;
//   }

//   showModalTipoAlergia() {
//     this.visibleTipoAlergia = true;
//     this.tipoAlergia = {} as TipoAlergias;
//   }

//   showModalExamenFisico() {
//     this.visibleExamenFisico = true;
//     this.tipoExamenFisico= {} as ExamenFisico;
//   }

//   saveTipoVacuna() {
//     this.tipoVacuna.estado = true;
//     this.tipoVacunaService.saveTipoVacuna(this.tipoVacuna).subscribe((data) => {
//       alert('SUCESSFULL');
//       this.tipoVacuna = {} as TipoVacuna;
//       this.visibleTipoVacuna = false;
//     })
//   }

//   saveTipoEnfermedad() {
//     this.tipoEnfermedad.estado = true;
//     this.tipoEnfermedadService.saveTipoEnfermedad(this.tipoEnfermedad).subscribe((data) => {
//       alert('SUCESSFULL');
//       this.tipoEnfermedad = {} as TipoEnfermedad;
//       this.visibleTipoEnfermedad = false;
//     })
//   }

//   saveTipoTratamiento() {
//     this.tipoTratamiento.estado = true;
//     this.tipoTratamientoService.saveTipoTratamiento(this.tipoTratamiento).subscribe((data) => {
//       alert('SUCESSFULL');
//       this.tipoTratamiento = {} as TipoTratamiento;
//       this.visibleTipoTratamiento= false;
//     })
//   }

//   saveTipoAlergias() {
//     this.tipoAlergia.estado = 1;
//     this.tipoAlergiaService.saveTipoAlergias(this.tipoAlergia).subscribe((data) => {
//       alert('SUCESSFULL');
//       this.tipoAlergia = {} as TipoAlergias;
//       this.visibleTipoAlergia = false;
//     })
//   }

//   saveExamenFisico() {
//     this.tipoExamenFisicoService.saveExamenFisico(this.tipoExamenFisico).subscribe((data) => {
//       alert('SUCESSFULL');
//       this.tipoExamenFisico = {} as ExamenFisico;
//       this.visibleExamenFisico = false;
//     })
//   }

//   // GET VACUNAS
//   listTipoVacuna: TipoVacuna[] = [];
//   selectedVacuna = new TipoVacuna();

//   getAllTiposVacunas() {
//     this.tipoVacunaService.getListaTipoVacuna().subscribe((data) => {
//       this.listTipoVacuna = data;
//     });
//   }

//   // GET Enfermedad
//   listTipoEnfermedad: TipoEnfermedad[] = [];
//   selectedEnfermedad= new TipoEnfermedad();
//   getAllTiposEfermedades() {
//     this.tipoEnfermedadService.getListaTipoEnfermedad().subscribe((dataen) => {
//       this.listTipoEnfermedad = dataen;
//     });
//   }

//   // GET Tratamiento
//   listTipoTratamiento: TipoTratamiento[] = [];
//   selectedTratamiento= new TipoTratamiento();
//   getAllTiposTratamiento() {
//     this.tipoTratamientoService.getListaTipoTratamiento().subscribe((datatra) => {
//       this.listTipoTratamiento = datatra;
//     });
//   }

//   // GET Alergia
//   listTipoAlergia: TipoAlergias[] = [];
//   selectedAlergias= new TipoAlergias();
//   getAllTiposAlergias() {
//     this.tipoAlergiaService.getListaTipoAlergias().subscribe((dataale) => {
//       this.listTipoAlergia = dataale;
//     });
//   }

//   // GET ExamenFisico
//   listTipoExamenFisico: ExamenFisico[] = [];
//   selectedExamenFisico= new ExamenFisico();
//   getAllTiposExamenFisico() {
//     this.tipoExamenFisicoService.getListaExamenFisico().subscribe((dataex) => {
//       this.listTipoExamenFisico = dataex;
//     });
//   }


//   // MODAl ADD VACUNA FOR ANIMAL
//   vacuna = new Vacuna();
//   visibleVacuna: boolean = false;

//   showModalVacuna() {
//     this.getAllTiposVacunas();
//     this.visibleVacuna = true;
//     this.vacuna = {} as Vacuna;
//   }

//   enfermedad = new Enfermedad();
//   visibleEnfermedad: boolean = false;

//   showModalEnfermedad() {
//     this.getAllTiposEfermedades();
//     this.visibleEnfermedad = true;
//     this.enfermedad = {} as Enfermedad;
//   }

//   tratamiento = new Tratamiento();
//   visibleTratamiento: boolean = false;

//   showModalTratamiento() {
//     this.getAllTiposTratamiento();
//     this.visibleTratamiento = true;
//     this.tratamiento = {} as Tratamiento;
//   }

//   alergia = new Alergias();
//   visibleAlergia: boolean = false;

//   showModalAlergia() {
//     this.getAllTiposAlergias();
//     this.visibleAlergia = true;
//     this.alergia = {} as Alergias;
//   }


//   examenfisicos = new ExamenFisico();
//   visibleExamenFisicos: boolean = false;

//   showModalExamenFisicos() {
//     this.getAllTiposExamenFisico();
//     this.visibleExamenFisicos = true;
//     this.examenfisicos = {} as ExamenFisico;
//   }

//   saveVacuna() {
//     this.vacuna.tipoVacuna = this.selectedVacuna;
//     this.vacuna.fichaMedica = this.isFichaMedica;
//     this.vacuna.estadoVacuna = 'A';
//     this.vacunaService.saveVacuna(this.vacuna).subscribe((data) => {
//       alert('SUCESSFULL');
//       this.getListaVacunasByIdFichaMedica(this.isFichaMedica.idFichaMedica!)
//       this.vacuna = {} as Vacuna;
//       this.isFichaMedica = {} as FichaMedica;
//       this.selectedVacuna = {} as TipoVacuna;
//       this.visibleVacuna = false;
//     })
//   }
//   mostrarPanel: boolean = false;


//   // SELECT ANIMAL
//   isIdAnimal!: number
//   isFichaMedica = new FichaMedica()
//   selectAnimal(idAnimal: number, fichaMedica: FichaMedica) {
//     this.isIdAnimal = idAnimal;
//     this.isFichaMedica = fichaMedica;
//     this.visible = false;
//     this.getListaVacunasByIdFichaMedica(fichaMedica.idFichaMedica!)
//     this.getPeyloadEnfermedadAnimal(fichaMedica.idFichaMedica!)
//     this.getPeyloadTratamientoAnimal(fichaMedica.idFichaMedica!)
//     this.getPeyloadAlergiaAnimal(fichaMedica.idFichaMedica!)
//     this.getPeyloadExamenFisicoAnimal(fichaMedica.idFichaMedica!)
//   }

//   //ENFERMEDAD
//   saveEnfermedad() {
//     this.enfermedad.tipoEnfermedad = this.selectedEnfermedad;
//     this.enfermedad.fichaMedica = this.isFichaMedica;
//     this.enfermedad.estadoEnfermedad = 'A';
//     this.enfermedadService.saveEnfermedad(this.enfermedad).subscribe((data) => {
//       alert('SUCESSFULL');
//       this.getPeyloadEnfermedadAnimal(this.isFichaMedica.idFichaMedica!)
//       this.enfermedad = {} as Enfermedad;
//       this.isFichaMedica = {} as FichaMedica;
//       this.selectedEnfermedad = {} as TipoEnfermedad;
//       this.visibleEnfermedad = false;
//     })
//   }

//     //TRATAMIENTO
//     saveTratamiento() {
//       this.tratamiento.tipoTratamiento = this.selectedTratamiento;
//       this.tratamiento.fichaMedica = this.isFichaMedica;
//       this.tratamiento.estadoTratamiento = 'A';
//       this.tratamientoService.saveTratamiento(this.tratamiento).subscribe((data) => {
//         alert('SUCESSFULL');
//         this.getPeyloadTratamientoAnimal(this.isFichaMedica.idFichaMedica!)
//         this.tratamiento = {} as Tratamiento;
//         this.isFichaMedica = {} as FichaMedica;
//         this.selectedTratamiento = {} as TipoTratamiento;
//         this.visibleTratamiento = false;
//       })
//     }

//       //ALERGIAS
//   saveAlergias() {
//     this.alergia.tipoAlergias = this.selectedAlergias;
//     this.alergia.fichaMedica = this.isFichaMedica;
//     this.alergia.tipoAlergias.estado = 1;
//     this.alergiasService.saveAlergias(this.alergia).subscribe((data) => {
//       alert('SUCESSFULL');
//       this.getPeyloadAlergiaAnimal(this.isFichaMedica.idFichaMedica!)
//       this.alergia = {} as Alergias;
//       this.isFichaMedica = {} as FichaMedica;
//       this.selectedAlergias = {} as TipoAlergias;
//       this.visibleAlergia = false;
//     })
//   }

//   fechaExa!: Date;
//   pesoExa!:                 number;
//   frecuenciaExa!:   number;
//   mucosaExa!:               string;
//   ojosrojosExa!:            string;
//   pielExa!:                 string;
//   sistemaUrinarioExa!:      string;
//   sistemaDigestivoExa!:     string;
//   abdomenExa!:              string;

//    // ENFERMEDAD
//     saveExamenFisicocrea() {
//       this.examenfisicos.peso = this.pesoExa;
//       this.examenfisicos.fechaRevisionFisisca = this.fechaExa;
//       this.examenfisicos.frecuenciaCardiaca = this.frecuenciaExa;
//       this.examenfisicos.mucosa = this.mucosaExa;
//       this.examenfisicos.ojosrojos = this.ojosrojosExa;
//       this.examenfisicos.piel = this.pielExa;
//       this.examenfisicos.sistemaUrinario = this.sistemaUrinarioExa;
//       this.examenfisicos.sistemaDigestivo = this.sistemaDigestivoExa;
//       this.examenfisicos.abdomen = this.abdomenExa;
//       this.examenfisicos.fichaMedica = this.isFichaMedica;
//       this.examenfisicoservice.saveExamenFisico(this.examenfisicos).subscribe((data) => {
//         alert('SUCESSFULL');
//         this.getPeyloadEnfermedadAnimal(this.isFichaMedica.idFichaMedica!)
//         this.examenfisicos = {} as ExamenFisico;
//         this.isFichaMedica = {} as FichaMedica;
//         this.selectedExamenFisico = {} as ExamenFisico;
//         this.visibleExamenFisico = false;
//       })
//     }


//     actualizarVacuna() {

//       if (this.tipoVacunaSeleccionada) {
//         this.tipoVacunaService.updateTipoVacuna(this.tipoVacunaSeleccionada.idTipoVacuna, this.tipoVacunaSeleccionada)
//           .subscribe((updatedVacuna: TipoVacuna) => {

//             console.log('Tipo de vacuna actualizado:', updatedVacuna);
//             this.visibleTipoVacuna = false;
//           }, (error) => {
//             console.error('Error al actualizar el tipo de vacuna:', error);
//           });
//       }
//     }

//     actualizarEnfermedad() {

//       if (this.tipoEnfermedadSeleccionada) {
//         this.tipoEnfermedadService.updateTipoEnfermedad(this.tipoEnfermedadSeleccionada.idTipoEnfermedad, this.tipoEnfermedadSeleccionada)
//           .subscribe((updateEnfermedad: TipoEnfermedad) => {

//             console.log('Tipo de enfermedad actualizado:', updateEnfermedad);
//             this.visibleTipoEnfermedad = false;
//           }, (error) => {
//             console.error('Error al actualizar el tipo de enfermedad:', error);
//           });
//       }
//     }

//     actualizarTratamiento() {

//       if (this.tipoTratamientoSeleccionada) {
//         this.tipoTratamientoService.updateTipoTratamiento(this.tipoTratamientoSeleccionada.idTipoTratamiento, this.tipoTratamientoSeleccionada)
//           .subscribe((updatedTratamiento: TipoTratamiento) => {

//             console.log('Tipo de Tratamiento actualizado:', updatedTratamiento);
//             this.visibleTipoTratamiento = false;
//           }, (error) => {
//             console.error('Error al actualizar el tipo de Tratamiento:', error);
//           });
//       }
//     }

//     actualizarAlergia() {

//       if (this.tipoAlergiaSeleccionada) {
//         this.tipoAlergiaService.updateTipoAlergias(this.tipoAlergiaSeleccionada.idTipoAlergia, this.tipoAlergiaSeleccionada)
//           .subscribe((updatedAlergia: TipoAlergias) => {

//             console.log('Tipo de Alergia actualizado:', updatedAlergia);
//             this.visibleTipoAlergia = false;
//           }, (error) => {
//             console.error('Error al actualizar el tipo de Alergia:', error);
//           });
//       }
//     }
}
