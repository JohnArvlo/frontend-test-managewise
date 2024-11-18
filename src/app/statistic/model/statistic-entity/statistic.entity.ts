export class Statistics {
  id: number;
  title: string;
  description: string;
  owner: string;
  status: 'TO_DO' | 'COMPLETE';
  sprint: number;
  effort: number; // Ensure this property exists

  constructor(
    id: number,
    title: string,
    description: string,
    owner: string,
    status: 'TO_DO' | 'COMPLETE',
    sprint: number,
    effort: number // Add the effort parameter
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.owner = owner;
    this.status = status;
    this.sprint = sprint;
    this.effort = effort; // Assign the effort property
  }
}
