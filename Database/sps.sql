USE `esn`;
/*================GENDER==============================*/
DELIMITER $$
DROP procedure IF EXISTS `CreateGender`$$
CREATE PROCEDURE `CreateGender` (IN _description varchar(255))
BEGIN

	INSERT INTO gender(description) VALUES(_description);

    SELECT LAST_INSERT_ID() as id;
    
END$$

/*================PROVINCE==============================*/
DELIMITER $$
DROP procedure IF EXISTS `CreateProvince`$$
CREATE PROCEDURE `CreateProvince` (IN _countryId int, IN _description varchar(255))
BEGIN

	INSERT INTO province(description) VALUES(_description);

    SELECT LAST_INSERT_ID() as id;
    
END$$
/*================CITY==============================*/
DELIMITER $$
DROP procedure IF EXISTS `CreateCity`$$
CREATE PROCEDURE `CreateCity` (IN _provinceId int, IN _description varchar(255))
BEGIN

	INSERT INTO city(description) VALUES(_description);

    SELECT LAST_INSERT_ID() as id;
    
END$$
/*================CONTRIES==============================*/
DELIMITER $$
DROP procedure IF EXISTS `CreateCountry`$$
CREATE PROCEDURE `CreateCountry` (IN _description varchar(255))
BEGIN

	INSERT INTO country(description) VALUES(_description);

    SELECT LAST_INSERT_ID() as id;
    
END$$
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
									IN _dateOfBirth date, IN _email varchar(255), IN _mobile varchar(255),IN _phone varchar(255),IN _ext varchar(255),
                                    IN _password VARCHAR(255),IN _genderId int,IN _higherPersonId int, 
                                    IN _avatar varchar(255),_token varchar(255), _roleId int)
BEGIN
	
	DECLARE _existsMessage varchar(255);
    DECLARE _abbr varchar(3); 
    
    SET _existsMessage = validatePersonExists(_email,_names,_firstLastName,_secondLastName,_dateOfBirth);
    
    IF _existsMessage <> '' THEN
		SIGNAL sqlstate 'ERROR' SET message_text = _existsMessage;
    END IF;
    
    SET _abbr = getAbbr(_names,_firstLastName);
    

    INSERT INTO person (names,firstLastName,secondLastName,dateOfBirth,email,mobile,phone,ext,password,genderId,higherPersonId,avatar,token,abbr,roleId,startDate)
    VALUES(_names,_firstLastName,_secondLastName,_dateOfBirth,_email,_mobile,_phone,_ext,_password,_genderId,_higherPersonId,_avatar,_token,_abbr,_roleId,NOW());
    
    SELECT LAST_INSERT_ID() as id;
    
END$$

DELIMITER $$
DROP procedure IF EXISTS `EditPerson`$$
CREATE PROCEDURE `EditPerson` (	IN _id int,
								IN _names varchar(255),		IN _firstLastName varchar(255), IN _secondLastName varchar(255), 
								IN _dateOfBirth date, 		IN _email varchar(255),			IN _mobile varchar(255),		IN _phone varchar(255),			
                                IN _ext varchar(255),		IN _password VARCHAR(255),		IN _genderId int,
                                IN _startDate varchar(255),	IN _endDate varchar(255),		IN _higherPersonId int,         
                                IN _lastLogin datetime, 	IN _avatar varchar(255),		IN _description varchar(255),	
                                IN _job varchar(255),       IN _roleId int,					IN _theme varchar(255),	    	
                                IN _token varchar(255),		IN _isIosSync bool,    			IN _isAndroidSync bool,    		
                                IN _os_android varchar(255),IN _os_ios varchar(255),    	IN _os_chrome varchar(255),		
                                IN _os_safari varchar(255)	)
BEGIN
	
	DECLARE _abbr varchar(3); 
	DECLARE _isLoop int; 
    
    SET _abbr = getAbbr(_names,_firstLastName);
    SET _isLoop = 0;
    
    SELECT validateLevelLoop(_id,_higherPersonId) INTO @isLoop;

	IF _isLoop = 0 THEN
    
		UPDATE person
		SET	names = coalesce(_names,names),	
			firstLastName = coalesce(_firstLastName,firstLastName),
			secondLastName = coalesce(_secondLastName,secondLastName),
			dateOfBirth = coalesce(_dateOfBirth,dateOfBirth),
			email = coalesce(_email,email),
            mobile = coalesce(_mobile,mobile),
			phone = coalesce(_phone,phone),
			ext = coalesce(_ext,ext),
			password = coalesce(_password,password),
            genderId = coalesce(_genderId,genderId),
			startDate = coalesce(_startDate,startDate),
			endDate = coalesceForceDate(_endDate,endDate,1),
			higherPersonId = coalesce(_higherPersonId,higherPersonId),
			lastLogin = coalesce(_lastLogin,lastLogin),
			avatar = coalesce(_avatar,avatar),
			description = coalesce(_description,description),
			job = coalesce(_job,job),
			roleId = coalesce(_roleId,roleId),
			abbr = coalesce(_abbr,abbr),
			theme = coalesce(_theme,theme),
            token = coalesce(_token,token),
			isIosSync = coalesce(_isIosSync,isIosSync),
            isAndroidSync = coalesce(_isAndroidSync,isAndroidSync),
            os_android = coalesce(_os_android,os_android),
			os_ios = coalesce(_os_ios,os_ios),
            os_chrome = coalesce(_os_chrome,os_chrome),
            os_safari = coalesce(_os_safari,os_safari)
		WHERE id = _id;
        
    ELSE
    
		SIGNAL sqlstate 'ERROR' SET message_text = 'A hierarchical loop was found.';
    
    END IF;


    
