  import { StreetAddress } from './address.entity';
  import { Email } from './email.entity';
  import { Role } from './role.entity';
  import { PersonName } from './person-name.entity'; // Importa PersonName

  export class Member {
      id: number;
      personName: PersonName;  // Cambiado para usar PersonName
      email: Email;
      streetAddress: StreetAddress;
      role: string;  // Cambiado para que sea una cadena simple, si no necesitas propiedades adicionales en Role

      constructor() {
          this.id = 0;
          this.personName = new PersonName('');  // Asigna un nuevo objeto PersonName
          this.email = new Email();
          this.streetAddress = new StreetAddress();
          this.role = '';  // Define como una cadena vacía si el rol es solo texto
      }
  }
