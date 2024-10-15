export class Task {
  id: number;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Complete';
  creationDate: Date;
  userStoryId: number;
  sprint: number;

  constructor(
    id: number,
    title: string,
    description: string,
    status: 'Pending' | 'In Progress' | 'Complete',
    creationDate: Date,
    userStoryId: number,
    sprint: number
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.status = status;
    this.creationDate = creationDate;
    this.userStoryId = userStoryId;
    this.sprint = sprint;
  }
}
