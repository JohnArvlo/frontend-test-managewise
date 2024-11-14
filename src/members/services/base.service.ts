import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, retry, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BaseService<T> {
  // URL base del servidor JSON
  protected basePath: string = 'https://my-json-server.typicode.com/CB-Sergio-AGV/members'; // Cambia esta URL si es necesario
  protected resourceEndpoint: string = '/members'; // Endpoint de los miembros

  // Configuración de cabeceras HTTP para peticiones JSON
  protected httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(protected http: HttpClient) {}

  // Manejo de errores de la API
  protected handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Error:', error);
    return throwError(() => new Error('Error en la solicitud. Intente nuevamente.'));
  }

  // Método para obtener la URL completa del recurso
  protected resourcePath(): string {
    return `${this.basePath}${this.resourceEndpoint}`;
  }

  // Crear un nuevo miembro
  create(item: T): Observable<T> {
    console.log('Creando miembro', item); // Agrega un log para verificar
    return this.http.post<T>(this.resourcePath(), item, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  // Eliminar un miembro por su ID
  delete(id: number | string): Observable<void> {
    console.log('Eliminando miembro con id', id); // Log para eliminar
    return this.http.delete<void>(`${this.resourcePath()}/${id}`, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  // Actualizar un miembro por su ID
  update(id: number | string, item: T): Observable<T> {
    console.log('Actualizando miembro', id, item); // Log para actualizar
    return this.http.put<T>(`${this.resourcePath()}/${id}`, item, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  // Obtener todos los miembros
  getAll(): Observable<T[]> {
    return this.http.get<T[]>(this.resourcePath(), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  // Obtener un miembro por su ID
  getById(id: number | string): Observable<T> {
    return this.http.get<T>(`${this.resourcePath()}/${id}`, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }
}
