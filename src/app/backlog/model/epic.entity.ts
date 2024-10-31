export class Epic {
  id: number;
  title: string;
  description: string;
  status: 'to_do' | 'in_progress' | 'done';

  constructor(
    id: number,
    title: string,
    description: string,
    status: 'to_do' | 'in_progress' | 'done' = 'to_do',
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.status = status;
  }
}
