import { Component, OnInit } from '@angular/core';
import { Toast } from 'ngx-toastr';
import { ControlAnimal } from 'src/app/Models/controlAnimal';
import { EstadoAnimal } from 'src/app/Models/estadoAnimal';
import { Animal, Notificaciones, TipoAnimal, TipoVacuna, Vacuna } from 'src/app/Models/models';
import { PayloadControlAnimal } from 'src/app/Payloads/payloadControlPorAnimal';
import { VacunasAnimales } from 'src/app/Payloads/payloadVacunasAnimal';
import { AnimalService } from 'src/app/Service/animal.service';
import { ControlAnimalService } from 'src/app/Service/controlAnimal.service';
import { EsatadoAnimalService } from 'src/app/Service/estadoAnimal.service';
import { NotifacionesService } from 'src/app/Service/notifaciones.service';
import { PayloadService } from 'src/app/Service/peyloads.service';
import { TipoVacunaService } from 'src/app/Service/tipoVacuna.service';
import { VacunaService } from 'src/app/Service/vacuna.service';
@Component({
  selector: 'app-control-animal',
  templateUrl: './control-animal.component.html',
  styleUrls: ['./control-animal.component.css', './control-animal.component.scss']
})
export class ControlAnimalComponent implements OnInit {


  constructor(
    private animalesService: AnimalService,
    private tipoVacunaService: TipoVacunaService,
    private vacunaService: VacunaService,
    private controlAnimalService: ControlAnimalService,
    private estadoAnimalService: EsatadoAnimalService,
    private payloadservice: PayloadService,
    private notificacionesService: NotifacionesService
  ) { }
  tipoVacunaSeleccionada: TipoVacuna = new TipoVacuna();
  originalAvailableTVacuna: any[] = [];
  ngOnInit(): void {
    this.getAllTiposVacunas();
    this.getListEstadoAnimal();
    this.selectedTVacuna = [];
    this.originalAvailableTVacuna = [...this.availableTVacuna];
  }

  // selectedSections: number[] = [];
  showVacunas: boolean = false;
  selectedEstado!: EstadoAnimal;


  // showCard(section: number) {
  //   const index = this.selectedSections.indexOf(section);
  //   if (index === -1) {
  //     // If the section is not already selected, add it to the array.
  //     this.selectedSections.push(section);
  //   } else {
  //     // If the section is already selected, remove it from the array.
  //     this.selectedSections.splice(index, 1);
  //   }
  // }

  // GET ANIMALES FOR PARAMETERS
  public ListAnimales!: Animal[];

  // PAGES
  isPage: number = 0;
  isSize: number = 8
  isSosrt: string[] = ['nombreAnimal', 'asc']
  selectedVacunatipo: TipoVacuna[] | undefined;
  selectedEstadoId!: number;
  pageTotal: number = 0;
  isFirst: boolean = false;
  isLast: boolean = false;
  public loadingVacuna: boolean = false;



  isTextDigit!: string;
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
  vacunasAnimales: VacunasAnimales[] = [];
  controlesanimales: PayloadControlAnimal[] = [];
  estadosanimales: EstadoAnimal[] = [];

  VerDetalle(idControlAnimal: number) {
    console.log(idControlAnimal);
    this.payloadservice.getPeyloadVacunasAnimalById(idControlAnimal).subscribe(data => {
      this.vacunasAnimales = data
      console.log(this.vacunasAnimales);
      this.visibleVacuna = true;
    })
  }

  fechacon?: Date;
  observa!: any;
  nombrevete!: any;
  pesoact!: any;
  idcontro!: any;
  visibleEditarControl: boolean = false;
  CargarDatodControl(idControlAnimal: number) {
    this.controlAnimalService.getControlById(idControlAnimal).subscribe(data => {
      console.log(data);
      this.idcontro = data.idControlAnimal;
      this.visibleEditarControl = true;
      this.fechacon = data.fechaControlAnimal;
      this.observa = data.observaciones;
      this.nombrevete = data.nombreVeterinario;
      this.pesoact = data.pesoActual;

    })
  }

  ActulizarDatosControl() {
    console.log("entroooupdate");
    this.control.nombreVeterinario = this.nombrevete;
    this.control.observaciones = this.observa;
    this.control.pesoActual = this.pesoact;
    this.control.fechaControlAnimal = this.fechacon;
    this.controlAnimalService.updateControl(this.idcontro, this.control).subscribe(data => {
      console.log(data);
    })
  }

  CancelarEditarControl() {
    this.idcontro = "";
    this.visibleEditarControl = false;
    this.fechacon = new Date;
    this.observa = "";
    this.nombrevete = "";
    this.pesoact = "";
  }

  getListaVacunasByIdControlAnimal(idControlAnimal: number) {
    console.log("entro")
    this.payloadservice.getPeyloadVacunasAnimalById(idControlAnimal).subscribe(data => {
      this.vacunasAnimales = data
    })
  }

