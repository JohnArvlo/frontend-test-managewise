import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Issue } from '../model/issue.entity';
import { History } from '../model/history.entity';
import { catchError } from 'rxjs/operators';  // Para manejar errores
import { Router } from '@angular/router';  // Para redirigir en caso de errores

@Injectable({
  providedIn: 'root'
})
export class IssuesService extends BaseService<Issue> {

  constructor(private httpClient: HttpClient, private router: Router) {
    super(httpClient); // Llamar al constructor de la clase base
    this.resourceEndpoint = '/issues'; // Definir el endpoint
  }

  // Crear las opciones de cabecera con el token
  private createHttpOptions() {
    const token = localStorage.getItem('token'); // Obtener el token del localStorage
    console.log('Token en las cabeceras:', token);  // Debug para verificar que el token se envía

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
      catchError(this.handleError.bind(this)) // Manejo de errores
    );
  }

  // Eliminar una incidencia (Issue) por ID
  deleteIssue(id: number): Observable<void> {
    const httpOptions = this.createHttpOptions();
    return this.httpClient.delete<void>(`${this.basePath}${this.resourceEndpoint}/${id}`, httpOptions).pipe(
      catchError(this.handleError.bind(this)) // Manejo de errores
    );
  }

  // Actualizar una incidencia existente
  override update(id: number, issue: Issue): Observable<Issue> {
    const httpOptions = this.createHttpOptions();
    return this.httpClient.put<Issue>(`${this.basePath}${this.resourceEndpoint}/${id}`, issue, httpOptions).pipe(
      catchError(this.handleError.bind(this)) // Manejo de errores
    );
  }

  // Crear una nueva incidencia
  createIssue(issue: Issue): Observable<Issue> {
    const httpOptions = this.createHttpOptions();
    return this.httpClient.post<Issue>(`${this.basePath}${this.resourceEndpoint}`, issue, httpOptions).pipe(
      catchError(this.handleError.bind(this)) // Manejo de errores
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
      catchError(this.handleError.bind(this)) // Manejo de errores
    );
  }

  // Manejo de errores globales en las solicitudes HTTP
  private handleError(error: any) {
    console.error('Ocurrió un error:', error);

    if (error.status === 401) {
      // Si el token es inválido o ha expirado, redirigir al login
      console.log('Token expirado o no válido. Redirigiendo al login...');
      localStorage.removeItem('token');  // Eliminar token expirado
      this.router.navigate(['/login']);  // Redirigir al login
    }

    // Aquí podrías manejar otros errores (por ejemplo, 500, 404, etc.)
    if (error.status === 500) {
      alert('Ha ocurrido un error en el servidor. Inténtelo nuevamente más tarde.');
    } else if (error.status === 404) {
      alert('Recurso no encontrado.');
    }

    // Retornar un observable con el error para manejarlo en el componente
    throw error;
  }
}
