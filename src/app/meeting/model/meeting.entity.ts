import { Member } from "../model/member.entity"; // Ajusta la ruta según corresponda

export class Meeting {
  id: number;
  title: string;
  date: string;
  time: string;
  link: string;
  recording: {
    recordingLink: string;
    duration: string;
    publicAccess: boolean; // Esta propiedad debe estar aquí
  };
  host: number; // Solo el ID del host

  access_code: string;
  members: number[]; // Agrega esta línea para incluir la propiedad members

  constructor() {
    this.id = 0;
    this.title = '';
    this.date = '';
    this.time = '';
    this.link = '';
    this.recording = {
      recordingLink: '',
      duration: '',
      publicAccess: false, // Inicializar con un valor predeterminado
    };
    this.host = 0;

    this.access_code = '';
    this.members = []; // Inicializa members como un array vacío
  }
}
