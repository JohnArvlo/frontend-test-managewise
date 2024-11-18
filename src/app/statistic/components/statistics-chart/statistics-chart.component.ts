import { Component, OnInit } from '@angular/core';
import { Chart, registerables, TooltipItem } from 'chart.js';
import { StatisticsService } from '../../services/statistics.service';
import { Statistics } from '../../model/statistic-entity/statistic.entity';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';

Chart.register(...registerables);

@Component({
  selector: 'app-statistics-chart',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './statistics-chart.component.html',
  styleUrls: ['./statistics-chart.component.css']
})
export class StatisticsChartComponent implements OnInit {
  public chart: any;
  public sprints: any[] = [];  // Array para almacenar los sprints

  constructor(
    private statisticsService: StatisticsService,
    private router: Router,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang('en');
    this.translate.use('en'); // O 'in'
  }

  ngOnInit(): void {
    this.fetchStatistics();
  }

  fetchStatistics() {
    // Obtener los sprints de la API
    this.statisticsService.getSprints().subscribe((sprints) => {
      this.sprints = sprints;  // Asignar los sprints al array

      this.statisticsService.getUserStories().subscribe((statistics: Statistics[]) => {
        const sprintCounts: { [key: number]: { complete: number; inProgress: number; total: number; titlesComplete: { title: string; owner: string }[]; titlesInProgress: { title: string; owner: string }[] } } = {};

        // Inicializar el objeto sprintCounts basado en los sprints dinámicos
        this.sprints.forEach(sprint => {
          sprintCounts[sprint.id] = { complete: 0, inProgress: 0, total: 0, titlesComplete: [], titlesInProgress: [] };
        });

        statistics.forEach(stat => {
          if (sprintCounts[stat.sprint]) {
            if (stat.status === 'COMPLETE') {
              sprintCounts[stat.sprint].complete++;
              sprintCounts[stat.sprint].titlesComplete.push({ title: stat.title, owner: stat.owner });
            } else if (stat.status === 'TO_DO') {
              sprintCounts[stat.sprint].inProgress++;
              sprintCounts[stat.sprint].titlesInProgress.push({ title: stat.title, owner: stat.owner });
            }
            sprintCounts[stat.sprint].total++;
          }
        });

        this.createChart(sprintCounts);
      });
    });
  }

  createChart(sprintCounts: { [key: number]: { complete: number; inProgress: number; total: number; titlesComplete: { title: string; owner: string }[]; titlesInProgress: { title: string; owner: string }[] } }) {
    const ctx = document.getElementById('myStatisticChart') as HTMLCanvasElement;

    // Generar dinámicamente las etiquetas y los porcentajes según los sprints disponibles
    const labels = this.sprints.map(sprint => `Sprint ${sprint.id}`);
    const completePercentages = this.sprints.map(sprint => {
      const count = sprintCounts[sprint.id];
      return count ? (count.total ? (count.complete / count.total) * 100 : 0) : 0;
    });

    const inProgressPercentages = this.sprints.map(sprint => {
      const count = sprintCounts[sprint.id];
      return count ? (count.total ? (count.inProgress / count.total) * 100 : 0) : 0;
    });

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,  // Usar etiquetas dinámicas de los sprints
        datasets: [
          {
            label: 'Historias Completadas (%)',
            data: completePercentages,
            backgroundColor: 'rgba(0, 255, 0, 0.5)' // Verde
          },
          {
            label: 'Historias en progreso (%)',
            data: inProgressPercentages,
            backgroundColor: 'rgba(255, 0, 0, 0.5)' // Rojo
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: (value) => value + '%',
              stepSize: 10
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              title: (tooltipItems) => {
                const sprintIndex = tooltipItems[0].dataIndex;
                return `Sprint ${this.sprints[sprintIndex].id}`;
              },
              label: (tooltipItem: TooltipItem<'bar'>) => {
                const datasetLabel = tooltipItem.dataset.label || '';
                const value = tooltipItem.raw as number;
                return `${datasetLabel}: ${value.toFixed(2)}%`;
              },
              afterLabel: (tooltipItem: TooltipItem<'bar'>) => {
                const sprintIndex = tooltipItem.dataIndex;
                const sprintData = sprintCounts[this.sprints[sprintIndex].id];

                // Determina si es el dataset de "Completadas" o "En Progreso"
                let titles: { title: string; owner: string }[] = [];
                if (tooltipItem.datasetIndex === 0) { // Dataset "Completadas"
                  titles = sprintData.titlesComplete;
                } else { // Dataset "En Progreso"
                  titles = sprintData.titlesInProgress;
                }

                // Construir la cadena de información adicional
                const additionalInfo = titles.map((titleInfo) => {
                  return `Title: ${titleInfo.title}, Owner: ${titleInfo.owner}`;
                }).join('\n');

                return additionalInfo || 'No titles'; // Mostrar las historias relevantes o un mensaje por defecto
              }
            }
          }
        }
      }
    });
  }

  // Método para manejar el clic en el botón de timeline
  viewTimeline() {
    this.router.navigate(['/timeline']); // Redirecciona a la ruta de Timeline
  }

  // Método para descargar el gráfico como imagen PNG
  downloadChart() {
    const canvas = document.getElementById('myStatisticChart') as HTMLCanvasElement;
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'statistics_chart.png';
    link.click();
  }
}