END$$

/* CALL EditPerson(4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL) */    
DELIMITER $$
DROP procedure IF EXISTS `GetPerson`$$
CREATE PROCEDURE `GetPerson` (IN _id int)
BEGIN
	
    SELECT	p.id as personId,
			p.names,	
			p.firstLastName,
			p.secondLastName,
            getFullName(p.id) as person,
			formatDate(p.dateOfBirth) as dateOfBirth,
			p.email,
            p.mobile,
            p.genderId,
            g.description as gender,
			p.phone,
			p.ext,
			formatDate(p.startDate) as startDate,
			formatDate(p.endDate) as endDate,
			p.higherPersonId,
            getFullName(p.higherPersonId) as higherPerson,
			formatDate(p.lastLogin) as lastLogin,
			p.avatar,
			p.description,
			p.job,
			p.roleId,
			p.abbr,
            getLevelKey(_id) as levelKey,
            p.theme
    FROM person as p
    INNER JOIN gender as g on g.id = p.genderId
    WHERE p.id = _id;
    
END$$

DELIMITER $$
DROP procedure IF EXISTS `GetLogin`$$
CREATE PROCEDURE `GetLogin` (IN _email varchar(255), IN _password varchar(255))
BEGIN

	DECLARE _id int;

	SELECT id INTO _id
    FROM person
    WHERE email = _email AND password = _password;
    
    CALL GetPerson(_id);

END$$

/*CALL GetLogin('even.sosa@gmail.com','passwerd');*/

/*================Followers===========================*/

DELIMITER $$
DROP procedure IF EXISTS `CreateFollower`$$
CREATE PROCEDURE `CreateFollower` (IN _followerId varchar(255), IN _personId varchar(255))
BEGIN

	INSERT INTO followers (personId,followerId,startDate) VALUES(_personId,_followerId,NOW());

END$$

DELIMITER $$
DROP procedure IF EXISTS `DeleteFollower`$$
CREATE PROCEDURE `DeleteFollower` (IN _followerId varchar(255), IN _personId varchar(255))
BEGIN

	DELETE FROM followers 
    WHERE 	personId = _personId AND 
			followerId = _followerId;

END$$

DELIMITER $$
DROP procedure IF EXISTS `GetFollows`$$
CREATE PROCEDURE `GetFollows` (IN _followerId varchar(255))
BEGIN

	SELECT 	p.id,
			getFullName(p.id) as person,
            p.email,
            isFollowing(f.followerId,f.personId) as isFollowing
	FROM followers as f
    INNER JOIN person as p on p.id = f.personId
    WHERE followerId = _followerId;

END$$


DELIMITER $$
DROP procedure IF EXISTS `GetFollowers`$$
CREATE PROCEDURE `GetFollowers` (IN _personId varchar(255))
BEGIN

	SELECT 	p.id,
			getFullName(p.id) as person,
            p.email,
            isFollowing(f.followerId,f.personId) as isFollowing
	FROM followers as f
    INNER JOIN person as p on p.id = f.followerId
    WHERE f.personId = _personId;

END$$



DELIMITER $$
DROP procedure IF EXISTS `GetHierarchy`$$
CREATE PROCEDURE `GetHierarchy` (IN _personId varchar(255))
BEGIN

	SELECT 	id,
			getFullName(id) as person,
			email,
            getLevelKey(id) as levelKey,
            getAvatar(id) as avatar
    FROM person
	WHERE getLevelKey(id) like concat('%',getLevelKey(_personId),'%')
    ORDER BY levelKey,person;


END$$


/*===================================================================================================*/
/*===================================================================================================*/
/*=========================================POSTS ============================================*/

DELIMITER $$
DROP procedure IF EXISTS `CreatePost`$$
CREATE PROCEDURE `CreatePost` (	IN _personId int,			IN _message text,			IN _messageTypeId int,
								IN _attachment varchar(255),IN _attachmentTypeId int,  	IN _scopeTypeId int,        
                                IN _scopeId int	)
BEGIN

	INSERT INTO post (personId,message,messageTypeId,attachment,attachmentTypeId,scopeTypeId,scopeId,creationDate)
	VALUES(_personId,_message,_messageTypeId,_attachment,_attachmentTypeId,_scopeTypeId,_scopeId,NOW());

	SELECT LAST_INSERT_ID() as id;

