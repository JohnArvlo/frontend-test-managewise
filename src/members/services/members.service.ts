import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Member } from '../model/member.entity';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  // URL correcta para los miembros
  private apiUrl = 'https://my-json-server.typicode.com/CB-Sergio-AGV/members/members';

  constructor(private http: HttpClient) {}

  // Método para obtener todos los miembros
  getAllMembers(): Observable<Member[]> {
    return this.http.get<Member[]>(this.apiUrl);
  }

  // Método para crear un nuevo miembro
  create(member: Member): Observable<Member> {
    // Asegúrate de que el miembro tiene un ID cuando se crea
    return this.http.post<Member>(this.apiUrl, member);
  }

  // Método para actualizar un miembro
  update(id: number, member: Member): Observable<Member> {
    // La URL para la actualización debe incluir el id del miembro
    return this.http.put<Member>(`${this.apiUrl}/${id}`, member);
  }

  // Método para eliminar un miembro
  delete(id: number): Observable<void> {
    // La URL para la eliminación debe incluir el id del miembro
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
