import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from './task.model';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiBaseUrl = 'http://localhost:3000/api/tasks';
  public taskListSubject: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>([]);
  public sortingOptionSubject: BehaviorSubject<string> = new BehaviorSubject<string>("priority");
  categories: string[] = ['School', 'Business', 'Home', 'Reminder'];

  constructor(private http: HttpClient) {}

  // Fetch tasks from database using API
  getTasks(): Observable<Task[]> {
    const url = `${this.apiBaseUrl}`;
    return this.http.get<Task[]>(url).pipe(
      tap((tasks: Task[]) => {
        this.taskListSubject.next(tasks);
      })
    );
  }

  // Delete task from database using API
  deleteTask(taskId: number): Observable<void> {
    const url = `${this.apiBaseUrl}/${taskId}`;
    return this.http.delete<void>(url).pipe(
      tap(() => {
        // Remove the deleted task from the task list subject
        const updatedTasks = this.taskListSubject.value.filter((task) => task.id !== taskId);
        this.taskListSubject.next(updatedTasks);
      })
    );
  }
  
  // Create task from database using API
  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiBaseUrl, task).pipe(
      tap((createdTask: Task) => {
        // Add the newly created task to the task list subject
        const updatedTasks = [...this.taskListSubject.value, createdTask];
        this.taskListSubject.next(updatedTasks);
      })
    );
  }

  // Update task data from database using API
  updateTask(task: Task): Observable<Task> {
    const url = `${this.apiBaseUrl}/${task.id}`;
    return this.http.put<Task>(url, task).pipe(
      tap((updatedTask: Task) => {
        // Update the task in the task list subject
        const updatedTasks = this.taskListSubject.value.map((t) =>
          t.id === updatedTask.id ? updatedTask : t
        );
        this.taskListSubject.next(updatedTasks);
      })
    );
  }

  // Change Sorting Option
  setSortingOption(option: string) {
    this.sortingOptionSubject.next(option);
  }
  
}
