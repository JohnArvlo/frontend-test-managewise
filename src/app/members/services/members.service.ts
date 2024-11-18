import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Member } from '../model/member.entity';
import { environment } from '../../../environments/environment';  // Asegúrate de usar la ruta correcta

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  private apiUrl = `${environment.serverBasePath}/members`;  // Usa la URL base desde environment.ts

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''  // Si no hay token, no se incluye
    });
  }

  // Método para obtener todos los miembros
  getAllMembers(): Observable<Member[]> {
    const headers = this.getAuthHeaders();  // Obtiene los encabezados con el token
    return this.http.get<Member[]>(this.apiUrl, { headers });
  }

  // Crear un miembro
  create(member: Member): Observable<Member> {
    const headers = this.getAuthHeaders();  // Obtiene los encabezados con el token
    return this.http.post<Member>(this.apiUrl, member, { headers });
  }

  // Método para actualizar un miembro
  update(id: number, member: Member): Observable<Member> {
    const headers = this.getAuthHeaders();  // Obtiene los encabezados con el token
    return this.http.put<Member>(`${this.apiUrl}/${id}`, member, { headers });
  }

  // Método para eliminar un miembro
  delete(id: number): Observable<void> {
    const headers = this.getAuthHeaders();  // Obtiene los encabezados con el token
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }
}
