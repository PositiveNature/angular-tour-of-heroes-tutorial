import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Task } from './task';
import { MessageService } from './message.service';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }
  constructor(
    private http: HttpClient,
    private messageService: MessageService,
  ) { }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.tasksUrl)
    .pipe(
        tap(_ => this.log('fetched tasks')),
        catchError(this.handleError<Task[]>('getTasks', []))
      );
  }

  getTask(id: number): Observable<Task> {
    const url = `${this.tasksUrl}/${id}`;
    return this.http.get<Task>(url).pipe(
      tap(_ => this.log(`fetched Task id=${id}`)),
      catchError(this.handleError<Task>(`getTask id=${id}`))
    );
  }

  updateTask(task: Task): Observable<any> {
    return this.http.put(this.tasksUrl, task, this.httpOptions)
      .pipe(
        tap(_ => this.log(`updated task id=${task.id}`)),
        catchError(this.handleError<any>('updateTask'))
      );
  }

  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.tasksUrl, task, this.httpOptions).pipe(
      tap((newTask: Task) => this.log(`added Task w/ id=${newTask.id}`),
        catchError(this.handleError<Task>('addTask'))
      )
    );
  }

  deleteTask(id: number): Observable<Task> {
    const url = `${this.tasksUrl}/${id}`
    return this.http.delete<Task>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted Task id=${id}`)),
      catchError(this.handleError<Task>('deleteTask'))
    )
  }

  searchTasks(term: string): Observable<Task[]> {
    if (!term.trim()) {
      // if no search term, return empty hero array.
      return of([]);
    }
    return this.http.get<Task[]>(`${this.tasksUrl}/?subject=${term}`).pipe(
      tap(x => x.length ?
        this.log(`found tasks matching "${term}"`) :
        this.log(`no tasks matching "${term}"`),
        catchError(this.handleError<Task[]>('searchTasks',[]))
      )
    )
  }

  private handleError<T>(operation = 'operation', result?: T)
  {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed[TaskService]: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    }
  }

  private tasksUrl = 'api/tasks'
  private log(message: string) {
    this.messageService.add(`TaskService(log): ${message}`);
  }
}