END$$

DELIMITER $$
DROP procedure IF EXISTS `GetPost`$$
CREATE PROCEDURE `GetPost` (	IN _postId int	)
BEGIN

	SELECT 	pst.id,
			pst.personId,
			getFullName(pe.id) as person,
			pst.message,
            pst.messageTypeId,
            ifnull(attachment,'') as attachment,
            attachmentTypeId,
            scopeTypeId,
            scopeId,
            formatDate(creationDate) as creationDate
    FROM post as pst
    INNER JOIN person as pe on pe.id = pst.personId
    WHERE pst.id = _postId;

END$$

DELIMITER $$
DROP procedure IF EXISTS `EditPost`$$
CREATE PROCEDURE `EditPost` (	IN _postId int,				IN _message text,		IN _attachment varchar(255),
								IN _attachmentTypeId int,  	IN _scopeTypeId int,    IN _scopeId int	)
BEGIN

	UPDATE post
    SET	message = 			coalesce(_message,message),
		attachment = 		coalesceForceVarchar(_attachment,attachment,true),
        attachmentTypeId = 	coalesceForceInt(_attachmentTypeId,attachmentTypeId,true),
        scopeTypeId = 		coalesceForceInt(_scopeTypeId,scopeTypeId,true),
        scopeId = 			coalesceForceInt(_scopeId,scopeId,true)
    WHERE id = 	_postId;

END$$

DELIMITER $$
DROP procedure IF EXISTS `CreatePostMessage`$$
CREATE PROCEDURE `CreatePostMessage` (	IN _postId int,			IN _personId int,				IN _message text,		
										IN _messageTypeId int,	IN _attachment varchar(255),  	IN _attachmentTypeId int)
BEGIN

	INSERT INTO postMessage (postId,personId,message,messageTypeId,attachment,attachmentTypeId,messageDate)
    VALUES(_postId,_personId,_message,_messageTypeId,_attachment,_attachmentTypeId,NOW());

END$$

DELIMITER $$
DROP procedure IF EXISTS `DeletePostMessage`$$
CREATE PROCEDURE `DeletePostMessage` (	IN _id int )
BEGIN

	DELETE FROM postMessage
    WHERE id = _id;

END$$



DELIMITER $$
DROP procedure IF EXISTS `CreatePostMember`$$
CREATE PROCEDURE `CreatePostMember` (	IN _postId int,		IN _personId int,		IN _isSaved bool,		
										IN _isliked bool  )
BEGIN

	INSERT INTO postMember (postId,personId,isSaved,isLiked,lastSeen)
    VALUES(_postId,_personId,_isSaved,_isLiked,NOW());

END$$


DELIMITER $$
DROP procedure IF EXISTS `EditPostMember`$$
CREATE PROCEDURE `EditPostMember` (	IN _postId int,		IN _personId int,		IN _isSaved bool,		
									IN _isliked bool  )
BEGIN

	IF (	SELECT count(*) 
			FROM postMember
            WHERE 	postId = _postId AND
					personId = _personId	) > 0 
	THEN
		
        UPDATE	postMember
        SET	isSaved = _isSaved,
			isLiked = _isLiked,
            lastSeen = NOW()
        WHERE 	postId = _postId AND
				personId = _personId;
        
	ELSE
		CALL CreatePostMember(_postId,_personId,_isSaved,_isliked);
	END IF;

END$$

/*--------------FEED--------------*/
DELIMITER $$
DROP procedure IF EXISTS `GetFeed`$$
CREATE PROCEDURE `GetFeed` (	IN _personId int,	IN _scopeTypeId int, IN _scopeId int  )
BEGIN


	/*REGLAS:
		Lost post pueden ser visto por:
			-Si es scope Type 1 (all)
				-seguidores
			-Si es scope Type 2 (Team)
				-Todas las personas de un grupo
			-Si es scopeType 3 (Project)
				-Todas las personas de un proyecto
			-Si es scopeType 4 (Person)
				-Todas las personas dentro de una conversación
	*/
	SELECT 	pst.id,
			pst.personId,
			pst.message,
			pst.messageTypeId,
			getFullName(pst.personId) as person,
			messageTypeId,
			attachment,
			attachmentTypeId,
			formatDate(creationDate) as creationDate,
            getAvatar(pst.personId) as avatar,
            p.theme,
            'Post' as category
	FROM post as pst
    INNER JOIN person as p on pst.personId = p.id
	WHERE pst.personId = _personId and pst.scopeTypeId = _scopeTypeId
	UNION ALL
	SELECT 	pst.id,
			pst.personId,
			pst.message,
			pst.messageTypeId,
			getFullName(pst.personId) as person,
			messageTypeId,
			attachment,
			attachmentTypeId,
			formatDate(creationDate) as creationDate,
            getAvatar(pst.personId) as avatar,
            p.theme,
            'Post' as category            
	FROM post as pst
	INNER JOIN followers as f on pst.personId = f.personId
    INNER JOIN person as p on pst.personId = p.id    
	WHERE f.followerId = _personId and pst.scopeTypeId = _scopeTypeId
    ORDER BY creationDate desc;

