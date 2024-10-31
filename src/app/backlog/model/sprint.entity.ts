export class Sprint {
  id: number;
  title: string;
  goal: number;
  status: 'Active' | 'Closed';
  startDate: Date;
  endDate: Date;

  constructor(
    id: number,
    title: string,
    goal: number,
    status: 'Active' | 'Closed' = 'Active',
    startDate: Date,
    endDate: Date
  ) {
    this.id = id;
    this.title = title;
    this.goal = goal;
    this.status = status;
    this.startDate = startDate;
    this.endDate = endDate;
  }
}
