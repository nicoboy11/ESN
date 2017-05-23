USE `esn`;

/*================SCOPE TYPE===========================*/
DELIMITER $$
DROP procedure IF EXISTS `CreateScopeType`$$
CREATE PROCEDURE `CreateScopeType` (IN _description varchar(255))
BEGIN

	INSERT INTO scopeType(description) VALUES(_description);

    SELECT LAST_INSERT_ID() as id;
    
END$$

DELIMITER $$
DROP procedure IF EXISTS `GetScopeType`$$
CREATE PROCEDURE `GetScopeType` (IN _id varchar(255))
BEGIN

    SELECT id,description
    FROM scopeType
    WHERE id = coalesce(_id,id);
    
END$$
/*CALL GetScopeType(NULL);*/

DELIMITER $$
DROP procedure IF EXISTS `EditScopeType`$$
CREATE PROCEDURE `EditScopeType` (IN _id int, IN _description varchar(255))
BEGIN

    UPDATE scopeType
    SET description = _description
    WHERE id = _id;
    
END$$
/*CALL EditScopeType(2,'Team');*/


/*================ROLE TYPE===========================*/
DELIMITER $$
DROP procedure IF EXISTS `CreateRoleType`$$
CREATE PROCEDURE `CreateRoleType` (IN _description varchar(255))
BEGIN

	INSERT INTO roleType(description) VALUES(_description);

    SELECT LAST_INSERT_ID() as id;
    
END$$

DELIMITER $$
DROP procedure IF EXISTS `GetRoleType`$$
CREATE PROCEDURE `GetRoleType` (IN _id varchar(255))
BEGIN

    SELECT id,description
    FROM roleType
    WHERE id = coalesce(_id,id);
    
END$$
/*CALL GetRoleType(NULL);*/

DELIMITER $$
DROP procedure IF EXISTS `EditRoleType`$$
CREATE PROCEDURE `EditRoleType` (IN _id int, IN _description varchar(255))
BEGIN

    UPDATE roleType
    SET description = _description
    WHERE id = _id;
    
END$$
/*CALL EditRoleType(2,'Leader');*/

/*================STATE TYPE===========================*/
DELIMITER $$
DROP procedure IF EXISTS `CreateStateType`$$
CREATE PROCEDURE `CreateStateType` (IN _description varchar(255))
BEGIN

	INSERT INTO stateType(description) VALUES(_description);

    SELECT LAST_INSERT_ID() as id;
    
END$$

DELIMITER $$
DROP procedure IF EXISTS `GetStateType`$$
CREATE PROCEDURE `GetStateType` (IN _id varchar(255))
BEGIN

    SELECT id,description
    FROM stateType
    WHERE id = coalesce(_id,id);
    
END$$
/*CALL GetStateType(NULL);*/

DELIMITER $$
DROP procedure IF EXISTS `EditStateType`$$
CREATE PROCEDURE `EditStateType` (IN _id int, IN _description varchar(255))
BEGIN

    UPDATE stateType
    SET description = _description
    WHERE id = _id;
    
END$$
/*CALL EditStateType(2,'Inactive');*/


/*================ATTACHMENT TYPE===========================*/
DELIMITER $$
DROP procedure IF EXISTS `CreateAttachmentType`$$
CREATE PROCEDURE `CreateAttachmentType` (IN _description varchar(255))
BEGIN

	INSERT INTO attachmentType(description) VALUES(_description);

    SELECT LAST_INSERT_ID() as id;
    
END$$

DELIMITER $$
DROP procedure IF EXISTS `GetAttachmentType`$$
CREATE PROCEDURE `GetAttachmentType` (IN _id varchar(255))
BEGIN

    SELECT id,description
    FROM attachmentType
    WHERE id = coalesce(_id,id);
    
END$$
/*CALL GetAttachmentType(NULL);*/

DELIMITER $$
DROP procedure IF EXISTS `EditAttachmentType`$$
CREATE PROCEDURE `EditAttachmentType` (IN _id int, IN _description varchar(255))
BEGIN

    UPDATE attachmentType
    SET description = _description
    WHERE id = _id;
    
END$$
/*CALL EditAttachmentType(2,'Photo');*/

