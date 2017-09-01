
DELIMITER $$
DROP FUNCTION IF EXISTS getAbbr$$
CREATE FUNCTION `getAbbr` (_name varchar(255),_lastName varchar(255)) 
RETURNS VARCHAR(3)
BEGIN

	RETURN CONCAT(LEFT(_name,1),LEFT(_lastName,1));
    
END$$

DELIMITER $$
DROP FUNCTION IF EXISTS getTaskCount$$
CREATE FUNCTION `getTaskCount` (_projectId int, _stateId int) 
RETURNS INT
BEGIN

	SET @activeTasks = (	SELECT count(*)
											FROM task
											WHERE projectId = _projectId AND stateId = ifnull(_stateId,stateId) );
    RETURN @activeTasks;
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

	SELECT concat(	names,' ',firstLastName/*,ifnull(concat(' ',secondLastName),'')*/	) INTO fullName
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

	IF (_lowerDate >= _higherDate) THEN
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
DROP FUNCTION IF EXISTS isParent$$
CREATE FUNCTION isParent(_personId int) RETURNS bool
BEGIN
	DECLARE _isParent bool DEFAULT false;
    
	SELECT 	CASE WHEN count(*) > 0 THEN true ELSE false END INTO _isParent
	FROM person
	WHERE higherPersonId = _personId;
    
    RETURN _isParent;
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
			ifnull(endDate,NOW() + 1) > NOW();

	RETURN _isValid;
    
END$$

DELIMITER $$
DROP FUNCTION IF EXISTS getProjectProgress$$
CREATE FUNCTION getProjectProgress(_projectId int) RETURNS text
BEGIN
	DECLARE _progress double;
	SELECT  (SUM( CASE WHEN t.stateId <> 1 THEN 100 ELSE progress END)*100) / (count(*)*100)/100 INTO _progress
	FROM task as t
	INNER JOIN project as p on p.id = t.projectId
	WHERE p.id = _projectId
	GROUP BY projectId;
    
    RETURN _progress;
END$$

DELIMITER $$
DROP FUNCTION IF EXISTS getJsonMembers$$
CREATE FUNCTION getJsonMembers(_taskId int, _roleId int) RETURNS text
BEGIN

	DECLARE _members text;
	SET SESSION group_concat_max_len = 1000000;
    SELECT concat('[',
					group_concat( concat(
                    '{',
						'"personId":',t.personId,',',
						'"avatar":"',getAvatar(personId),'",',
						'"abbr":"',getPersonAbbr(personId),'",',
						'"person":"',getFullName(personId),'",',
                        '"theme":"',ifnull(p.theme,'#555555'),'",',
                        '"playerIds":"',getPlayerIds(personId),'"',
                    '}') separator ','),
				  ']') INTO _members
    FROM taskMember as t
    INNER JOIN person as p on p.id = t.personId
    WHERE taskId = _taskId and t.roleId = ifnull(_roleId, t.roleId);
    
    RETURN _members;

END$$

DELIMITER $$
DROP FUNCTION IF EXISTS getPlayerIds$$
CREATE FUNCTION getPlayerIds(_personId int) RETURNS text
BEGIN

	DECLARE _playerId text;
	SELECT CONCAT_WS(',',os_android, os_ios) INTO _playerId
	FROM person
	WHERE id = _personId;
    
    RETURN _playerId;

END$$

DELIMITER $$
DROP FUNCTION IF EXISTS getProjectMembers$$
CREATE FUNCTION getProjectMembers(_projectId int, _roleId int) RETURNS text
BEGIN

	DECLARE _members text;
	SET SESSION group_concat_max_len = 1000000;
    SELECT concat('[',
					group_concat( concat(
                    '{',
						'"personId":',t.personId,',',
						'"avatar":"',getAvatar(personId),'",',
						'"abbr":"',getPersonAbbr(personId),'",',
						'"person":"',getFullName(personId),'",',
                        '"theme":"',ifnull(p.theme,'#555555'),'"',
                    '}') separator ','),
				  ']') INTO _members
    FROM projectMember as t
    INNER JOIN person as p on p.id = t.personId
    WHERE projectId = _projectId and t.roleId = ifnull(_roleId, t.roleId);
    
    RETURN _members;

END$$

DELIMITER $$
DROP VIEW IF EXISTS vwSeenNotification$$
CREATE VIEW vwSeenNotification AS

	SELECT 	t.id as taskId,
			tm.personId,
			SUM(areValidDates(ifnull(tm.lastSeen, '1900-01-02'),ifnull(t.creationDate, '1900-01-01'))) as taskNotif
	FROM task as t
	INNER JOIN taskMember as tm on tm.taskId = t.id
	GROUP BY t.id, tm.personId;$$
    
DELIMITER $$
DROP VIEW IF EXISTS vwMessageNotification$$
CREATE VIEW vwMessageNotification AS

	SELECT 	t.id as taskId,
			tm.personId,
			SUM(areValidDates(ifnull(tm.lastSeen, '1900-01-02'),ifnull(tmsg.messageDate, '1900-01-01'))) as chatNotif
	FROM task as t
	INNER JOIN taskMember as tm on tm.taskId = t.id
	LEFT JOIN taskMessage as tmsg on tmsg.taskId = t.id
	GROUP BY t.id, tm.personId;$$

DELIMITER $$
DROP VIEW IF EXISTS vwCheckListNotification$$
CREATE VIEW vwCheckListNotification AS

	SELECT 	t.id as taskId,
			tm.personId,
			SUM(areValidDates(ifnull(tm.lastSeen, '1900-01-02'),ifnull(chi.lastChanged, '1900-01-01'))) as checkNotif
	FROM task as t
	INNER JOIN taskMember as tm on tm.taskId = t.id
	LEFT JOIN checkList as ch on ch.taskId = t.id
	LEFT JOIN checkListItem as chi on chi.checkListId = ch.id
	GROUP BY t.id, tm.personId;$$


DELIMITER $$
DROP VIEW IF EXISTS vwTaskNotifications$$
CREATE VIEW vwTaskNotifications AS

	SELECT SC1.taskId, SC1.personId, taskNotif, chatNotif, checkNotif
	FROM task as tk
	INNER JOIN taskMember as tm on tm.taskId = tk.id
	LEFT JOIN vwSeenNotification AS SC1 on tk.id = SC1.taskId and SC1.personId = tm.personId
	LEFT JOIN vwMessageNotification AS SC2 on tk.id = SC2.taskId and SC2.personId = tm.personId
	LEFT JOIN vwCheckListNotification AS SC3 on tk.id = SC3.taskId and SC3.personId = tm.personId
    WHERE tk.stateId in (1);$$


DELIMITER $$
DROP VIEW IF EXISTS vwPersonTaskProgress$$
CREATE VIEW vwPersonTaskProgress AS

	select 	tm.personId,
			SUM(CASE WHEN t.stateId = 1 THEN 1 ELSE 0 END) ActiveTasks,
			SUM(CASE WHEN t.stateId = 5 THEN 1 ELSE 0 END) Completed,
			SUM(CASE WHEN t.stateId in (1,5) THEN 1 ELSE 0 END) TotalTasks
	from task as t
	INNER JOIN taskMember as tm on tm.taskId = t.id
	INNER JOIN roleType as rt on rt.id = tm.roleId
	GROUP BY tm.personId






