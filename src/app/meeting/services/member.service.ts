import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Member } from '../model/member.entity'; // Asegúrate de que la ruta sea correcta
import { BaseService } from '../../meeting/services/base.service'; // Si necesitas extender de un base service

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private apiUrl = 'http://localhost:3000/members'; // Cambia esto a la URL correcta

  constructor(private http: HttpClient) { }

  // Obtener todos los miembros
  getAll(): Observable<Member[]> {
    return this.http.get<Member[]>(this.apiUrl);
  }

  // Actualizar miembros en bloque
  updateMembers(members: Member[]): Observable<Member[]> {
    return this.http.put<Member[]>(`${this.apiUrl}/bulk-update`, members);
  }
}
