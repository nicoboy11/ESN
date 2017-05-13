/* --------------------------- USER -----------------------------*/
CREATE TABLE user (
	id int PRIMARY KEY AUTO_INCREMENT,
    names varchar(255),
    firstLastName varchar(255),
    secondLastName varchar(255),
    dateOfBirth date,
    email varchar(255),
    password varchar(255),
    startDate datetime,
    endDate datetime,
    higherUserId int,
    lastLogin datetime,
    avatar varchar(255),
    description text,
    job varchar(255),
    os_android varchar(255),
    os_ios varchar(255),
    os_chrome varchar(255),
    os_safari varchar(255),
    CONSTRAINT FOREIGN KEY (higherUserId) REFERENCES user(id)
);

CREATE TABLE userFollowers(
	userId int,
    followerId int,
    CONSTRAINT FOREIGN KEY (userId) REFERENCES user(id),
    CONSTRAINT FOREIGN KEY (followerId) REFERENCES user(id),
    date datetime
);