END$$

/*===================================================================================================*/
/*===================================================================================================*/
/*=========================================TEAMS============================================*/

DELIMITER $$
DROP procedure IF EXISTS `CreateTeam`$$
CREATE PROCEDURE `CreateTeam` (	IN _name varchar(255),		IN _abbr varchar(10),		IN _teamGoal text,
								IN _parentTeamId int,		IN _email varchar(255),		IN _address text,
                                IN _postCode varchar(10),	IN _cityId int,				IN _phone1 varchar(10),
                                IN _ext1 varchar(255),		IN _phone2 varchar(255),	IN _ext2 varchar(255),
                                IN _latitude varchar(255),	IN _longitude varchar(255),	IN _logo varchar(255),
								IN _personId int,			IN _stateTypeId int	)
BEGIN

	INSERT INTO team ( 	name,			abbr,			teamGoal, 
						parentTeamId, 	email, 			address, 
                        postCode, 		cityId, 		phone1, 
                        ext1, 			phone2, 		ext2,
                        latitude, 		longitude, 		logo, 
                        personId,		stateTypeId,
                        isActive,		creationDate	)
	VALUES(	_name,			_abbr,			_teamGoal, 
			_parentTeamId, 	_email, 		_address, 
			_postCode, 		_cityId, 		_phone1, 
			_ext1, 			_phone2, 		_ext2,
			_latitude, 		_longitude, 	_logo, 
			_personId,		_stateTypeId,
			1,		NOW()	);
                        
	SELECT LAST_INSERT_ID() as id;

END$$


DELIMITER $$
DROP procedure IF EXISTS `EditTeam`$$
CREATE PROCEDURE `EditTeam` (	IN _teamId int,
								IN _name varchar(255),		IN _abbr varchar(10),		IN _teamGoal text,
								IN _parentTeamId int,		IN _email varchar(255),		IN _address text,
                                IN _postCode varchar(10),	IN _cityId int,				IN _phone1 varchar(10),
                                IN _ext1 varchar(255),		IN _phone2 varchar(255),	IN _ext2 varchar(255),
                                IN _latitude varchar(255),	IN _longitude varchar(255),	IN _logo varchar(255),
								IN _personId int,			IN _stateTypeId int,		IN _isActive int	)
BEGIN

	UPDATE team
    SET name = 			coalesce(_name,name),
		abbr = 			coalesce(_abbr,abbr),
        teamGoal = 		coalesce(_teamGoal,teamGoal),
        parentTeamId = 	coalesce(_parentTeamId,parentTeamId),
        email = 		coalesce(_email,email),
        address = 		coalesce(_address,address),
        postCode = 		coalesce(_postCode,postCode),
        cityId = 		coalesce(_cityId,cityId),
        phone1 = 		coalesce(_phone1,phone1),
        ext1 = 			coalesce(_ext1,ext1),
        phone2 = 		coalesce(_phone2,phone2),
        ext2 = 			coalesce(_ext2,ext2),
        latitude = 		coalesce(_latitude,latitude),
        longitude = 	coalesce(_longitude,longitude),
        logo = 			coalesce(_logo,logo),
        personID = 		coalesce(_personId,personId),
        stateTypeId = 	coalesce(_stateTypeId,stateTypeId),
        isActive = 		coalesce(_isActive,isActive)
    WHERE id = _teamId;

END$$


DELIMITER $$
DROP procedure IF EXISTS `GetTeam`$$
CREATE PROCEDURE `GetTeam` (	IN _teamId int	)
BEGIN
    SELECT	name,
			abbr,
			teamGoal,
			parentTeamId,
			email,
			address,
			postCode,
			cityId,
			phone1,
			ext1,
			phone2,
			ext2,
			latitude,
			longitude,
			logo,
			personID,
			stateTypeId,
			isActive
	FROM team
    WHERE id = _id;

END$$

/*-------------Team Members-------------------*/
DELIMITER $$
DROP procedure IF EXISTS `CreateTeamMember`$$
CREATE PROCEDURE `CreateTeamMember` (	IN _teamId int, IN _personId int, IN _roleId int	)
BEGIN

	INSERT INTO teamMember(teamId,personId,roleId,startDate)
    VALUES(_teamId,_personId,_roleId,NOW());

END$$

DELIMITER $$
DROP procedure IF EXISTS `EditTeamMember`$$
CREATE PROCEDURE `EditTeamMember` (	IN _teamId int, IN _personId int, _endDate datetime, _lastSeen datetime, _roleId int	)
BEGIN

	UPDATE teamMember
    SET		endDate = coalesce(_endDate,endDate),
			lastSeen = coalesce(_lastSeen,lastSeen),
            roleId = coalesce(_roleId,roleId)
    WHERE 	teamId = _teamId AND
			personId = _personId;
    
END$$

