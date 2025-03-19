drop database if exists eventsync_test;
create database eventsync_test;
use eventsync_test;

create table Users (
    user_id int primary key auto_increment,
    username varchar(255) null unique,
    image_url varchar(255) default "",
    `password` varchar(255) not null,
    email varchar(255) not null unique,
    is_verified boolean default null,
    created_at datetime default current_timestamp
);

create table `Events` (
    event_id int primary key auto_increment,
    host_id int not null,
    event_name varchar(255) not null,
    event_description text,
    event_date datetime not null,
    event_location varchar(255),
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
    item_description text,
    item_quantity int default 1,
    created_at datetime default current_timestamp,
    foreign key (event_id) references `Events`(event_id) on delete cascade,
    foreign key (user_id) references Users(user_id) on delete cascade
);

delimiter //

create procedure set_known_good_state()
begin
    delete from Items;
    alter table Items auto_increment = 1;
    delete from Invites;
    alter table Invites auto_increment = 1;
    delete from `Events`;
    alter table `Events` auto_increment = 1;
    delete from Users;
    alter table Users auto_increment = 1;

    insert into Users (email, `password`) values
        ('user1@mail.com', 'password1'),
        ('user2@mail.com', 'password2');

    insert into `Events` (host_id, event_name, event_description, event_date, event_location) values
        (1, 'Event 1', 'Description for Event 1', '2023-12-01 10:00:00', 'Location 1'),
        (2, 'Event 2', 'Description for Event 2', '2023-12-02 11:00:00', 'Location 2');

    insert into Invites (event_id, user_id, isAccepted) values
        (1, 2, true),
        (2, 1, false);
    
    insert into Items (event_id, user_id, item_name, item_category, item_description) values
        (1, 1, 'Item 1', 'Category 1', 'Description for Item 1'),
        (2, 2, 'Item 2', 'Category 2', 'Description for Item 2');
end //
delimiter ;