create database car_db;

create table car(
    id int primary key auto_increment,
    name_car varchar(50) not null,
    price int not null,
    description varchar(50),
    imageURL varchar(250) not null,
    public_id  varchar(250) not null,
    model varchar(10) not null,
    status varchar (10) not null,
    maker varchar(55) not null
);

create table user(
    id_user int primary key auto_increment,
    name varchar(100) not null,
    last_name varchar(100) not null,
    email varchar(100) not null unique,
    password varchar(100) not null,
    image varchar(250) default '',
    direccion varchar(250),
    role varchar(250) default 'user',
    enable boolean default true,
    google boolean default false
    
);

--ALTER TABLE user ADD COLUMN google boolean default false;