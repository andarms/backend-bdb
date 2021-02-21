import { DbManager } from '../../database/db-manager';
import { Genders, Person, PersonModel } from './person.model';

const testData: Person[] = [
  {
    id: 1,
    identification: '001',
    fullname: 'test user  1',
    birth: new Date(2021, 1, 20),
    gender: Genders.Male,
  },
];

describe('Person Model', () => {
  let model: PersonModel;
  beforeEach(() => {
    model = new PersonModel();
  });

  it('should get All person model from Api', async () => {
    const managerSpy = spyOn(DbManager.prototype, 'executeQuery').and.returnValue({ rows: [...testData] });
    const data = await model.finadAll();
    expect(data.length).toBe(testData.length);
    expect(managerSpy).toHaveBeenCalled();
  });

  it('should get person model from Api', async () => {
    const managerSpy = spyOn(DbManager.prototype, 'executeQuery').and.returnValue({ rows: [...testData] });
    const data = await model.find(1);
    expect(data.identification).toEqual(testData[0].identification);
    expect(managerSpy).toHaveBeenCalled();
  });

  it('should get person model from Api', async () => {
    const identification = testData[0].identification;
    const managerSpy = spyOn(DbManager.prototype, 'executeQuery').and.returnValue({ rows: [...testData] });
    const data = await model.findByIdentification(identification);
    expect(data.identification).toEqual(identification);
    expect(managerSpy).toHaveBeenCalled();
  });

  it('should get person model relatives from Api', async () => {
    const managerSpy = spyOn(DbManager.prototype, 'executeQuery').and.returnValue({ rows: [...testData] });
    const data = await model.findRelatives(1);
    // expect(data.children).toEqual(testData);
    // expect(data.father).toEqual(testData[0]);
    // expect(data.mother).toEqual(testData[0]);
    expect(managerSpy).toHaveBeenCalledTimes(3);
  });

  it('should create person model from Api', async () => {
    const managerSpy = spyOn(DbManager.prototype, 'executeQuery').and.callFake(() => null);
    const modelSpy = spyOn(PersonModel.prototype, 'findByIdentification').and.callFake(() => null);
    const person: Person = {
      id: 1,
      identification: '001',
      fullname: 'test person',
      birth: new Date(),
      gender: Genders.Female,
    };
    await model.create(person);
    expect(modelSpy).toHaveBeenCalled();
    expect(managerSpy).toHaveBeenCalled();
  });

  it('should return validation error', async () => {
    spyOn(DbManager.prototype, 'executeQuery').and.returnValue({ rows: [...testData] });
    const person: Person = { id: 999, identification: null, fullname: null, birth: null, gender: null };
    const errors = await model.validate(person);
    expect(errors.length).toBe(4);
  });

  it('should return validation for existing identification', async () => {
    spyOn(DbManager.prototype, 'executeQuery').and.returnValue({ rows: [...testData] });
    const person: Person = testData[0];
    const errors = await model.validate(person);
    expect(errors.length).toBe(1);
    expect(errors.pop()).toBe('Person already exist');
  });
});
