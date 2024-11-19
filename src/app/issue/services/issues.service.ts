import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Issue } from '../model/issue.entity';
import { History } from '../model/history.entity';
import { catchError } from 'rxjs/operators';  // Para manejar errores

@Injectable({
  providedIn: 'root'
})
export class IssuesService extends BaseService<Issue> {

  constructor(private httpClient: HttpClient) {
    super(httpClient); // Llamar al constructor de la clase base
    this.resourceEndpoint = '/issues'; // Definir el endpoint
  }

  // Crear las opciones de cabecera con el token
  private createHttpOptions() {
    const token = localStorage.getItem('token'); // Obtener el token del localStorage
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '' // Añadir el token si está presente
      })
    };
  }

  // Obtener todas las incidencias (Issues)
  getAllIssues(): Observable<Issue[]> {
    const httpOptions = this.createHttpOptions();
    return this.httpClient.get<Issue[]>(`${this.basePath}${this.resourceEndpoint}`, httpOptions).pipe(
      catchError(this.handleError) // Manejo de errores
    );
  }

  // Eliminar una incidencia (Issue) por ID
  deleteIssue(id: number): Observable<void> {
    const httpOptions = this.createHttpOptions();
    return this.httpClient.delete<void>(`${this.basePath}${this.resourceEndpoint}/${id}`, httpOptions).pipe(
      catchError(this.handleError) // Manejo de errores
    );
  }

  // Actualizar una incidencia existente
  override update(id: number, issue: Issue): Observable<Issue> {
    const httpOptions = this.createHttpOptions();
    return this.httpClient.put<Issue>(`${this.basePath}${this.resourceEndpoint}/${id}`, issue, httpOptions).pipe(
      catchError(this.handleError) // Manejo de errores
    );
  }

  // Crear una nueva incidencia
  createIssue(issue: Issue): Observable<Issue> {
    const httpOptions = this.createHttpOptions();
    return this.httpClient.post<Issue>(`${this.basePath}${this.resourceEndpoint}`, issue, httpOptions).pipe(
      catchError(this.handleError) // Manejo de errores
    );
  }

  // Añadir un evento de historial a una incidencia
  addHistoryEventToIssue(issueId: number, historyEvent: History): Observable<History> {
    const httpOptions = this.createHttpOptions();
    return this.httpClient.post<History>(
      `${this.basePath}${this.resourceEndpoint}/${issueId}/events`,
      historyEvent,
      httpOptions
    ).pipe(
      catchError(this.handleError) // Manejo de errores
    );
  }

  // Manejo de errores globales en las solicitudes HTTP
  private handleError(error: any) {
    console.error('Ocurrió un error:', error);
    // Aquí podrías redirigir al usuario al login en caso de un 401
    if (error.status === 401) {
      // Redirigir a la página de inicio de sesión si el token no es válido
      // Implementa tu lógica de redirección, por ejemplo usando el Router de Angular
      // this.router.navigate(['/login']);
    }
    // Retornar un observable con el error para manejarlo en el componente
    throw error;
  }
}
