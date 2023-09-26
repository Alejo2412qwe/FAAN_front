import { Component, OnInit } from '@angular/core';
import { Toast, ToastrService } from 'ngx-toastr';
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
import { FOLDER_IMAGES, getFile } from 'src/app/util/const-data';
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
    private notificacionesService: NotifacionesService,
    private toastr: ToastrService
  ) { }
  tipoVacunaSeleccionada: TipoVacuna = new TipoVacuna();
  originalAvailableTVacuna: any[] = [];
  ngOnInit(): void {
    this.getAllTiposVacunas();
    this.getListEstadoAnimal();
  }

  // selectedSections: number[] = [];
  showVacunas: boolean = false;
  selectedEstado!: EstadoAnimal;
  public submitted: boolean = false;
  tipoVacuna = new TipoVacuna();
  visibleTipoVacuna: boolean = false;
  control = new ControlAnimal();
  visibleControl: boolean = false;
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
  isTextDigit: string = '';
  public loadingVacuna: boolean = false;
  vacunasAnimales: VacunasAnimales[] = [];
  controlesanimales: PayloadControlAnimal[] = [];
  estadosanimales: EstadoAnimal[] = [];
  public avatarURL: string = '';
  fechacon?: Date;
  observa!: any;
  nombrevete!: any;
  pesoact!: any;
  idcontro!: any;
  visibleEditarControl: boolean = false;
  estadovisible: boolean = false;
  listTipoVacuna: TipoVacuna[] = [];
  selectedVacuna = new TipoVacuna();
  selectEstado = new EstadoAnimal();
  vacuna = new Vacuna();
  visibleVacuna: boolean = false;
  mostrarPanel: boolean = false;
  estadoAnimal = new EstadoAnimal();
  idestado?: any;
  objetoanimal = new Animal();
  vacunasTemporales: any[] = [];
  isIdAnimal!: any
  isControlAnimal = new ControlAnimal();


  //Foto
  public getUriFile(fileName: string): string {
    return getFile(fileName, FOLDER_IMAGES);
  }

  //Validaciones
  public isEmpty(obj: any) {
    return obj ? Object.keys(obj).length === 0 : true;
  }


  //Busqueda Mascota Paginado
  public getAllMascotas(): void {
    this.animalesService.getAllAnimalesPagesOrPlacaOrName(this.isTextDigit, this.isPage, this.isSize, this.isSosrt).subscribe((data: any) => {
      if (data !== null) {
        this.ListAnimales = data.content;
        this.pageTotal = data.totalPages
      }
    });

  }

  //Pagina Anterior
  anteriorPage(): void {
    if (!this.isFirst) {
      this.isPage--;
      this.getAllMascotas();
    }
  }

  //Pagina Siguiente
  siguientePage(): void {
    if (!this.isLast) {
      this.isPage++;
      this.getAllMascotas();
    }
  }

  // Ver Datos de Vacuna Detalle
  VerDetalle(idControlAnimal: number) {
    this.payloadservice.getPeyloadVacunasAnimalById(idControlAnimal).subscribe(data => {
      this.vacunasAnimales = data
      this.visibleVacuna = true;
    })
  }

  //Carga de Datos de Control
  CargarDatodControl(idControlAnimal: number) {
    this.controlAnimalService.getControlById(idControlAnimal).subscribe(data => {
      this.idcontro = data.idControlAnimal;
      this.visibleEditarControl = true;
      this.fechacon = data.fechaControlAnimal;
      this.observa = data.observaciones;
      this.nombrevete = data.nombreVeterinario;
      this.pesoact = data.pesoActual;

    })
  }


  //Listar vacunas segun el control
  getListaVacunasByIdControlAnimal(idControlAnimal: number) {
    this.payloadservice.getPeyloadVacunasAnimalById(idControlAnimal).subscribe(data => {
      this.vacunasAnimales = data
    })
  }

  //Listar control segun el animal
  getListaControlAnimal(idAnimal: number) {
    this.payloadservice.getPeyloadControlAnimal(idAnimal).subscribe(data2 => {
      this.controlesanimales = data2;
    })
  }

  // MODAL
  visible: boolean = false;

  //Abrir Modals
  showModalAnimales() {
    this.visible = true;
    this.getAllMascotas();
  }
  showModalTipoVacuna() {
    this.visibleTipoVacuna = true;
    this.tipoVacuna = {} as TipoVacuna;
  }

  showModalControl() {
    this.visibleControl = true;
    this.control = {} as ControlAnimal;
  }
  showDialogToAddEstado() {
    this.estadovisible = true;
  }

  showModalVacuna() {
    this.getAllTiposVacunas();
    this.visibleVacuna = true;
    this.vacuna = {} as Vacuna;
  }

  public onRowSelect(event: any) {
    this.tipoVacuna = event;
    this.tipoVacunaSeleccionada = event;
  }

  //Metodo automatico de carga de mascota
  onInputChange() {
    if (this.isTextDigit === '') {
      this.getAllMascotas();
    }
  }


  //Guardar Vacuna
  saveTipoVacuna() {
    if (!this.tipoVacuna || !this.tipoVacuna.nombreVacuna) {
      this.toastr.error("Nombre de vacuna no especificado.");
      return;
    }
    const nombreVacunaIngresada = this.tipoVacuna.nombreVacuna.toLowerCase();
    const vacunasDefinidas = this.listTipoVacuna.filter(v => v.nombreVacuna);

    const vacunaExistente = vacunasDefinidas.find(v => v.nombreVacuna!.toLowerCase() === nombreVacunaIngresada);

    if (vacunaExistente) {
      this.toastr.error("La vacuna ya existe.");
    } else {
      this.tipoVacuna.estado = true;
      this.tipoVacunaService.saveTipoVacuna(this.tipoVacuna).subscribe((data) => {
        this.tipoVacuna = {} as TipoVacuna;
        this.visibleTipoVacuna = false;
        this.getAllTiposVacunas();
      });
    }
  }


  //Listar Vacunas
  getAllTiposVacunas() {
    this.tipoVacunaService.getListaTipoVacuna().subscribe((data) => {
      this.listTipoVacuna = data;
    });
  }


  //Listar Tipo Vacuna
  getAllControlAnimal() {
    this.tipoVacunaService.getListaTipoVacuna().subscribe((data) => {
      this.listTipoVacuna = data;
    });
  }

  //Guardar Estado Animal
  saveEstadoAnimal() {
    if (!this.estadoAnimal.tipoEstadoAnimal || !this.estadoAnimal.descripcion) {
      this.toastr.error("Completa todos los campos.");
      return;
    }
    const tipoEstadoAnimal = this.estadoAnimal.tipoEstadoAnimal.toLowerCase();
    const estadoExistente = this.estadosanimales.find(e => e?.tipoEstadoAnimal?.toLowerCase() === tipoEstadoAnimal);
    if (estadoExistente) {

      this.toastr.error("El estado ya existe.");
    } else {
      this.estadoAnimal.estado = 'A';
      this.estadoAnimalService.saveEstadoAnimal(this.estadoAnimal).subscribe(data => {
        this.getListEstadoAnimal();
        this.estadovisible = false;
        this.estadoAnimal.tipoEstadoAnimal = "";
        this.estadoAnimal.descripcion = "";
        this.toastr.success("Estado Agregado");
      });
    }
  }


  //Listado de Estado Animales
  getListEstadoAnimal() {
    this.estadoAnimalService.getListaEstadoAnimal().subscribe(data => {
      this.estadosanimales = data;
    })
  }

  //Guardar Control
  saveControl() {
    this.submitted = true;
    this.control.estadoAnimal = this.selectEstado;
    this.control.animal = this.objetoanimal;
    this.control.estadoControl = true;
    if (Object.keys(this.objetoanimal).length === 0) {
      this.toastr.error('Debe seleccionar un animal');
    } else {
      if (Object.keys(this.selectEstado).length === 0) {
        this.toastr.error('No ha seleccionado un estado');
      } else {
        const validVaccine = this.vacunasTemporales.some(vacuna => vacuna.fechaProximaVacuna);
        if (!validVaccine) {
          this.toastr.error('Debe ingresar al menos una fecha de próxima vacuna para guardar la notificación.');
        } else {
          this.controlAnimalService.saveControl(this.control).subscribe((data) => {
            this.control = data;
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

                });
              }
            }

            this.toastr.success('Control creado con exito');
            this.getListaVacunasByIdControlAnimal(this.isControlAnimal.idControlAnimal!);
            this.limpiarVacunasTemporales2()
            this.control = {} as ControlAnimal;
            this.isControlAnimal = {} as ControlAnimal;
          });
        }
      }
    }
  }



  //Guardar Vacuna
  saveVacuna(control: ControlAnimal, vacunaTemporal: any) {
    this.vacuna.tipoVacuna = vacunaTemporal.tipoVacuna,
      this.vacuna.controlAnimal = control;
    this.vacuna.fechaVacuna = vacunaTemporal.fechaVacuna,
      this.vacuna.estadoVacuna = true;
    this.vacunaService.saveVacuna(this.vacuna).subscribe((data) => {
      this.getListaVacunasByIdControlAnimal(this.isControlAnimal.idControlAnimal!)
      this.vacuna = {} as Vacuna;
      this.isControlAnimal = {} as ControlAnimal;
      this.visibleVacuna = false;
      this.getListaControlAnimal(this.isIdAnimal);
    })
  }


  //Agregar Vacuna en lista Temporal
  agregarVacuna() {
    if (this.selectedVacuna == null || this.vacuna.observaciones == null || this.vacuna.fechaProximaVacuna == null) {
      this.toastr.warning('Debe completar los campos de la vacuna');
    } else {
      const currentDate = new Date();
      const daysUntilNextVaccination = Math.floor((new Date(this.vacuna.fechaProximaVacuna).getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
      this.vacunasTemporales.push({
        tipoVacuna: this.selectedVacuna,
        observaciones: this.vacuna.observaciones,
        fechaProximaVacuna: this.vacuna.fechaProximaVacuna,
        estadoVacuna: true,
        fechaVacuna: this.vacuna.fechaProximaVacuna,
        diasFaltantes: daysUntilNextVaccination,
      });

      this.toastr.info('Vacuna Agregada');
      this.limpiarCampos();
    }
  }

  //Eliminar Vacuna en lista Temporal
  eliminarVacuna(vacuna: any) {
    const index = this.vacunasTemporales.indexOf(vacuna);
    if (index !== -1) {
      this.vacunasTemporales.splice(index, 1);

      this.toastr.warning("Vacuna removida");
    }
  }

  //limpiar Campos en lista Temporal
  limpiarCampos() {
    this.vacuna.observaciones = '';
    this.vacuna.fechaProximaVacuna = new Date();
  }

  //Limpiar Vacunas en lista Temporal
  limpiarVacunasTemporales() {
    this.toastr.warning("Vacunas canceladas");
    this.vacunasTemporales = [];
  }

  //Limpiar Vacunas en lista Temporal
  limpiarVacunasTemporales2() {
    this.vacunasTemporales = [];
  }

  //Obtener Fecha Actual
  obtenerFechaActual(): Date {
    return new Date();
  }


  //Seleccionar Animal
  selectAnimal(idAnimal: number) {
    this.isIdAnimal = idAnimal;
    this.visible = false;
    this.animalesService.getAnimalById(this.isIdAnimal).subscribe(data => {
      this.objetoanimal = data;
    })
    this.getListaControlAnimal(idAnimal);
  }
}