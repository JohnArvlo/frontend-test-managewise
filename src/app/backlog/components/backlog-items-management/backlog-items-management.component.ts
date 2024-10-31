import { Component } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule, NgForm } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { NgClass, NgFor } from "@angular/common";

import { UserStory } from "../../model/user-story.entity";
import { UserStoriesService } from "../../services/user-stories.service";

import { Task } from "../../model/task.entity";
//import { TasksService } from "../../services/tasks.service";

import { Epic } from "../../model/epic.entity";
import { EpicsService } from "../../services/epics.service";
import { MatIcon } from "@angular/material/icon";

import { UserStoryCreateAndEditComponent } from "../user-story-create-and-edit/user-story-create-and-edit.component";
import { TaskCreateAndEditComponent } from "../task-create-and-edit/task-create-and-edit.component"; // Importa el componente para tareas
import { EpicCreateAndEditComponent } from "../epic-create-and-edit/epic-create-and-edit.component"; // Importa el componente para épicos

@Component({
  selector: 'app-backlog-items-management',
  standalone: true,
  imports: [MatCardModule, MatInputModule, MatFormFieldModule, CommonModule, FormsModule, MatIcon, NgFor],
  templateUrl: './backlog-items-management.component.html',
  styleUrl: './backlog-items-management.component.css'
})
export class BacklogItemsManagementComponent {
  userStories: Array<UserStory> = [];
  tasks: Array<Task> = [];
  epics: Array<Epic> = [];
  backogItem: string = 'userStories';

  constructor(
    private userStoriesService: UserStoriesService,
    //private tasksService: TasksService,
    private epicsService: EpicsService,
    private dialog: MatDialog
  ) {}

  private getAllUserStories(): void {
    this.userStoriesService.getAll()
      .subscribe((response: any) => {
        this.userStories = response;

        // Extrae todas las tareas de las historias de usuario
        this.tasks = this.userStories.flatMap(userStory => userStory.tasks);
      });
  }

  // Metodo para obtener las tareas de una historia de usuario específica
  getTasksByUserStoryId(userStoryId: number): Task[] {
    return this.tasks.filter(task => task.userStoryId === userStoryId);
  }


  /*private getAllTasks(): void {
    this.tasksService.getAll()
      .subscribe((response: any) => {
        this.tasks = response;
      });
  }*/

  private getAllEpics(): void {
    this.epicsService.getAll()
      .subscribe((response: any) => {
        this.epics = response;
      });
  }

  //delete items id
  private deleteUserStory(userStoryId: number): void {
    this.userStoriesService.delete(userStoryId)
      .subscribe(() => {
        this.userStories = this.userStories.filter((userStory: UserStory) => userStory.id !== userStoryId);
      });
  }

  private deleteEpic(epicId: number): void {
    this.epicsService.delete(epicId)
      .subscribe(() => {
        this.epics = this.epics.filter((epic: Epic) => epic.id !== epicId);
      });
  }

  /*
  private deleteTask(taskId: number): void {
    this.tasksService.delete(taskId)
      .subscribe(() => {
        this.tasks = this.tasks.filter((task: Task) => task.id !== taskId);
      });
  }*/

  //formularios
  openAddUserStoryForm(): void {
    const dialogRef = this.dialog.open(UserStoryCreateAndEditComponent, {
      width: '400px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllUserStories();
      }
    });
  }


  openEditUserStoryForm(us: UserStory): void {
    const dialogRef = this.dialog.open(UserStoryCreateAndEditComponent, {
      width: '400px',
      data: us  // Pasamos el us actual para editarlo
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllUserStories();  // Recargamos la lista de issues
      }
    });
  }

  // Tareas: agregar y editar
  openAddTaskForm(): void {
    const dialogRef = this.dialog.open(TaskCreateAndEditComponent, {
      width: '400px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllUserStories();
      }
    });
  }

  openEditTaskForm(task: Task): void {
    const dialogRef = this.dialog.open(TaskCreateAndEditComponent, {
      width: '400px',
      data: task  // Pasamos la tarea actual para editarla
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllUserStories();  // Recargamos la lista de tareas
      }
    });
  }

  // Épicos: agregar y editar
  openAddEpicForm(): void {
    const dialogRef = this.dialog.open(EpicCreateAndEditComponent, {
      width: '400px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllEpics();
      }
    });
  }

  openEditEpicForm(epic: Epic): void {
    const dialogRef = this.dialog.open(EpicCreateAndEditComponent, {
      width: '400px',
      data: epic  // Pasamos el épico actual para editarlo
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllEpics();  // Recargamos la lista de épicos
      }
    });
  }

  //delete
  onDeleteUserStory(element: UserStory) {
    this.deleteUserStory(element.id);
  }

  onDeleteEpic(element: Epic) {
    this.deleteEpic(element.id);
  }

  /*
  onDeleteTask(element: Task) {
    this.deleteTask(element.id);
  }*/

  //mostrar us, epic o task dependiendo de vista
  showItem(item: string){
    this.backogItem = item;
  }

  ngOnInit(): void {
    this.getAllUserStories();
    //this.getAllTasks();
    this.getAllEpics();
  }
}
