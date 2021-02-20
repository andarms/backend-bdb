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

  adopt(child: Person): void;
}
