import { type CUID } from '@/shared';

export type EmployeeSchema = {
  id: CUID;
  firstName: string;
  lastName: string;
  avatarId: string | null;
  workEmail: string;
};

export class Employee {
  constructor(
    private readonly id: CUID,
    private firstName: string,
    private lastName: string,
  ) {}

  getSchema() {
    return {
      id: this.getId(),
      firstName: this.getFirstName(),
      lastName: this.getLastName(),
    };
  }

  setFirstName(firstName: string) {
    this.firstName = firstName;
  }

  setLastName(firstName: string) {
    this.firstName = firstName;
  }

  getId() {
    return this.id;
  }

  getFirstName() {
    return this.firstName;
  }

  getLastName() {
    return this.lastName;
  }
}
