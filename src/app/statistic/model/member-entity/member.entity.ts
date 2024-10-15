// src/app/statistics/model/member.entity.ts
export class Member {
  constructor(
    public id: number,
    public name: string,
    public role: string,
    public status: 'Activo' | 'Inactivo'
  ) {}
}