  getListaControlAnimal(idAnimal: number) {
    this.payloadservice.getPeyloadControlAnimal(idAnimal).subscribe(data2 => {
      console.log("entrooooooooo");
      console.log(data2);
      this.controlesanimales = data2;
      console.log(this.controlesanimales);
    })
  }

  estadovisible: boolean = false;

  showDialogToAddEstado() {
    this.estadovisible = true;
  }

  public onRowSelect(event: any) {
    this.tipoVacuna = event;
    this.tipoVacunaSeleccionada = event;
  }



  // MODAL
  visible: boolean = false;

  showModalAnimales() {
    this.visible = true;
    this.getAllMascotas();
  }

  // MODAL TIPO VACUNA
  tipoVacuna = new TipoVacuna();
  visibleTipoVacuna: boolean = false;

  control = new ControlAnimal();
  visibleControl: boolean = false;

  showModalTipoVacuna() {
    this.visibleTipoVacuna = true;
    this.tipoVacuna = {} as TipoVacuna;
  }

  showModalControl() {
    this.visibleControl = true;
    this.control = {} as ControlAnimal;
  }


  saveTipoVacuna() {
    this.tipoVacuna.estado = true;
    this.tipoVacunaService.saveTipoVacuna(this.tipoVacuna).subscribe((data) => {
      alert('SUCESSFULL');
      this.tipoVacuna = {} as TipoVacuna;
      this.visibleTipoVacuna = false;
    })
  }


  // GET VACUNAS
  listTipoVacuna: TipoVacuna[] = [];
  selectedVacuna = new TipoVacuna();

  getAllTiposVacunas() {
    this.tipoVacunaService.getListaTipoVacuna().subscribe((data) => {
      this.listTipoVacuna = data;
      this.availableTVacuna = data;
    });
  }

  getAllControlAnimal() {
    this.tipoVacunaService.getListaTipoVacuna().subscribe((data) => {
      this.listTipoVacuna = data;
    });
  }


  // STATE ANIMAL
  selectEstado = new EstadoAnimal();

  saveEstadoAnimal() {
    this.estadoAnimal.estado = 'A';
    this.estadoAnimalService.saveEstadoAnimal(this.estadoAnimal).subscribe(data => {
      alert('SUCESSFULL');
      this.getListEstadoAnimal();
    })
  }

  getListEstadoAnimal() {
    this.estadoAnimalService.getListaEstadoAnimal().subscribe(data => {
      this.estadosanimales = data;
    })
  }




  // MODAl ADD VACUNA FOR ANIMAL
  vacuna = new Vacuna();
  visibleVacuna: boolean = false;


  showModalVacuna() {
    this.getAllTiposVacunas();
    this.visibleVacuna = true;
    this.vacuna = {} as Vacuna;
  }




  mostrarPanel: boolean = false;
  estadoAnimal = new EstadoAnimal();
  idestado?: any;


  objetoanimal = new Animal();

