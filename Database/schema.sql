DROP DATABASE IF EXISTS esn;

CREATE DATABASE esn
DEFAULT CHARACTER SET utf8
DEFAULT COLLATE utf8_general_ci;

USE esn;

/* MISC TABLES */
CREATE TABLE scopeType(
	id int PRIMARY KEY AUTO_INCREMENT,
    description varchar(255)
);

CREATE TABLE roleType(
	id int PRIMARY KEY AUTO_INCREMENT,
    description varchar(255)
);

CREATE TABLE stateType(
	id int PRIMARY KEY AUTO_INCREMENT,
    description varchar(255)
);

CREATE TABLE attachmentType(
	id int PRIMARY KEY AUTO_INCREMENT,
    description varchar(255)
);

CREATE TABLE messageType(
	id int PRIMARY KEY AUTO_INCREMENT,
    description varchar(255)
);

/* --------------------------- Person -----------------------------*/
DROP TABLE IF EXISTS person;
CREATE TABLE person (
	id int PRIMARY KEY AUTO_INCREMENT,
    names varchar(255) NOT NULL,
    firstLastName varchar(255) NOT NULL,
    secondLastName varchar(255),
    dateOfBirth date,
    email varchar(255) NOT NULL,
    phone varchar(255),
    ext varchar(255),
    password varchar(255) NOT NULL,
    startDate datetime NOT NULL,
    endDate datetime,
    higherPersonId int,
    lastLogin datetime,
    avatar varchar(255),
    abbr varchar(3),
    description text,
    job varchar(255),
    roleId int,/* check if it is the best way*/
    theme varchar(255),
    token varchar(255),
    isIosSync bool,
    isAndroidSync bool,
    os_android varchar(255),
    os_ios varchar(255),
    os_chrome varchar(255),
    os_safari varchar(255),    
    CONSTRAINT FOREIGN KEY (higherPersonId) REFERENCES person(id),
    CONSTRAINT FOREIGN KEY (roleId) REFERENCES roleType(id)
);

DROP TABLE IF EXISTS followers;
CREATE TABLE followers(
	personId int,
    followerId int,
	startDate datetime,
    CONSTRAINT FOREIGN KEY (personId) REFERENCES person(id),
    CONSTRAINT FOREIGN KEY (followerId) REFERENCES person(id),
    CONSTRAINT UNIQUE KEY (personId,followerId)
);

/* POSTS posts can be done within people, teams, proyects or the whole company */
DROP TABLE IF EXISTS post;
CREATE TABLE post(
	id int PRIMARY KEY AUTO_INCREMENT,
    personId int,
    message text,
    messageTypeId int,
    attachment varchar(255),
    attachmentTypeId int,
    creationDate datetime,
    scopeTypeId int, /* tells if the post is intended for a group, or a project or general */
    scopeId int, /* depending on the scopeType this can be a group id or a project id, if null anyone who follows will see it */
	CONSTRAINT FOREIGN KEY (personId) REFERENCES person(id),
    CONSTRAINT FOREIGN KEY (messageTypeId) REFERENCES messageType(id),
    CONSTRAINT FOREIGN KEY (scopeTypeId) REFERENCES scopeType(id),
    CONSTRAINT FOREIGN KEY (attachmentTypeId) REFERENCES attachmentType(id)  
);

DROP TABLE IF EXISTS postMessage;
CREATE TABLE postMessage(
	id int PRIMARY KEY AUTO_INCREMENT,
    postId int,
    personId int,
    message text,
    messageTypeId int,    
    attachment varchar(255),
    attachmentTypeId int,
    messageDate datetime,
    CONSTRAINT FOREIGN KEY (personId) REFERENCES person(id),
    CONSTRAINT FOREIGN KEY (postId) REFERENCES post(id),
    CONSTRAINT FOREIGN KEY (messageTypeId) REFERENCES messageType(id),
    CONSTRAINT FOREIGN KEY (attachmentTypeId) REFERENCES attachmentType(id)
);

DROP TABLE IF EXISTS postMember;
CREATE TABLE postMember(
	postId int,
    personId int,
    isSaved bool,
    isLiked bool,
    lastSeen datetime,
	CONSTRAINT FOREIGN KEY (personId) REFERENCES person(id),    
    CONSTRAINT FOREIGN KEY (postId) REFERENCES post(id)
);



