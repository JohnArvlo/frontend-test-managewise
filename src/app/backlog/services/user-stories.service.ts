import { Injectable } from '@angular/core';

import { environment } from "../../../environments/environment";
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { catchError, Observable, retry, throwError } from "rxjs";

import { Task } from "../model/task.entity";
import { UserStory } from "../model/user-story.entity";

@Injectable({
  providedIn: 'root'
})
export class UserStoriesService {
  basePath: string = `${environment.serverBasePath}`;
  resourceEndpoint: string = '/userStories';  // Ajusta el endpoint según sea necesario

  httpOptions = {
    headers: new HttpHeaders({
      'Content-type': 'application/json',
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
  create(item: any): Observable<UserStory> {
    return this.http.post<UserStory>(this.resourcePath(), item, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  // Delete Resource
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.resourcePath()}/${id}`, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  // Update Resource
  update(id: number, item: any): Observable<UserStory> {
    return this.http.put<UserStory>(`${this.resourcePath()}/${id}`, item, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  // Get All Resources
  getAll(): Observable<UserStory[]> {
    return this.http.get<UserStory[]>(this.resourcePath(), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  addTask(userStoryId: number, task: Task): Observable<UserStory> {
    return this.http.post<UserStory>(
      `${this.resourcePath()}/${userStoryId}/tasks`,
      task,
      this.httpOptions
    ).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  updateTask(userStoryId: number, taskId: number, updatedData: any): Observable<any> {
    return this.http.put(`/userStories/${userStoryId}/tasks/${taskId}`, updatedData)
      .pipe(
        catchError(this.handleError)
      );
  }



  private resourcePath(): string {
    return `${this.basePath}${this.resourceEndpoint}`;
  }
}
