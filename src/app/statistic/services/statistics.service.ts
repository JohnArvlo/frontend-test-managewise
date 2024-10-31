import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // Importa el operador map

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

  // Método para obtener los miembros
  getMembers(): Observable<any[]> {
    return this.http.get<any[]>('https://my-json-server.typicode.com/CB-Sergio-AGV/db/members');
  }
 getMemberRoles(): Observable<any[]> {
    return this.http.get<any[]>('https://my-json-server.typicode.com/CB-Sergio-AGV/db/members').pipe(
      map(members => members.map(member => member.role))
    );
  }
}