DELIMITER $$
DROP procedure IF EXISTS `GetTeamMembers`$$
CREATE PROCEDURE `GetTeamMembers` (	IN _teamId int	)
BEGIN

	SELECT 	tm.teamId,
			tm.personId,
            getFullName(tm.personId) as person,
            getAvatar(tm.personId) as avatar,
            tm.roleId,
            r.description as roleType,
            tm.lastSeen,
            tm.startDate
    FROM teamMember as tm
    INNER JOIN roleType as r on r.id = tm.roleId
    WHERE tm.teamId = _teamId;
    
END$$

/*--------------------Projects--------------------------*/

DELIMITER $$
DROP PROCEDURE IF EXISTS `CreateProject`$$
CREATE PROCEDURE `CreateProject` (	IN _name varchar(250), 	IN _abbr varchar(10), 	IN _startDate datetime, 
									IN _creatorId int, 		IN _dueDate datetime, 	IN _logo varchar(255) )
BEGIN

	IF(areValidDates(_startDate,_dueDate) = FALSE) THEN
		SIGNAL sqlstate 'ERROR' SET message_text = 'The start date is greater than the end date.';
    END IF;

	INSERT INTO project ( name, abbr, startDate, creatorId, dueDate, logo )
    VALUES ( _name, _abbr, _startDate, _creatorId, _dueDate, _logo );

END$$

DELIMITER $$
DROP PROCEDURE IF EXISTS `EditProject`$$
CREATE PROCEDURE `EditProject` (	IN _id int, 			IN _name varchar(250), 	IN _abbr varchar(10), 	IN _startDate datetime, 
									IN _creatorId int, 		IN _dueDate datetime, 	IN _logo varchar(255) )
BEGIN

	IF(areValidDates(_startDate,_dueDate) = FALSE) THEN
		SIGNAL sqlstate 'ERROR' SET message_text = 'The start date is greater than the end date.';
    END IF;

	UPDATE project 
    SET name = _name, 
		abbr = _abbr, 
        startDate = _startDate, 
        creatorId = _creatorId, 
        dueDate = _dueDate, 
        logo = _logo
	WHERE id = _id;

END$$

DELIMITER $$
DROP PROCEDURE IF EXISTS `GetProject`$$
CREATE PROCEDURE `GetProject` (	IN _id int )
BEGIN

	SELECT 	name,
			abbr,
			startDate,
			creatorId,
			dueDate,
			logo
	FROM project
	WHERE id = _id;

END$$

/*--------------------Project Teams--------------------------*/
DELIMITER $$
DROP PROCEDURE IF EXISTS `CreateProjectTeam`$$
CREATE PROCEDURE `CreateProjectTeam` (	IN _projectId int, IN _teamId int, IN _startDate datetime, IN _endDate datetime)
BEGIN

	IF(areValidDates(_startDate,_endDate) = FALSE) THEN
		SIGNAL sqlstate 'ERROR' SET message_text = 'The start date is greater than the end date.';
    END IF;

	INSERT INTO projectTeam ( projectId, teamId, startDate, endDate )
    VALUES ( _projectId, _teamId, _startDate, _endDate);

END$$

DELIMITER $$
DROP PROCEDURE IF EXISTS `EditProjectTeam`$$
CREATE PROCEDURE `EditProjectTeam` ( IN _projectId int, IN _teamId int, IN _startDate datetime, IN _endDate datetime )
BEGIN

	IF(areValidDates(_startDate,_endDate) = FALSE) THEN
		SIGNAL sqlstate 'ERROR' SET message_text = 'The start date is greater than the end date.';
    END IF;

	UPDATE projectTeam 
    SET startDate = _startDate, 
        endDate = _endDate
	WHERE 	projectId = _projectId AND
			teamId = _teamId;

END$$

DELIMITER $$
DROP PROCEDURE IF EXISTS `DeleteProjectTeam`$$
CREATE PROCEDURE `DeleteProjectTeam` ( IN _projectId int, IN _teamId int )
BEGIN

	DELETE FROM projectTeam 
	WHERE 	projectId = _projectId AND
			teamId = _teamId;

END$$

DELIMITER $$
DROP PROCEDURE IF EXISTS `GetProjectTeam`$$
CREATE PROCEDURE `GetProjectTeam` (	IN _projectId int, IN _teamId int )
BEGIN

	SELECT 	projectId,
			teamId,
			startDate,
			endDate
	FROM projectTeam
	WHERE 	projectId = _projectId AND
			teamId = coalesce(_teamId, teamId);

END$$

/*--------------------Project Members--------------------------*/
DELIMITER $$
DROP PROCEDURE IF EXISTS `CreateProjectMember`$$
CREATE PROCEDURE `CreateProjectMember` (	IN _projectId int, 		IN _personId int, 		IN _roleId int, 
											IN _startDate datetime, IN _endDate datetime	)
