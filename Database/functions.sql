
DELIMITER $$
DROP FUNCTION IF EXISTS getAbbr$$
CREATE FUNCTION `getAbbr` (_name varchar(255),_lastName varchar(255)) 
RETURNS VARCHAR(3)
BEGIN

	RETURN CONCAT(LEFT(_name,1),LEFT(_lastName,1));
    
END$$

DELIMITER $$
DROP FUNCTION IF EXISTS getPersonAbbr$$
CREATE FUNCTION `getPersonAbbr` (_personId int) 
RETURNS VARCHAR(3)
BEGIN

	SET @abbr = (	SELECT getAbbr(names, firstLastName)
					FROM person
					WHERE id = _personId	);
    RETURN @abbr;
END$$

DELIMITER $$
DROP FUNCTION IF EXISTS coalesceForceVarchar$$
CREATE FUNCTION `coalesceForceVarchar` (field1 varchar(255),field2 varchar(255),forceNull bool)
RETURNS VARCHAR(255)
BEGIN

	IF field1 is NULL THEN
		IF forceNull = true THEN
			RETURN NULL;
		ELSE
			RETURN field2;
		END IF;
    ELSE
		RETURN field1;
    END IF;
    
END$$


DELIMITER $$
DROP FUNCTION IF EXISTS coalesceForceDate$$
CREATE FUNCTION `coalesceForceDate` (field1 datetime,field2 datetime,forceNull bool)
RETURNS datetime
BEGIN

	IF field1 is NULL THEN
		IF forceNull = true THEN
			RETURN NULL;
		ELSE
			RETURN field2;
		END IF;
    ELSE
		RETURN field1;
    END IF;
    
END$$

DELIMITER $$
DROP FUNCTION IF EXISTS coalesceForceInt$$
CREATE FUNCTION `coalesceForceInt` (_field1 int,_field2 int,_forceNull bool)
RETURNS int
BEGIN

	IF _field1 is NULL THEN
		IF _forceNull = true THEN
			RETURN NULL;
		ELSE
			RETURN _field2;
		END IF;
    ELSE
		RETURN _field1;
    END IF;
    
END$$

DELIMITER $$
DROP FUNCTION IF EXISTS validatePersonExists$$
CREATE FUNCTION validatePersonExists(_email varchar(255),_names varchar(255), _firstLastName varchar(255), _secondLastName varchar(255), _dateOfBirth date) RETURNS varchar(255)
BEGIN
	
   
    IF (	SELECT count(*) FROM person
			WHERE 	email = _email	) = 1 THEN
            
		RETURN 'Email is in use.';
        
	END IF;        
    
    
	IF (	SELECT count(*) FROM person
			WHERE 	firstLastName = _firstLastName AND 
					secondLastName = _secondLastName AND 
					names = _names AND 
					dateOfBirth = _dateOfBirth	) = 1 THEN
    
		RETURN 'Person already signed up.';
    
	END IF;    

    RETURN '';
    
END$$


DELIMITER $$
DROP FUNCTION IF EXISTS validateLevelLoop$$
CREATE FUNCTION validateLevelLoop(_id int,_newHigherPersonId int) RETURNS int
BEGIN

	SET @newHigh = (SELECT getLevelKey(_newHigherPersonId));
	SET @id = (SELECT getLevelKey(_id));
	SET @loopFound = 0;

	SELECT count(@newHigh) as count INTO @loopFound
	FROM person
	WHERE id = _id AND @newHigh like concat('%',@id,'%');

	RETURN @loopFound;
    
END$$


