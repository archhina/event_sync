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
    is_accepted boolean default null,
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

insert into Users (user_id, image_url, `password`, email, is_verified)
    values
    (1, "https://png.pngtree.com/recommend-works/png-clipart/20241213/ourmid/pngtree-experienced-male-master-chef-logo-illustration-png-image_14072793.png", "$2a$10$RjbMK2Th9Xd.boxM1gBFqueeZX.JKm157YKltAqckBrilm7iDxBmm", "armeet@mail.com", 1),
    (2, "https://png.pngtree.com/png-clipart/20230317/ourmid/pngtree-cartoon-head-chef-png-image_6654127.png", "$2a$10$hlMHr0KWMQ8dT8gux35EVOk2mkRGqDDf7yLHWZlxh7R4dndZnVKoi", "umair@mail.com", 1),
    (3, "https://static.vecteezy.com/system/resources/thumbnails/044/448/699/small_2x/collection-of-culinary-chef-cook-head-logo-designs-isolated-png.png", "$2a$10$FgQUBz8Ht3RWXfT.EvI5W..IVwbdSCfDxETCxpj28R9hbBLzhJHlO", "hadi@mail.com", 1),
    (4, "https://i.pinimg.com/564x/99/3d/48/993d48fd121299552c035f969da03d5c.jpg", "$2a$10$mKNOttwX020XblI38qJYJuXKziECMu6dK1sEuiczyzkuf3BV5d.2a", "hassan@mail.com", 1),
    (5, "https://static.vecteezy.com/system/resources/thumbnails/025/002/353/small_2x/cute-cartoon-chef-character-on-transparent-background-generative-ai-png.png", "$2a$10$MeJ3mMyxUWIVO5zjFxIbuuZ6L4Pn.EX3tU1BOcNTQnHPr1tBp7J9W", "hussein@mail.com", 1),
    (6, "https://png.pngtree.com/png-clipart/20210224/ourmid/pngtree-cartoon-chef-png-image_2948736.jpg", "$2a$10$MB32DaPRbUZrGSbz3xeugO.bjhJVgQDII2nxDw3w3.GE7iPIX7g16", "mehdi@mail.com", 1),
    (7, "https://i.pinimg.com/474x/60/2f/47/602f47047f3a5fdb1e1b640795e3e501.jpg", "$2a$10$e9CnIYC6umMU1NV4yXJnXOEVffLnEGmNI8rStkwNRBJO2FNWh31s.", "jacob@mail.com", 1),
    (8, "https://cdn.creazilla.com/cliparts/3173164/chef-clipart-xl.png", "$2a$10$K4nXDmexFyXHGSjDdVJ/COQ2XPnDd52lbd8QEsjWPHBGGm6dBRmRG", "rafic@mail.com", 1),
    (9, "https://static.vecteezy.com/system/resources/previews/047/305/019/non_2x/a-cartoon-chef-is-holding-a-spatula-and-smiling-vector.jpg", "$2a$10$s5NReMc/1eYNp7VEhqMYoePjONjR51w8kzuPqhY79BbKaMMM5aG26", "moe@mail.com", 1),
    (10, "https://media.gettyimages.com/id/483954891/vector/fast-food-home-delivery.jpg?s=612x612&w=gi&k=20&c=uR46GaEw0POqJGk7z6vi4vty-3zKlMETwzUnGBKhmMk=", "$2a$10$x/5evc3x2MDzWAdchDCc4eqZRFkfgmBnHzlV92JSat3WpvtD9Xt7C", "ben@mail.com", 1),
    (11, "https://cdn.creazilla.com/cliparts/70127/chef-clipart-xl.png", "$2a$10$ipA2V/Rex2NBTV3WyO8Vy.lehzhV6jrjH8zI5SqlsA9NX5ya9TZOy", "isaiah@mail.com", 1),
    (12, "https://www.clipartmax.com/png/middle/1-17588_chef-clipart-black-and-white-free-images-chef-clipart-black-and-white.png", "$2a$10$xhvgfcsh4jJd37GHFd3.WOut3KXABrEW11vlXT5LbBVr03HF.AofO", "hesham@mail.com", 1);