/* TEAMS */
CREATE TABLE team(
	id int PRIMARY KEY AUTO_INCREMENT,
    name varchar(255),
    abbr varchar(10),
    teamGoal text,
    parentTeam int NULL,
    email varchar(255),
    address text,
    city varchar(255),
    country varchar(255),
    phone1 varchar(255),
    ext1 varchar(255),
    phone2 varchar(255),
    ext2 varchar(255),
    latitude varchar(255),
    longitude varchar(255),
    logo varchar(255),
    isActive bool,
    date datetime,
    userId int,    
    CONSTRAINT FOREIGN KEY (parentTeam) REFERENCES team(id),
    CONSTRAINT FOREIGN KEY (userId) REFERENCES person(id)
);

CREATE TABLE teamMembers(
	teamId int,
    userId int,
    lastSeen datetime,
    startDate datetime,
    endDate datetime,
    CONSTRAINT FOREIGN KEY (teamId) REFERENCES team(id),
    CONSTRAINT FOREIGN KEY (userId) REFERENCES person(id)
);

/*PROJECTS*/
CREATE TABLE project(
	id int PRIMARY KEY AUTO_INCREMENT,
    name varchar(250),
    abbr varchar(10),
    date datetime,
    creatorId int,
	dueDate date,
    logo varchar(255),
    CONSTRAINT FOREIGN KEY (creatorId) REFERENCES person(id)
);

CREATE TABLE projectGroups(
	projectId int,
    teamId int,
    startDate datetime,
    endDate datetime,
    CONSTRAINT FOREIGN KEY (projectId) REFERENCES project(id),
    CONSTRAINT FOREIGN KEY (teamId) REFERENCES team(id)
);

CREATE TABLE projectMembers(
	projectId int,
    userId int,
    roleId int,
    lastSeen datetime,
    startDate datetime,
    endDate datetime,
    CONSTRAINT FOREIGN KEY (projectId) REFERENCES project(id),
    CONSTRAINT FOREIGN KEY (userId) REFERENCES person(id),
    CONSTRAINT FOREIGN KEY (roleId) REFERENCES roleType(id)
);

/* Tasks */
CREATE TABLE task(
	id int PRIMARY KEY AUTO_INCREMENT,
    name varchar(255),
    description varchar(255),
    startDate datetime,
    dueDate datetime,
    creationDate datetime,
    creatorId int,
    projectId int,
    stateId int,
    calendarId int,/*investigar que se ocupa para google calendar*/
    CONSTRAINT FOREIGN KEY (projectId) REFERENCES project(id),
	CONSTRAINT FOREIGN KEY (creatorId) REFERENCES person(id),    
    CONSTRAINT FOREIGN KEY (stateId) REFERENCES stateType(id)
);

CREATE TABLE taskMembers(
	taskId int,
    userId int,
    roleId int,
    lastSeen datetime,
    startDate datetime,
    endDate datetime,
    CONSTRAINT FOREIGN KEY (taskId) REFERENCES task(id),
    CONSTRAINT FOREIGN KEY (userId) REFERENCES person(id),
    CONSTRAINT FOREIGN KEY (roleId) REFERENCES roleType(id)
);

CREATE TABLE taskMessages(
	id int PRIMARY KEY AUTO_INCREMENT,
    taskId int,
    userId int,
    message text,
    messageType int,
    attachment varchar(255), /*que se ocupa google drive?*/
    attachmentTypeId int,
    date datetime,
    CONSTRAINT FOREIGN KEY (taskId) REFERENCES task(id),
    CONSTRAINT FOREIGN KEY (userId) REFERENCES person(id),
    CONSTRAINT FOREIGN KEY (attachmentTypeId) REFERENCES attachmentType(id)
    
);

CREATE TABLE checkList(
	id int PRIMARY KEY AUTO_INCREMENT,
    taskId int ,
    title varchar(255),
    dueDate datetime,
    dateCreated datetime,
    userId int,
    CONSTRAINT FOREIGN KEY (taskId) REFERENCES task(id),
    CONSTRAINT FOREIGN KEY (userId) REFERENCES person(id)
);

CREATE TABLE checkListItems(
	checkListId int,
    item varchar(255),
    dueDate datetime,
    isChecked bool,
    creatorId int,
    terminatorId int,
    terminationDate datetime,
    CONSTRAINT FOREIGN KEY (checkListId) REFERENCES checkList(id),
    CONSTRAINT FOREIGN KEY (creatorId) REFERENCES person(id),
    CONSTRAINT FOREIGN KEY (terminatorId) REFERENCES person(id)
);






