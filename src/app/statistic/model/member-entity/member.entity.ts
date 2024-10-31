export class Member {
  id: number;
  profile: {
    firstName: string;
    lastName: string;
    address: string;
    number: string;
    city: string;
    postalCode: string;
    email: string;
    country: string;
    phone: string;
    avatar: string;
  };
  role: {
    name: string;
    description: string;
  };
  availability: {
    startSchedule: string;
    finalSchedule: string;
    days: string[];
  };
  status: string;

  constructor(
    id: number,
    firstName: string,
    lastName: string,
    address: string,
    number: string,
    city: string,
    postalCode: string,
    email: string,
    country: string,
    phone: string,
    avatar: string,
    roleName: string,
    roleDescription: string,
    startSchedule: string,
    finalSchedule: string,
    days: string[],
    status: string
  ) {
    this.id = id;
    this.profile = {
      firstName,
      lastName,
      address,
      number,
      city,
      postalCode,
      email,
      country,
      phone,
      avatar,
    };
    this.role = {
      name: roleName,
      description: roleDescription,
    };
    this.availability = {
      startSchedule,
      finalSchedule,
      days,
    };
    this.status = status;
  }
}
