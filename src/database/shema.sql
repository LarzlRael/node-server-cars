create database car_db;

create table car(
    id int primary key auto_increment,
    name_car varchar(50) not null,
    price int not null,
    description varchar(50),
    imageURL varchar(250),
    public_id  varchar(250),
    year varchar(10)
);