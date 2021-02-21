import { DbManager } from '../../database/db-manager';
import { Genders, Person, PersonModel } from './person.model';

const testPersons: Person[] = [
  {
    id: 1,
    indentification: '001',
    fullname: 'test user  1',
    birth: new Date(),
    gender: Genders.Male,
  },
];

describe('Person Model', () => {
  let model: PersonModel;
  beforeEach(() => {
    model = new PersonModel();
  });

  it('should get person model from Api', async () => {
    const managerSpy = spyOn(DbManager.prototype, 'executeQuery').and.returnValue({ rows: testPersons });
    const data = await model.finadAll();
    expect(data.length).toBe(testPersons.length);
    expect(managerSpy).toHaveBeenCalled();
  });
});
