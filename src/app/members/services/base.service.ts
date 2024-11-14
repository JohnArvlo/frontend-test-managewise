import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, retry, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BaseService<T> {
  // URL base completa para el servidor JSON
  protected basePath: string = 'http://localhost:8095/api/v1/members';

  // Aquí es donde puedes agregar el token si es necesario
  private token: string = 'eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJBbmRyZSIsImlhdCI6MTczMTU1MTM0NSwiZXhwIjoxNzMyMTU2MTQ1fQ.rTODmyYpswiIzfBegSBYi9Tvh4Az9KvbPxu5Ek0bNUY-SQ0a_zOziHV1rsuUv0WX';

  // Configuración de los encabezados de la solicitud
  protected httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}` // Si es necesario agregar el token
    })
  };

  constructor(protected http: HttpClient) {}

  // Manejo de errores de la API
  protected handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Error desconocido';
    if (error.error instanceof ErrorEvent) {
      // Error en el lado del cliente o de la red
      errorMessage = `Error en la solicitud: ${error.error.message}`;
    } else {
      // Error en la respuesta del servidor
      errorMessage = `Código de error: ${error.status}, Mensaje: ${error.message}`;
    }
    console.error('Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  // Crear un nuevo miembro
  create(item: T): Observable<T> {
    return this.http.post<T>(this.basePath, item, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  // Eliminar un miembro por su ID
  delete(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.basePath}/${id}`, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  // Actualizar un miembro por su ID
  update(id: number | string, item: T): Observable<T> {
    return this.http.put<T>(`${this.basePath}/${id}`, item, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  // Obtener todos los miembros
  getAll(): Observable<T[]> {
    return this.http.get<T[]>(this.basePath, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  // Obtener un miembro por su ID
  getById(id: number | string): Observable<T> {
    return this.http.get<T>(`${this.basePath}/${id}`, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }
}
