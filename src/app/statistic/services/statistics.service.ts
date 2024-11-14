import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Statistics } from '../model/statistic-entity/statistic.entity';
import { Member } from '../model/member-entity/member.entity';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  constructor(private http: HttpClient) {}

  // Método para obtener las User Stories
  getUserStories(): Observable<Statistics[]> {
    return this.http.get<Statistics[]>('https://my-json-server.typicode.com/CB-Sergio-AGV/db/userStories');
  }

  // Método para obtener los miembros con token
  getMembers(): Observable<Member[]> {
    const token = localStorage.getItem('token');  // Obtén el token de localStorage

    // Asegúrate de que el token existe antes de agregarlo a las cabeceras
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });

    return this.http.get<Member[]>('http://localhost:8095/api/v1/members', { headers });
  }

  // Método para obtener los roles de los miembros con token
  getMemberRoles(): Observable<string[]> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });

    return this.http.get<Member[]>('http://localhost:8095/api/v1/members', { headers }).pipe(
      map(members => members.map(member => member.role))
    );
  }
}
