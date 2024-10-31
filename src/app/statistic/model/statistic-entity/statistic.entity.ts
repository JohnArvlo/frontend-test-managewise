export class Statistics {
  id: number;
  title: string;
  description: string;
  owner: string;
  status: 'To do' | 'Complete';
  sprint: number;
  startDate: Date;
  endDate: Date;
  effort: number; // Ensure this property exists

  constructor(
    id: number,
    title: string,
    description: string,
    owner: string,
    status: 'To do' | 'Complete',
    sprint: number,
    startDate: Date,
    endDate: Date,
    effort: number // Add the effort parameter
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.owner = owner;
    this.status = status;
    this.sprint = sprint;
    this.startDate = startDate;
    this.endDate = endDate;
    this.effort = effort; // Assign the effort property
  }
}
