import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserStory } from '../../model/user-story.entity';
import { UserStoriesService } from '../../services/user-stories.service';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, NgForm } from "@angular/forms";
import { NgClass, NgFor } from "@angular/common";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-user-story-form',
  standalone: true,
  imports: [MatCardModule, FormsModule, NgFor, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './user-story-form.component.html',
  styleUrls: ['./user-story-form.component.css']
})
export class UserStoryFormComponent {
  newUserStory: UserStory;

  constructor(
    private userStoriesService: UserStoriesService,
    private dialogRef: MatDialogRef<UserStoryFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserStory
  ) {
    // Si no se recibe data, crea una nueva user story con valores predeterminados
    this.newUserStory = data ? { ...data } : new UserStory();
  }

  // Método para manejar la creación o actualización de la user story
  onSubmit(): void {
    if (this.newUserStory.id) {
      // Actualiza la historia si ya tiene ID
      this.userStoriesService.update(this.newUserStory.id, this.newUserStory).subscribe(() => {
        this.dialogRef.close(true);
      });
    } else {
      // Crea una nueva historia si no tiene ID
      this.userStoriesService.create(this.newUserStory).subscribe(() => {
        this.dialogRef.close(true);
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
