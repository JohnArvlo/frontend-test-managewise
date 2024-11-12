import { Component, OnInit } from '@angular/core';
import { MembersService } from "../../services/members.service";
import { Member } from "../../model/member.entity";
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from "@angular/forms";
import { NgFor } from "@angular/common";
import { MemberCreateAndEditComponent } from "../../components/member-create-and-edit/member-create-and-edit.component";

@Component({
  selector: 'app-member-management',
  standalone: true,
  imports: [MatCardModule, FormsModule, NgFor],
  templateUrl: './member-management.component.html',
  styleUrls: ['./member-management.component.css']
})
export class MemberManagementComponent implements OnInit {
  members: Member[] = [];

  constructor(private membersService: MembersService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getAllMembers();
  }

  // Método para obtener todos los miembros
  getAllMembers(): void {
    this.membersService.getAll()
      .subscribe((response: Member[]) => {
        console.log(response);
        this.members = response;
      });
  }

  // Método para eliminar un miembro
  deleteMember(member: Member): void {
    if (confirm('¿Estás seguro de que deseas sacarlo del proyecto?')) {
      this.membersService.delete(member.id).subscribe(() => {
        this.getAllMembers(); // Recargamos la lista después de eliminar
      });
    }
  }

  // Método para abrir el diálogo de agregar un nuevo miembro
  openAddMemberDialog(): void {
    const dialogRef = this.dialog.open(MemberCreateAndEditComponent, {
      width: '400px',
      height: '600px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllMembers(); // Recargamos la lista de miembros después de agregar
      }
    });
  }

  // Método para abrir el diálogo de edición de miembro
  openEditMemberDialog(member: Member): void {
    const dialogRef = this.dialog.open(MemberCreateAndEditComponent, {
      width: '400px',
      height: '600px',
      data: member // Pasamos el miembro actual para editar
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllMembers(); // Recargamos la lista de miembros después de editar
      }
    });
  }
}
