import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { ToastrService } from 'ngx-toastr';
import { NumeroAnimalTipo } from 'src/app/Payloads/PayloadNumeroAnimalTipo';
import { PeyloadNumeroAdopcionFecha } from 'src/app/Payloads/peyloadNumeroAdopcionFecha';
import { PeyloadNumeroAdopcionRaza } from 'src/app/Payloads/peyloadNumeroAdopcionRaza';
import { CargarScrpitsService } from 'src/app/Service/cargar-scrpits.service';
import { PayloadService } from 'src/app/Service/peyloads.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss', './dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(
    private _CargarScript: CargarScrpitsService,
    private payloadService: PayloadService,
    private toastrService: ToastrService
  ) {
    _CargarScript.Cargar(["dashboard"]);
  }

  ngOnInit(): void {
    this.getDatas();
    this.cargarAnimalesPorTipo();
  }

  payloadNAdopcionRaza: PeyloadNumeroAdopcionRaza[] = [];
  payloadNAdopcionYears: PeyloadNumeroAdopcionFecha[] = [];

  // DATAS
  getDatas() {
    this.payloadService.getAllPeyloadNumeroAdopcionRaza().subscribe((data) => {
      this.payloadNAdopcionRaza = data;
      const razas = this.payloadNAdopcionRaza.map(animales => animales.nombreRaza);
      const adopciones = this.payloadNAdopcionRaza.map(animales => animales.numeroAdopcion);
      this.graficoPastel(razas, adopciones);
    })
    this.payloadService.getAllPeyloadNumeroAdopcionFecha().subscribe((data) => {
      this.payloadNAdopcionYears = data;
      const years = this.payloadNAdopcionYears.map(animales => animales.fechaAdopcion);
      const adopciones = this.payloadNAdopcionYears.map(animales => animales.numeroAdopcionFecha);
      this.graficoBarras(years, adopciones);

    })
  }

  // GRAPHICS
  data: any;
  options: any;

  graficoPastel(nombresRazas: any, adopcionesPorRaza: any) {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.data = {
      labels: nombresRazas,
      datasets: [
        {
          label: 'Adopciones',
          data: adopcionesPorRaza,
          backgroundColor: [documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--yellow-500'), documentStyle.getPropertyValue('--green-500')],
          hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--green-400')]
        }
      ]
    };

    this.options = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: textColor
          }
        }
      }
    };
  }


  basicData: any;
  basicOptions: any;

  graficoBarras(years: any, adopcionesPorAño: any) {
    const documentStyle = getComputedStyle(document.documentElement);
    // const textColor = documentStyle.getPropertyValue('--text-color');
    // const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.basicData = {
      labels: years,
      datasets: [
        {
          label: 'Adopciones',
          data: adopcionesPorAño,
          backgroundColor: ['rgba(255, 159, 64, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)'],
          borderColor: ['rgb(255, 159, 64)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)'],
          borderWidth: 1
        }
      ]
    };

    this.basicOptions = {
      plugins: {
        legend: {
          labels: {
            color: '#52a4b7'
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: '#52a4b7'
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        x: {
          ticks: {
            color: '#52a4b7'
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };
  }
  animalesPorTipo!: NumeroAnimalTipo[];
  cargarAnimalesPorTipo() {
    this.payloadService.getAllPeyloadNumeroAnimalTipo().subscribe(
      (data: NumeroAnimalTipo[]) => {
        this.animalesPorTipo = data;
      },
      error => {
        this.toastrService.error('INCONVENIENTE AL OBTENER LOS DATOS.', 'ERROR');
      }
    );
  }

}
