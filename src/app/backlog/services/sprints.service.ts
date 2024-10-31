import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import {catchError, map, Observable, retry, throwError} from 'rxjs';

import { Sprint } from '../model/sprint.entity'; // Ajusta la ruta según sea necesario
import { environment } from '../../../environments/environment'; // Ajusta esta ruta también si es necesario

@Injectable({
  providedIn: 'root'
})
export class SprintService {
  basePath: string = `${environment.serverBasePath}`;
  resourceEndpoint: string = '/sprints'; // Ajusta el endpoint según sea necesario

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(private http: HttpClient) {}

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.log(`An error occurred: ${error.error.message}`);
    } else {
      console.log(`Backend returned code ${error.status}, body was: ${error.error}`);
    }
    return throwError(() => new Error('Something happened with the request; please try again later.'));
  }

  // Create Resource
  create(item: Sprint): Observable<Sprint> {
    return this.http.post<Sprint>(this.resourcePath(), item, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  // Delete Resource
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.resourcePath()}/${id}`, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  // Update Resource
  update(id: number, item: Sprint): Observable<Sprint> {
    return this.http.put<Sprint>(`${this.resourcePath()}/${id}`, item, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  // Get All Resources
  getAll(): Observable<Sprint[]> {
    return this.http.get<Sprint[]>(this.resourcePath(), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  // Get Active Sprint
  getActiveSprint(): Observable<Sprint | null> {
    return this.http.get<Sprint[]>(this.resourcePath(), this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError),
      map((sprints: Sprint[]) => sprints.find(sprint => sprint.status === 'Active') || null) // Devuelve el sprint activo o null si no hay
    );
  }

  // Verifica si hay un sprint activo
  hasActiveSprint(): Observable<boolean> {
    return this.http.get<Sprint[]>(this.resourcePath(), this.httpOptions).pipe(
      map((sprints: Sprint[]) => sprints.some(sprint => sprint.status === 'Active')),
      catchError(this.handleError)
    );
  }

  private resourcePath(): string {
    return `${this.basePath}${this.resourceEndpoint}`;
  }
}
