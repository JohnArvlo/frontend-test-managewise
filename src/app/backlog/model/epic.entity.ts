export class Epic {
  id: number;
  title: string;
  projectId: number;
  description: string;
  status: 'Pending' | 'In Progress' | 'Complete';
  creationDate: Date;

  constructor(
    id: number,
    title: string,
    projectId: number,
    description: string,
    status: 'Pending' | 'In Progress' | 'Complete',
    creationDate: Date
  ) {
    this.id = id;
    this.title = title;
    this.projectId = projectId;
    this.description = description;
    this.status = status;
    this.creationDate = creationDate;
  }
}
