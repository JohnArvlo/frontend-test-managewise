import { Component, OnInit, ViewChild } from "@angular/core";
import { StatisticsService } from '../../services/statistics.service';
import { Statistics } from '../../model/statistic-entity/statistic.entity';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexPlotOptions,
  ApexXAxis,
  ApexDataLabels,
  ApexLegend
} from "ng-apexcharts";

@Component({
  selector: 'app-timeline-page',
  templateUrl: './timeline-page.component.html',
  styleUrls: ['./timeline-page.component.css'],
  standalone: true,
  imports: [CommonModule, NgApexchartsModule, TranslateModule]
})
export class TimelinePageComponent implements OnInit {
  @ViewChild("chart") chart!: ChartComponent;
  userStories: Statistics[] = [];
  chartOptions: any;

  newUserStory: Statistics = new Statistics(0, '', '', '', 'To do', 0, new Date(), new Date(), 0);

  // Color mapping for each sprint
  private sprintColors: { [key: number]: string } = {
    1: '#FF5733', // Color for Sprint 1 (red)
    2: '#33FF57', // Color for Sprint 2 (green)
    3: '#3357FF', // Color for Sprint 3 (blue)
    4: '#F33FFF', // Color for Sprint 4 (magenta)
  };

  constructor(private statisticsService: StatisticsService, private router: Router, private translate: TranslateService) {
    this.translate.setDefaultLang('en');
    this.translate.use('en'); // O 'in'
  }

  ngOnInit() {
    this.loadUserStories();
  }

  loadUserStories() {
    this.statisticsService.getUserStories().subscribe({
      next: (stories) => {
        console.log('Historias recibidas:', stories); // Verifica las historias recibidas
        this.userStories = stories.map(story => {
          console.log('Historia:', story); // Log para cada historia
          console.log('Start Date:', story.startDate, 'End Date:', story.endDate); // Verifica las fechas
          return new Statistics(
            story.id,
            story.title,
            story.description,
            story.owner,
            story.status,
            story.sprint,
            this.toDate(story.startDate), // Convierte a Date
            this.toDate(story.endDate), // Convierte a Date
            story.effort
          );
        });
        this.initializeChart();
        console.log(this.userStories); // Verifica el contenido de userStories después de cargar
      },
      error: (error) => {
        console.error('Error al cargar historias de usuario:', error);
      }
    });
  }

  initializeChart() {
    interface SeriesData {
      name: string;
      data: { x: string; y: number[]; fillColor: string }[];
    }

    const seriesData: SeriesData[] = this.userStories.reduce((acc: SeriesData[], story) => {
      const existingSprint = acc.find(s => s.name === `Sprint ${story.sprint}`);

      const storyData = {
        x: `Sprint ${story.sprint}`,
        y: [
          story.startDate.getTime(),
          story.endDate.getTime()
        ],
        fillColor: this.getColorBySprint(story.sprint)
      };

      if (existingSprint) {
        existingSprint.data.push(storyData);
      } else {
        acc.push({
          name: `Sprint ${story.sprint}`,
          data: [storyData]
        });
      }
      return acc;
    }, []);

    console.log("Series Data:", seriesData);

    this.chartOptions = {
      series: seriesData,
      chart: {
        height: 350,
        type: "rangeBar",
        toolbar: {
          show: true,
          tools: {
            download: false, // Permite la descarga
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true,
          },
          export: {
            csv: {
              enabled: false // Deshabilita exportación CSV
            },
            svg: {
              enabled: false // Deshabilita exportación SVG
            },
            png: {
              enabled: false // Habilita exportación PNG
            }
          }
        }
      },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: '100%',
        }
      },
      xaxis: {
        type: 'datetime',
        tickAmount: 14,
        labels: {
          format: 'dd MMM',
        },
      },

      yaxis: {
        labels: {
          style: {
            fontSize: '12px',
          }
        }
      },
      legend: {
        show: false,
      }
    };
  }


  getColorBySprint(sprint: number): string {
    return this.sprintColors[sprint] || '#000000'; // Default to black if not found
  }

  // Método para redirigir a la página de estadísticas
  navigateToStatistics() {
    this.router.navigate(['/statistics']); // Redirige a /statistics
  }

  // Método para convertir a Date
  private toDate(dateInput: any): Date {
    if (dateInput instanceof Date) {
      return dateInput; // Si ya es un Date, simplemente devuelve
    } else if (typeof dateInput === 'string' || typeof dateInput === 'number') {
      const date = new Date(dateInput);
      if (!isNaN(date.getTime())) {
        return date; // Solo retorna si la fecha es válida
      }
    }
    console.warn('Entrada de fecha inválida:', dateInput); // Log de advertencia
    return new Date(); // Manejo por defecto
  }
}