insert into `Events` (event_id, host_id, event_name, event_description, event_image, event_date, event_location, is_private)
    values
    (1, 2, "Iftar at Umair's", "Break your fast this Ramadan with good food and good company! (Mac & Cheese optional)", "", "2025-03-14 18:00:00", "Umair's House", true),
    (2, 3, "Taco Tuesday Potluck", "Taco night with a twist! Bring a taco component (meat, toppings, shells, etc.) or a complementary dish.", "https://static.wixstatic.com/media/11062b_ce3458f81a3e496b8440378bc649802c~mv2.jpg/v1/fill/w_640,h_454,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/11062b_ce3458f81a3e496b8440378bc649802c~mv2.jpg", "2025-04-04 19:00:00", "456 Elm Street, Los Angeles, CA", false),
    (3, 4, "Backyard BBQ Bash", "Celebrate spring with a backyard BBQ! Bring your favorite grilled dish or a side to share.", "https://www.juddbuilders.com/juddbuildersblog/wp-content/uploads/2019/06/iStock-1051702542-1024x683.jpg", "2025-04-20 15:00:00", "123 Oak Lane, Austin, TX", false),
    (4, 5, "Cultural Cuisine Night", "A potluck where everyone brings a dish from their heritage or a favorite international recipe.", "https://static1.squarespace.com/static/53b839afe4b07ea978436183/53bbeeb2e4b095b6a428a13e/5fd2570b51740e23cce97919/1734370539706/traditional-food-around-the-world-Travlinmad.jpg?format=1500w", "2025-05-10 18:00:00", "Center Hall, Dearborn, MI", false),
    (5, 8, "Friendsgiving", "A warm, cozy pre-Thanksgiving celebration with friends and homemade comfort food.", "https://png.pngtree.com/png-clipart/20240514/original/pngtree-thanksgiving-dinner-and-friendsgiving-potluck-png-image_15092072.png", "2025-11-24 17:00:00", "Rafic's House", true),
    (6, 3, "Summer Picnic in the Park", "Join us for a relaxing afternoon picnic at the park. Bring blankets, outdoor games, and a dish to share!", "https://ingoodtaste.kitchen/wp-content/uploads/2011/08/Stocksy_txp0f5848fckJM100_Small_710145-1.jpg", "2025-06-15 14:00:00", "Zilker Park, Chicago, IL", false),
    (7, 9, "Beach Bonfire & Bites", "Wrap up the weekend with a beachside bonfire potluck. Bring snacks, s'mores, and good vibes.", "https://compassohio.com/wp-content/uploads/2024/10/Thursday-Bonfire-Blog-no-logo-1024x1024.jpg.webp", "2025-07-20 18:30:00", "Ocean Beach, San Francisco, CA", false);

insert into Invites (invite_id, event_id, user_id, is_accepted)
    values
    (1, 1, 1, true),
    (2, 1, 2, true),
    (3, 1, 3, true),
    (4, 1, 4, true),
    (5, 1, 5, true),
    (6, 1, 6, true),
    (7, 1, 7, true),
    (8, 1, 8, true),
    (9, 1, 9, true),
    (10, 1, 10, true),
    (11, 1, 11, true),
    (12, 1, 12, true),
    (13, 2, 3, true),
    (14, 2, 5, true),
    (15, 2, 8, true),
    (16, 2, 9, true),
    (17, 2, 11, true),
    (18, 2, 1, true),
    (19, 3, 4, true),
    (20, 3, 5, true),
    (21, 3, 8, true),
    (22, 3, 10, true),
    (23, 3, 7, true),
    (24, 4, 5, true),
    (25, 4, 6, true),
    (26, 4, 10, true),
    (27, 4, 2, true),
    (28, 4, 12, true),
    (29, 5, 8, true),
    (30, 5, 9, true),
    (31, 5, 11, true),
    (32, 5, 1, true),
    (33, 5, 3, true),
    (34, 6, 3, true),
    (35, 6, 4, true),
    (36, 6, 5, true),
    (37, 6, 7, true),
    (38, 6, 8, true),
    (39, 7, 9, true),
    (40, 7, 5, true),
    (41, 7, 4, true),
    (42, 7, 12, true),
    (43, 7, 1, true),
    (44, 7, 2, true);

insert into Items (item_id, event_id, user_id, item_name, item_category)
    values
    (1, 2, 3, "Chicken Tacos", "Main Dish"),
    (2, 2, 5, "Guacamole", "Side/Appetizer"),
    (3, 2, 8, "Salsa", "Condiment"),
    (4, 2, 9, "Chips", "Snack"),
    (5, 2, 11, "Mexican Rice", "Side/Appetizer"),
    (6, 3, 4, "Grilled Burgers", "Main Dish"),
    (7, 3, 5, "Coleslaw", "Side/Appetizer"),
    (8, 3, 8, "Potato Salad", "Side/Appetizer"),
    (9, 3, 10, "Corn on the Cob", "Side/Appetizer"),
    (10, 3, 7, "Grilled Veggies", "Side/Appetizer"),
    (11, 4, 5, "Biryani", "Main Dish"),
    (12, 4, 6, "Hummus and Pita", "Side/Appetizer"),
    (13, 4, 10, "Dolma", "Side/Appetizer"),
    (14, 4, 2, "Baklava", "Dessert"),
    (15, 4, 12, "Tabbouleh Salad", "Salad"),
    (16, 5, 8, "Roasted Turkey", "Main Dish"),
    (17, 5, 9, "Stuffing", "Side/Appetizer"),
    (18, 5, 11, "Pumpkin Pie", "Dessert"),
    (19, 5, 1,"Mashed Potatoes", "Side/Appetizer"),
    (20 ,5 ,3 ,"Green Bean Casserole" ,"Side/Appetizer") ,
    (21 ,6 ,3 ,"Sandwich Platter" ,"Main Dish") ,
    (22 ,6 ,4 ,"Fruit Salad" ,"Salad") ,
    (23 ,6 ,5 ,"Chips and Dip" ,"Snack") ,
    (24 ,6 ,7 ,"Lemonade" ,"Drink") ,
    (25 ,6 ,8 ,"Brownies" ,"Dessert") ,
    (26 ,7 ,9 ,"BBQ Chicken Skewers" ,"Main Dish") ,
    (27 ,7 ,5 ,"S'mores Kit" ,"Dessert") ,
    (28 ,7 ,4 ,"Veggie Platter" ,"Side/Appetizer") ,
    (29 ,7 ,12 ,"Potato Chips" ,"Snack") ,
    (30 ,7 ,1 ,"Fruit Punch" ,"Drink");