BEGIN

	IF(areValidDates(_startDate,_endDate) = FALSE) THEN
		SIGNAL sqlstate 'ERROR' SET message_text = 'The start date is greater than the end date.';
    END IF;

	INSERT INTO projectMember ( projectId, personId, roleId, startDate, endDate )
    VALUES ( _projectId, _personId, _roleId, _startDate, _endDate );

END$$

DELIMITER $$
DROP PROCEDURE IF EXISTS `EditProjectMember`$$
CREATE PROCEDURE `EditProjectMember` (	IN _projectId int, 		IN _personId int, 		IN _roleId int, 
										IN _lastSeen datetime,  IN _startDate datetime, IN _endDate datetime	)
BEGIN

	IF(areValidDates(_startDate,_endDate) = FALSE) THEN
		SIGNAL sqlstate 'ERROR' SET message_text = 'The start date is greater than the end date.';
    END IF;

	UPDATE projectMember 
    SET roleId = coalesce(_roleId,roleId),
		lastSeen = coalesce(_lastSeen,lastSeen),
		startDate = coalesce(_startDate,startDate), 
        endDate = coalesce(_endDate,endDate)
	WHERE 	projectId = _projectId AND
			personId = _personId;

END$$

DELIMITER $$
DROP PROCEDURE IF EXISTS `DeleteProjectMember`$$
CREATE PROCEDURE `DeleteProjectMember` ( IN _projectId int, IN _personId int )
BEGIN

	DELETE FROM projectMember 
	WHERE 	projectId = _projectId AND
			personId = _personId;

END$$



DELIMITER $$
DROP PROCEDURE IF EXISTS `GetProjectMember`$$
CREATE PROCEDURE `GetProjectMember` (	IN _projectId int, IN _personId int )
BEGIN

	SELECT 	projectId,
			personId,
            roleId,
            lastSeen,
			startDate,
			endDate
	FROM projectMember
	WHERE 	projectId = coalesce(_projectId,projectId) AND
			userId = coalesce(_personId, personId);

END$$

/*--------------------TASKS-----------------------*/

DELIMITER $$
DROP PROCEDURE IF EXISTS `CreateTask`$$
CREATE PROCEDURE `CreateTask` (	IN _name varchar(255), 	IN _description text, 		IN _startDate datetime, 
								IN _dueDate datetime, 	IN _creationDate datetime,	IN _creatorId int, 		
                                IN _projectId int,		IN _calendarId varchar(255) )
BEGIN

	IF(areValidDates(_startDate,_dueDate) = FALSE) THEN
		SIGNAL sqlstate 'ERROR' SET message_text = 'The start date is greater than the end date.';
    END IF;

	INSERT INTO task ( name, description, startDate, dueDate, creationDate, creatorId, projectId, calendarId )
    VALUES ( _name, _description, _startDate, _dueDate, _creationDate, _creatorId, _projectId, _calendarId );
    
	CALL CreateTaskMember(LAST_INSERT_ID(), _creatorId, 1, NOW(), NULL);    

END$$

DELIMITER $$
DROP PROCEDURE IF EXISTS `EditTask`$$
CREATE PROCEDURE `EditTask` (	IN _taskId int, 		IN _name varchar(255), 		IN _description text, 		IN _startDate datetime, 
								IN _dueDate datetime, 	IN _creationDate datetime,	IN _creatorId int, 		
                                IN _projectId int,		IN _stateId int,			IN _calendarId varchar(255) )
BEGIN

	IF(areValidDates(_startDate,_dueDate) = FALSE) THEN
		SIGNAL sqlstate 'ERROR' SET message_text = 'The start date is greater than the end date.';
    END IF;

	UPDATE task
    SET name = 	coalesce(_name,name),
		description = coalesce(_description, description),
        startDate = coalesce(_startDate, startDate),
        dueDate = coalesce(_dueDate, dueDate),
        projectId = coalesce(_projectId, projectId),
        stateId = coalesce(_stateId, stateId),
        calendarId = coalesce(_calendarId, calendarId)
	WHERE id = _taskId;


END$$

DELIMITER $$
DROP PROCEDURE IF EXISTS `GetTask`$$
CREATE PROCEDURE `GetTask` ( IN _taskId int )
BEGIN

	SELECT 	name,
			description,
            formatDate(startDate) as startDate,
            formatDate(dueDate) as dueDate,
            formatDate(creationDate) as creationDate,
            creatorId,
            getAvatar(creatorId) as avatar,
            getFullName(creatorId) as person,
            getPersonAbbr(creatorId) as abbr,
            projectId,
            stateId,
            calendarId,
            isPinned
	FROM task
    WHERE id = _taskId;

END$$

DELIMITER $$
DROP PROCEDURE IF EXISTS `StartTaskMonitor`$$
CREATE PROCEDURE `StartTaskMonitor` (IN _taskId int, IN _personId int, IN _startDate datetime)
BEGIN
	
    DECLARE _sessionNumber int;

	IF( (SELECT count(*) FROM taskMonitor    
			WHERE 	taskId = _taskId AND
					personId = _personId AND
                    endDate is null) > 0 ) THEN
		SIGNAL sqlstate 'ERROR' SET message_text = 'You cannot perform this action because there is still an active task.';
    END IF;

	SELECT ifnull(max(sessionNumber),0) + 1 INTO _sessionNumber
    FROM taskMonitor
    WHERE 	taskId = _taskId AND
			personId = _personId;

	INSERT INTO taskMonitor (taskId, personId, startDate, sessionNumber)
    VALUES (_taskId, _personId, _startDate, _sessionNumber);

