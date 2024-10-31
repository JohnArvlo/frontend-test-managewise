import { Task } from './task.entity';

export class UserStory {
  id: number;
  title: string;
  description: string;
  status: 'to_do' | 'in_progress' | 'done'; // Cambié los estados para que coincidan con el JSON
  epicId: number; // Vinculación de la User Story con una Epic
  sprintBacklogId: number | null; // Cambiado a sprintBacklogId
  effort: number;
  tasks: Task[]; // Array de tareas

  constructor(
    id: number = 0,
    title: string = '',
    description: string = '',
    status: 'to_do' | 'in_progress' | 'done' = 'to_do',
    epicId: number = 0,
    sprintBacklogId: number | null = null,
    effort: number = 0,
    tasks: Task[] = [] // Inicializa tasks como un array vacío
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.status = status;
    this.epicId = epicId;
    this.sprintBacklogId = sprintBacklogId;
    this.effort = effort;
    this.tasks = tasks; // Inicializa tasks
  }
}
