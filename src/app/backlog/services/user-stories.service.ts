import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { Task } from '../model/task.entity';
import { UserStory } from '../model/user-story.entity';
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserStoriesService {
  basePath: string = 'http://localhost:8091/api/v1';
  resourceEndpoint: string = '/user-stories';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken'); // Asumiendo que el token está guardado aquí
    console.log('Token:', token);  // Verifica el valor del token
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''  // Si no hay token, no se agrega el encabezado Authorization
    });
  }


  // Opciones HTTP que incluyen el encabezado de autenticación
  private get httpOptions() {
    return {
      headers: this.getAuthHeaders()  // Usar los encabezados de autenticación en cada solicitud
    };
  }

  // Manejo de errores
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.log(`An error occurred: ${error.error.message}`);
    } else {
      console.log(`Backend returned code ${error.status}, body was: ${error.error}`);
    }
    return throwError(() => new Error('Something happened with the request; please try again later.'));
  }

  // Crear un recurso
  create(item: any): Observable<UserStory> {
        const headers = this.getAuthHeaders();  // Obtiene los encabezados con el token

    item.sprintId = 0;  // Establecer un valor predeterminado para sprintId
    return this.http.post<UserStory>(this.resourcePath(), item)
      .pipe(retry(2), catchError(this.handleError));
  }

  // Eliminar un recurso
  delete(id: number): Observable<void> {
        const headers = this.getAuthHeaders();  // Obtiene los encabezados con el token

    return this.http.delete<void>(`${this.resourcePath()}/${id}`)
      .pipe(retry(2), catchError(this.handleError));
  }

  // Actualizar un recurso
  update(id: number, item: any): Observable<UserStory> {
        const headers = this.getAuthHeaders();  // Obtiene los encabezados con el token

    return this.http.put<UserStory>(`${this.resourcePath()}/${id}`, item)
      .pipe(retry(2), catchError(this.handleError));
  }

  // Obtener todos los recursos
  getAll(): Observable<UserStory[]> {
        const headers = this.getAuthHeaders();  // Obtiene los encabezados con el token

    return this.http.get<UserStory[]>(this.resourcePath())
      .pipe(retry(2), catchError(this.handleError));
  }

  // Agregar una tarea a un User Story
  addTask(userStoryId: number, task: Task): Observable<UserStory> {
        const headers = this.getAuthHeaders();  // Obtiene los encabezados con el token

    return this.http.post<UserStory>(`${this.resourcePath()}/${userStoryId}/tasks`, task)
      .pipe(retry(2), catchError(this.handleError));
  }

  // Actualizar una tarea en un User Story
  updateTask(userStoryId: number, taskId: number, updatedData: any): Observable<any> {
        const headers = this.getAuthHeaders();  // Obtiene los encabezados con el token

    return this.http.put(`${this.resourcePath()}/${userStoryId}/tasks/${taskId}`, updatedData)
      .pipe(retry(2), catchError(this.handleError));
  }

  // Eliminar una tarea
  deleteTask(userStoryId: number, taskId: number): Observable<any> {
        const headers = this.getAuthHeaders();  // Obtiene los encabezados con el token

    return this.http.delete(`${this.resourcePath()}/${userStoryId}/tasks/${taskId}`)
      .pipe(retry(2), catchError(this.handleError));
  }

  // Ruta base del recurso
  private resourcePath(): string {
    return `${this.basePath}${this.resourceEndpoint}`;
  }
}
