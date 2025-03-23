drop database if exists eventsync;
create database eventsync;
use eventsync;

create table Users (
    user_id int primary key auto_increment,
    username varchar(255) null unique,
    image_url varchar(255) default "",
    `password` varchar(255) not null,
    email varchar(255) not null unique,
    verification_code varchar(255) null,
    is_verified boolean default null,
    created_at datetime default current_timestamp
);

create table `Events` (
    event_id int primary key auto_increment,
    host_id int not null,
    event_name varchar(255) not null,
    event_description text,
    event_image varchar(255) default "",
    event_date datetime not null,
    event_location varchar(255),
    is_private boolean default false,
    created_at datetime default current_timestamp,
    foreign key (host_id) references Users(user_id) on delete cascade
);

create table Invites (
    invite_id int primary key auto_increment,
    event_id int not null,
    user_id int not null,
    isAccepted boolean default null,
    created_at datetime default current_timestamp,
    foreign key (event_id) references `Events`(event_id) on delete cascade,
    foreign key (user_id) references Users(user_id) on delete cascade,
    unique (event_id, user_id)
);

create table Items (
    item_id int primary key auto_increment,
    event_id int not null,
    user_id int not null,
    item_name varchar(255) not null,
    item_category varchar(255) not null,
    created_at datetime default current_timestamp,
    foreign key (event_id) references `Events`(event_id) on delete cascade,
    foreign key (user_id) references Users(user_id) on delete cascade
);