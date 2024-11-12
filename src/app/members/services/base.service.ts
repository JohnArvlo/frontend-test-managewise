import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { catchError, Observable, retry, throwError } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BaseService<T> {
  // Base URL del servidor, definida en el archivo de configuración de entorno
  protected basePath: string = `${environment.serverBasePath}`;

  // Endpoint para los miembros, acorde a la estructura de db.json
  protected resourceEndpoint: string = '/members';

  // Configuración de cabeceras HTTP para peticiones JSON
  protected httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(protected http: HttpClient) {}

  // Manejo de errores de la API, adaptable según las necesidades
  protected handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      console.error(`Ocurrió un error: ${error.error.message}`);
    } else {
      console.error(`El backend devolvió el código ${error.status}, con el cuerpo: ${error.error}`);
    }
    return throwError(() => new Error('Ocurrió un problema con la solicitud, por favor intente nuevamente.'));
  }

  // Construye la URL completa del recurso
  protected resourcePath(): string {
    return `${this.basePath}${this.resourceEndpoint}`;
  }

  // Crea un nuevo recurso de tipo miembro
  create(item: T): Observable<T> {
    return this.http.post<T>(this.resourcePath(), item, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  // Elimina un recurso de tipo miembro por su ID
  delete(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.resourcePath()}/${id}`, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  // Actualiza un recurso específico de tipo miembro por su ID
  update(id: number | string, item: T): Observable<T> {
    return this.http.put<T>(`${this.resourcePath()}/${id}`, item, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  // Obtiene todos los recursos de tipo miembro
  getAll(): Observable<T[]> {
    return this.http.get<T[]>(this.resourcePath(), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  // Obtiene un recurso específico de tipo miembro por su ID
  getById(id: number | string): Observable<T> {
    return this.http.get<T>(`${this.resourcePath()}/${id}`, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }
}