  saveControl() {
    this.control.estadoAnimal = this.selectEstado;
    this.control.animal = this.objetoanimal;
    console.log(this.control.animal);
    this.control.estadoControl = true;
    if (Object.keys(this.objetoanimal).length === 0) {
      alert('Debe seleccionar un animal');
    } else {
      if (Object.keys(this.selectEstado).length === 0) {
        alert('No ha seleccionado un estado');
      } else {
        const validVaccine = this.vacunasTemporales.some(vacuna => vacuna.fechaProximaVacuna);
        if (!validVaccine) {
          alert('Debe ingresar al menos una fecha de próxima vacuna para guardar la notificación.');
        } else {
          this.controlAnimalService.saveControl(this.control).subscribe((data) => {
            this.control = data;
            console.log(data);
  
            const currentDate = new Date(); 
            for (const vacunaTemporal of this.vacunasTemporales) {
              if (vacunaTemporal.fechaProximaVacuna) { 
           
                const daysUntilNextVaccination = Math.floor((new Date(vacunaTemporal.fechaProximaVacuna).getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
  
                this.saveVacuna(this.control, vacunaTemporal);
  
                const notificacion: Notificaciones = {
                  fullNameMascota: this.control.animal?.nombreAnimal, 
                  cuerpoMensaje: `Próxima vacunación en ${daysUntilNextVaccination} días.`,
                  diasFaltantes: daysUntilNextVaccination.toString(),
                  estadoNotifacion: 'A',
                  proximaFechaFacunacion: vacunaTemporal.fechaProximaVacuna,
                };
  
                this.notificacionesService.saveNotificacion(notificacion).subscribe((data) => {
                  console.log('Notificación guardada con éxito.');
                  console.log(data);
                });
              }
            }
  
            alert('ÉXITO');
            this.getListaVacunasByIdControlAnimal(this.isControlAnimal.idControlAnimal!);
            this.control = {} as ControlAnimal;
            this.isControlAnimal = {} as ControlAnimal;
          });
        }
      }
    }
  }
  



  saveVacuna(control: ControlAnimal, vacunaTemporal: any) {
    this.vacuna.tipoVacuna = vacunaTemporal.tipoVacuna,
      this.vacuna.controlAnimal = control;
    this.vacuna.fechaVacuna = vacunaTemporal.fechaVacuna,
      this.vacuna.estadoVacuna = true;
    this.vacunaService.saveVacuna(this.vacuna).subscribe((data) => {
      console.log(data);
      alert('SUCESSFULL');
      this.getListaVacunasByIdControlAnimal(this.isControlAnimal.idControlAnimal!)
      this.vacuna = {} as Vacuna;
      this.isControlAnimal = {} as ControlAnimal;
      this.visibleVacuna = false;
      this.getListaControlAnimal(this.isIdAnimal);
    })
  }




  vacunasTemporales: any[] = [];

  agregarVacuna() {


    const currentDate = new Date();
    const daysUntilNextVaccination = Math.floor((new Date(this.vacuna.fechaProximaVacuna).getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
  
    this.vacunasTemporales.push({
      tipoVacuna: this.selectedVacuna,
      observaciones: this.vacuna.observaciones,
      fechaProximaVacuna: this.vacuna.fechaProximaVacuna,
      estadoVacuna: true,
      fechaVacuna: this.obtenerFechaActual(),
      diasFaltantes: daysUntilNextVaccination, 
    });
    
    alert("Vacuna Agregada");
    this.limpiarCampos();
    console.log(this.vacunasTemporales);
  }
  eliminarVacuna(vacuna: any) {
    const index = this.vacunasTemporales.indexOf(vacuna);
    if (index !== -1) {
      this.vacunasTemporales.splice(index, 1);
      console.log("Vacuna Eliminada");
      console.log(this.vacunasTemporales);
    }
  }

  limpiarCampos() {
    this.vacuna.observaciones = '';
    this.vacuna.fechaProximaVacuna = new Date();
  }

  limpiarVacunasTemporales() {
    alert("Vacunas canceladas");
    this.vacunasTemporales = [];
    console.log(this.vacunasTemporales);
  }



  obtenerFechaActual(): Date {
    return new Date();
  }

  // SELECT ANIMAL
  isIdAnimal!: any
  isControlAnimal = new ControlAnimal();
  selectAnimal(idAnimal: number) {
    this.isIdAnimal = idAnimal;
    this.visible = false;
    this.animalesService.getAnimalById(this.isIdAnimal).subscribe(data => {
      this.objetoanimal = data;
    })
    this.getListaControlAnimal(idAnimal);
  }



  actualizarVacuna() {

    if (this.tipoVacunaSeleccionada) {
      this.tipoVacunaService.updateTipoVacuna(this.tipoVacunaSeleccionada.idTipoVacuna, this.tipoVacunaSeleccionada)
        .subscribe((updatedVacuna: TipoVacuna) => {

          console.log('Tipo de vacuna actualizado:', updatedVacuna);
          this.visibleTipoVacuna = false;
        }, (error) => {
          console.error('Error al actualizar el tipo de vacuna:', error);
        });
    }
  }

  availableTVacuna!: any[];
  selectedTVacuna: any[] = [];
  draggedTVacuna: any | undefined | null;

  dragStart(product: any) {
    this.draggedTVacuna = product;
  }

  drop() {
    if (this.draggedTVacuna) {
      if (this.selectedTVacuna.includes(this.draggedTVacuna)) {
        return;
      }

      let draggedProductIndex = this.findIndex(this.draggedTVacuna);
      this.selectedTVacuna = [...this.selectedTVacuna, this.draggedTVacuna];
      this.availableTVacuna = this.availableTVacuna?.filter((val, i) => i != draggedProductIndex);
      this.draggedTVacuna = null;
    }
  }

  dragEnd() {
    this.draggedTVacuna = null;
  }

  findIndex(product: any) {
    let index = -1;
    for (let i = 0; i < (this.availableTVacuna as any[]).length; i++) {
      if (product.id === (this.availableTVacuna as any[])[i].id) {
        index = i;
        break;
      }
    }
    return index;
  }

  // getSeverity(status: string) {
  //   switch (status) {
  //     case 'INSTOCK':
  //       return 'success';
  //     case 'LOWSTOCK':
  //       return 'warning';
  //     case 'OUTOFSTOCK':
  //       return 'danger';
  //     default: return '';
  //   }
  // }

  selectedTipoVacunas: any[] = [];

  addSelectedTipoVacunas() {
    this.visibleVacuna = true;
    this.selectedTipoVacunas = [...this.selectedTipoVacunas, ...this.selectedTVacuna];
    console.log(this.selectedTipoVacunas);
  }

  resetTable() {
    this.selectedTVacuna = [];
    this.tipoVacunaService.getListaTipoVacuna().subscribe((data) => {
      this.listTipoVacuna = data;
      this.availableTVacuna = data;
    });
  }



}
