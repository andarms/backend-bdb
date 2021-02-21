import { DbManager } from '../../database/db-manager';

enum Genders {
  Male = 'M',
  Female = 'F',
}

interface Person {
  id: number;
  indentification: string;
  fullname: string;
  birth: Date;
  gender: Genders;

  // eslint-disable-next-line no-use-before-define
  relatives?: PersonRelatives;
}

interface PersonRelatives {
  father: Person;
  mother: Person;
  children: Person[];
}

class PersonModel {
  async finadAll(): Promise<Person[]> {
    const manager = new DbManager();
    manager.open();
    const data = await manager.executeQuery<Person>('select * from Persons', []);
    manager.close();
    return data.rows;
  }

  async find(id: number | string): Promise<Person> {
    const manager = new DbManager();
    try {
      manager.open();
      const data = await manager.executeQuery<Person>('select * from Persons where id = $1', [id]);
      if (data.rows.length) {
        const person: Person = data.rows.shift();
        return new Promise((resolve) => resolve(person));
      }
      return null;
    } catch (e) {
      console.log(e);
      return null;
    } finally {
      manager.close();
    }
  }

  async findRelatives(id: string | number): Promise<PersonRelatives> {
    const manager = new DbManager();
    try {
      manager.open();
      const fatherQuery = await manager.executeQuery<Person>(
        `select * from Persons where id in (select fatherId from Children where childId = $1) `,
        [id],
      );
      const motherQuery = await manager.executeQuery<Person>(
        `select * from Persons where id in (select motherId from Children where childId = $1) `,
        [id],
      );
      const childrenQuery = await manager.executeQuery<Person>(
        `select * from Persons where id in (select childID from Children where fatherId = $1 or motherId = $1) `,
        [id],
      );
      const father = fatherQuery.rows?.shift();
      const mother = motherQuery.rows?.shift();
      const children = childrenQuery?.rows;

      return { father, mother, children };
    } catch (error) {
      console.log(error);
    } finally {
      manager.close();
    }
  }

  async create(person: Person): Promise<number> {
    const manager = new DbManager();
    manager.open();
    const data = await manager.executeQuery<Person>(
      `insert into Persons(identification, fullname, birth, gender)  values ($1, $2, $3, $4)`,
      [person.indentification, person.fullname, person.birth, person.gender],
    );
    manager.close();
    return data.rowCount;
  }
}

export { Person, PersonRelatives, Genders, PersonModel };