/*================MESSAGE TYPE===========================*/
DELIMITER $$
DROP procedure IF EXISTS `CreateMessageType`$$
CREATE PROCEDURE `CreateMessageType` (IN _description varchar(255))
BEGIN

	INSERT INTO messageType(description) VALUES(_description);

    SELECT LAST_INSERT_ID() as id;
    
END$$

DELIMITER $$
DROP procedure IF EXISTS `GetMessageType`$$
CREATE PROCEDURE `GetMessageType` (IN _id varchar(255))
BEGIN

    SELECT id,description
    FROM messageType
    WHERE id = coalesce(_id,id);
    
END$$
/*CALL GetMessageType(2);*/

DELIMITER $$
DROP procedure IF EXISTS `EditMessageType`$$
CREATE PROCEDURE `EditMessageType` (IN _id int, IN _description varchar(255))
BEGIN

    UPDATE messageType
    SET description = _description
    WHERE id = _id;
    
END$$
/*CALL EditMessageType(2,'Log');*/

/*===================================================================================================*/
/*===================================================================================================*/
/*=========================================USER (PERSON)============================================*/

/*================PERSON===========================*/

DELIMITER $$
DROP procedure IF EXISTS `CreatePerson`$$
CREATE PROCEDURE `CreatePerson` (	IN _names varchar(255),IN _firstLastName varchar(255), IN _secondLastName varchar(255), 
									IN _dateOfBirth date, IN _email varchar(255),IN _phone varchar(255),IN _ext varchar(255),
                                    IN _password VARCHAR(255),IN _higherUserId int, IN _avatar varchar(255), _roleId int)
BEGIN
	
    SET @abbr = getAbbr(_names,_firstLastName);

    INSERT INTO person (names,firstLastName,secondLastName,dateOfBirth,email,phone,ext,password,higherUserId,avatar,abbr,roleId,startDate)
    VALUES(_names,_firstLastName,_secondLastName,_dateOfBirth,_email,_phone,_ext,_password,_higherUserId,_avatar,@abbr,_roleId,NOW());
    
END$$

DELIMITER $$
DROP procedure IF EXISTS `EditPerson`$$
CREATE PROCEDURE `EditPerson` (	IN _id int,
								IN _names varchar(255),		IN _firstLastName varchar(255), IN _secondLastName varchar(255), 
								IN _dateOfBirth date, 		IN _email varchar(255),			IN _phone varchar(255),			
                                IN _ext varchar(255),		IN _password VARCHAR(255),		IN _startDate varchar(255),		
                                IN _endDate varchar(255),	IN _higherUserId int,           IN _lastLogin datetime, 	
                                IN _avatar varchar(255),	IN _description varchar(255),	IN _job varchar(255), 
                                IN _roleId int	)
BEGIN
	
    SET @abbr = getAbbr(_names,_firstLastName);

    UPDATE person
    SET	names = coalesce(_names,names),	
		firstLastName = coalesce(_firstLastName,firstLastName),
        secondLastName = coalesce(_secondLastName,secondLastName),
        dateOfBirth = coalesce(_dateOfBirth,dateOfBirth),
        email = coalesce(_email,email),
        phone = coalesce(_phone,phone),
        ext = coalesce(_ext,ext),
        password = coalesce(_password,password),
        startDate = coalesce(_startDate,startDate),
        endDate = coalesceForceDate(_endDate,endDate,1),
        higherUserId = coalesce(_higherUserId,higherUserId),
        lastLogin = coalesce(_lastLogin,lastLogin),
        avatar = coalesce(_avatar,avatar),
        description = coalesce(_description,description),
        job = coalesce(_job,job),
        roleId = coalesce(_roleId,roleId),
        abbr = coalesce(@abbr,abbr)
	WHERE id = _id;
    
END$$

/* CALL EditPerson(1,NULL,NULL,NULL,NULL,'esosarodriguez1@sheffield.ac.uk',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL) */    


DELIMITER $$
DROP procedure IF EXISTS `GetPerson`$$
CREATE PROCEDURE `GetPerson` (IN _id int)
BEGIN
	
    SELECT	names,	
			firstLastName,
			secondLastName,
			dateOfBirth,
			email,
			phone,
			ext,
			startDate,
			endDate,
			higherUserId,
			lastLogin,
			avatar,
			description,
			job,
			roleId,
			abbr
    FROM person
    WHERE id = _id;
    
END$$
