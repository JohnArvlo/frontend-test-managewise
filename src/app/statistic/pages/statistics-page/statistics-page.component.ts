import { Component, OnInit } from '@angular/core';
import { StatisticsService } from '../../services/statistics.service';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexPlotOptions, ApexYAxis } from 'ng-apexcharts';
import { RouterModule } from '@angular/router';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CommonModule } from '@angular/common'; // Asegúrate de que esta línea está presente
import { StatisticsChartComponent } from '../../components/statistics-chart/statistics-chart.component';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
};

@Component({
  standalone: true,
  selector: 'app-statistics-page',
  templateUrl: './statistics-page.component.html',
  styleUrls: ['./statistics-page.component.css'],
  imports: [CommonModule, RouterModule, NgApexchartsModule, StatisticsChartComponent, TranslateModule, TranslateModule], // Asegúrate de que CommonModule esté aquí
})
export class StatisticsPageComponent implements OnInit {
  public chartOptions: Partial<ChartOptions>;
  public members: any[] = []; // Definir la variable para los miembros

  constructor(private statisticsService: StatisticsService) {
    this.chartOptions = {
      series: [],
      chart: {
        type: 'bar',
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      dataLabels: {
        enabled: true,
      },
      yaxis: {
        min: 0,
        max: 10,
        tickAmount: 10,
        labels: {
          formatter: (val) => `${val}`,
        },
      },
    };
  }

  ngOnInit(): void {
    this.statisticsService.getUserStories().subscribe((userStories) => {
      const totalStories = userStories.length;

      if (totalStories === 0) {
        this.chartOptions.series = [];
        return;
      }

      const inProgress = userStories.filter((story) => story.status === 'TO_DO').length;
      const complete = userStories.filter((story) => story.status === 'COMPLETE').length;

      const inProgressValue = Math.min(10, Math.ceil((inProgress / totalStories) * 10));
      const completeValue = Math.min(10, Math.ceil((complete / totalStories) * 10));

      this.chartOptions = {
        series: [
          {
            name: 'To do',
            data: [{ x: 'Sprint 1', y: inProgressValue }],
          },
          {
            name: 'Complete',
            data: [{ x: 'Sprint 1', y: completeValue }],
          },
        ],
      };
    });

    this.statisticsService.getMembers().subscribe((members) => {
      this.members = members; // Almacenar los miembros
      console.log('Members:', members);
    });
  }
}
