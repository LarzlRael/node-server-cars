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

create table user(
    id_user int primary key auto_increment,
    name varchar(100) not null,
    last_name varchar(100) not null,
    email varchar(100) not null unique,
    password varchar(100) not null,
    image varchar(250) default '',
    direccion varchar(250),
    rol varchar(250) default 'user',
    enable boolean default true
);

ALTER TABLE user ADD COLUMN google boolean default false;