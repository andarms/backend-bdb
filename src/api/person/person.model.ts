import { DbManager } from '../../database/db-manager';

enum Genders {
  Male = 'M',
  Female = 'F',
}

interface Person {
  id: number;
  identification: string;
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

interface PersonRelativesIds {
  fatherId: number;
  motherId: number;
  childId: number;
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

  async findByIdentification(identification: string): Promise<Person> {
    const manager = new DbManager();
    try {
      manager.open();
      const data = await manager.executeQuery<Person>('select * from Persons where identification = $1', [
        identification,
      ]);
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
      const children = childrenQuery?.rows.length ? childrenQuery.rows : null;

      return { father, mother, children };
    } catch (error) {
      console.log(error);
    } finally {
      manager.close();
    }
  }

  async create(person: Person): Promise<number> {
    const manager = new DbManager();
    const errors = await this.validate(person);
    if (errors.length) {
      throw errors;
    }
    try {
      manager.open();
      const data = await manager.executeQuery<number>(
        `insert into Persons(identification, fullname, birth, gender)  values ($1, $2, $3, $4)`,
        [person.identification, person.fullname, person.birth, person.gender],
      );

      return data.rowCount;
    } catch (error) {
      console.log(error);
    } finally {
      manager.close();
    }
  }

  async validate(person: Person): Promise<string[]> {
    const errors = [];
    if (!person.identification) {
      errors.push('field Identification is required');
    }
    if (!person.fullname) {
      errors.push('field Full Name is required');
    }
    if (!person.gender) {
      errors.push('field Gender is required');
    }
    if (!person.birth) {
      errors.push('field Birth date is required');
    }
    const found = await this.findByIdentification(person.identification);
    if (found) {
      errors.push('Person already exist');
    }
    return errors;
  }

  async adopt({ fatherId, motherId, childId }: PersonRelativesIds): Promise<boolean> {
    const errors = await this.checkAdoption(fatherId, motherId, childId);
    if (errors.length) {
      throw errors;
    }
    const manager = new DbManager();
    try {
      manager.open();
      await manager.executeQuery<number>(`insert into Children( childId, fatherId, motherId)  values ($1, $2, $3)`, [
        childId,
        fatherId,
        motherId,
      ]);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    } finally {
      manager.close();
    }
  }

  async checkAdoption(fatherId: number, motherId: number, childId: number): Promise<string[]> {
    const manager = new DbManager();
    const errors: string[] = [];
    try {
      manager.open();
      const childQuery = await manager.executeQuery<Person>('select * from Children where childId = $1', [childId]);
      if (childQuery.rowCount > 0) {
        return ['Child already has parents'];
      }
      const familyQuery = await manager.executeQuery<Person>(
        'select * from Children where childId = $1 and fatherId = $2 and motherId = $3',
        [childId, fatherId, motherId],
      );
      if (familyQuery.rowCount > 0) {
        return ['Adoption already made'];
      }
      return [];
    } catch (e) {
      console.log(e);
      return errors;
    } finally {
      manager.close();
    }
  }
}

export { Person, PersonRelatives, Genders, PersonModel, PersonRelativesIds };
