import { Component } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule, NgForm } from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";

import {UserStory} from "../../model/user-story.entity";
import {UserStoriesService} from "../../services/user-stories.service";

import {Task} from "../../model/task.entity";
import {TasksService} from "../../services/tasks.service";

import {Epic} from "../../model/epic.entity";
import {EpicsService} from "../../services/epics.service";


import {UserStoryFormComponent} from "../user-story-form/user-story-form.component";

@Component({
  selector: 'app-backlog-items-management',
  standalone: true,
  imports: [MatCardModule, MatInputModule, MatFormFieldModule, CommonModule, FormsModule],
  templateUrl: './backlog-items-management.component.html',
  styleUrl: './backlog-items-management.component.css'
})
export class BacklogItemsManagementComponent {
  userStories: Array<UserStory> = [];
  tasks: Array<Task> = [];
  epics: Array<Epic> = [];

  constructor(private userStoriesService: UserStoriesService,
              private tasksService: TasksService,
              private epicsService: EpicsService,
              private dialog: MatDialog) {}

  private getAllUserStories(): void {
    this.userStoriesService.getAll()
      .subscribe((response: any) => {
        this.userStories = response;
      });
  }

  private getAllTasks(): void {
    this.tasksService.getAll()
      .subscribe((response: any) => {
        this.tasks = response;
      });
  }

  private getAllEpics(): void {
    this.epicsService.getAll()
      .subscribe((response: any) => {
        this.epics = response;
      });
  }

  //creacion de backlog items
  openAddUserStoryForm(): void {
    const dialogRef = this.dialog.open(UserStoryFormComponent, {
      width: '400px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllUserStories();
      }
    });
  }

  //eliminacion de us
  deleteUserStory(userstory: UserStory): void {
    if (confirm('¿Estás seguro que deseas eliminar esta user story?')) {
      this.userStoriesService.delete(userstory.id).subscribe(() => {
        this.getAllUserStories();  // Recargamos la lista tras eliminar
      });
    }
  }

  ngOnInit(): void {
    this.getAllUserStories();
    this.getAllTasks();
    this.getAllEpics();
  }
}
