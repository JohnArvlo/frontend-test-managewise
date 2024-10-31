



import { Component, EventEmitter, inject, Inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from "@angular/material/dialog";
import { TranslateModule } from "@ngx-translate/core";
import { MatSelectModule } from "@angular/material/select";
import { Meeting } from "../../model/meeting.entity";
import { MeetingService } from "../../services/meeting.service";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MemberService } from '../../services/member.service'; // Servicio para obtener miembros



@Component({
  selector: 'app-meeting-create-and-edit',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    NgxMaterialTimepickerModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    TranslateModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,



  ],
  templateUrl: './meeting-create-and-edit.component.html',
  styleUrls: ['./meeting-create-and-edit.component.css']
})
export class MeetingCreateAndEditComponent implements OnInit {
  meeting: Meeting;
  editMode!: boolean;
  inputData: any;
  members: any[] = []; // Lista de miembros
  @ViewChild('resourceForm', { static: false }) resourceForm!: NgForm;
  //@ViewChild('pickerTime') pickerTime!: NgxMaterialTimepickerComponent;

  private meetingService: MeetingService = inject(MeetingService);
  private memberService: MemberService = inject(MemberService); // Servicio inyectado

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<MeetingCreateAndEditComponent>) {
    this.meeting = data.meeting;
    this.editMode = data.editMode;
  }

  onTimeChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const timeValue = input.value;

    const timePattern = /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/;
    if (timePattern.test(timeValue)) {
      console.log('Hora válida:', timeValue);
    } else {
      console.error('Hora no válida. Usa el formato hh:mm AM/PM');
    }
  }

  validateTime(event: Event) {
    const input = event.target as HTMLInputElement;
    const timeValue = input.value;

    const timePattern = /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/;

    if (!timePattern.test(timeValue) && timeValue !== '') {
      input.value = '';
      alert('Por favor, ingresa una hora válida en el formato hh:mm AM/PM.');
    }
  }

  formatDate(): void {
    const dateParts = this.meeting.date.split('/');
    if (dateParts.length === 3) {
      this.meeting.date = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
    }
  }

  // CRUD Actions
  private createResource(): void {
    this.meeting.members = this.members.map(m => m.id);
    this.meeting.access_code = this.generateAccessCode();

    const randomHost = this.selectRandomHost();
    if (randomHost) {
      console.log('Host seleccionado:', randomHost);
      this.meeting.host = randomHost.id;
    }
    this.meeting.link = this.generateRandomLink();

    this.meeting.recording = {
      recordingLink: this.generateRecordingLink(),
      duration: this.generateRandomDuration(),
      publicAccess: this.generateRandomAccess()
    };

    this.meetingService.create(this.meeting).subscribe(response => {
      this.meeting = response;
      this.addRecording(this.meeting);
    });
  }

  private updateResource(): void {
    let resourceToUpdate: Meeting = this.meeting;

    this.meetingService.update(this.meeting.id, resourceToUpdate).subscribe(response => {
      this.meeting = response;
    });
  }

  private addRecording(meeting: Meeting): void {
    const recording = {
      title: meeting.title,
      date: meeting.date,
      time: meeting.time,
      link: meeting.link,
      recordingLink: meeting.recording.recordingLink,
      duration: this.generateRandomDuration(),
      publicAccess: this.generateRandomAccess()
    };

    // Lógica para añadir el recording a tu data source de recordings
  }

  private generateRandomLink(): string {
    const randomPart = Math.random().toString(36).substring(2, 8);
    return `https://meet.google.com/${randomPart}`;
  }

  private generateRecordingLink(): string {
    return `https://meet.google.com/recordings/${this.meeting.title.replace(/\s+/g, '-').toLowerCase()}`;
  }

  private generateRandomDuration(): string {
    const hours = Math.floor(Math.random() * 2);
    const minutes = Math.floor(Math.random() * 60);
    return `${hours}h ${minutes}m`;
  }

  private generateRandomAccess(): boolean {
    return Math.random() < 0.5;
  }

  private loadMembers(): void {
    this.memberService.getAll().subscribe((members) => {
      this.members = members;
    });
  }

  private generateAccessCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  private selectRandomHost(): any {
    if (this.members.length > 0) {
      const randomIndex = Math.floor(Math.random() * this.members.length);
      return this.members[randomIndex];
    }
    return null;
  }

  // UI Event Handlers
  onSubmit(): void {
    if (this.resourceForm.form.valid) {
      if (this.editMode) {
        this.updateResource();
      } else {
        this.createResource();
      }
      this.onClose();
    } else {
      console.error('Invalid data in form');
    }
  }

  onCancel(): void {
    console.log('Submit');
  }

  onClose(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.inputData = this.data;
    this.loadMembers(); // Cargar miembros al inicializar el componente
  }
}