END$$

DELIMITER $$
DROP PROCEDURE IF EXISTS `EndTaskMonitor`$$
CREATE PROCEDURE `EndTaskMonitor` (IN _taskId int, IN _personId int, IN _endDate datetime)
BEGIN
	
	UPDATE taskMonitor
    SET endDate = _endDate
    WHERE 	taskId = _taskId AND
			personId = _personId AND
            endDate is null;

END$$

/*------Task Member----------*/
    
DELIMITER $$
DROP PROCEDURE IF EXISTS `CreateTaskMember`$$
CREATE PROCEDURE `CreateTaskMember` (	IN _taskId int, 		IN _personId int, 		IN _roleId int, 
										IN _startDate datetime, IN _endDate datetime	)
BEGIN

	IF(areValidDates(_startDate,_endDate) = FALSE) THEN
		SIGNAL sqlstate 'ERROR' SET message_text = 'The start date is greater than the end date.';
    END IF;

	INSERT INTO taskMember ( taskId, personId, roleId, startDate, endDate )
    VALUES ( _taskId, _personId, _roleId, _startDate, _endDate );

END$$
    
DELIMITER $$
DROP PROCEDURE IF EXISTS `EditTaskMember`$$
CREATE PROCEDURE `EditTaskMember` (	IN _taskId int, 		IN _personId int, 		IN _roleId int, 
									IN _lastSeen datetime,	IN _startDate datetime, IN _endDate datetime, IN _isPinned bool	)
BEGIN

	IF(areValidDates(_startDate,_endDate) = FALSE) THEN
		SIGNAL sqlstate 'ERROR' SET message_text = 'The start date is greater than the end date.';
    END IF;

	UPDATE taskMember 
    SET roleId = coalesce(_roleId,roleId),
		lastSeen = coalesce(_lastSeen,lastSeen),
		startDate = coalesce(_startDate,startDate), 
        endDate = coalesce(_endDate,endDate),
        isPinned = coalesce(_isPinned, isPinned)
	WHERE 	taskId = _taskId AND
			personId = _personId;

END$$

DELIMITER $$
DROP PROCEDURE IF EXISTS `DeleteTaskMember`$$
CREATE PROCEDURE `DeleteTaskMember` ( IN _taskId int, IN _personId int )
BEGIN

	DELETE FROM taskMember 
	WHERE 	taskId = _taskId AND
			personId = _personId;

END$$

DELIMITER $$
DROP PROCEDURE IF EXISTS `GetTaskMember`$$
CREATE PROCEDURE `GetTaskMember` (	IN _taskId int, IN _personId int )
BEGIN

	SELECT 	taskId,
			personId,
            roleId,
            lastSeen,
			startDate,
			endDate
	FROM taskMember
	WHERE 	taskId = coalesce(_taskId,taskId) AND
			personId = coalesce(_personId, personId)
	ORDER BY roleId, startDate, endDate;

END$$    

DELIMITER $$
DROP PROCEDURE IF EXISTS `GetPersonTasks`$$
CREATE PROCEDURE `GetPersonTasks` (	IN _personId int )
BEGIN

    SELECT	t.id as taskId,
			t.name,
            t.description,
            formatDate(t.startDate) as startDate,
            formatDate(t.dueDate) as dueDate,
            t.creatorId,
            getFullName(t.creatorId) as creator,
            getPersonAbbr(t.creatorId) as creatorAbbr,
            getAvatar(t.creatorId) as creatorAvatar,
            p.id as projectId,
            p.name as projectName,
            p.abbr as projectabbr,
            te.id as teamId,
            te.name as teamName,
            te.abbr as teamAbbr,
            getJsonMembers(t.id,3) as collaborators,
            getJsonMembers(t.id,2) as leader,
            per.theme,
            tm.isPinned,
            'Task' as category
    FROM task as t
    INNER JOIN person as per on per.id = t.creatorId
    INNER JOIN taskMember as tm on tm.personId = t.creatorId AND tm.taskId = t.id
    LEFT JOIN project as p on p.id = t.projectId
    LEFT JOIN projectTeam as pte on pte.projectId = p.id
    LEFT JOIN team as te on te.id = pte.teamId
    WHERE t.creatorId = _personId
    ORDER BY tm.isPinned desc;

END$$   

/*---------Task Messages----------*/
DELIMITER $$
DROP PROCEDURE IF EXISTS `CreateTaskMessage`$$
CREATE PROCEDURE `CreateTaskMessage` (	IN _taskId int,			IN _personId int,				IN _message text, 
										IN _messageTypeId int,	IN _attachment varchar(255),	IN _attachmentTypeId int	)
