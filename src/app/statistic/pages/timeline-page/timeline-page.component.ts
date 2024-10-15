import { Component, OnInit, ViewChild } from "@angular/core";
import { StatisticsService } from '../../services/statistics.service';
import { Statistics } from '../../model/statistic-entity/statistic.entity';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';

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
  imports: [CommonModule, NgApexchartsModule]
})
export class TimelinePageComponent implements OnInit {
  @ViewChild("chart") chart!: ChartComponent;
  userStories: Statistics[] = [];
  chartOptions: any;

  newUserStory: Statistics = new Statistics(0, '', '', '', 'To do', 0, new Date(), new Date(), 0); // Agrega el parámetro de esfuerzo

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit() {
    this.loadUserStories();
  }

  loadUserStories() {
    this.statisticsService.getUserStories().subscribe((stories) => {
      this.userStories = stories.map(story => new Statistics(
        story.id,
        story.title,
        story.description,
        story.owner,
        story.status,
        story.sprint,
        new Date(story.startDate),
        new Date(story.endDate),
        story.effort // Asegúrate de pasar el valor de esfuerzo aquí
      ));
      this.initializeChart();
    });
  }

  initializeChart() {
    this.chartOptions = {
      series: [{
        name: 'User Stories',
        data: this.userStories.map(story => ({
          x: story.title,
          y: [story.startDate.getTime(), story.endDate.getTime()],
          sprint: story.sprint
        }))
      }],
      chart: {
        type: 'rangeBar',
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: true,
          dataLabels: {
            position: 'top'
          }
        }
      },
      xaxis: {
        type: 'datetime',
        labels: {
          formatter: (value: number) => new Date(value).toLocaleDateString(),
        }
      },
      yaxis: {
        categories: this.userStories.map(story => story.sprint), // Establece dinámicamente las categorías de sprint
      }
    };
  }

  addUserStory() {
      // Validar el nuevo user story
      if (this.newUserStory.title && this.newUserStory.description) {
        this.statisticsService.addUserStory(this.newUserStory).subscribe((addedStory: Statistics) => {
          // Añadir la nueva historia a la lista de user stories
          this.userStories.push(new Statistics(
            addedStory.id,
            addedStory.title,
            addedStory.description,
            addedStory.owner,
            addedStory.status,
            addedStory.sprint,
            new Date(addedStory.startDate),
            new Date(addedStory.endDate),
            addedStory.effort // Asegúrate de incluir el esfuerzo
          ));

          // Reiniciar el formulario para una nueva historia
          this.newUserStory = new Statistics(0, '', '', '', 'To do', 0, new Date(), new Date(), 0);

          // Actualizar el gráfico después de añadir una nueva historia
          this.initializeChart();
        });
      } else {
        // Manejo de errores, si es necesario
        console.error('Title and description are required to add a user story.');
      }
  }

}
