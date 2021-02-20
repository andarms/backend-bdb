create table Persons(
    id SMALLSERIAL primary key,
    identification varchar(25),
    fullname varchar(300) not null,
    birth date not null,
    gender char(1) not null
);


create table  Children(
    id SMALLSERIAL primary key,
    fatherId int not null,
    motherId int not null,
    childId int not null,
    foreign key (fatherId) references Persons(id),
    foreign key (motherId) references Persons(id),
    foreign key (childId) references Persons(id)
);


insert into Persons(identification, fullname, birth, gender)  values ('111111111', 'Marie C. Tran','1984-01-21', 'F');
insert into Persons(identification, fullname, birth, gender)  values ('222222222', 'Rex M. Carter','1990-08-6', 'M');
insert into Persons(identification, fullname, birth, gender)  values ('333333333', 'Gloria S. Jones','1979-03-10', 'F');
insert into Persons(identification, fullname, birth, gender)  values ('444444444', 'Paul A. Enriquez','1986-05-12', 'M');
