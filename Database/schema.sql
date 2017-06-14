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

CREATE TABLE gender(
	id int PRIMARY KEY AUTO_INCREMENT,
    description varchar(255)
);

DROP TABLE IF EXISTS country;
CREATE TABLE country(
	id int PRIMARY KEY AUTO_INCREMENT,
    description varchar(255)
);

DROP TABLE IF EXISTS province;
CREATE TABLE province(
	id int PRIMARY KEY AUTO_INCREMENT,
    description varchar(255),
    countryId int,
    CONSTRAINT FOREIGN KEY (countryId) REFERENCES country(id)
);

DROP TABLE IF EXISTS city;
CREATE TABLE city(
	id int PRIMARY KEY AUTO_INCREMENT,
    description varchar(255),
    provinceId int,
    CONSTRAINT FOREIGN KEY (provinceId) REFERENCES province(id)
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
    mobile varchar(255) NOT NULL,
    phone varchar(255),
    ext varchar(255),
    password varchar(255) NOT NULL,
    genderId int,
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
    CONSTRAINT FOREIGN KEY (roleId) REFERENCES roleType(id),
    CONSTRAINT FOREIGN KEY (genderId) REFERENCES gender(id)
);

DROP TABLE IF EXISTS personSettings;
CREATE TABLE personSettings(
	personId int,
    isFullFeed bool, /* If the user wants to be everyones feed or just peple he follows */
    CONSTRAINT FOREIGN KEY (personId) REFERENCES person(id)
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
    CONSTRAINT FOREIGN KEY (postId) REFERENCES post(id),
    CONSTRAINT UNIQUE KEY (postId,personId)
);



/* TEAMS */
DROP TABLE IF EXISTS team;
CREATE TABLE team(
	id int PRIMARY KEY AUTO_INCREMENT,
    name varchar(255),
    abbr varchar(10),
    teamGoal text,
    parentTeamId int NULL,
    email varchar(255),
    address text,
    postCode varchar(10),
    cityId int,
    phone1 varchar(255),
    ext1 varchar(255),
    phone2 varchar(255),
    ext2 varchar(255),
    latitude varchar(255),
    longitude varchar(255),
    logo varchar(255),
    isActive bool,
    creationDate datetime,
    personId int,    
    stateTypeId int, /* public or private group */
    CONSTRAINT FOREIGN KEY (parentTeamId) REFERENCES team(id),
    CONSTRAINT FOREIGN KEY (cityId) REFERENCES city(id),
    CONSTRAINT FOREIGN KEY (personId) REFERENCES person(id),
    CONSTRAINT FOREIGN KEY (stateTypeId) REFERENCES stateType(id)
);

DROP TABLE IF EXISTS teamMember;
CREATE TABLE teamMember(
	teamId int,
    personId int,
    lastSeen datetime,
    startDate datetime,
    endDate datetime,
    roleId int,
    CONSTRAINT FOREIGN KEY (teamId) REFERENCES team(id),
    CONSTRAINT FOREIGN KEY (personId) REFERENCES person(id),
    CONSTRAINT FOREIGN KEY (roleId) REFERENCES roleType(id),
    CONSTRAINT UNIQUE KEY (teamId,personId)
);

/*PROJECTS*/
DROP TABLE IF EXISTS project;
CREATE TABLE project(
	id int PRIMARY KEY AUTO_INCREMENT,
    name varchar(250),
    abbr varchar(10),
    startDate datetime,
    creatorId int,
	dueDate datetime,
    logo varchar(255),
    CONSTRAINT FOREIGN KEY (creatorId) REFERENCES person(id)
);

DROP TABLE IF EXISTS projectTeam;
CREATE TABLE projectTeam(
	projectId int,
    teamId int,
    startDate datetime,
    endDate datetime,
    CONSTRAINT FOREIGN KEY (projectId) REFERENCES project(id),
    CONSTRAINT FOREIGN KEY (teamId) REFERENCES team(id),
    CONSTRAINT UNIQUE KEY (projectId,teamId)    
);

DROP TABLE IF EXISTS projectMember;
CREATE TABLE projectMember(
	projectId int,
    personId int,
    roleId int,
    lastSeen datetime,
    startDate datetime,
    endDate datetime,
    CONSTRAINT FOREIGN KEY (projectId) REFERENCES project(id),
    CONSTRAINT FOREIGN KEY (personId) REFERENCES person(id),
    CONSTRAINT FOREIGN KEY (roleId) REFERENCES roleType(id),
    CONSTRAINT UNIQUE KEY (projectId,personId)    
);

/* Tasks */
DROP TABLE IF EXISTS task;
CREATE TABLE task(
	id int PRIMARY KEY AUTO_INCREMENT,
    name varchar(255),
    description text,
    startDate datetime,
    dueDate datetime,
    creationDate datetime,
    creatorId int,
    projectId int,
    stateId int,
    calendarId varchar(255),/*investigar que se ocupa para google calendar*/
    CONSTRAINT FOREIGN KEY (projectId) REFERENCES project(id),
	CONSTRAINT FOREIGN KEY (creatorId) REFERENCES person(id),    
    CONSTRAINT FOREIGN KEY (stateId) REFERENCES stateType(id)    
);

DROP TABLE IF EXISTS taskMember;
CREATE TABLE taskMember(
	taskId int,
    personId int,
    roleId int,
    lastSeen datetime,
    startDate datetime,
    endDate datetime,
    CONSTRAINT FOREIGN KEY (taskId) REFERENCES task(id),
    CONSTRAINT FOREIGN KEY (personId) REFERENCES person(id),
    CONSTRAINT FOREIGN KEY (roleId) REFERENCES roleType(id),
    CONSTRAINT UNIQUE KEY (taskId,personId)    
);

/*----------TASK MESSAGES----------------*/
DROP TABLE IF EXISTS taskMessage;
CREATE TABLE taskMessage(
	id int PRIMARY KEY AUTO_INCREMENT,
    taskId int,
    personId int,
    message text,
    messageTypeId int,
    attachment varchar(255), /*que se ocupa google drive?*/
    attachmentTypeId int,
    messageDate datetime,
    CONSTRAINT FOREIGN KEY (taskId) REFERENCES task(id),
    CONSTRAINT FOREIGN KEY (personId) REFERENCES person(id),
    CONSTRAINT FOREIGN KEY (messageTypeId) REFERENCES messageType(id),    
    CONSTRAINT FOREIGN KEY (attachmentTypeId) REFERENCES attachmentType(id)
    
);

DROP TABLE IF EXISTS checkList;
CREATE TABLE checkList(
	id int PRIMARY KEY AUTO_INCREMENT,
    taskId int ,
    title varchar(255),
    dueDate datetime,
    dateCreated datetime,
    personId int,
    CONSTRAINT FOREIGN KEY (taskId) REFERENCES task(id),
    CONSTRAINT FOREIGN KEY (personId) REFERENCES person(id)
);

DROP TABLE IF EXISTS checkListItem;
CREATE TABLE checkListItem(
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