DELIMITER $$
DROP FUNCTION IF EXISTS getLevelKey$$
CREATE FUNCTION getLevelKey(_id int) RETURNS varchar(1000) CHARSET utf8
BEGIN

	DECLARE _level int DEFAULT 0;
	DECLARE _higherPersonId int DEFAULT 9999;
	DECLARE _it int DEFAULT 0;
	DECLARE _key varchar(1000) DEFAULT '';
    
	SELECT ifnull(higherPersonId,0) as higherPersonId
	INTO _higherPersonId FROM
		person
	WHERE id = _id;
    
	SET _key = lpad(_id,4,'0');
    
	SET _key = CONCAT(lpad(_higherPersonId,4,'0'),'-',_key);
    
	WHILE _it < 50 && _higherPersonId != 0 DO
		
        SELECT ifnull(higherPersonId,0) INTO _higherPersonId
		FROM person
		WHERE id = _higherPersonId;
        
		SET _it = _it + 1;
		SET _level = _level + 1;
		SET _key = CONCAT(lpad(_higherPersonId,4,'0'),'-',_key);
        
	END WHILE;
      
	SET _key = REPLACE(_key,'0000-','');
    
	RETURN _key;
    
END$$


DELIMITER $$
DROP FUNCTION IF EXISTS isFollowing$$
CREATE FUNCTION isFollowing(_followerId int,_personId int) RETURNS bool
BEGIN

	DECLARE _isFollowing int DEFAULT 0;

	SELECT count(*) isFollowing INTO _isFollowing
    FROM followers
    WHERE personId = _followerId AND followerId = _personId;
    
    IF _isFollowing = 0 THEN
		RETURN false;
	ELSE
		RETURN true;
	END IF;

END$$


DELIMITER $$
DROP FUNCTION IF EXISTS getFullName$$
CREATE FUNCTION getFullName(_personId int) RETURNS varchar(255)
BEGIN

	DECLARE fullName varchar(255) DEFAULT '';

	SELECT concat(	names,' ',firstLastName,ifnull(concat(' ',secondLastName),'')	) INTO fullName
    FROM person
    WHERE id = _personId;

	RETURN fullName;

END$$


DELIMITER $$
DROP FUNCTION IF EXISTS getAvatar$$
CREATE FUNCTION getAvatar(_personId int) RETURNS varchar(255)
BEGIN

	DECLARE _avatar varchar(255) DEFAULT '';

	SELECT CASE WHEN ifnull(avatar,'') = '' THEN abbr ELSE avatar END INTO _avatar
    FROM person
    WHERE id = _personId;

	RETURN _avatar;

END$$

DELIMITER $$
DROP FUNCTION IF EXISTS areValidDates$$
CREATE FUNCTION areValidDates(_lowerDate datetime,_higherDate datetime) RETURNS bool
BEGIN

	IF (_lowerDate > _higherDate) THEN
		RETURN FALSE;
    END IF;
    

	RETURN TRUE;
    
END$$

DELIMITER $$
DROP FUNCTION IF EXISTS formatDate$$
CREATE FUNCTION formatDate(_date datetime) RETURNS varchar(20)
BEGIN
	RETURN date_format(_date,'%Y-%m-%d %T');
END$$


DELIMITER $$
DROP FUNCTION IF EXISTS isValidMessenger$$
CREATE FUNCTION isValidMessenger(_taskId int,_personId int) RETURNS bool
BEGIN

	DECLARE _isValid bool;
    
    /*If the user is an active member of the task*/
	SELECT CASE WHEN count(*) = 0 THEN FALSE ELSE TRUE END INTO _isValid
	FROM task as t
	INNER JOIN taskMember as tm on t.id = tm.taskId
	WHERE	tm.taskId = _taskId AND
			tm.personId = _personId AND
			endDate > NOW();

	RETURN _isValid;
    
END$$


DELIMITER $$
DROP FUNCTION IF EXISTS getJsonMembers$$
CREATE FUNCTION getJsonMembers(_taskId int, _roleId int) RETURNS text
BEGIN

	DECLARE _members text;

    SELECT concat('{',
					group_concat( concat(personId, 
                    ':{','avatar:"',getAvatar(personId),'",',
						'abbr:"',getPersonAbbr(personId),'"',
						'person:"',getFullName(personId),'"',
                    '}') separator ','),
				  '}') INTO _members
    FROM taskMember
    WHERE taskId = _taskId and roleId = _roleId;
    
    RETURN _members;

END$$

