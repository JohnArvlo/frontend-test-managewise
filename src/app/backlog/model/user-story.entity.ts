export class UserStory {
  id: number;
  title: string;
  description: string;
  owner: string;
  status: 'Pending' | 'In Progress' | 'Complete';
  sprint: number | null;  // El sprint puede ser nulo si aún no ha sido asignado
  startDate: Date;
  endDate: Date;
  effort: number;

  constructor(
    id: number = 0,  // Si es una nueva historia de usuario, se asigna 0 al id
    title: string = '',
    description: string = '',
    owner: string = '',
    status: 'Pending' | 'In Progress' | 'Complete' = 'Pending',
    sprint: number | null = null,  // Sprint por defecto es nulo
    startDate: Date = new Date(),
    endDate: Date = new Date(),
    effort: number = 0
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.owner = owner;
    this.status = status;
    this.sprint = sprint;
    this.startDate = startDate;
    this.endDate = endDate;
    this.effort = effort;
  }
}
