import { Component } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { TranslateModule } from "@ngx-translate/core";

import {UserStory} from "../../model/user-story.entity";
import {UserStoriesService} from "../../services/user-stories.service";

@Component({
  selector: 'app-product-backlog',
  standalone: true,
  imports: [MatCardModule, MatInputModule, MatFormFieldModule, CommonModule],
  templateUrl: './product-backlog.component.html',
  styleUrl: './product-backlog.component.css'
})
export class ProductBacklogComponent {
  userStories: Array<UserStory> = [];
  filteredUserStories: Array<UserStory> = [];

  constructor(private userStoriesService: UserStoriesService) {}

  private getAllUserStories(): void {
    this.userStoriesService.getAll()
      .subscribe((response: any) => {
        this.filteredUserStories = response.filter((story: UserStory) => story.sprint == null);
        this.userStories = response.filter((story: UserStory) => story.sprint != null);
      });
  }


  ngOnInit(): void {
    this.getAllUserStories();
  }

}

