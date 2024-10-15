import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Statistics } from '../model/statistic-entity/statistic.entity'; // Asegúrate de importar el modelo correcto

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  constructor(private http: HttpClient) {}

  // Método para obtener las User Stories
  getUserStories(): Observable<Statistics[]> {
    return this.http.get<Statistics[]>('https://my-json-server.typicode.com/CB-Sergio-AGV/db/userStories');
  }

  // Método para agregar una nueva User Story
  addUserStory(story: Statistics): Observable<Statistics> {
    return this.http.post<Statistics>('https://my-json-server.typicode.com/CB-Sergio-AGV/db/userStories', story);
  }

  // Método para actualizar la estimación de esfuerzo
  updateEffortEstimation(storyId: number, newEffort: number): Observable<any> {
    return this.http.patch<any>(`https://my-json-server.typicode.com/CB-Sergio-AGV/db/userStories/${storyId}`, { effort: newEffort });
  }

  // Método para actualizar la fecha de inicio y fin
  updateDateRange(storyId: number, startDate: Date, endDate: Date): Observable<any> {
    return this.http.patch<any>(`https://my-json-server.typicode.com/CB-Sergio-AGV/db/userStories/${storyId}`, { startDate, endDate });
  }

  // Método para obtener los miembros
  getMembers(): Observable<any[]> {
    return this.http.get<any[]>('https://my-json-server.typicode.com/CB-Sergio-AGV/db/members');
  }
}
