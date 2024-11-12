import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MembersService } from '../../services/members.service';
import { Member } from '../../model/member.entity';

// Importa los módulos necesarios para que Angular reconozca los elementos de Angular Material
import { MatCardModule } from '@angular/material/card'; // Para mat-card
import { MatDialogModule } from '@angular/material/dialog'; // Para mat-dialog-content
import { MatFormFieldModule } from '@angular/material/form-field'; // Para mat-form-field
import { MatInputModule } from '@angular/material/input'; // Para mat-input
import { FormsModule } from '@angular/forms'; // Para usar ngModel

@Component({
  selector: 'app-member-create-and-edit',
  templateUrl: './member-create-and-edit.component.html',
  styleUrls: ['./member-create-and-edit.component.css'],
  standalone: true, // Esto hace que el componente sea autónomo
  imports: [
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ] // Aquí importamos todos los módulos necesarios directamente en el componente
})
export class MemberCreateAndEditComponent {
  newMember: Member = new Member();
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private membersService: MembersService,
    private dialogRef: MatDialogRef<MemberCreateAndEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Member // Recibe los datos del miembro
  ) {
    // Si hay datos (para editar), se inicializa 'newMember' con esos datos
    if (data) {
      this.newMember = { ...data };
    }
  }

  onSubmit(): void {
    this.isLoading = true;
    if (this.newMember.id) {
      // Lógica de actualización
      this.membersService.update(this.newMember.id, this.newMember).subscribe({
        next: () => {
          this.isLoading = false;
          this.dialogRef.close(true); // Cerrar el diálogo y pasar true
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = 'Error updating member. Please try again.';
          console.error('Error updating member:', err);
        }
      });
    } else {
      // Lógica de creación
      this.membersService.create(this.newMember).subscribe({
        next: () => {
          this.isLoading = false;
          this.dialogRef.close(true); // Cerrar el diálogo y pasar true
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = 'Error creating member. Please try again.';
          console.error('Error creating member:', err);
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false); // Cerrar el diálogo sin realizar ninguna acción
  }
}
