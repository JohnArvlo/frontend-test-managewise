  import { Routes } from '@angular/router';
  import { StatisticsPageComponent } from './statistic/pages/statistics-page/statistics-page.component'; // Importa el componente de estadísticas
  import { PageNotFoundComponent } from "./public/pages/page-not-found/page-not-found.component";
  import { TimelinePageComponent } from './statistic/pages/timeline-page/timeline-page.component'; // Cambia TimeLine a Timeline
  import { BacklogPageComponent } from './backlog/pages/backlog-page/backlog-page.component';
  import { BacklogItemsPageComponent } from './backlog/pages/backlog-items-page/backlog-items-page.component';
import { IssuesListComponent } from "./issue/pages/issues-list/issues-list.component";
import { MeetingManagementComponent } from './meeting/pages/meeting-management/meeting-management.component'; // Cambia TimeLine a Timeline
import { RecordingManagementComponent } from './meeting/components/recording-management/recording-management.component'; // Cambia TimeLine a Timeline

  export const routes: Routes = [
    { path: 'statistics', component: StatisticsPageComponent },
    { path: 'backlog', component: BacklogPageComponent },
    { path: 'backlog-items', component: BacklogItemsPageComponent },
    { path: 'issues', component: IssuesListComponent },
    { path: 'meeting', component: MeetingManagementComponent },
{ path: 'recordings', component: RecordingManagementComponent},
    { path: '', redirectTo: 'project', pathMatch: 'full' }, // Redirección por defecto
    { path: '**', component: PageNotFoundComponent } // Ruta para páginas no encontradas
  ];

