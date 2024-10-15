import { Component, OnInit } from '@angular/core';
import { Chart, registerables, TooltipItem } from 'chart.js';
import { StatisticsService } from '../../services/statistics.service';
import { Statistics } from '../../model/statistic-entity/statistic.entity';
import { Router } from '@angular/router'; // Importa el Router

Chart.register(...registerables);

@Component({
  selector: 'app-statistics-chart',
  standalone: true,
  templateUrl: './statistics-chart.component.html',
  styleUrls: ['./statistics-chart.component.css']
})
export class StatisticsChartComponent implements OnInit {
  public chart: any;

  constructor(private statisticsService: StatisticsService, private router: Router) {} // Inyecta el Router

  ngOnInit(): void {
    this.fetchStatistics();
  }

  fetchStatistics() {
    this.statisticsService.getUserStories().subscribe((statistics: Statistics[]) => {
      const sprintCounts: {
        [key: number]: {
          complete: number;
          inProgress: number;
          total: number;
          titlesComplete: { title: string; owner: string }[];
          titlesInProgress: { title: string; owner: string }[];
        }
      } = {
        1: { complete: 0, inProgress: 0, total: 0, titlesComplete: [], titlesInProgress: [] },
        2: { complete: 0, inProgress: 0, total: 0, titlesComplete: [], titlesInProgress: [] },
        3: { complete: 0, inProgress: 0, total: 0, titlesComplete: [], titlesInProgress: [] },
        4: { complete: 0, inProgress: 0, total: 0, titlesComplete: [], titlesInProgress: [] }
      };

      statistics.forEach(stat => {
        if (stat.sprint >= 1 && stat.sprint <= 4) {
          if (stat.status === 'Complete') {
            sprintCounts[stat.sprint].complete++;
            sprintCounts[stat.sprint].titlesComplete.push({ title: stat.title, owner: stat.owner });
          } else if (stat.status === 'To do') {
            sprintCounts[stat.sprint].inProgress++;
            sprintCounts[stat.sprint].titlesInProgress.push({ title: stat.title, owner: stat.owner });
          }
          sprintCounts[stat.sprint].total++;
        }
      });

      this.createChart(sprintCounts);
    });
  }

  createChart(sprintCounts: { [key: number]: { complete: number; inProgress: number; total: number; titlesComplete: { title: string; owner: string }[]; titlesInProgress: { title: string; owner: string }[] } }) {
    const ctx = document.getElementById('myStatisticChart') as HTMLCanvasElement;

    const completePercentages = [
      (sprintCounts[1].total ? (sprintCounts[1].complete / sprintCounts[1].total) * 100 : 0),
      (sprintCounts[2].total ? (sprintCounts[2].complete / sprintCounts[2].total) * 100 : 0),
      (sprintCounts[3].total ? (sprintCounts[3].complete / sprintCounts[3].total) * 100 : 0),
      (sprintCounts[4].total ? (sprintCounts[4].complete / sprintCounts[4].total) * 100 : 0)
    ];

    const inProgressPercentages = [
      (sprintCounts[1].total ? (sprintCounts[1].inProgress / sprintCounts[1].total) * 100 : 0),
      (sprintCounts[2].total ? (sprintCounts[2].inProgress / sprintCounts[2].total) * 100 : 0),
      (sprintCounts[3].total ? (sprintCounts[3].inProgress / sprintCounts[3].total) * 100 : 0),
      (sprintCounts[4].total ? (sprintCounts[4].inProgress / sprintCounts[4].total) * 100 : 0)
    ];

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Sprint 1', 'Sprint 2', 'Sprint 3', 'Sprint 4'],
        datasets: [
          {
            label: 'Historias Completadas (%)',
            data: completePercentages,
            backgroundColor: 'rgba(0, 255, 0, 0.5)' // Verde
          },
          {
            label: 'Historias en Progreso (%)',
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
                const sprintIndex = tooltipItems[0].dataIndex; // Get the index of the data point
                const sprint = sprintCounts[sprintIndex + 1]; // Get the corresponding sprint data
                return `Sprint ${sprintIndex + 1}`; // Set the title for the tooltip
              },
              label: (tooltipItem: TooltipItem<'bar'>) => {
                const datasetLabel = tooltipItem.dataset.label || '';
                const value = tooltipItem.raw as number; // Use 'as number' to assert type
                return `${datasetLabel}: ${value.toFixed(2)}%`;
              },
              afterLabel: (tooltipItem: TooltipItem<'bar'>) => {
                const sprintIndex = tooltipItem.dataIndex; // Get the index of the data point
                const sprintData = sprintCounts[sprintIndex + 1]; // Get the corresponding sprint data
                const titles = [...sprintData.titlesComplete, ...sprintData.titlesInProgress]; // Combine complete and in-progress titles

                // Build the additional info string
                const additionalInfo = titles.map((titleInfo) => {
                  return `Title: ${titleInfo.title}, Owner: ${titleInfo.owner}`;
                }).join('\n');

                return additionalInfo || 'No titles'; // Return the combined string or a default message
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
