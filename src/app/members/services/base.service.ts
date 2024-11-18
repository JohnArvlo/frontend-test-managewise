import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { environment } from '../../environments/environment';  // Importa la configuración de environment

@Injectable({
  providedIn: 'root',
})
export class BaseService<T> {
  // Usa la URL base desde environment.ts
  protected basePath: string = `${environment.serverBasePath}/members`;  // La URL base es dinámica

  private token: string = localStorage.getItem('token') || '';  // Si es necesario, obtén el token desde localStorage

  protected httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}` // Si es necesario agregar el token
    }),
  };

  constructor(protected http: HttpClient) {}

  // Manejo de errores de la API
  protected handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Error desconocido';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error en la solicitud: ${error.error.message}`;
    } else {
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
