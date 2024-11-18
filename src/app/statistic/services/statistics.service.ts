import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Statistics } from '../model/statistic-entity/statistic.entity';
import { Member } from '../model/member-entity/member.entity';
import { Sprint } from '../model/statistic-entity/sprint.entity';
import { environment } from '../../../environments/environment';  // Importa el entorno

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  private apiUrl = `${environment.serverBasePath}`;  // Corregido para usar template literal

  constructor(private http: HttpClient) {}

  // Método para obtener las User Stories desde la API
  getUserStories(): Observable<Statistics[]> {
    return this.http.get<Statistics[]>(`${this.apiUrl}/user-stories`);
  }

  // Método para obtener los Sprints desde la API
  getSprints(): Observable<Sprint[]> {
    return this.http.get<Sprint[]>(`${this.apiUrl}/sprints`);
  }

  // Método para obtener los miembros con token
  getMembers(): Observable<Member[]> {
    const token = localStorage.getItem('token');  // Obtén el token de localStorage

    // Asegúrate de que el token existe antes de agregarlo a las cabeceras
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });

    return this.http.get<Member[]>(`${this.apiUrl}/members`, { headers });
  }

  // Método para obtener los roles de los miembros con token
  getMemberRoles(): Observable<string[]> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });

    return this.http.get<Member[]>(`${this.apiUrl}/members`, { headers }).pipe(
      map(members => members.map(member => member.role))
    );
  }
}
