import { Injectable } from '@angular/core';
import { BaseService } from "../../shared/services/base.service";
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import { Issue } from "../model/issue.entity";
import { History } from "../model/history.entity";
@Injectable({
  providedIn: 'root'
})
export class IssuesService extends BaseService<Issue> {
  constructor(private httpClient: HttpClient) {
    super(httpClient);
    this.resourceEndpoint = '/issues';
  }
  private createHttpOptions() {
      const token = localStorage.getItem('token'); // Obtener el token del localStorage
      return {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '' // Agregar el token en la cabecera si existe
        })
      };
    }
  // Nuevo método específico para IssuesService
  getAllIssues(): Observable<Issue[]> {
        const httpOptions = this.createHttpOptions();

    return this.httpClient.get<Issue[]>(`${this.basePath}${this.resourceEndpoint}`, httpOptions);
  }

   deleteIssue(id: number): Observable<void> {
         const httpOptions = this.createHttpOptions();

         return this.httpClient.delete<void>(`${this.basePath}${this.resourceEndpoint}/${id}`, httpOptions);
       }

  // Método específico para actualizar un issue existente
    override update(id: number, issue: Issue): Observable<Issue> {
          const httpOptions = this.createHttpOptions();

      return this.httpClient.put<Issue>(`${this.basePath}${this.resourceEndpoint}/${id}`, issue, httpOptions);
    }

  // Método específico para crear un nuevo issue
    createIssue(issue: Issue): Observable<Issue> {
          const httpOptions = this.createHttpOptions();

      return this.httpClient.post<Issue>(`${this.basePath}${this.resourceEndpoint}`, issue, httpOptions);
    }

   // Método específico para añadir un evento de historial a un issue dado
    addHistoryEventToIssue(issueId: number, historyEvent: History): Observable<History> {
          const httpOptions = this.createHttpOptions();

      return this.httpClient.post<History>(
        `${this.basePath}${this.resourceEndpoint}/${issueId}/events`,
        historyEvent,
        httpOptions
      );
    }
}
