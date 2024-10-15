import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment'; // Adjust the path if necessary
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, retry, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BaseService<T> {
  basePath: string = `${environment.serverBasePath}`; // Use your environment variable for the base path
  resourceEndpoint: string = '/resources'; // Adjust as needed

  httpOptions = {
    headers: new HttpHeaders({
      'Content-type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  handleError(error: HttpErrorResponse) {
    // Default error handling
    if (error.error instanceof ErrorEvent) {
      console.log(`An error occurred: ${error.error.message}`);
    } else {
      // Unsuccessful Response Error Code returned from Backend
      console.log(`Backend returned code ${error.status}, body was: ${error.error}`);
    }
    return throwError(() => new Error('Something happened with the request; please try again later.'));
  }

  // Example method to get all resources
  getAllResources(): Observable<T[]> {
    return this.http
      .get<T[]>(`${this.basePath}${this.resourceEndpoint}`, this.httpOptions)
      .pipe(
        retry(1), // Retry once before throwing error
        catchError(this.handleError.bind(this)) // Bind this for context
      );
  }

  // You can add more methods as needed, like get, post, put, delete, etc.
}
