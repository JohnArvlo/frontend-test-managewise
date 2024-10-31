export class Task {
  id: number;
  title: string;
  description: string;
  status: 'to_do' | 'in_progress' | 'done';
  estimation: number;
  userStoryId: number;

  constructor(
    id: number = 0,
    title: string = '',
    description: string = '',
    status: 'to_do' | 'in_progress' | 'done' = 'to_do',
    estimation: number = 0,
    userStoryId: number = 0

  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.status = status;
    this.estimation = estimation;
    this.userStoryId = userStoryId;
  }
}