BEGIN

	if(isValidMessenger(_taskId, _personId) = FALSE) THEN
		SIGNAL sqlstate 'ERROR' SET message_text = 'You cannot send messages in this task.';
    END IF;

	INSERT INTO taskMessage (taskId, personId, message, messageTypeId, attachment, attachmentTypeId, messageDate)
    VALUES(_taskId, _personId, _message, _messageTypeId, _attachment, _attachmentTypeId, NOW() );

END$$


DELIMITER $$
DROP PROCEDURE IF EXISTS `GetTaskMessages`$$
CREATE PROCEDURE `GetTaskMessages` (	IN _taskId int,	IN _personId int	)
BEGIN

	SELECT 	tmsg.id as taskMessageId,
			tmsg.taskId,
			tmsg.personId,
            getAvatar(tmsg.personId) as avatar,
            getFullName(tmsg.personId) as person,
            getPersonAbbr(tmsg.personId) as abbr,
            message,
            messageTypeId,
            attachment,
			attachmentTypeId,
            formatDate(messageDate) messageDate
    FROM task as t
    INNER JOIN taskMessage as tmsg on tmsg.taskId = t.id
    LEFT JOIN taskMember as tm on tm.taskId = t.id
	WHERE 	t.id = _taskId AND
			tm.personId = _personId AND
            tmsg.messageDate < ifnull(tm.endDate,NOW())
	ORDER BY messageDate asc;
    
END$$

/*---------Task Checklist----------*/
DELIMITER $$
DROP PROCEDURE IF EXISTS `CreateCheckList`$$
CREATE PROCEDURE `CreateCheckList` ( IN _taskId int, IN _title varchar(255), _dueDate date, _personId int )
BEGIN

	INSERT INTO checkList ( taskId, title, creationDate, dueDate, personId )
    VALUES ( _taskId, _title, NOW(), _dueDate, _personId );

	SELECT LAST_INSERT_ID() as id;

END$$ 

DELIMITER $$
DROP PROCEDURE IF EXISTS `EditCheckList`$$
CREATE PROCEDURE `EditCheckList` (IN _checkListId int, IN _title varchar(255), IN _dueDate datetime, IN _personId int)
BEGIN

	UPDATE checkList
	SET title = _title,
		dueDate = _dueDate,
        personId = _personId
    WHERE id = _checkListId;

END$$
    
DELIMITER $$
DROP PROCEDURE IF EXISTS `GetCheckList`$$
CREATE PROCEDURE `GetCheckList` (IN _taskId int, IN _checkListId int)
BEGIN

	SELECT 	taskId,
			title,
            dueDate,
            personId
    FROM checkList
    WHERE 	taskId = _taskId AND
			id = coalesce(_checkListId,id);
			

END$$
    
    
DELIMITER $$
DROP PROCEDURE IF EXISTS `CreateCheckListItem`$$
CREATE PROCEDURE `CreateCheckListItem` ( IN _checkListId int, _item varchar(255), _creatorId int )
BEGIN

	DECLARE _dueDate datetime;
	DECLARE _sortNumber int;

    SELECT dueDate INTO _dueDate
    FROM checkList
    WHERE id = _checkListId;

    SELECT ifnull(max(sortNumber),0) + 1 INTO _sortNumber
    FROM checkListItem
    WHERE checkListId = _checkListId;

	INSERT INTO checkListItem (checkListId, item, dueDate, creatorId, isChecked, sortNumber)
    VALUES(_checkListId, _item, _dueDate, _creatorId, false, _sortNumber );

END$$

DELIMITER $$
DROP PROCEDURE IF EXISTS `EditCheckListItem`$$
CREATE PROCEDURE `EditCheckListItem` (	IN _checkListId int,	IN _sortNumber int,	IN _item varchar(255),
										IN _dueDate datetime,	IN _isChecked bool,	IN _terminatorId int,
                                        IN _terminationDate datetime )
BEGIN

	UPDATE checkListItem
    SET item = coalesce(_item,item),
		dueDate = coalesce(_dueDate,dueDate),
        isChecked = coalesce(_isChecked,isChecked),
        terminatorId = coalesce(_terminatorId,terminatorId),
        terminationDate = coalesce(_terminationDate,terminationDate)
    WHERE 	checkListId = _checkListId AND
			sortNumber = _sortNumber;

END$$

DELIMITER $$
DROP PROCEDURE IF EXISTS `GetCheckListItem`$$
CREATE PROCEDURE `GetCheckListItem` (IN _checkListId int)
BEGIN

	SELECT 	item,
			formatDate(dueDate) as dueDate,
            isChecked,
            sortNumber
    FROM checkListItem
    WHERE checkListId = _checkListId
    ORDER BY sortNumber;

END$$ 



/*
checkListId int,
    item varchar(255),
    dueDate datetime,
    isChecked bool,
    creatorId int,
    terminatorId int,
    terminationDate datetime,
    sortNumber
*/


